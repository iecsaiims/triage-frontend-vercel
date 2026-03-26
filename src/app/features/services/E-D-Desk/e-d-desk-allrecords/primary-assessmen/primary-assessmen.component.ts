import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimaryAssessmentService } from '../../../../../api/primary-assessment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-primary-assessmen',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './primary-assessmen.component.html',
  styleUrl: './primary-assessmen.component.css',
})
export class PrimaryAssessmenComponent {
  gross_added_sounds_Left: string = 'none';
  respiratory_effort: string = 'normal';
  airway_open_stable: string = '';
  rr: number | null = null;
  spo2: number | null = null;
  respEffortOther: string = '';
  air_entry: string = '';
  grossSoundsOther_Left: string = '';

  pulse_rate: number | null = null;
  pulse_regular: string = '';
  crt_seconds: number | null = null;
  skin: string = 'warm';
  skinOther: string = '';
  bp_right_arm: string = '';
  bp_left_arm: string = '';
  circulation_other: string = '';
  assessment_other: string = '';
  gcs_e: number | null = null;
  gcs_v: number | string | null = null;
  gcs_m: number | null = null;
  gcsTotal: number = 0;
  gcs_total: string = '';
  pupil_right_eye: number | null = null;
  reaction_to_light_right: string | null = null;
  pupil_left_eye: number | null = null;
  reaction_to_light_left: string | null = null;
  asymmetry_limb_movement: string = '';
  facial_asymmetry: string = '';
  posturing: string = '';
  temperature_f: number | null = null;
  rash: string = '';
  cynosis: string = '';
  patientId: string = '';

  // 🆕 Right side properties
  gross_added_sounds_right: string = 'none';
  grossSoundsOther_right: string = '';
  assessmentData: any = null;
  assessmentExists: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public primaryAssessmentService: PrimaryAssessmentService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const idFromRoute =
      this.route?.snapshot?.paramMap?.get('id') ||
      this.route?.parent?.snapshot?.paramMap?.get('id');

    if (idFromRoute) {
      this.patientId = idFromRoute;
      console.log('✅ Patient ID:', this.patientId);

      // ✅ Load assessment data
      this.loadAssessmentData(Number(this.patientId));
    } else {
      console.error('❌ No patient ID in route');
    }
  }

  loadAssessmentData(patientId: number) {
    this.primaryAssessmentService
      .getAssessmentByPatientId(patientId)
      .subscribe({
        next: (res: any) => {
          this.assessmentData = res?.data;
          this.assessmentExists = true;
          this.assessmentData.showDetails = true;
        },
        error: (err) => {
          console.error('❌ Error loading assessment data:', err);
        },
      });
  }

  calculateGcsTotal() {
    const e = typeof this.gcs_e === 'number' ? this.gcs_e : 0;
    const m = typeof this.gcs_m === 'number' ? this.gcs_m : 0;
    let total = e + m;
    let vText = '';

    if (typeof this.gcs_v === 'number') {
      total += this.gcs_v;
    } else if (this.gcs_v === 'T') {
      vText = 'T';
    }

    this.gcs_total = total + vText;
  }

  onSave() {
    if (this.assessmentExists) {
      this._snackBar.open(
        '⚠️ Assessment already exists for this patient.',
        'Close',
        {
          duration: 3000,
          panelClass: ['warning-snackbar'],
        }
      );
      return;
    }

    if (!this.patientId || isNaN(Number(this.patientId))) {
      this._snackBar.open('❌ Invalid patient ID.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // 👇 Parse BP
    const [rightSbp, rightDbp] = this.bp_right_arm
      .split('/')
      .map((v) => v.trim());
    const [leftSbp, leftDbp] = this.bp_left_arm.split('/').map((v) => v.trim());
    const data = {
      patientId: Number(this.patientId),
      airway_open_stable: this.airway_open_stable,
      rr: this.rr,
      spo2: this.spo2,
      respiratory_effort: this.respiratory_effort,
      air_entry: this.air_entry,
      breathing_other: this.respEffortOther,
      gross_added_sounds_Left: this.gross_added_sounds_Left,
      gross_added_sounds_right: this.gross_added_sounds_right,
      pulse_rate: this.pulse_rate,
      pulse_regular: this.pulse_regular,
      crt_seconds: this.crt_seconds?.toString(),
      skin: this.skin,
      circulation_other: this.circulation_other,
      bp_right_arm: this.bp_right_arm,
      bp_left_arm: this.bp_left_arm,
      gcs_e: this.gcs_e,
      gcs_v: this.gcs_v,
      gcs_m: this.gcs_m,
      gcs_total: this.gcs_total,
      pupil_right_eye: this.pupil_right_eye?.toString(),
      pupil_left_eye: this.pupil_left_eye?.toString(),
      reaction_to_light_right: this.reaction_to_light_right,
      reaction_to_light_left: this.reaction_to_light_left,
      asymmetry_limb_movement: this.asymmetry_limb_movement,
      facial_asymmetry: this.facial_asymmetry,
      posturing: this.posturing,
      temperature_f: this.temperature_f,
      rash: this.rash,
      cynosis: this.cynosis,
      assessment_other: this.assessment_other,
    };

    // ✅ Required fields to check
    const requiredFields = [
      'airway_open_stable',
      'rr',
      'spo2',
      'respiratory_effort',
      'air_entry',
      'gross_added_sounds_Left',
      'gross_added_sounds_right',
      'pulse_rate',
      'pulse_regular',
      'crt_seconds',
      'skin',
      'bp_right_arm',
      'bp_left_arm',
      'gcs_e',
      'gcs_v',
      'gcs_m',
      'gcs_total',
      'pupil_right_eye',
      'pupil_left_eye',
      'reaction_to_light_right',
      'reaction_to_light_left',
      'asymmetry_limb_movement',
      'facial_asymmetry',
      'posturing',
      'temperature_f',
      'rash',
      'cynosis',
    ];

    const allFilled = requiredFields.every((key) => {
      const value = (data as any)[key];
      return value !== null && value !== '' && value !== undefined;
    });

    if (!allFilled) {
      alert('❌ Please fill all required fields.');
      return;
    }

    // ✅ Proceed if valid
    console.log('📤 Sending data to API:', data);
    this.primaryAssessmentService.createAssessment(data).subscribe({
      next: (response: any) => {
        this.assessmentExists = true; // ✅ mark saved
        this._snackBar.open('✅ Assessment successfully saved.', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.loadAssessmentData(Number(this.patientId));
      },

      error: (error: any) => {
        console.error('❌ Error saving data:', error);
      },
    });
  }

  onCancel() {
    if (this.patientId) {
      this.router.navigate(['/patient-dashboard', this.patientId]);
    } else {
      console.error('❌ ID not available');
    }
  }
  onReset() {
    this.gross_added_sounds_Left = 'none';
    this.gross_added_sounds_right = 'none';
    this.respiratory_effort = 'normal';
    this.airway_open_stable = '';
    this.rr = null;
    this.spo2 = null;
    this.respEffortOther = '';
    this.air_entry = '';
    this.grossSoundsOther_Left = '';
    this.grossSoundsOther_right = '';
    this.pulse_rate = null;
    this.pulse_regular = '';
    this.crt_seconds = null;
    this.skin = 'warm';
    this.skinOther = '';
    this.bp_right_arm = '';
    this.bp_left_arm = '';
    this.circulation_other = '';
    this.assessment_other = '';
    this.gcs_e = null;
    this.gcs_v = null;
    this.gcs_m = null;
    this.gcsTotal = 0;
    this.gcs_total = '';
    this.pupil_right_eye = null;
    this.reaction_to_light_right = null;
    this.pupil_left_eye = null;
    this.reaction_to_light_left = null;
    this.asymmetry_limb_movement = '';
    this.facial_asymmetry = '';
    this.posturing = '';
    this.temperature_f = null;
    this.rash = '';
    this.cynosis = '';
  }
}
