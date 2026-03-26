import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvestigationService {
  private baseUrl = 'http://localhost:8000/api/investigation';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage?.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // ---------------- CBC ----------------
  saveCbc(body: any) {
    return this.http.post(`${this.baseUrl}/save-cbc`, body, { headers: this.getHeaders() });
  }

  getCbc(patientId: number) {
    return this.http.get(`${this.baseUrl}/get-cbc/${patientId}`, { headers: this.getHeaders() });
  }

  // ---------------- LFT ----------------
  saveLft(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save-lft`, body, { headers: this.getHeaders() });
  }

  getLft(patientId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-lft/${patientId}`, { headers: this.getHeaders() });
  }

  // ---------------- KFT (RFT) ----------------
  saveKft(body: any) {
    return this.http.post(`${this.baseUrl}/save-rft`, body, { headers: this.getHeaders() });
  }

  getKft(patientId: number) {
    return this.http.get(`${this.baseUrl}/get-rft/${patientId}`, { headers: this.getHeaders() });
  }

  // ---------------- URINE TEST ----------------
saveUrine(body: any) {
  return this.http.post(`${this.baseUrl}/save-urineTest`, body, {
    headers: this.getHeaders()
  });
}

getUrine(patientId: number) {
  return this.http.get(`${this.baseUrl}/get-urineTest/${patientId}`, {
    headers: this.getHeaders()
  });
}

// ---------------- Coagulation ----------------
saveCoagulation(body: any) {
  return this.http.post(`${this.baseUrl}/save-coagulation`, body, {
    headers: this.getHeaders()
  });
}

getCoagulation(patientId: number) {
  return this.http.get(`${this.baseUrl}/get-coagulation/${patientId}`, {
    headers: this.getHeaders()
  });
}

}
