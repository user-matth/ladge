import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-fine-tune',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './fine-tune.component.html',
  styleUrls: ['./fine-tune.component.css']
})
export class FineTuneComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  files: any;
  models: any;
  fineTunes: any;
  fineTuneData: any;
  fineTuneEvents: any;
  fileToUpload: File | null = null;
  formGroup!: FormGroup;
  drawerOpen = false;
  selectedItem: any = null;
  chart!: Chart; 
  loading: boolean = true
  metricsData: any;
  fileOptions = '0';

  fileEarned: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      model: [''],
      file: [''],
    });
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.getAllModels();
    this.getAllFiles();
    this.getAllFineTunes();
  }

  ngAfterViewInit(): void {
    this.setupChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  getAllModels() {
    this.http.get<any>('https://api.openai.com/v1/models', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(models => {
      this.models = models;
    });
  }

  getAllFiles() {
    this.http.get<any>('https://api.openai.com/v1/files', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(files => {
      this.files = files;
    });
  }

  getAllFineTunes() {
    this.http.get<any>('https://api.openai.com/v1/fine_tuning/jobs', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe({
      next: (fineTunes) => {
        this.fineTunes = fineTunes;
        this.loading = false;

        const isPollingNeeded = this.fineTunes.data.some((fineTune: any) => 
          fineTune.status === 'running' || fineTune.status === 'validating_files'
        );

        if (isPollingNeeded) {
          setTimeout(() => {
            this.getAllFineTunes();
            console.log('Polling fine tuning jobs...')
          }, 10000);
        }
      },
      error: (error) => {
        console.error('Failed to fetch fine tuning jobs:', error);
        this.loading = false;
      }
    });
  }

  createFineTune(model: string, fileId: string) {
    this.http.post('https://api.openai.com/v1/fine_tuning/jobs', {
      "training_file": fileId,
      "model": model
    }, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      },
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        this.getAllFineTunes();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

  fileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
    this.uploadFile(this.fileToUpload!);
  }
  
  uploadSelectedFile(): void {
    if(this.fileEarned != null) {
      this.createFineTune(this.formGroup.get('model')?.value, this.fileEarned?.body.id);
    } else if (this.formGroup.get('file')?.value && this.formGroup.get('model')?.value) {
      this.createFineTune(this.formGroup.get('model')?.value, this.formGroup.get('file')?.value);
    } else {
      alert('Please select a file and enter a model.');
    }
  }

  getFileName(fileId: string) {
    if(!this.files) {
      return '-';
    } 
    return this.files.data.find((file: any) => file.id === fileId)?.filename;
  }

  toggleDrawer(item?: any) {
    this.drawerOpen = !this.drawerOpen;
    if (item) {
      this.selectedItem = item;
      this.retrieveFineTune(this.selectedItem.id);
      this.retrieveFineTuneEvents(this.selectedItem.id);
    }
  }

  retrieveFineTune(id: string) {
    this.http.get<any>(`https://api.openai.com/v1/fine_tuning/jobs/${id}`, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(fineTuneData => {
      this.fineTuneData = fineTuneData;
    });
  }
  
  cancelFineTune(id: string) {
    this.http.post<any>(`https://api.openai.com/v1/fine_tuning/jobs/${id}/cancel`, {}, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(fineTuneData => {
      this.getAllFineTunes();
    });
  }

  retrieveFineTuneEvents(id: string) {
    this.http.get<any>(`https://api.openai.com/v1/fine_tuning/jobs/${id}/events`, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(fineTuneEvents => {
      this.fineTuneEvents = fineTuneEvents;
      this.processMetricsData(fineTuneEvents);
      this.setupChart();
    });
  }

  processMetricsData(response: any) {
    const metrics = response.data.filter((event: any) => event.type === 'metrics');
    this.metricsData = {
      steps: metrics.map((m: any) => m.data.step),
      trainLosses: metrics.map((m: any) => m.data.train_loss),
      trainAccuracies: metrics.map((m: any) => m.data.train_mean_token_accuracy),
      totalSteps: metrics.map((m: any) => m.data.total_steps)
    };
    this.setupChart();
  }

  setupChart(): void {
    this.destroyChart();
    const maxLoss = Math.max(...this.metricsData?.trainLosses);
    const suggestedMax = maxLoss + (maxLoss * 0.1);
    const ctx = this.myChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: this.metricsData?.steps,
        datasets: [{
          data: this.metricsData?.trainLosses,
          borderColor: '#406FDC',
          borderWidth: 2,
          pointRadius: 0,
          pointBackgroundColor: '#FFFF',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
            suggestedMax: suggestedMax,
            grid: {
              color: '#B3B3B3',
            }
          },
          x: {
            display: true,
            border: {
              display: false,
            },
            title: {
              display: true,
              text: ''
            },
            grid: {
              display:false
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: .2
          }
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false
          },
        }
      }
    });
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return formatter.format(date);
  }

  getTimeDifference(created_at: number, finished_at: number): string {
    const differenceInSeconds = finished_at - created_at;
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  href(jobId: string) {
    window.open(`https://platform.openai.com/finetune/${jobId}?filter=all`, '_blank');
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'fine-tune');
    this.http.post('https://api.openai.com/v1/files', formData, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      },
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        this.fileEarned = event;
        this.getAllFiles();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
