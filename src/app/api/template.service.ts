import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  public baseUrl = 'https://triage-backend-vercel.vercel.app/api/templates';
  public baseUrldisposition = 'https://triage-backend-vercel.vercel.app/api/disposition';
  constructor(public http: HttpClient) {}
  emergencycareData(emergencycare: any) {
    return this.http?.post(
      `${this.baseUrl}/create-emergencycare`,
      emergencycare
    );
  }

  getemergencycare(id: number): any {
    return this.http?.get(`${this.baseUrl}/emergency-care/${id}`);
  }
  traumaTemplateData(traumaTemplate: any) {
    return this.http?.post(`${this.baseUrl}/trauma-template`, traumaTemplate);
  }

  gettraumaTemplate(id: number): any {
    return this.http?.get(`${this.baseUrl}/trauma-template/${id}`);
  }

  progressNoteseData(progressNotes: any) {
    return this.http?.post(`${this.baseUrl}/progress-notes`, progressNotes);
  }

  getprogressNotes(id: number): any {
    return this.http?.get(`${this.baseUrl}/progress-notes/${id}`);
  }

  transferOutSlipData(transferSlip: any) {
    return this.http?.post(
      `${this.baseUrldisposition}/transfer-out`,
      transferSlip
    );
  }

  getTransferOutSlip(patientId: number) {
    return this.http?.get(
      `${this.baseUrldisposition}/transfer-out/${patientId}`
    );
  }

  dischargeSummary(data: any) {
    return this.http?.post(`${this.baseUrldisposition}/dischage-summary`, data);
  }

  getDischargeSummary(patientId: number) {
    return this.http?.get(
      `${this.baseUrldisposition}/dischage-summary/${patientId}`
    );
  }
  saveLamaConsent(formData: FormData) {
    return this.http?.post(`${this.baseUrldisposition}/lama`, formData);
  }

  getLamaConsent(patientId: number) {
    return this.http?.get(`${this.baseUrldisposition}/lama/${patientId}`);
  }

  saveAdmission(formData: FormData) {
    return this.http.post(`${this.baseUrldisposition}/admission`, formData);
  }

  getAdmission(patientId: number) {
    return this.http?.get(`${this.baseUrldisposition}/admission/${patientId}`);
  }
}
