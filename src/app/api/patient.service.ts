import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  public baseUrl = 'http://localhost:8000/api/patient';

  constructor(public http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  addPatient(patient: any): Observable<any> {
    if (!this.isBrowser()) {
      return of(null);
    }
    return this.http.post(`${this.baseUrl}/registerPatient`, patient);
  }

  getPatients(): Observable<any> {
    if (!this.isBrowser()) {
      return of({ data: [] });
    }
    return this.http.get(`${this.baseUrl}/PatientList`);
  }

  getPatientById(id: number): Observable<any> {
    if (!this.isBrowser()) {
      return of({});
    }
    return this.http.get(`${this.baseUrl}/patientDetails/${id}`);
  }

  updatePatient(updatedPatient: any): Observable<any> {
    if (!this.isBrowser()) {
      return of(null);
    }
    return this.http.post(`${this.baseUrl}/addTriage/${updatedPatient?.id}`, updatedPatient);
  }

  getPatientsWithTriage(): Observable<any> {
    if (!this.isBrowser()) {
      return of([]);
    }
    return this.http.get(`${this.baseUrl}/patientList/triage`);
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
