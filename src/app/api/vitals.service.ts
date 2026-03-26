import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service'; // aapke auth headers ke liye
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VitalsService {
  private apiUrl = 'http://localhost:8000/api/vitals';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getHeaders(): HttpHeaders {
    const token = localStorage?.getItem('authToken');
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
