import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvestigationService } from '../../../../../api/investigation.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PatientService } from '../../../../../api/patient.service';
import { AuthService } from '../../../../../api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-investigation-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './investigation-order.component.html',
  styleUrls: ['./investigation-order.component.css'],
})
export class InvestigationOrderComponent {
  patientId!: number;
  // Template Selection
  selectedTemplate: string = '';
  hemoglobin: any;
  hct: any;
  mcv: any;
  rdwcv: any;
  tlc: any;
  neutrophils: any;
  lymphocytes: any;
  monocytes: any;
  eosinophils: any;
  basophil: any;
  plateletCount: any;
  // LFT fields
  tBill: number | null = null;
  dBill: number | null = null;
  iBill: number | null = null;
  ast: number | null = null;
  alt: number | null = null;
  alp: number | null = null;
  totalProtein: number | null = null;
  albumin: number | null = null;
  globulin: number | null = null;

  // kft fields
  urea: number | null = null;
  creatine: number | null = null;
  na: number | null = null;
  k: number | null = null;
  cl: number | null = null;
  uricAcid: number | null = null;
  ketones: string = '';
  nitrites: string = '';
  urineCulture: string = '';
  // Coagulation Test fields
  ptinr: number | null = null;
  apttt: number | null = null;
  dDimer: number | null = null;
  // Data from backend
  cbcData: any = null;
  showCbcDetails: boolean = false;
  cbcRecords: any[] = [];
  patient: any = null;
  lftRecords: any[] = [];
  kftRecords: any[] = [];
  urineRecords: any[] = [];
  coagulationRecords: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private investigationService: InvestigationService,
    private patientService: PatientService,
    public authService: AuthService,
    private snackBar: MatSnackBar
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

    this.loadCbc(this.patientId);
    this.loadPatientDetails();
    this.loadLft(this.patientId);
    this.loadKft(this.patientId);
    this.getUrineRecords(this.patientId);
    this.getCoagulationRecords(this.patientId);
    console.log('✅ Patient ID from route:', this.patientId);
  }

  loadCbc(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    this.investigationService.getCbc(patientId).subscribe({
      next: (res: any) => {
        console.log('CBC records fetched:', res);
        const records = Array.isArray(res.data) ? res.data : [res.data];
        this.cbcRecords = records.map((r: any) => ({
          ...r,
          submitted_by: r.submitted_by || user?.user || 'Unknown',
          designation: r.designation || user?.designation || 'N/A',
        }));
      },
      error: (err) => console.error('Error fetching CBC data', err),
    });
  }
  saveCbcOrder() {
    const user = this.authService.getCurrentUserFromToken();
    const body = {
      hemoglobin: Number(this.hemoglobin),
      hct: Number(this.hct),
      mcv: Number(this.mcv),
      rdwcv: Number(this.rdwcv),
      tlc: Number(this.tlc),
      neutrophils: Number(this.neutrophils),
      lymphocytes: Number(this.lymphocytes),
      monocytes: Number(this.monocytes),
      eosinophils: Number(this.eosinophils),
      basophil: Number(this.basophil),
      plateletCount: Number(this.plateletCount),
      patientId: this.patientId,
      submitted_by: user?.user || 'Unknown',
      designation: user?.designation || 'N/A',
    };

    console.log('Saving CBC order:', body);

    this.investigationService.saveCbc(body).subscribe({
      next: (res: any) => {
        console.log('CBC saved successfully:', res.data);
        this.loadCbc(this.patientId);

        // ✅ Snackbar success message
        this.snackBar.open('✅ CBC saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'], // Optional custom CSS
        });
      },
      error: (err: any) => {
        console.error('Error saving CBC', err);

        // ❌ Snackbar error message
        this.snackBar.open('❌ Failed to save CBC. Try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  // Save LFT
  saveLftOrder() {
    const body = {
      tBill: this.tBill,
      dBill: this.dBill,
      iBill: this.iBill,
      ast: this.ast,
      alt: this.alt,
      alp: this.alp,
      totalProtein: this.totalProtein,
      albumin: this.albumin,
      globulin: this.globulin,
      patientId: this.patientId,
    };

    this.investigationService.saveLft(body).subscribe({
      next: (res) => {
        console.log('LFT saved successfully', res);
        this.loadLft(this.patientId);
      },
      error: (err) => console.error('Error saving LFT', err),
    });
  }

  // Get LFT List
  loadLft(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    this.investigationService.getLft(patientId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const records = Array.isArray(res.data) ? res.data : [res.data];

          this.lftRecords = records.map((r: any) => ({
            ...r,
            submitted_by: r.submitted_by || user?.user || 'Unknown',
            designation: r.designation || user?.designation || 'N/A',
          }));
          console.log('LFT records:', this.lftRecords);
        }
      },
      error: (err) => console.error('Error fetching LFT', err),
    });
  }

  // ================= KFT Save =================
  saveKftOrder() {
    const body = {
      urea: this.urea,
      creatine: this.creatine,
      na: this.na,
      k: this.k,
      cl: this.cl,
      uricAcid: this.uricAcid,
      patientId: this.patientId,
    };

    this.investigationService.saveKft(body).subscribe({
      next: (res: any) => {
        console.log('KFT saved successfully', res);
        this.loadKft(this.patientId);
      },
      error: (err: any) => console.error('Error saving KFT', err),
    });
  }

  // ================= KFT Load =================

  loadKft(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    this.investigationService.getKft(patientId).subscribe({
      next: (res: any) => {
        console.log('KFT records:', res);
        const records = Array.isArray(res.data) ? res.data : [res.data];
        this.kftRecords = records.map((r: any) => ({
          ...r,
          submitted_by: r.submitted_by || user?.user || 'Unknown',
          designation: r.designation || user?.designation || 'N/A',
        }));
      },
      error: (err: any) => console.error('Error fetching KFT', err),
    });
  }

  saveUrineOrder() {
    if (!this.ketones && !this.nitrites && !this.urineCulture) {
      this.snackBar.open(
        '❌ Please fill at least one field before saving.',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
      return;
    }

    const urineBody = {
      ketones: this.ketones,
      nitrites: this.nitrites,
      urineCulture: this.urineCulture,
      patientId: this.patientId,
    };

    console.log('Saving Urine order:', urineBody);

    this.investigationService.saveUrine(urineBody).subscribe({
      next: (res) => {
        console.log('✅ Urine test saved:', res);
        this.snackBar.open('Urine Test Saved Successfully ✅', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        this.ketones = '';
        this.nitrites = '';
        this.urineCulture = '';

        this.getUrineRecords(this.patientId);
      },
      error: (err) => {
        console.error('❌ Error saving urine test:', err);

        this.snackBar.open('Failed to Save Urine Test ❌', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  // Records fetch karne ka method
  getUrineRecords(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    this.investigationService.getUrine(patientId).subscribe({
      next: (res: any) => {
        console.log('Fetched urine test records:', res);
        const records = Array.isArray(res.data) ? res.data : [res.data];
        this.urineRecords = records.map((r: any) => ({
          ...r,
          submitted_by: r.submitted_by || user?.user || 'Unknown',
          designation: r.designation || user?.designation || 'N/A',
        }));
      },
      error: (err: any) => {
        console.error('Error fetching urine test records:', err);
      },
    });
  }
  saveCoagulationOrder() {
    if (!this.ptinr && !this.apttt && !this.dDimer) {
      this.snackBar.open(
        'Please enter at least one field before saving.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    const coagulationBody = {
      ptinr: this.ptinr,
      apttt: this.apttt,
      dDimer: this.dDimer,
      patientId: this.patientId,
    };

    this.investigationService.saveCoagulation(coagulationBody).subscribe({
      next: (res) => {
        this.snackBar.open('Coagulation test saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.getCoagulationRecords(this.patientId);

        // clear fields
        this.ptinr = null;
        this.apttt = null;
        this.dDimer = null;
      },
      error: (err) => {
        console.error('Error saving Coagulation:', err);
        this.snackBar.open('Error saving Coagulation test!', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
  getCoagulationRecords(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();
    this.investigationService.getCoagulation(patientId).subscribe({
      next: (res: any) => {
        console.log('Fetched Coagulation records:', res);
        const records = Array.isArray(res.data) ? res.data : [res.data];
        this.coagulationRecords = records.map((r: any) => ({
          ...r,
          submitted_by: r.submitted_by || user?.user || 'Unknown',
          designation: r.designation || user?.designation || 'N/A',
        }));
      },
      error: (err) => {
        console.error('Error fetching Coagulation:', err);
      },
    });
  }

  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Patient fetch error:', err),
    });
  }
}
