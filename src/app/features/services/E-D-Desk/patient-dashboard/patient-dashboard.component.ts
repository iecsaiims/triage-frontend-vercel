import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { DataStoreService } from '../../../../store/datastoreservice.service';
@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css',
})
export class PatientDashboardComponent {
  patient: any;
// component.ts
displayedColumns: string[] = [
  'date',
  'time',
  'status',
  'spo2',
  'pulse',
  'sbp',
  'dbp',
  'rr',
  'temp',
  'emergencyType',
  'triage',
  // 'triageNotes',
  // 'arrivalMode',
  // 'referralStatus',
  'complaints',
  'submittedBy',
  'designation',
];

getComplaints(complaints: any[]): string {
  return complaints && complaints.length
    ? complaints.map(c => `${c.complaint} (${c.duration})`).join(', ')
    : '-';
}

  patiendata: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public patientService: PatientService,
    public dataStoreService: DataStoreService
  ) {}
  ngOnInit() {
    let id = Number(this.route?.snapshot?.paramMap?.get('id'));
    if (!id) {
      id = Number(this.route?.parent?.snapshot?.paramMap.get('id'));
      console.log('Fetching patient with ID:', id);
    }
    this.patientService.getPatientById(id).subscribe((data: any) => {
      console.log('Patient data fetched:', data);
      this.dataStoreService.set('patient', data);
      this.patient = data;
    });
  }

  getTriageColorClass(value: string): string {
  switch (value?.toLowerCase()) {
    case 'red':
      return 'triage-red';
    case 'yellow':
      return 'triage-yellow';
    case 'green':
      return 'triage-green';
    case 'black':
      return 'triage-black';
    default:
      return '';
  }
}

}
