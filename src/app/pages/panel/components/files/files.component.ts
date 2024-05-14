import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  files: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getEnvironmentNews();
  }

  getEnvironmentNews() {
    this.http.get<any>('https://api.openai.com/v1/files', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(files => {
      this.files = files;
      console.log(files);
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
