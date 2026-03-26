import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { DataStoreService } from '../../../../store/datastoreservice.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../../header/header.component';
@Component({
  selector: 'app-prepare-summary',
  standalone: true,
    imports: [
      CommonModule,
      MatTableModule,
      MatCardModule,
      MatDividerModule,
      RouterModule,
      HeaderComponent
    ],
  templateUrl: './prepare-summary.component.html',
  styleUrl: './prepare-summary.component.css'
})
export class PrepareSummaryComponent {
 patient: any;
  displayedColumns: string[] = [
    // 'id',
    'date',
    'time',
    'status',
    'spo2',
    'hr',
    'bp',
    'rr',
    'rbs',
    'emergencyType',
    'triage',
    'triageNotes',
  ];
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
