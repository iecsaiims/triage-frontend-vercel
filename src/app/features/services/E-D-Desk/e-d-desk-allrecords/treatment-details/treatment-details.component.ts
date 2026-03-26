import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TreatmentService } from '../../../../../api/treatment.service';
import { PatientService } from '../../../../../api/patient.service';
import { AuthService } from '../../../../../api/auth.service';
import { MaterialModule } from '../../../../../shared/material/material.module';
@Component({
  selector: 'app-treatment-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './treatment-details.component.html',
  styleUrls: ['./treatment-details.component.css'],
})
export class TreatmentDetailsComponent implements OnInit {
  patientId!: number;
  patient: any = null;
  showTreatmentForm = false;
  treatments: any[] = [];
  treatmentData = {
    TreatmentDate: '',
    TreatmentTime: '',
    drugName: '',
    dose: '',
    frequency: '',
    route: '',
    // specialInstructions: '',
  };

  constructor(
    private treatmentService: TreatmentService,
    private route: ActivatedRoute,
    public patientService: PatientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const idParam =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route?.parent?.snapshot?.paramMap.get('id');

    this.patientId = idParam ? +idParam : NaN;

    if (isNaN(this.patientId)) {
      console.error('❌ Invalid patient ID');
      return;
    }

    console.log('✅ Patient ID from route:', this.patientId);
    this.loadTreatments(this.patientId);
    this.loadPatientDetails();
  }

  loadTreatments(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    console.log(
      '🔍 Fetching treatments for patient ID:',
      patientId,
      'User:',
      user
    );
    this.treatmentService.getTreatment(patientId).subscribe({
      next: (res: any) => {
        console.log('✅ Treatments fetched:', res);
        if (res?.data) {
          const records = Array.isArray(res.data) ? res.data : [res.data];
          this.treatments = records.map((r: any) => ({
            ...r,
            submitted_by: r.submitted_by || user?.user || 'Unknown',
            designation: r.designation || user?.designation || 'N/A',
          }));
        } else {
          this.treatments = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching treatments:', err);
      },
    });
  }

  saveTreatment() {
    const payload = {
      ...this.treatmentData,
      patientId: this.patientId,
    };

    this.treatmentService.saveTreatment(payload).subscribe({
      next: (res: any) => {
        console.log('Treatment saved:', res);

        this.loadTreatments(this.patientId);

        this.resetForm();
        this.showTreatmentForm = false;
      },
      error: (err) => {
        console.error('Error saving treatment:', err);
      },
    });
  }

  resetForm() {
    this.treatmentData = {
      TreatmentDate: '',
      TreatmentTime: '',
      drugName: '',
      dose: '',
      frequency: '',
      route: '',
      // specialInstructions: '',
    };
  }
  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Patient fetch error:', err),
    });
  }
}
