import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  constructor(private http: HttpClient) { }

  getNoticias() {
    return this.http.get('http://servicodados.ibge.gov.br/api/v3/noticias/')
  }

}
