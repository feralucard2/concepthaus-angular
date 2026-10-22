import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataInterface, RootInterface } from '../interfaces/dataInterface';



@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private readonly cacheBuster = Date.now();
  private jsonUrl = `assets/data/eng.json?v=${this.cacheBuster}`;
  private jsonUrlEsp = `assets/data/esp.json?v=${this.cacheBuster}`;

  constructor(private http: HttpClient) { }

  getEng(): Observable<RootInterface> {
    return this.http.get<RootInterface>(this.jsonUrl);
  }

  getEsp(): Observable<RootInterface> {
    return this.http.get<RootInterface>(this.jsonUrlEsp);
  }
}
