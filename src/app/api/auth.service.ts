import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public baseUrl = 'http://localhost:8000/api/auth';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  constructor(public http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}
  registerPatient(patient: any): Observable<any> {
    return this.http?.post(`${this.baseUrl}/register`, patient);
  }

  login(patient: any) {
    return this.http?.post(`${this.baseUrl}/login`, patient).pipe(
      map((response: any) => {
        // const user = this.getCurrentUserFromToken();
        const user = response.user;
        this.userSubject.next(user);
        return response;
      })
    );
  }
  logout() {
    // just clear frontend memory, backend can also have /logout endpoint
    this.userSubject.next(null);
  }

  getCurrentrole(): string | null {
    return this.userSubject.value?.role ?? null;
  }
  // auth.service.ts
  getCurrentUserFromToken(): any {
    // console.log('Getting user from token');
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const token = localStorage?.getItem('authToken');
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
  // Get full user directly
  get currentUser() {
    return this.userSubject.value;
  }

  // Get role directly
  get role(): string | null {
    if(!this.userSubject.value) {
      // console.log('UserSubject is empty, fetching from token',this.getCurrentUserFromToken());
      return this.getCurrentUserFromToken()?.role ?? null;
    }
    // console.log('Getting role from AuthService:', this.userSubject);
    return this.userSubject.value?.role ?? null;
  }
}
