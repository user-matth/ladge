import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IbgeService } from '../../../../services/ibge/ibge.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { Chart, PieControllerChartOptions, registerables } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class PanelHomeComponent implements OnInit {

  @ViewChild('mainChart') mainChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trainingResultsChart') trainingResultsChart!: ElementRef<HTMLCanvasElement>;

  consolidatedMetricsData: any = { steps: [], trainLosses: [], trainAccuracies: [], totalSteps: [] };

  news: any;
  all_news: any;
  fineTuneData: any;
  fineTuneEvents: any;
  metricsData: any;
  pieMetricsData: any;
  chart!: Chart;
  pieChartInstance!: Chart<'pie', number[], string>;
  pieChartData: any;
  jobsFiveDays = [
    "ftjob-vWQDnNo4PfXCXmenlwiUB32B",
    "ftjob-BI6b7ZbJxNbssO1viGe7TCkt",
    "ftjob-NumzsePsEzqt2M9XBofQwavZ",
    "ftjob-4J3DBFTTCqNC8Xm4WxacLgSn",
    "ftjob-c6clI5s09van3IFfz0SzB85T"
  ];
  jobResults: any = {};

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.getEnvironmentNews();
    this.getAllNews();
    this.retrieveFineTune();
    this.jobsFiveDays.forEach(jobId => {
      this.retrieveFiveFineTuneEvents(jobId);
    });
    this.getTunedData();
  }

  getEnvironmentNews() {
    this.http.get('https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=12&busca=meio%2Fambiente').subscribe(news => {
      this.news = news;
      console.log(news);
    });
  }

  getAllNews() {
    this.http.get('https://servicodados.ibge.gov.br/api/v3/noticias').subscribe(all_news => {
      this.all_news = all_news;
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

  saveDatasetInJsonl(): void {
    const items = this.all_news.items;
  
    const jsonlContent = items.map((item: any) => {
      const initialSystemContent = "Ladge is a environment journalist.";
      const userQuery = `Tell me ${item.type} news about the environment`;
      const assistantResponse = item.introducao + " - Foto: " + item.foto;
  
      return JSON.stringify({
        messages: [
          { role: "system", content: initialSystemContent },
          { role: "user", content: userQuery },
          { role: "assistant", content: assistantResponse }
        ]
      });
    }).join('\n');
  
    this.downloadFile(jsonlContent, 'environment_news.jsonl');
  }  

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  retrieveFineTune() { 
    var id = 'ftjob-v9Q43cG1UN5BbMFeg6MXE7Ak';
    this.http.get<any>(`https://api.openai.com/v1/fine_tuning/jobs/${id}`, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(fineTuneData => {
      this.fineTuneData = fineTuneData;
      console.log(fineTuneData);
    });
    this.retrieveFineTuneEvents(id);
  }

  retrieveFiveFineTuneEvents(id: string) {
    this.http.get<any>(`https://api.openai.com/v1/fine_tuning/jobs/${id}/events`, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(response => {
      this.processFiveMetricsData(id, response);
      console.log(response);
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
    });
  }
  
  getTunedData() {
    this.http.post<any>(`https://api.openai.com/v1/chat/completions`, {
      "model": "ft:gpt-3.5-turbo-0125:personal::9P0425Fl",
      "messages": [
        {
          "role": "user",
          "content": "Based on the recent news, give two percentage, the total has to be 100% and you must return the good news percentage and bad news percentage"
        }
      ],
      "temperature": 1,
      "top_p": 1,
      "n": 1,
      "stream": false,
      "max_tokens": 250,
      "presence_penalty": 0,
      "frequency_penalty": 0
    }, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(data => {
      this.pieChartData = data;
      this.processPieData(data);
      console.log(data);
    });
  }

  processPieData(response: any) {
    const goodNewsPercentage = response.goodNewsPercentage;
    const badNewsPercentage = response.badNewsPercentage;
    
    this.pieMetricsData = {
      good: goodNewsPercentage,
      bad: badNewsPercentage,
    };
    
    this.setupPieChart();
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

  processFiveMetricsData(id: string, response: any) {
    const metrics = response.data.filter((event: any) => event.type === 'metrics');
    this.jobResults[id] = {
      steps: metrics.map((m: any) => m.data.step),
      trainLosses: metrics.map((m: any) => m.data.train_loss)
    };

    // Only setup chart when all jobs have been processed
    if (Object.keys(this.jobResults).length === this.jobsFiveDays.length) {
      this.setupTrainingResultsChart();
    }
  }

  setupTrainingResultsChart(): void {
    const ctx = this.trainingResultsChart.nativeElement.getContext('2d');
    const colors = ['#ff3c2f', '#ff9400', '#007aff', '#af52df', '#ff2c56']; // Example colors
    const datasets = this.jobsFiveDays.map((jobId, index) => ({
      label: `Job ID: ${jobId}`,
      data: this.jobResults[jobId].trainLosses,
      borderColor: colors[index],
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      pointBackgroundColor: '#FFFF',
    }));

    const chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: this.jobResults[this.jobsFiveDays[0]].steps, // Assuming all jobs have the same step labels
        datasets: datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            border: {
              display: false,
            },
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
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 10,
              boxHeight: 10,
              padding: 20,
              font: {
                size: 12,
                family: 'Inter',
                style: 'normal',
                lineHeight: 1.2
              },
              color: '#000000',
            }
          },
        },
      }
    });
  }

  setupChart(): void {
    const maxLoss = Math.max(...this.metricsData?.trainLosses);
    const suggestedMax = maxLoss + (maxLoss * 0.1);
    const ctx = this.mainChart.nativeElement.getContext('2d');
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

  setupPieChart(): void {
    const ctx = this.pieChart.nativeElement.getContext('2d');
  
    this.pieChartInstance = new Chart(ctx!, {
      type: 'pie', 
      data: {
        labels: ['Good News', 'Bad News'], 
        datasets: [{
          data: [72, 38], 
          backgroundColor: ['#047cfe', '#ff9501'], 
          borderColor: ['#fff'], 
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top'
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false
          }
        }
      }
    });
  }  

}
