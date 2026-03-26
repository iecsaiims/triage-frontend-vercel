import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service'; // aapke auth headers ke liye
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VitalsService {
  private apiUrl = 'https://triage-backend-vercel.vercel.app/api/vitals';

  constructor(private http: HttpClient, private auth: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  saveVitals(vitals: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, vitals, { headers: this.getHeaders() 
    });
  }

  getVitals(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-vitals/${patientId}`, { headers: this.getHeaders() 
    });
  }
}
