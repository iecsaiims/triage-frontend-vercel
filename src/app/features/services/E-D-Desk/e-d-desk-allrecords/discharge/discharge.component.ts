import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../../../../api/template.service';
import { AuthService } from '../../../../../api/auth.service';
import { PatientService } from '../../../../../api/patient.service';
import { FileService } from '../../../../../api/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-discharge',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './discharge.component.html',
  styleUrl: './discharge.component.css',
})
export class DischargeComponent {
  selectedTemplate = '';
  patientId!: number;
  patient: any;
  isLoading = true;
  admissions: any[] = [];
  modalImage: string | null = null;
  // Transfer Out Slip
  transfer = {
    name: '',
    age: '',
    sex: '',
    guardian_name: '',
    address: '',
    referred_date: '',
    referred_time: '',
    referred_to_facility: '',
    transfer_provisional_diagnosis: '',
    transfer_attended_date: '',
    transfer_attended_time: '',
    chief_complaints: '',
    reason_for_referral: '',
    condition_at_referral: 'Stable',
    treatment_received: '',
    referring_physician_name: '',
    referring_physician_designation: '',
  };
  transferSlips: any[] = [];
  // Discharge Summary
  discharge = {
    name: '',
    age: '',
    sex: '',
    guardian_name: '',
    address: '',
    discharge_clinical_course: '',
    discharge_provisional_diagnosis: '',
    pulse: '',
    blood_pressure: '',
    respiratory_rate: '',
    spo2: '',
    pain_score: '',
    gcs: 0,
    discharge_advice: '',
  };
  dischargeSummaries: any[] = [];

  // LAMA
  lama: any = {
    name: '',
    age: '',
    sex: '',
    guardian_name: '',
    address: '',
    lama_consent_document: null,
  };
  lamaFile: File | null = null;
  lamaConsents: any[] = [];

  Admission = {
    name: '',
    age: '',
    sex: '',
    guardian_name: '',
    address: '',
    ward: '',
    image_blobUrl: '',
    showImage: false,
    wardConsentDocument: '',
    showDetails: false,
    createdAt: '',
    updatedAt: '',
    submittedBy: '',
    designation: '',
    wardConsentDocument_url: '',
  };
  AdmissionFile: File | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public templateService: TemplateService,
    public authService: AuthService,
    public patientService: PatientService,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const idParam =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route?.parent?.snapshot?.paramMap.get('id');
    this.patientId = idParam ? +idParam : NaN;

    if (isNaN(this.patientId)) {
      console.error('❌ Invalid patient ID');
      this.isLoading = false;
      return;
    }

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => {
        this.patient = data;

        // 👇 Copy data into all templates
        this.copyPatientDetailsTo(this.transfer);
        this.copyPatientDetailsTo(this.discharge);
        this.copyPatientDetailsTo(this.lama);
        this.copyPatientDetailsTo(this.Admission);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Patient fetch error:', err);
        this.isLoading = false;
      },
    });

    this.getDischargeSummaries();
    this.getTransferSlips();
    this.getLamaConsent(this.patientId);
    this.getAdmission(this.patientId);
  }

  copyPatientDetailsTo(target: any) {
    if (!this.patient) return;

    target.name = this.patient.name || '';
    target.address = this.patient.address || '';
    target.age = this.patient.age || '';
    target.sex = this.patient.gender || '';
    target.guardian_name = this.patient.guardianName || '';
  }

  getDischargeSummaries() {
    this.templateService.getDischargeSummary(this.patientId).subscribe({
      next: (res: any) => {
        this.dischargeSummaries = res.data.map((d: any) => ({
          ...d,
          showDetails: false,
        }));
      },
      error: (err: any) => {
        console.error('❌ Error fetching discharge summaries:', err);
      },
    });
  }
  getTransferSlips() {
    this.templateService.getTransferOutSlip(this.patientId).subscribe({
      next: (res: any) => {
        console.log('📦 Transfer Slip Data:', res.data);
        this.transferSlips = res.data.map((slip: any) => ({
          ...slip,
          showDetails: false,
        }));
      },
      error: (err: any) => console.error('❌ Transfer Out fetch error:', err),
    });
  }
  //  Save Transfer Slip
  onSaveTransferSlip() {
    const data = {
      patientId: this.patientId,
      ...this.transfer,
    };
    this.templateService.transferOutSlipData(data).subscribe({
      next: (res: any) => {
        this.getTransferSlips();

        // ✅ Success snackbar
        this.snackBar.open('Transfer Slip saved successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err: any) => {
        console.error('❌ Transfer slip save error:', err);

        // ❌ Error snackbar
        this.snackBar.open(
          'Failed to save Transfer Slip. Try again!',
          'Close',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  // Save Discharge Summary
  onSaveDischargeSummary() {
    const data = {
      patientId: this.patientId,
      ...this.discharge,
    };
    this.templateService.dischargeSummary(data).subscribe({
      next: (res: any) => {
        this.getDischargeSummaries();

        // ✅ Success message
        this.snackBar.open('Discharge Summary saved successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err: any) => {
        console.error('❌ Error saving Discharge Summary:', err);

        // ❌ Error message
        this.snackBar.open(
          'Failed to save Discharge Summary. Try again!',
          'Close',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  // Save LAMA
  onLamaFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.lamaFile = file;
    }
  }

  onSaveLamaConsent() {
    const formData = new FormData();
    formData.append('patientId', this.patientId.toString());
    formData.append('name', this.lama.name);
    formData.append('age', this.lama.age);
    formData.append('sex', this.lama.sex);
    formData.append('guardian_name', this.lama.guardian_name);
    formData.append('address', this.lama.address);

    if (this.lamaFile) {
      // Change field name here
      formData.append('lamaConsentDocument', this.lamaFile);
    }

    this.templateService.saveLamaConsent(formData).subscribe({
      next: (res: any) => {
        this.getLamaConsent(this.patientId);

        // ✅ Success message
        this.snackBar.open('LAMA Consent saved successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (err: any) => {
        console.error('❌ Error saving LAMA Consent:', err);

        // ❌ Error message
        this.snackBar.open('Failed to save LAMA Consent. Try again!', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  getLamaConsent(patientId: number = this.patientId) {
    this.templateService.getLamaConsent(this.patientId).subscribe({
      next: (res: any) => {
        const latestConsent = res.data?.[res.data.length - 1];
        if (latestConsent) {
          this.lama = {
            ...latestConsent,
            showDetails: false,
          };
        }
      },
      error: (err: any) => {
        console.error('❌ Error fetching LAMA Consent:', err);
      },
    });
  }

  openImageModal(imagePath: string): void {
    this.modalImage = imagePath;
  }

  closeImageModal(): void {
    this.modalImage = null;
  }

  fullscreenImageUrl: string | null = null;

  // Open fullscreen for ECG or Gas image
  openFullScreen(imageUrl: string) {
    this.fullscreenImageUrl = imageUrl;
  }

  closeFullScreen() {
    this.fullscreenImageUrl = null;
  }

  toggleImage(item: any, imageKey: string) {
    if (item.showImage) {
      item.showImage = false;
      return;
    }

    if (item.image_blobUrl) {
      item.showImage = true;
      return;
    }

    const fileName = item[imageKey];
    if (!fileName) {
      console.error('❌ Invalid file URL');
      return;
    }

    this.fileService.getfile(fileName).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        item.image_blobUrl = objectUrl;
        item.showImage = true;
      },
      error: (err) => {
        console.error('❌ Error fetching file:', err);
        item.showImage = false;
      },
    });
  }

  isValidBP(bp: string): boolean {
    if (!bp) return false;
    const regex = /^[0-9]{2,3}\/[0-9]{2,3}$/;
    return regex.test(bp);
  }
  get respRateNum(): number {
    return Number(this.discharge?.respiratory_rate);
  }

  get spo2Num(): number {
    return Number(this.discharge?.spo2);
  }
  onSaveAdmission() {
    const formData = new FormData();
    formData.append('patientId', this.patientId.toString());
    formData.append('name', this.Admission.name);
    formData.append('age', this.Admission.age);
    formData.append('sex', this.Admission.sex);
    formData.append('guardian_name', this.Admission.guardian_name);
    formData.append('address', this.Admission.address);
    formData.append('ward', this.Admission.ward);

    if (this.AdmissionFile) {
      formData.append('AdmissionConsentDocument', this.AdmissionFile);
    }

    this.templateService.saveAdmission(formData).subscribe({
      next: (res: any) => {
        console.log('✅ Admission Consent saved:', res);

        this.snackBar.open('Admission Consent saved successfully!', 'Close', {
          duration: 3000,
        });

        this.getAdmission(this.patientId);
      },
      error: (err: any) => {
        console.error('❌ Error saving Admission Consent:', err);

        this.snackBar.open('Failed to save Admission Consent!', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onAdmissionFileSelected(event: any) {
    this.AdmissionFile = event.target.files[0];
  }

  getAdmission(patientId: number = this.patientId) {
    this.templateService.getAdmission(this.patientId).subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          this.admissions = res.data.map((item: any) => ({
            ...item,
            showDetails: false,
            showImage: false,
          }));
        }
      },
      error: (err: any) => {
        console.error('❌ Error fetching Admission Consent:', err);
      },
    });
  }
}
