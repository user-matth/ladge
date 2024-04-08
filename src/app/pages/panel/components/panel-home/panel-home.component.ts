import { Component, OnInit } from '@angular/core';
import { IbgeService } from '../../../../services/ibge/ibge.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.css']
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
    });
  }

  getAllNews() {
    this.http.get('https://servicodados.ibge.gov.br/api/v3/noticias').subscribe(all_news => {
      this.all_news = all_news;
      console.log(this.all_news);
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

}
