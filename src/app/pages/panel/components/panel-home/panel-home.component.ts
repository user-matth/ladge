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
    });
  }

  getTest() {
    this.http.get('https://teste.4selet.com.br/api/buscas/dados-zoom/LgFicv02HSHuuMukdska3hLqUBAsZ1Er4QPSeSsO', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 206990e331c4fd47f68494777a6aee4c43a5af6e4b3c431eb4fdc06822347d8a93639cbebce290b1e7e30c670fdb0347242225e7c8fa736ed4fabc318e46aa73"
      }
    }).subscribe(response => {
      console.log(response);
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

}
