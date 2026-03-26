import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { DiagnosisService } from '../../../../../api/diagnosis.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule],
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css'],
})
export class DiagnosisComponent {
  @Input() patientId!: number;
  remark = '';
  diagnosisRecords: any[] = [];
  patientData: any;
  diagnosisList: any[] = [];

  constructor(
    private diagnosisService: DiagnosisService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idFromRoute =
      this.route.snapshot.paramMap.get('id') ||
      this.route.parent?.snapshot?.paramMap.get('id');

    if (idFromRoute) {
      this.patientId = Number(idFromRoute);

      if (isNaN(this.patientId)) {
        console.error('Invalid patient ID in route:', idFromRoute);
        this.snackBar.open('Invalid patient ID in URL', 'Close', {
          duration: 3000,
        });
        return;
      }
      this.getDiagnosis();
    } else {
      console.error('No patient ID found in route');
      this.snackBar.open('No patient ID found in URL', 'Close', {
        duration: 3000,
      });
    }
  }

  onSave() {
    if (!this.patientId) {
      console.error('❌ Patient ID missing');
      this.snackBar.open('Patient ID missing', 'Close', { duration: 3000 });
      return;
    }

    this.diagnosisService.saveDiagnosis(this.patientId, this.remark).subscribe({
      next: (res: any) => {
        console.log('✅ Diagnosis saved:', res);
        this.snackBar.open('Diagnosis saved successfully ✅', 'Close', {
          duration: 3000,
        });
        this.remark = '';
        this.getDiagnosis();
      },
      error: (err: any) => {
        console.error('❌ Error saving diagnosis:', err);
        this.snackBar.open('Failed to save diagnosis ❌', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  getDiagnosis() {
    this.diagnosisService.getDiagnosis(this.patientId).subscribe({
      next: (res: any) => {
        console.log('📦 Diagnosis records:', res);
        this.diagnosisRecords = res.data || [];
      },
      error: (err: any) => {
        console.error('❌ Error fetching diagnosis:', err);
        this.snackBar.open('Failed to fetch diagnosis ❌', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
