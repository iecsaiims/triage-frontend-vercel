import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseHandoverNotesService {
  private baseUrl = 'http://localhost:8000/api/handover-notes';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}
    private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  createHandover(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  getHandoverByPatient(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-handover/${patientId}`);
  }
}
