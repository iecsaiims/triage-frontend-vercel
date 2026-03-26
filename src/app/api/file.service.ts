import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private baseUrl = 'https://triage-backend-vercel.vercel.app/api/files';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  getfile(fileName: string) {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage?.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`https://triage-backend-vercel.vercel.app/api/files/${fileName}`, {
      headers,
      responseType: 'blob',
    });
  }
}
