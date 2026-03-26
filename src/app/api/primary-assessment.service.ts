// primary-assessment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrimaryAssessmentService {
  public baseUrl = 'http://localhost:8000/api/primary-assessment';
  private baseUrlSummary = 'http://localhost:8000/api/patient/summary';
  constructor(private http: HttpClient) {}

  createAssessment(data: any): Observable<any> {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http?.post(`${this.baseUrl}/create`, data, { headers });
  }

  getAssessmentByPatientId(patientId: number): Observable<any> {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http?.get(`${this.baseUrl}/${patientId}`, { headers });
  }

  getSummary(patientId: number) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrlSummary}/${patientId}`, { headers });
  }
}
