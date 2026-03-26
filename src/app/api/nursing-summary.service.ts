import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NursingSummaryService {
   private baseUrlNursingSummary = 'http://localhost:8000/api/patient/nursing-summary';
   constructor(private http: HttpClient) {}
   getNursingSummary(patientId: number) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrlNursingSummary}/${patientId}`, { headers });
  }
}
