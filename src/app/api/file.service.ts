import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'http://localhost:8000/api/files';

  constructor(private http: HttpClient) {}

  getfile(fileName: string) {
    const token = localStorage?.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`http://localhost:8000/api/files/${fileName}`, {
      headers,
      responseType: 'blob',
    });
  }
}
