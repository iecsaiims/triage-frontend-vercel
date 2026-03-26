import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TriageEngineService, TriageInput } from '../../../../api/triage-engine.service';
import { signal } from '@angular/core';
import { VoiceRecognitionService } from '../../../../api/voice-recognition.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-triage-entry-desk',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderComponent,
  ],
  templateUrl: './triage-entry-desk.component.html',
  styleUrl: './triage-entry-desk.component.css',
})
export class TriageEntryDeskComponent implements OnInit {
  patient: any;
  triageForm: FormGroup;
  isMenuOpen = false;
  successMessage = '';
  isSubmitting = false;
  isPdfOpen = false;
  mode: string = '';

  // Auto-triage outputs 
  autoCategory: string | null = null;
  autoReasons: string[] = [];

  //VOice-recognition fields
  private voiceBaseText = '';
  protected readonly listening = signal(false);
  protected readonly voiceHint = signal('Tap mic to capture complaint by voice.');

  // helper for Angular template strict checking
  get hasAutoReasons(): boolean {
    return this.autoReasons && this.autoReasons.length > 0;
  }

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public patientService: PatientService,
    public fb: FormBuilder,
    private readonly voice: VoiceRecognitionService,
    private triageEngine: TriageEngineService
  ) {
    this.triageForm = this.fb.group({
      status: ['', Validators.required],
      spo2: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      pulse: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      dbp: ['', [Validators.required, Validators.min(0), Validators.max(200)]],
      sbp: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      rr: [null, [Validators.required, Validators.min(0), Validators.max(80)]],
      temp: [null, [Validators.required, Validators.min(0), Validators.max(120)]],

      emergencyType: ['NON-TRAUMA'],
      triage: [''],
      triageNotes: [''],
      arrivalMode: ['', Validators.required],
      referralStatus: ['', Validators.required],
      complaints: this.fb.array([]),

      triageTimeStamp: [new Date().toISOString()],
      submittedBy: [''],
      designation: [''],

      //In future fields for triage-engine logic 
      gcs: [15],
      alertOrResponsive: [true],
      acuteOnset: [false],
      airwayCompromise: [false],
      seizureNow: [false],
    });

    //Live auto-triage calculation
    this.triageForm.valueChanges.subscribe((value) => {
      this.updateAutoTriage(value);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'];
      console.log(this.mode);
    });

    const id = Number(this.route?.snapshot?.paramMap.get('id'));
    if (!id || isNaN(id)) {
      console.warn('No valid patient ID in route (SSR or invalid)');
      this.addComplaint();
      return;
    }

    this.patientService?.getPatientById(id).subscribe((data: any) => {
      this.patient = data || {};
      
      const src = this.patient;
      this.triageForm.patchValue({
        status: src.status || '',
        spo2: src.spo2 ?? null,
        pulse: src.pulse ?? '',
        dbp: src.dbp ?? '',
        sbp: src.sbp ?? '',
        rr: src.rr ?? null,
        temp: src.temp ?? null,
        emergencyType: src.emergencyType || 'NON-TRAUMA',
        triage: src.triage || '',
        triageNotes: src.triageNotes || '',
        arrivalMode: src.arrivalMode || '',
        referralStatus: src.referralStatus || '',
        triageTimeStamp: src.triageTimeStamp || new Date().toISOString(),
        submittedBy: src.submittedBy || '',
        designation: src.designation || '',

        //optional engine fields (only patch if present)
        gcs: src.gcs ?? 15,
        alertOrResponsive: src.alertOrResponsive ?? true,
        acuteOnset: src.acuteOnset ?? false,
        airwayCompromise: src.airwayCompromise ?? false,
        seizureNow: src.seizureNow ?? false,
      });

      if (src.complaints && src.complaints.length > 0) {
        src.complaints.forEach((c: any) => {
          this.complaints.push(
            this.fb.group({
              complaint: c.complaint,
              duration: c.duration,
            })
          );
        });
      }

      if (this.complaints.length === 0) {
        this.addComplaint();
      }

      // compute once after patch
      this.updateAutoTriage(this.triageForm.value);
    });
  }

  get complaints(): FormArray {
    return this.triageForm.get('complaints') as FormArray;
  }

  addComplaint() {
    this.complaints.push(
      this.fb.group({
        complaint: ['', Validators.required],
        duration: ['', Validators.required],
      })
    );
  }

  removeComplaint(index: number) {
    if (this.complaints.length > 1) {
      this.complaints.removeAt(index);
    }
  }

  saveTriageInfo() {
    this.successMessage = '';
    this.isSubmitting = true;

    if (this.triageForm.invalid) {
      this.successMessage = '❌ Please fill all required fields.';
      this.isSubmitting = false;
      this.triageForm.markAllAsTouched();
      setTimeout(() => (this.successMessage = ''), 3000);
      return;
    }

    const payload = this.triageForm.value;

    if (this.patient) {
      this.patientService.addTriage(this.patient.id, payload).subscribe(
        (response) => {
          this.stopVoice();
          this.successMessage = '✅ Patient details saved successfully!';
          this.isSubmitting = false;

          if (this.mode === 'e') {
            setTimeout(() => {
              this.router.navigate(['/ed-desk/patient-details']);
            }, 2000);
          } else {
            console.log('Patient updated:', response);
            setTimeout(() => {
              this.router.navigate(['/triage-list']);
            }, 2000);
          }
        },
        (error) => {
          console.error('Error updating patient', error);
          this.successMessage = '❌ Error saving patient data. Please try again.';
          this.isSubmitting = false;
        }
      );
    }
  }

  saveDraft() {
    console.log('Draft Saved:', this.triageForm.value);
    this.successMessage = '📝 Draft saved successfully!';
  }

  clearForm() {
    this.triageForm.reset();
    // optional: reset auto outputs too
    this.autoCategory = null;
    this.autoReasons = [];
    this.stopVoice();

  }

  cancel() {
    this.router.navigate(['/triage-list']);
  }

  openPdf() {
    this.isPdfOpen = true;
  }

  closePdf() {
    this.isPdfOpen = false;
  }

  closeOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closePdf();
    }
  }


  //  AUTO TRIAGE

  private updateAutoTriage(formValue: any): void {
    const input: TriageInput = {
      alertOrResponsive: this.toBooleanOrNull(formValue.alertOrResponsive),
      acuteOnset: this.toBooleanOrNull(formValue.acuteOnset),

      spo2: this.toNumberOrNull(formValue.spo2),
      respRate: this.toNumberOrNull(formValue.rr),
      sbp: this.toNumberOrNull(formValue.sbp),
      dbp: this.toNumberOrNull(formValue.dbp),
      pulse: this.toNumberOrNull(formValue.pulse),
      gcs: this.toNumberOrNull(formValue.gcs),

      airwayCompromise: this.toBooleanOrNull(formValue.airwayCompromise),
      seizureNow: this.toBooleanOrNull(formValue.seizureNow),
    };

    const decision = this.triageEngine.evaluate(input);

    if (!decision) {
      this.autoCategory = null;
      this.autoReasons = [];
      return;
    }

    this.autoCategory = decision.category;
    this.autoReasons = decision.reasons ?? [];

    // auto-fill existing triage control (without looping valueChanges)
    // const triageControl = this.triageForm.get('triage');
    // if (triageControl && triageControl.value !== decision.category) {
    //   triageControl.setValue(decision.category, { emitEvent: false });
    // }
  }

  private toNumberOrNull(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  private toBooleanOrNull(value: any): boolean | null {
    if (value === null || value === undefined || value === '') return null;
    return !!value;
  }

  // VOICE RECOGNITION METHODS
  protected toggleVoice(): void {
    if (!this.voice.isSupported) {
      this.voiceHint.set('Voice input is not supported in this browser.');
      return;
    }

    if (this.listening()) {
      this.stopVoice();
    } else {
      this.startVoice();
    }
  }

  private startVoice(): void {
  if (this.complaints.length === 0) this.addComplaint();

  const c0 = this.complaints.at(0);
  const control = c0?.get('complaint');
  if (!control) return;

  // ✅ Base text is whatever was already typed BEFORE starting voice
  this.voiceBaseText = (control.value ?? '').toString().trim();

  const started = this.voice.start((text, isFinal) => {
    const spoken = (text ?? '').trim();
    if (!spoken) return;

    if (isFinal) {
      // ✅ Commit final once
      this.voiceBaseText = this.voiceBaseText
        ? `${this.voiceBaseText} ${spoken}`.trim()
        : spoken;

      control.setValue(this.voiceBaseText); // final committed
      this.voiceHint.set('Captured. Tap again to stop or continue speaking.');
    } else {
      // ✅ Live preview (do NOT commit/append permanently)
      const preview = this.voiceBaseText
        ? `${this.voiceBaseText} ${spoken}`.trim()
        : spoken;

      control.setValue(preview);
      this.voiceHint.set('Listening... speak clearly.');
    }
  });

  if (started) {
    this.listening.set(true);
    this.voiceHint.set('Listening... speak clearly.');
  } else {
    this.voiceHint.set('Unable to start voice capture. Please type instead.');
  }
}


  private stopVoice(): void {
    this.voice.stop();
    this.listening.set(false);
    this.voiceHint.set('Voice capture paused.');
  }
}
