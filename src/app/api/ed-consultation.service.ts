import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EdConsultationService {
private apiUrl = 'http://localhost:8000/api/ed-consultation'; 

  constructor(private http: HttpClient) {}

saveConsultation(data: any, file?: File){
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  if (file) {
    formData.append('consultationImage', file);
  }

  return this.http.post(`${this.apiUrl}/consultation`, formData);
}

 // Get consultation by patientId (GET)
  getConsultationByPatientId(patientId: string) {
    return this.http.get(`${this.apiUrl}/consultation/${patientId}`);
  }

  getAllConsultations() {
    return this.http.get(`${this.apiUrl}/consultations`);
  }
}
