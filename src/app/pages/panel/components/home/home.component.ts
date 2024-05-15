import { Component, OnInit } from '@angular/core';
import { IbgeService } from '../../../../services/ibge/ibge.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  news: any;
  all_news: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getEnvironmentNews();
    this.getAllNews();
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

}
