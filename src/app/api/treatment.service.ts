import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private baseUrl = 'https://triage-backend-vercel.vercel.app/api/treatment';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getHeaders() {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // ---- Doctor Treatment ----
  saveTreatment(data: any) {
    return this.http.post(`${this.baseUrl}/save-treatment`, data, { headers: this.getHeaders() });
  }

  getTreatment(patientId: number) {
    let url = `${this.baseUrl}/get-treatment/${patientId}`;
    // if (name) url += `?name=${encodeURIComponent(name)}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // ---- Nursing Treatment ----
  saveTreatmentNursing(data: any) {
    return this.http.post(`${this.baseUrl}/save-treatment-nursing`, data, { headers: this.getHeaders() });
  }

  getTreatmentNursing(patientId: number) {
    let url = `${this.baseUrl}/get-treatment-nursing/${patientId}`;
    // if (name) url += `?name=${encodeURIComponent(name)}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
