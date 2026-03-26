import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private apiUrl = 'https://triage-backend-vercel.vercel.app/api/diagnosis';

  constructor(private http: HttpClient) {}

  // Save diagnosis
  saveDiagnosis(patientId: number, remark: string): Observable<any> {
    const body = { patientId, remark };
    return this.http.post(`${this.apiUrl}/save-diagnosis`, body);
  }

  // Get diagnosis by patientId
  getDiagnosis(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-diagnosis/${patientId}`);
  }
}
