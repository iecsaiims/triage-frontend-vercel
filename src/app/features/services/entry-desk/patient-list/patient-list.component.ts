import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../../header/header.component';
import { AuthService } from '../../../../api/auth.service';
@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    HttpClientModule,
    HeaderComponent,
  ],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  role: string | null = null;
  displayedColumns: string[] = [
    'name',
    'crNumber',
    'gender',
    'age',
    // 'category',
    // 'department',
    // 'room',
    'visitDate',
    'visitTime',
  ];

  patients: any[] = [];
  isMenuOpen = false;

  constructor(public patientService: PatientService, public router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.role;
    console.log('User Role:', this.role);
    this.patientService.getPatients().subscribe(
      (response: any) => {
        this.patients = response.data; // Use only the 'data' array from response
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

  viewDetails(patient: any) {
    this.router.navigate(['/patient-details', patient?.id]);
  }
}
