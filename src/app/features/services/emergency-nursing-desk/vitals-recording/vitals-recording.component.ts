import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VitalsService } from '../../../../api/vitals.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { PatientService } from '../../../../api/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vitals-recording',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './vitals-recording.component.html',
  styleUrls: ['./vitals-recording.component.css'],
})
export class VitalsRecordingComponent {
  patientId!: number;
  patient: any = null;

  vitalsData: any = {
    weightKg: null,
    heightCm: null,
    bmi: null,
    temperature: null,
    pulseRate: null,
    respiration: null,
    systolicBP: null,
    diastolicBP: null,
    meanBloodPressure: null,
    spo2: null,
    allergies: '',
    rbs: null,
    time: '',
  };

  vitalsRecords: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private vitalsService: VitalsService,
    private patientService: PatientService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const idParam =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route?.parent?.snapshot?.paramMap.get('id');
    this.patientId = idParam ? +idParam : NaN;

    if (isNaN(this.patientId)) return;

    this.loadVitals(this.patientId);
    this.loadPatientDetails();
  }

  calculateBMI() {
    if (this.vitalsData.weightKg && this.vitalsData.heightCm) {
      const heightM = this.vitalsData.heightCm / 100;
      this.vitalsData.bmi = +(
        this.vitalsData.weightKg /
        (heightM * heightM)
      ).toFixed(2);
    }
  }
  calculateMBP() {
    if (this.vitalsData.systolicBP && this.vitalsData.diastolicBP) {
      this.vitalsData.meanBloodPressure = +(
        this.vitalsData.diastolicBP +
        (this.vitalsData.systolicBP - this.vitalsData.diastolicBP) / 3
      ).toFixed(0);
    } else {
      this.vitalsData.meanBloodPressure = null;
    }
  }

  saveVitals() {
  const body = {
    patientId: this.patientId,
    weight: this.vitalsData.weightKg,
    height: this.vitalsData.heightCm,
    systolicBp: this.vitalsData.systolicBP,
    diastolicBp: this.vitalsData.diastolicBP,
    meanBp: this.vitalsData.meanBloodPressure,
    bmi: this.vitalsData.bmi,
    pulseRate: this.vitalsData.pulseRate,
    respiration: this.vitalsData.respiration,
    temperature: this.vitalsData.temperature,
    spo2: this.vitalsData.spo2,
    rbs: this.vitalsData.rbs,
    allergies: this.vitalsData.allergies,
    submittedBy: '',
    designation: ''
  };
  const { patientId, submittedBy, designation, ...checkFields } = body;
  const hasAnyValue = Object.values(checkFields).some(
    (val) => val !== null && val !== '' && val !== undefined
  );

  if (!hasAnyValue) {
    this.snackBar.open('Please fill at least one field before saving!', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    return;
  }
  console.log('Saving vitals:', body);

  this.vitalsService.saveVitals(body).subscribe({
    next: (res) => {
      console.log('Vitals saved:', res);
      this.loadVitals(this.patientId);
       // ✅ Success message after saving
    this.snackBar.open('Vitals saved successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    this.vitalsData = {
       weightKg: null,
    heightCm: null,
    bmi: null,
    temperature: null,
    pulseRate: null,
    respiration: null,
    systolicBP: null,
    diastolicBP: null,
    meanBloodPressure: null,
    spo2: null,
    allergies: '',
    rbs: null,
    time: '',
    };
    },
    error: (err) => console.error('Error saving vitals', err),
    
  });
    this.snackBar.open('Error saving vitals!', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
}


  loadVitals(patientId: number) {
    this.vitalsService.getVitals(patientId).subscribe({
      next: (res: any) => {
        console.log('Vitals records:', res);
        this.vitalsRecords = res.data || [];
      },
      error: (err) => console.error('Error fetching vitals', err),
    });
  }

  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Patient fetch error:', err),
    });
  }
}
