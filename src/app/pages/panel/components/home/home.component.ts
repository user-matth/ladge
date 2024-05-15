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

  news: any;
  all_news: any;
  fineTuneData: any;
  fineTuneEvents: any;
  metricsData: any;
  pieMetricsData: any;
  chart!: Chart; 
  pieChartInstance!: Chart<'pie', number[], string>;
  pieChartData: any;

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.getEnvironmentNews();
    this.getAllNews();
    this.retrieveFineTune();
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
      "model": "gpt-3.5-turbo",
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
      good: 70,
      bad: 30,
      yes: 30,
      no: 30,
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
          pointRadius: 3,
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
          data: [this.pieMetricsData.good, this.pieMetricsData.bad], 
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
