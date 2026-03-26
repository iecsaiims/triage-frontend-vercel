import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseHandoverNotesService {
  private baseUrl = 'http://localhost:8000/api/handover-notes';

  constructor(private http: HttpClient) {}
    private getHeaders(): HttpHeaders {
    const token = localStorage?.getItem('authToken');
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
