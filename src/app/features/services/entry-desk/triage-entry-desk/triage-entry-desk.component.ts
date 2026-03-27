import { Component, OnInit, signal } from '@angular/core';
import { PatientService } from '../../../../api/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { TriageEngineService, TriageInput } from '../../../../api/triage-engine.service';
import { VoiceRecognitionService } from '../../../../api/voice-recognition.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../header/header.component';
import {
  TRAUMA_ANATOMY_OPTIONS,
  TRAUMA_MECHANISM_OPTIONS,
  TRAUMA_SPECIAL_OPTIONS,
  NCCT_HEAD_OPTIONS,
  NONTRAUMA_IMMEDIATE_RED_OPTIONS,
  HIGH_RISK_BLEEDING_OPTIONS,
  TIME_SENSITIVE_OPTIONS,
  FEVER_DANGER_OPTIONS,
  MINOR_LOW_RISK_OPTIONS,
  Option,
} from './triage-options';


@Component({
  selector: 'app-triage-entry-desk',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatExpansionModule,
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
  successMessage = '';
  isSubmitting = false;
  isPdfOpen = false;
  mode: string = '';
  tAnatomyOpen = true;
  tMechOpen = false;
  tSpecialOpen = false;
  tNcctOpen = false;
  // Non-trauma collapsible states (Approach A)
  ntImmediateOpen = true;   // open by default (matches ED workflow + reference feel)
  ntBleedingOpen = false;
  ntTimeOpen = false;
  ntFeverOpen = false;
  ntMinorOpen = false;


  // Auto-triage outputs
  autoCategory: string | null = null;
  autoReasons: string[] = [];

  // Voice-recognition fields
  private voiceBaseText = '';
  protected readonly listening = signal(false);
  protected readonly voiceHint = signal('Tap mic to capture complaint by voice.');

  // helper for Angular template strict checking
  get hasAutoReasons(): boolean {
    return this.autoReasons && this.autoReasons.length > 0;
  }

  traumaAnatomyOptions: Option[] = TRAUMA_ANATOMY_OPTIONS;
  traumaMechanismOptions: Option[] = TRAUMA_MECHANISM_OPTIONS;
  traumaSpecialOptions: Option[] = TRAUMA_SPECIAL_OPTIONS;
  ncctHeadOptions: Option[] = NCCT_HEAD_OPTIONS;

  nonTraumaImmediateRedOptions: Option[] = NONTRAUMA_IMMEDIATE_RED_OPTIONS;
  highRiskBleedingOptions: Option[] = HIGH_RISK_BLEEDING_OPTIONS;
  timeSensitiveOptions: Option[] = TIME_SENSITIVE_OPTIONS;
  feverDangerOptions: Option[] = FEVER_DANGER_OPTIONS;
  minorLowRiskOptions: Option[] = MINOR_LOW_RISK_OPTIONS;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public patientService: PatientService,
    public fb: FormBuilder,
    private readonly voice: VoiceRecognitionService,
    private triageEngine: TriageEngineService
  ) {
    this.triageForm = this.fb.group({
      // existing
      status: ['ALERT', Validators.required], // AVPU UI (Alert/Verbal/Pain/Unresponsive)
      spo2: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]],
      pulse: [null as number | null, [Validators.required, Validators.min(0), Validators.max(300)]],
      dbp: [null as number | null, [Validators.required, Validators.min(0), Validators.max(200)]],
      sbp: [null as number | null, [Validators.required, Validators.min(0), Validators.max(300)]],
      rr: [null as number | null, [Validators.required, Validators.min(0), Validators.max(80)]],
      temp: [null as number | null, [Validators.required, Validators.min(0), Validators.max(120)]],

      emergencyType: ['NON-TRAUMA', Validators.required],
      triage: [''],
      triageNotes: [''],
      arrivalMode: ['', Validators.required],
      referralStatus: ['', Validators.required],
      complaints: this.fb.array([]),

      triageTimeStamp: [new Date().toISOString()],
      submittedBy: [''],
      designation: [''],

      // universal protocol toggles (compact)
      alertOrResponsive: [true],
      acuteOnset: [false],
      airwayCompromise: [false],
      seizureNow: [false],
      severePainOrDistress: [false],

      // trauma low-risk gate
      ambulatoryInEd: [null as boolean | null],
      onAnticoagulation: [null as boolean | null],
      ncctHead: this.fb.control<string[]>([]),

      // TRAUMA checklist groups
      traumaAnatomy: this.fb.control<string[]>([]),
      traumaMechanism: this.fb.control<string[]>([]),
      traumaSpecial: this.fb.control<string[]>([]),

      // NON-TRAUMA lists
      nonTraumaImmediateRed: this.fb.control<string[]>([]),
      highRiskBleeding: this.fb.control<string[]>([]),
      timeSensitive: this.fb.control<string[]>([]),
      noneOfTheAbove: [false],


      // fever high risk
      feverDanger: this.fb.control<string[]>([]),

      // minor list
      minorLowRisk: this.fb.control<string[]>([]),
    });


    // Live auto-triage calculation
    this.triageForm.valueChanges.subscribe((value) => {
      this.updateAutoTriage(value);
    });
  }
  private setupNoneOfAboveBehavior() {
    const noneCtrl = this.triageForm.get('noneOfTheAbove');

    if (!noneCtrl) return;

    // When user checks "none of the above" => clear all NT selections
    noneCtrl.valueChanges.subscribe((v: boolean) => {
      if (v !== true) return;

      const ntControls = [
        'nonTraumaImmediateRed',
        'timeSensitive',
        'highRiskBleeding',
        'feverDanger',
        'minorLowRisk',
      ];

      ntControls.forEach((name) => {
        const c = this.triageForm.get(name);
        if (c) c.setValue([], { emitEvent: false }); // don't trigger multiple recalcs
      });

      // Optional: close the NT sections so it feels reset
      this.ntImmediateOpen = false;
      this.ntTimeOpen = false;
      this.ntBleedingOpen = false;
      this.ntFeverOpen = false;
      this.ntMinorOpen = false;

      // Now recalc auto-triage once
      this.updateAutoTriage(this.triageForm.getRawValue());
    });
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'];
    });

    const id = Number(this.route?.snapshot?.paramMap.get('id'));
    this.patientService?.getPatientById(id).subscribe((data: any) => {
      this.patient = data;

      this.triageForm.patchValue({
        status: data.status || 'ALERT',
        spo2: data.spo2 ?? null,
        pulse: data.pulse ?? '',
        dbp: data.dbp ?? '',
        sbp: data.sbp ?? '',
        rr: data.rr ?? null,
        temp: data.temp ?? null,
        emergencyType: data.emergencyType || 'NON-TRAUMA',
        triage: data.triage || '',
        triageNotes: data.triageNotes || '',
        arrivalMode: data.arrivalMode || '',
        referralStatus: data.referralStatus || '',
        triageTimeStamp: data.triageTimeStamp || new Date().toISOString(),
        submittedBy: data.submittedBy || '',
        designation: data.designation || '',

        // optional
        alertOrResponsive: data.alertOrResponsive ?? true,
        acuteOnset: data.acuteOnset ?? false,
        airwayCompromise: data.airwayCompromise ?? false,
        seizureNow: data.seizureNow ?? false,
        severePainOrDistress: data.severePainOrDistress ?? false,

        ambulatoryInEd: data.ambulatoryInEd ?? false,
        onAnticoagulation: data.onAnticoagulation ?? false,
        ncctHead: data.ncctHead ?? [],

        traumaAnatomy: data.traumaAnatomy ?? [],
        traumaMechanism: data.traumaMechanism ?? [],
        traumaSpecial: data.traumaSpecial ?? [],

        nonTraumaImmediateRed: data.nonTraumaImmediateRed ?? [],
        highRiskBleeding: data.highRiskBleeding ?? [],
        timeSensitive: data.timeSensitive ?? [],
        triageOfficerDeemsRed: data.triageOfficerDeemsRed ?? false,

        feverDanger: data.feverDanger ?? [],
        chemoLast14Days: data.chemoLast14Days ?? false,
        aplasticAnemia: data.aplasticAnemia ?? false,

        minorLowRisk: data.minorLowRisk ?? [],
      });
      this.setupNoneOfAboveBehavior();

      if (data.complaints && data.complaints.length > 0) {
        data.complaints.forEach((c: any) => {
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

      this.updateAutoTriage(this.triageForm.value);
    });
  }

  // ========= UI helpers =========
  get complaints(): FormArray {
    return this.triageForm.get('complaints') as FormArray;
  }

  get isTrauma(): boolean {
    return this.triageForm.get('emergencyType')?.value === 'TRAUMA';
  }

  get isNonTrauma(): boolean {
    return this.triageForm.get('emergencyType')?.value === 'NON-TRAUMA';
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
  isSelected(controlName: string, code: string): boolean {
    const arr = (this.triageForm.get(controlName)?.value ?? []) as string[];
    return arr.includes(code);
  }

  toggleSelection(controlName: string, code: string, checked: boolean) {
    const ctrl = this.triageForm.get(controlName);
    if (!ctrl) return;

    const current: string[] = Array.isArray(ctrl.value) ? [...ctrl.value] : [];

    const next = checked
      ? (current.includes(code) ? current : [...current, code])
      : current.filter((x) => x !== code);

    ctrl.setValue(next);

    // ✅ If user selects any Non-Trauma item, noneOfTheAbove must turn OFF
    const nonTraumaControls = new Set([
      'nonTraumaImmediateRed',
      'timeSensitive',
      'highRiskBleeding',
      'feverDanger',
      'minorLowRisk',
    ]);

    if (nonTraumaControls.has(controlName) && next.length > 0) {
      this.triageForm.get('noneOfTheAbove')?.setValue(false, { emitEvent: false });
    }
  }

  setYesNo(controlName: string, value: boolean) {
    this.triageForm.get(controlName)?.setValue(value);
  }




  // ========= Save / misc =========
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
        () => {
          this.stopVoice();
          this.successMessage = '✅ Patient details saved successfully!';
          this.isSubmitting = false;

          if (this.mode === 'e') {
            setTimeout(() => this.router.navigate(['/ed-desk/patient-details']), 2000);
          } else {
            setTimeout(() => this.router.navigate(['/triage-list']), 2000);
          }
        },
        () => {
          this.successMessage = '❌ Error saving patient data. Please try again.';
          this.isSubmitting = false;
        }
      );
    }
  }

  saveDraft() {
    this.successMessage = '📝 Draft saved successfully!';
  }

  clearForm() {
    this.triageForm.reset();
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
    if ((event.target as HTMLElement).classList.contains('modal')) this.closePdf();
  }

  // ========= AUTO TRIAGE =========
  private updateAutoTriage(formValue: any): void {
    const status = (formValue.status || 'ALERT').toString().toUpperCase();

    const avpu: 'A' | 'V' | 'P' | 'U' | null =
      status === 'ALERT' ? 'A'
        : status === 'VERBAL' ? 'V'
          : status === 'PAIN' ? 'P'
            : status === 'UNRESPONSIVE' ? 'U'
              : null;

    const traumaAnatomy = (formValue.traumaAnatomy ?? []) as string[];
    const traumaMechanism = (formValue.traumaMechanism ?? []) as string[];
    const traumaSpecial = (formValue.traumaSpecial ?? []) as string[];

    const ncctHead = (formValue.ncctHead ?? []) as string[];

    const nonTraumaImmediateRed = (formValue.nonTraumaImmediateRed ?? []) as string[];
    const highRiskBleeding = (formValue.highRiskBleeding ?? []) as string[];
    const timeSensitive = (formValue.timeSensitive ?? []) as string[];

    const feverDanger = (formValue.feverDanger ?? []) as string[];
    const minorLowRisk = (formValue.minorLowRisk ?? []) as string[];

    const input: TriageInput = {
      acuteOnset: !!formValue.acuteOnset,
      severePainOrDistress: !!formValue.severePainOrDistress,

      spo2: this.toNumberOrNull(formValue.spo2),
      respRate: this.toNumberOrNull(formValue.rr),
      sbp: this.toNumberOrNull(formValue.sbp),
      dbp: this.toNumberOrNull(formValue.dbp),
      pulse: this.toNumberOrNull(formValue.pulse),

      avpu,

      airwayCompromise: !!formValue.airwayCompromise,
      seizureNow: !!formValue.seizureNow,

      emergencyType: (formValue.emergencyType || 'NON-TRAUMA').toString().toUpperCase(),

      // =========================
      // TRAUMA
      // =========================
      traumaHighRisk: (traumaAnatomy.length + traumaMechanism.length + traumaSpecial.length) > 0,

      // ✅ tri-state: null until user actually answers
      ambulatoryInEd: this.toBoolOrNull(formValue.ambulatoryInEd),
      onAnticoagulation: this.toBoolOrNull(formValue.onAnticoagulation),

      ncctIndicated: ncctHead.length > 0,

      // =========================
      // NON-TRAUMA
      // =========================
      immediateRed: nonTraumaImmediateRed.length > 0,
      highRiskBleeding: highRiskBleeding.length > 0,
      timeSensitive: timeSensitive.length > 0,
      highRiskFever: feverDanger.length > 0,
      minorLowRisk: minorLowRisk.length > 0,
      noneOfTheAbove: !!formValue.noneOfTheAbove,

      // =========================
      // Selected arrays for reasons (use extracted arrays)
      // =========================
      traumaAnatomySelected: traumaAnatomy,
      traumaMechanismSelected: traumaMechanism,
      traumaSpecialSelected: traumaSpecial,
      ncctHeadSelected: ncctHead,

      nonTraumaImmediateRedSelected: nonTraumaImmediateRed,
      highRiskBleedingSelected: highRiskBleeding,
      timeSensitiveSelected: timeSensitive,
      feverDangerSelected: feverDanger,
      minorLowRiskSelected: minorLowRisk,
    };


    const decision = this.triageEngine.evaluate(input);

    // if(this.triageForm.invalid){
    //   this.autoCategory = null;
    //   this.autoReasons = [];
    //   return;
    // }

    if (!decision) {
      this.autoCategory = null;
      this.autoReasons = [];
      return;
    }

    this.autoCategory = decision.category;
    this.autoReasons = decision.reasons ?? [];
  }


  private avpuFromStatus(status: string): 'A' | 'V' | 'P' | 'U' | null {
    switch (status) {
      case 'ALERT': return 'A';
      case 'VERBAL': return 'V';
      case 'PAIN': return 'P';
      case 'UNRESPONSIVE': return 'U';
      default: return null;
    }
  }

  private toNumberOrNull(value: any): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return isNaN(n) ? null : n;
  }
  private toBoolOrNull(v: any): boolean | null {
    if (v === true) return true;
    if (v === false) return false;
    return null;
  }

  private toBooleanOrNull(value: any): boolean | null {
    if (value === null || value === undefined || value === '') return null;
    return !!value;
  }

  // ========= VOICE =========
  protected toggleVoice(): void {
    if (!this.voice.isSupported) {
      this.voiceHint.set('Voice input is not supported in this browser.');
      return;
    }
    if (this.listening()) this.stopVoice();
    else this.startVoice();
  }

  private startVoice(): void {
    if (this.complaints.length === 0) this.addComplaint();

    const c0 = this.complaints.at(0);
    const control = c0?.get('complaint');
    if (!control) return;

    this.voiceBaseText = (control.value ?? '').toString().trim();

    const started = this.voice.start((text, isFinal) => {
      const spoken = (text ?? '').trim();
      if (!spoken) return;

      if (isFinal) {
        this.voiceBaseText = this.voiceBaseText
          ? `${this.voiceBaseText} ${spoken}`.trim()
          : spoken;

        control.setValue(this.voiceBaseText);
        this.voiceHint.set('Captured. Tap again to stop or continue speaking.');
      } else {
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
