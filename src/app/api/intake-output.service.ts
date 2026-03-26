import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // aapke auth headers ke liye

@Injectable({
  providedIn: 'root'
})
export class IntakeOutputService {
  private apiUrl = 'http://localhost:8000/api/inout';

  constructor(private http: HttpClient, private auth: AuthService) {}

    private getHeaders(): HttpHeaders {
    const token = localStorage?.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }
  saveIntakeOutput(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {headers: this.getHeaders()
    });
  }

getIntakeOutput(patientId: number) {
  return this.http.get(`${this.apiUrl}/get-inout/${patientId}`, { headers: this.getHeaders() });
}

}
