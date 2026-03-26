import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { AuthService } from '../../../../api/auth.service';

@Component({
  selector: 'app-triage-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, HeaderComponent],
  templateUrl: './triage-list.component.html',
  styleUrl: './triage-list.component.css',
})
export class TriageListComponent implements OnInit {
  patients: any[] = [];
  totalRecords = 0;
  currentPage = 1;
  totalPages = 0;
  deskType!: string;
  role: string | null = null;

  constructor(
    public patientService: PatientService,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.role = this.authService.role;
    this.deskType = this.route.snapshot.paramMap.get('deskType')!;
    this.getPatients();
  }

  getPatients() {
    this.patientService.getPatientsWithTriage().subscribe(
      (response: any) => {
        console.log('API Response:', response.data);
        this.patients = response.data;
        this.totalRecords = response.totalRecords;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      },
      (error: any) => console.error('Error fetching patients', error)
    );
  }

  viewDetails(patient: any) {
    this.router.navigate(['/patient-details', patient?.id]);
  }

  getLatestTriage(triageList: any[]): string {
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

  getTriageColorClass(triage: string): string {
    switch (triage.toLowerCase()) {
      case 'red':
        return 'triage-red';
      case 'yellow':
        return 'triage-yellow';
      case 'green':
        return 'triage-green';
      default:
        return 'triage-pending blinking';
    }
  }

  getLatestEmergencyType(triages: any[]): string {
  if (!triages || triages.length === 0) return 'NON-TRAUMA';
  return triages[triages.length - 1].emergencyType;
}

}
