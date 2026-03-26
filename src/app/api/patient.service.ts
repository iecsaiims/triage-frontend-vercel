import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PatientService {
    public baseUrl = 'http://localhost:8000/api/patient';

    constructor(public http: HttpClient) { }
    addPatient(patient: any){
        return this.http?.post(`${this.baseUrl}/registerPatient`, patient);
    }

    getPatients(){
        return this.http?.get(`${this.baseUrl}/PatientList`);
    }
    getPatientById(id: number): any {
        return this.http?.get(`${this.baseUrl}/patientDetails/${id}`);
    }
    
    updatePatient(updatedPatient: any) {
        return this.http?.post(`${this.baseUrl}/addTriage/${updatedPatient?.id}`, updatedPatient);
    }

    getPatientsWithTriage(){
        return this.http?.get(`${this.baseUrl}/patientList/triage`);
    }

 addTriage(patientId: number, triageData: any) {
    const body = {
      patientId,
      ...triageData,
    };
    return this.http?.post(`${this.baseUrl}/addTriage`, body);
  }

  getalltriages(id: number) {
    return this.http?.get(`${this.baseUrl}/all-triages/${id}`);
  }
}
