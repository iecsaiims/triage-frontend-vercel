import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { IntakeOutputService } from '../../../../api/intake-output.service';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-intake-output',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './intake-output.component.html',
  styleUrls: ['./intake-output.component.css'],
})
export class IntakeOutputComponent {
  selectedTemplate = false;
  patientId!: number;
  patient: any = null;

  inParameters = [
    'Blood',
    'Body Fluid',
    'Drain',
    'Feed',
    'Frozen Plasma',
    'Gastric Lavage',
    'IV Fluid',
    'IV Medication',
    'Medication',
    'Oral Feeding',
    'PBRC',
    'Platelets',
    'RT Aspiration',
    'Ryle Tube Feeding',
    'Stool',
    'Urine',
  ];

  outParameters = this.inParameters;

  intakeData = {
    inDate: '',
    inTime: '',
    inParameter: '',
    routeIn: '',
    volumeIn: '',
    remarksIn: '',
  };

  outputData = {
    outDate: '',
    outTime: '',
    outParameter: '',
    // routeOut: '',
    volumeOut: '',
    remarksOut: '',
  };

  submittedBy = 'Yamini Verma';
  designation = 'Doctor';

  intakeOutputRecords: any[] = [];
  remarks = '';

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private ioService: IntakeOutputService
  ) {}

  ngOnInit() {
    const idParam =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route?.parent?.snapshot?.paramMap.get('id');
    this.patientId = idParam ? +idParam : NaN;

    if (isNaN(this.patientId)) return;
    this.loadPatientDetails();
    this.loadIntakeOutput();
  }

  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error(err),
    });
  }

saveDetails(form: any) {
  if (!form.valid) {
    alert("Please fill all required fields before saving.");
    return;
  }

  const body = {
    patientId: this.patientId,
    inParameter: this.intakeData.inParameter,
    routeIn: this.intakeData.routeIn,
    volumeIn: this.intakeData.volumeIn,
    remarksIn: this.intakeData.remarksIn,
    inDate: this.intakeData.inDate,
    inTime: this.intakeData.inTime,

    outParameter: this.outputData.outParameter,
    // routeOut: this.outputData.routeOut,
    volumeOut: this.outputData.volumeOut,
    remarksOut: this.outputData.remarksOut,
    outDate: this.outputData.outDate,
    outTime: this.outputData.outTime,

    submittedBy: this.submittedBy,
    designation: this.designation
  };

  this.ioService.saveIntakeOutput(body).subscribe({
    next: res => {
      console.log('Saved:', res);
      this.loadIntakeOutput();
      this.selectedTemplate = false;
      alert('Details saved successfully!');
         form.reset();
    },
    error: err => console.error('Error saving intake/output', err)
  });
}


  loadIntakeOutput() {
    this.ioService.getIntakeOutput(this.patientId).subscribe({
      next: (res: any) => {
        this.intakeOutputRecords = res.data || [];
        // Set default showDetails = false
        this.intakeOutputRecords.forEach((r) => (r.showDetails = false));
      },
      error: (err) => console.error(err),
    });
  }
dateFilter = (d: Date | null): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !d ? false : d >= today;
};

}
