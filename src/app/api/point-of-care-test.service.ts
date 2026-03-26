// point-of-care-test.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointOfCareTestService {
  private baseUrl = 'http://localhost:8000/api/poc-tests';

  constructor(private http: HttpClient) {}

  savePocus(data: any) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http?.post(`${this.baseUrl}/pocus`, data, { headers });
  }
  getPocusByPatientId(patientId: number) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrl}/pocus/${patientId}`, { headers });
  }

  saveEcg(data: FormData) {
    const token = localStorage?.getItem('authToken');
    console.log('🔐 Sending token in header:', token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    }); // DO NOT SET Content-Type manually for FormData

    return this.http?.post(`${this.baseUrl}/ecg`, data, { headers });
  }
  // getEcgByPatientId(patientId: number): Observable<any> {
  getEcgByPatientId(patientId: number) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrl}/ecg/${patientId}`, { headers });
  }
  // saveBloodGas
  saveBloodGas(data: FormData) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.post(`${this.baseUrl}/blood-gas`, data, { headers });
  }
  // getBloodGas
  getBloodGasByPatientId(patientId: number): Observable<any> {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrl}/blood-gas/${patientId}`, { headers });
  }

  // saveTroponin
  saveTroponin(data: any) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http?.post(`${this.baseUrl}/troponin`, data, { headers });
  }
  // other test
  saveOtherTest(data: any) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http?.post(`${this.baseUrl}/other-test`, data, { headers });
  }
  // getTroponinByPatientId(patientId: number): Observable<any> {
  getOtherTestByPatientId(patientId: number) {
    const token = localStorage?.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http?.get(`${this.baseUrl}/other-test/${patientId}`, {
      headers,
    });
  }
  // In poc.service.ts

  getTroponinTests(patientId: number) {
    const url = `${this.baseUrl}/troponin/${patientId}`;
    const headers = this.getAuthHeaders();
    return this.http?.get<any>(url, { headers });
  }
  getAuthHeaders() {
    const token = localStorage?.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // X-RAY METHODS
  addXray(data: any) {
    const formData = new FormData();
    formData.append('xrayType', data.xrayType);
    formData.append('xrayFindings', data.xrayFindings);
    formData.append('xrayImage', data.xrayImage);
    formData.append('submittedBy', data.submittedBy);
    formData.append('designation', data.designation);
    formData.append('patientId', data.patientId.toString());

    const headers = this.getAuthHeaders();

    return this.http?.post(`${this.baseUrl}/xray`, formData, { headers });
  }
getXrayData(patientId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http?.get<any[]>(`${this.baseUrl}/xray/${patientId}`, { headers });
}

  submitCTScan(data:any) {
      const formData = new FormData();
    formData.append('ctType', data.ctType);
    formData.append('ctFindings', data.ctFindings);
    formData.append('ctScanList', data.ctScanList);
    formData.append('ctTypes', data.ctTypes);
    formData.append('xrayDataList', data.xrayDataList);
    formData.append('ctScanImage', data.ctScanImage);
    formData.append('patientId', data.patientId.toString());
    
    const token = this.getAuthHeaders();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http?.post(`${this.baseUrl}/ct-scan`, formData, { headers });
  }


getCtScanData(patientId: number){
   const headers = this.getAuthHeaders();
  return this.http?.get<any[]>(`${this.baseUrl}/ct-scan/${patientId}`, { headers });
}

}
