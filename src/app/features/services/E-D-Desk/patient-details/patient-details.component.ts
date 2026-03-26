import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AuthService } from '../../../../api/auth.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MaterialModule],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
})
export class PatientDetailsComponent implements OnInit {
  patients: any[] = [];
  totalRecords = 0;
  currentPage = 1;
  totalPages = 0;
  fullResponse: any;
  submittedBy = '';
  deskType!: string;
  userName = '';
  designation = '';
  constructor(
    public patientService: PatientService,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getPatients();
    this.deskType = this.route.snapshot.paramMap.get('deskType')!;
    console.log('Desk Type:', this.deskType);
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(
          decodeURIComponent(escape(atob(base64)))
        );
        console.log('Decoded Payload:', decodedPayload);

        this.userName = decodedPayload.user;
        this.designation = decodedPayload.designation;
        console.log('User Name:', this.userName);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.warn('Token not found in localStorage');
    }
  }

  getPatients() {
    this.patientService.getPatientsWithTriage().subscribe(
      (response: any) => {
        console.log('Patient data fetched:', response);
        this.fullResponse = response;
        this.patients = response.data;
        this.submittedBy = response.submittedBy;
        this.totalRecords = response.totalRecords;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        if (this.patients.length > 0) {
          this.submittedBy = this.patients[0].submittedBy;
        }
      },

      (error: any) => console.error('Error fetching patients', error)
    );
  }

  getLatestTriage(triageList: any[]) {
    console.log('Triage List:', triageList);
    console.log('Type of Triage List:', typeof triageList);

    if (!triageList || triageList.length === 0) return 'Pending';

    const sortedList = [...triageList].sort(
      (a, b) =>
        new Date(b.triageTimeStamp).getTime() -
        new Date(a.triageTimeStamp).getTime()
    );

    const latest = sortedList[0];
    return latest.triage || 'Pending';
  }

  getTriageColorClass(triage: string | null) {
    if (!triage) return 'triage-default';

    switch (triage.toLowerCase()) {
      case 'green':
        return 'triage-green';
      case 'yellow':
        return 'triage-yellow';
      case 'red':
        return 'triage-red';
      default:
        return 'triage-pending blinking';
    }
  }
  getLatestEmergencyType(triages: any[]) {
    if (!triages || triages.length === 0) return 'NON-TRAUMA';
    return triages[triages.length - 1].emergencyType;
  }
  getAssessmentStatus(primaryAssessment: any) {
    return primaryAssessment ? 'Completed' : 'Pending';
  }

  getDischargeStatus(dischargeSummary: any[]) {
    return dischargeSummary && dischargeSummary.length > 0
      ? 'Completed'
      : 'Pending';
  }

  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'triage-green';
      default:
        return 'triage-pending blinking';
    }
  }

  viewDetails(patient: any) {
    console.log('Navigating to patient details:', patient.id);
    const triage = this.getLatestTriage(patient.patientTriage);
    if (triage === 'Pending') {
      return;
    }
    // const triageCategory = this.getAssessmentStatus(patient.primaryAssessment);
    // console.log('Triage Category:', triageCategory);
    // if (this.deskType === 'nursing-desk' && triageCategory === 'Pending') {
    //   console.log('Triage Category:', triageCategory);
    //   return;
    // }
    this.router.navigate([
      '/' + this.deskType + '/patient-dashboard',
      patient.id,
    ]);
  }

  editPatient(patient: any, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/triage-entry-desk', patient.id], {
      queryParams: { source: 'd', mode: 'e' },
    });
  }

  deletePatient(patient: any, event: Event) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
      console.log('Delete patient:', patient);
    }
  }
}
