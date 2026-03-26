import { Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { EdConsultationService } from '../../../../../api/ed-consultation.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ed-consultation-record',
  imports: [MaterialModule, FormsModule],
  templateUrl: './ed-consultation-record.component.html',
  styleUrl: './ed-consultation-record.component.css',
})
export class EDConsultationRecordComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Backend fields
  patientId!: number;
  department: string = '';
  consultantName: string = '';
  callGivenTo: string = '';
  dispositionPlan: string = '';
  consultationImage: File | null = null;
  submittedBy: string = '';
  designation: string = '';

  // Date + Time fields
  callDate: Date | null = null;
  callTime: string = '';
  callSeenDate: Date | null = null;
  callSeenTime: string = '';

  // Store consultations
  consultations: any[] = [];

  // Dropdown data
  callGivenOptions = ['Jr', 'Sr', 'Faculty'];
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
    private consultationService: EdConsultationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const idParam =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route?.parent?.snapshot?.paramMap.get('id');

    this.patientId = idParam ? +idParam : NaN;
    console.log('✅ Patient ID from route:', this.patientId);

    const user = this.authService.getCurrentUserFromToken();
    this.submittedBy = user?.user || 'Current User';
    this.designation = user?.designation || 'Doctor';

    this.getConsultations();
  }

  // Combine date + time for backend
  private combineDateTime(date: Date | null, time: string): string {
    if (date && time) {
      const d = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      d.setHours(hours, minutes);
      return d.toISOString();
    }
    return '';
  }

  get callRespondedAt(): string {
    return this.combineDateTime(this.callDate, this.callTime);
  }

  get callSeenAtISO(): string {
    return this.combineDateTime(this.callSeenDate, this.callSeenTime);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.consultationImage = file;
      console.log('📂 File Selected:', file.name);
    }
  }

  saveConsultation() {
    const body = {
      patientId: this.patientId,
      department: this.department,
      callRespondedAt: this.callRespondedAt,
      consultantName: this.consultantName,
      callGivenTo: this.callGivenTo,
      callSeenAt: this.callSeenAtISO,
      dispositionPlan: this.dispositionPlan,
      submittedBy: this.submittedBy,
      designation: this.designation,
    };

    this.consultationService
      .saveConsultation(body, this.consultationImage || undefined)
      .subscribe({
        next: (res: any) => {
          console.log('✅ Consultation Saved:', res);

          this.snackBar.open('Consultation saved successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });

          this.getConsultations();

          // Reset fields
          this.department = '';
          this.consultantName = '';
          this.callGivenTo = '';
          this.dispositionPlan = '';
          this.consultationImage = null;
          this.callDate = null;
          this.callTime = '';
          this.callSeenDate = null;
          this.callSeenTime = '';

          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        },
        error: (err: any) => {
          console.error('❌ Error Saving Consultation:', err);

          this.snackBar.open(
            'Failed to save consultation. Try again!',
            'Close',
            {
              duration: 3000,
              panelClass: ['snackbar-error'],
            }
          );
        },
      });
  }

  getConsultations() {
    if (!this.patientId) return;

    this.consultationService
      .getConsultationByPatientId(this.patientId.toString())
      .subscribe({
        next: (res: any) => {
          console.log('📋 Consultations API Response:', res);
          this.consultations = res?.data || [];
        },
        error: (err: any) => {
          console.error('❌ Error fetching consultations:', err);
        },
      });
  }
}
