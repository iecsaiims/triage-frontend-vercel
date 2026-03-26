import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import { FormsModule } from '@angular/forms';
import { EncService } from '../../../../api/enc.service';
import { PatientService } from '../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enc-desk',
  standalone: true,
  imports: [CommonModule, MaterialModule, HeaderComponent, FormsModule],
  templateUrl: './enc-desk.component.html',
  styleUrls: ['./enc-desk.component.css'],
})
export class ENCDeskComponent implements OnInit {
  patientId: number = 0;
  patient: any = {};

  callRecords: any[] = [];
  finalCallSaved = false;
  consultationCompleted = '';
isFinalConsultationCompleted = false;

  form = {
    department: '',
    doctorName: '',
    callGivenBy: '',
    time: '',
  };

  dispositionSaved = false;
  dispositionForm = {
    status: '',
    time: '',
    notes: '',
  };
  disposition: any = {};

  departments = [
    'Anaesthesiology',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
  ];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private encService: EncService,
    public patientService: PatientService
  ) {}

  ngOnInit() {
    const id =
      Number(this.route?.snapshot?.paramMap?.get('id')) ||
      Number(this.route?.parent?.snapshot?.paramMap.get('id'));
    this.patientId = id;

    this.loadPatient();
    this.loadDisposition();
    this.loadConsultations();
  }

  // Load patient details
  loadPatient() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Error loading patient:', err),
    });
  }

  // Save consultation
  saveConsultationRecord() {
    const payload = {
      patientId: this.patientId,
      department: this.form.department,
      doctorName: this.form.doctorName,
      callGivenBy: this.form.callGivenBy,
      time: this.form.time,
      completed: this.consultationCompleted,
    };

    this.encService.submitConsultation(payload).subscribe({
      next: (res: any) => {
        console.log('Saved Consultation:', res);
        this.loadConsultations();

        if (payload.completed === 'Yes') this.finalCallSaved = true;

        this.form = {
          department: '',
          doctorName: '',
          callGivenBy: '',
          time: '',
        };
        this.consultationCompleted = '';
      },
      error: (err) => console.error('Error saving consultation:', err),
    });
  }

  // Load all consultations
loadConsultations() {
  this.encService.getConsultations(this.patientId).subscribe({
    next: (res: any) => {
      this.callRecords = Array.isArray(res?.data) ? res.data : [];

      if (this.callRecords.length > 0) {
        const lastCall = this.callRecords[this.callRecords.length - 1];

        if (lastCall.completed === "Yes") {
          this.isFinalConsultationCompleted = true;
          this.finalCallSaved = true;
        }
      }
    },
    error: (err) => console.error('Error loading consultations', err),
  });
}


  saveDisposition() {
    if (this.dispositionSaved) {
      alert('Disposition record already submitted for this patient.');
      return;
    }

    const payload = {
      patientId: this.patientId,
      disposition_status: this.dispositionForm.status || null,
      disposition_time: this.dispositionForm.time || null,
      disposition_notes: this.dispositionForm.notes || null,
    };

    this.encService.saveEncRecord(payload).subscribe({
      next: (res: any) => {
        console.log('Disposition Saved:', res);
        this.loadDisposition();
      },
      error: (err) => alert(err.error?.message || 'Error saving disposition'),
    });
  }

  loadDisposition() {
    this.encService.getEncRecord(this.patientId).subscribe({
      next: (res: any) => {
        console.log('DISPOSITION API:', res);
        this.disposition = {
          status: res?.data?.disposition_status || '',
          time: res?.data?.disposition_time || '',
          notes: res?.data?.disposition_notes || '',
        };

        this.dispositionSaved =
          !!this.disposition.status ||
          !!this.disposition.time ||
          !!this.disposition.notes;

        this.dispositionForm = { ...this.disposition };
      },
      error: (err) => console.error('Error loading disposition', err),
    });
  }
}
