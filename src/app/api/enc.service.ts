import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EncService {
  baseUrl = 'https://triage-backend-vercel.vercel.app/api/enc';

  constructor(private http: HttpClient) {}

  getConsultations(patientId: number) {
    return this.http.get(`${this.baseUrl}/get-enc-consultations/${patientId}`);
  }

  submitConsultation(payload: any) {
    return this.http.post(`${this.baseUrl}/save-enc-consultation`, payload);
  }

  getEncRecord(patientId: number) {
    return this.http.get(`${this.baseUrl}/get-enc/${patientId}`);
  }

  saveEncRecord(payload: any) {
    return this.http.post(`${this.baseUrl}/save-enc`, payload);
  }
}
