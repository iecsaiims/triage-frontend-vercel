import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../api/auth.service';
import { MaterialModule } from '../../../shared/material/material.module';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(public router: Router, public authService: AuthService) {}

  isMenuOpen = false;
  isLoginMode = true;
  isHomePage = false;
  message = '';

  formData: any = {
    name: '',
    email: '',
    mobile: '',
    designation: '',
    password: '',
  };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.formData = {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      password: '',
    };
    this.message = '';
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  navigateTo(path: string) {
    this.router?.navigate([path]);
  }

  onInput(event: any, field: string) {
    this.formData[field] = event.value ?? event?.target?.value;
    this.message = '';
  }

  onSubmit() {
    const { name, email, mobile, designation, password } = this.formData;

    if (this.isLoginMode) {
      console.log('Logging in with', email, password);

      this.authService?.login({ email, password }).subscribe(
        (response: any) => {
          localStorage.setItem('authToken', response?.token);
          console.log('Token saved to localStorage:', response?.token);

          this.message = `Welcome back!`;
          this.router.navigate(['/service']);

          this.formData = {
            name: '',
            email: '',
            mobile: '',
            designation: '',
            password: '',
          };
        },
        (error: any) => {
          console.error('Login failed', error);
          this.message = error.error?.error || 'Login failed. Try again.';
        }
      );
    } else {
      if (!name || !email || !mobile || !designation || !password) {
        this.message = 'Please fill all fields.';
        return;
      }

      let role = 'u';
      if (designation === 'Admin') role = 'a';
      else if (designation === 'Faculty') role = 'f';
      else if (designation === 'Nursing-Staff') role = 'n';
      else if (designation === 'Doctor') role = 'd';
      else if (designation === 'Registration-desk') role = 'r';
      else if (designation === 'Triage-officer') role = 't';

      console.log('Determined role:', role);
      const userData = {
        name,
        email,
        mobile_number: mobile,
        designation,
        password,
        role,
      };
      this.authService?.registerPatient(userData).subscribe(
        (response) => {
          console.log('Patient added successfully', response);
          this.message = '✅ Signup Successful! Please login.';

          this.formData = {
            name: '',
            email: '',
            mobile: '',
            designation: '',
            password: '',
          };

          this.toggleMode();
        },
        (error) => {
          console.error('Error adding patient', error);
          this.message = error.error?.error || 'Login failed. Try again.';
        }
      );
    }
  }

  logout() {
    this.router.navigate(['']);
  }
}
