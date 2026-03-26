// primary-assessment.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrimaryAssessmentService {
  public baseUrl = 'https://triage-backend-vercel.vercel.app/api/primary-assessment';
  private baseUrlSummary = 'https://triage-backend-vercel.vercel.app/api/patient/summary';
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  createAssessment(data: any): Observable<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http?.post(`${this.baseUrl}/create`, data, { headers });
  }

  getAssessmentByPatientId(patientId: number): Observable<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http?.get(`${this.baseUrl}/${patientId}`, { headers });
  }

  getSummary(patientId: number) {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrlSummary}/${patientId}`, { headers });
  }
}
