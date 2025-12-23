import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiMailService {
  private apiUrl = 'https://mailformch.vercel.app/api/sendMail'; // Cambia por tu endpoint real

  constructor(private http: HttpClient) {}

  sendMail(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
