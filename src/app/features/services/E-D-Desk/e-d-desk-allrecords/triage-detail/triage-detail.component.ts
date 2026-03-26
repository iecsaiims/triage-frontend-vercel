import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material/material.module';

@Component({
  selector: 'app-triage-detail',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './triage-detail.component.html',
  styleUrls: ['./triage-detail.component.css'],
})
export class TriageDetailComponent implements OnInit {
  patient: any;
  triageForm: FormGroup;
  triageData: any[] = [];
  isMenuOpen = false;
  successMessage = '';
  isSubmitting = false;

  displayedColumns: string[] = ['triage', 'triageNotes', 'date', 'time'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.triageForm = this.fb.group({
      status: ['', Validators.required],
      spo2: [null],
      hr: [''],
      bp: [''],
      rr: [null],
      rbs: [null],
      emergencyType: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
      triage: [''],
      triageNotes: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route?.parent?.snapshot?.paramMap?.get('id'));
    console.log('Fetching patient with ID:', id);

    this.patientService.getPatientById(id).subscribe((data: any) => {
      console.log('Patient data fetched:', data);
      this.patient = data;
      this.triageData = data.patientTriage || [];

      const now = new Date();
      const currentDate = now.toISOString().substring(0, 10);
      const currentTime = now.toTimeString().substring(0, 5);

      this.triageForm.patchValue({
        emergencyType: '',
        date: currentDate,
        time: currentTime,
        triageNotes: '',
        status: '',
        hr: '',
        bp: '',
        rr: '',
        spo2: '',
        rbs: '',
      });
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  saveTriageInfo() {
    this.successMessage = '';
    this.isSubmitting = true;

    console.log('Form submitted with values:', this.triageForm?.value);

    if (this.patient) {
      const updatedPatient: any = {
        ...this.patient,
        ...this.triageForm.value,
      };

      this.patientService.updatePatient(updatedPatient).subscribe(
        (response) => {
          console.log('Patient updated successfully', response);
          this.successMessage = '✅ Patient details saved successfully!';
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigate(['/prepare-summary', this.patient.id]);
          }, 2000);
        },
        (error) => {
          console.error('Error updating patient', error);
          this.successMessage =
            '❌ Error saving patient data. Please try again.';
          setTimeout(() => {
            this.successMessage = '';
            this.isSubmitting = false;
          }, 4000);
        }
      );
    }
  }

  clearForm() {
    this.triageForm.reset();
  }

  cancel() {
    this.router.navigate(['/patient-list']);
  }
}
