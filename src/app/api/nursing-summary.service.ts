import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NursingSummaryService {
   private baseUrlNursingSummary = 'https://triage-backend-vercel.vercel.app/api/patient/nursing-summary';
   constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}
   getNursingSummary(patientId: number) {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrlNursingSummary}/${patientId}`, { headers });
  }
}
