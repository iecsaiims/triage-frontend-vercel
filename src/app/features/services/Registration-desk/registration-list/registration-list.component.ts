import { Component } from '@angular/core';
import { PatientService } from '../../../../api/patient.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../api/auth.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-registration-list',
  imports: [MaterialModule, CommonModule, HeaderComponent],
  templateUrl: './registration-list.component.html',
  styleUrl: './registration-list.component.css',
})
export class RegistrationListComponent {
  role: string | null = null;
  displayedColumns: string[] = [
    'name',
    'crNumber',
    'gender',
    'age',
    'visitDate',
    'visitTime',
  ];

  patients: any[] = [];
  isMenuOpen = false;

  constructor(
    public patientService: PatientService,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.role = this.authService.role;
    console.log('User Role:', this.role);
    this.patientService.getPatients().subscribe(
      (response: any) => {
        this.patients = response.data;
        console.log('Patients fetched:', this.patients);
      },
      (error: any) => {
        console.error('Error fetching patients:', error);
        alert('Failed to fetch patient list.');
      }
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
