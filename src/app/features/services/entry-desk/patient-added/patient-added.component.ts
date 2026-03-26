import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from '../../../../api/patient.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { HeaderComponent } from '../../../header/header.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-patient-added',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './patient-added.component.html',
  styleUrl: './patient-added.component.css',
})
export class PatientAddedComponent implements OnInit {
  patientForm: any;
  successMessage: string = '';
  isSubmitting: boolean = false;
  constructor(
    public fb: FormBuilder,
    public patientService: PatientService,
    public router: Router
  ) {}

  ngOnInit() {
    const now = new Date();

    const currentDate = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 5);

    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      crNumber: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      guardianType: ['Father', Validators.required],
      guardianName: ['', Validators.required],
      visitDate: [currentDate, Validators.required],
      visitTime: [currentTime, Validators.required],
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;

      const formValue = this.patientForm.value;
      const patientData = {
        ...formValue,
        visitDateTime: new Date(
          `${formValue.visitDate}T${formValue.visitTime}`
        ).toISOString(),
      };

      this.patientService.addPatient(patientData).subscribe(
        (response) => {
          console.log('✅ Patient added successfully', response);
          this.successMessage = '✅ Patient added successfully!';
          setTimeout(() => this.router.navigateByUrl('/registration-list'), 1000);
        },
        (error) => {
          console.error('❌ Error adding patient', error);
          this.successMessage = '❌ Error while adding patient!';

          setTimeout(() => {
            this.successMessage = '';
            this.isSubmitting = false;
          }, 3000);
        }
      );
    }
  }
}
