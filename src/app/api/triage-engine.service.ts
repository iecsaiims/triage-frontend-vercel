import { Injectable } from '@angular/core';
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
  buildOptionLabelMap,
} from '../features/services/entry-desk/triage-entry-desk/triage-options';

const LABELS = buildOptionLabelMap([
  TRAUMA_ANATOMY_OPTIONS,
  TRAUMA_MECHANISM_OPTIONS,
  TRAUMA_SPECIAL_OPTIONS,
  NCCT_HEAD_OPTIONS,
  NONTRAUMA_IMMEDIATE_RED_OPTIONS,
  HIGH_RISK_BLEEDING_OPTIONS,
  TIME_SENSITIVE_OPTIONS,
  FEVER_DANGER_OPTIONS,
  MINOR_LOW_RISK_OPTIONS,
]);


export type TriageCategory = 'RED' | 'YELLOW' | 'GREEN';

export interface TriageInput {
  // Top-of-form triggers
  acuteOnset: boolean;
  severePainOrDistress: boolean;

  // Vitals & consciousness
  spo2: number | null;
  respRate: number | null;
  sbp: number | null;
  dbp: number | null;
  pulse: number | null;

  // AVPU from your UI: ALERT/VERBAL/PAIN/UNRESPONSIVE
  avpu: 'A' | 'V' | 'P' | 'U' | null;

  airwayCompromise: boolean;
  seizureNow: boolean;

  // Branch
  emergencyType: 'TRAUMA' | 'NON-TRAUMA' | string;

  // === NEW: Selected codes for reason listing ===
  traumaAnatomySelected?: string[];
  traumaMechanismSelected?: string[];
  traumaSpecialSelected?: string[];
  ncctHeadSelected?: string[];

  nonTraumaImmediateRedSelected?: string[];
  highRiskBleedingSelected?: string[];
  timeSensitiveSelected?: string[];
  feverDangerSelected?: string[];
  minorLowRiskSelected?: string[];

  // TRAUMA
  traumaHighRisk: boolean;      // any selection in tables 3/4/5
  ambulatoryInEd: boolean | null;
  onAnticoagulation: boolean | null;
  ncctIndicated: boolean;       // any selection in table 6

  // NON-TRAUMA
  immediateRed: boolean;
  highRiskBleeding: boolean;
  timeSensitive: boolean;
  highRiskFever: boolean;       // danger signs OR chemo<14d OR aplastic anemia
  minorLowRisk: boolean;
  noneOfTheAbove: boolean;
}

export interface TriageDecision {
  category: TriageCategory;
  reasons: string[];
}

@Injectable({ providedIn: 'root' })
export class TriageEngineService {
  private toMap(options: { code: string; label: string }[]): Record<string, string> {
    return options.reduce((acc, o) => {
      acc[o.code] = o.label;
      return acc;
    }, {} as Record<string, string>);
  }

  private pushSelectedReasons(
    reasons: string[],
    selectedCodes: string[] | undefined | null,
    labelMap: Record<string, string>,
    prefix?: string
  ) {
    const codes = (selectedCodes ?? []).filter(Boolean);
    for (const code of codes) {
      const label = labelMap[code] ?? code;
      reasons.push(prefix ? `${prefix}: ${label}` : label);
    }
  }
  // ==== Label maps (build from your Option[] lists) ====
  private TRAUMA_ANATOMY_MAP = this.toMap([
    { code: 'CSPINE_SBC_LT15', label: 'C-spine injury with Single Breath Count < 15' },
    { code: 'NECK_SWELL', label: 'Visible neck swelling' },
    { code: 'MAJOR_VASC', label: 'Major vascular injury' },
    { code: 'CHEST_SE', label: 'Chest trauma: surgical emphysema' },
    { code: 'CHEST_CCT_POS', label: 'Chest trauma: CCT positive' },
    { code: 'CHEST_SEATBELT', label: 'Chest trauma: seat belt sign' },
    { code: 'CHEST_FLAIL', label: 'Chest trauma: flail chest' },
    { code: 'PELVIC_FX', label: 'Pelvic fracture (PCT+)' },
    { code: 'NEW_PARALYSIS', label: 'Any new paralysis' },
  ]);

  private TRAUMA_MECHANISM_MAP = this.toMap([
    { code: 'GUNSHOT', label: 'Gunshot wound' },
    { code: 'STAB_TORSO', label: 'Stab injury in torso' },
    { code: 'CRUSH', label: 'Crush injury' },
    { code: 'AMPUT_PROX', label: 'Amputation proximal to wrist or ankle' },
    { code: 'OPEN_FX', label: 'Open fractures excluding hand/feet' },
    { code: 'FALL_GT_3X', label: 'Fall from > 3× patient height' },
    { code: 'FALL_GT_5_STAIRS', label: 'Fall from > 5 stairs' },
    { code: 'RTC_HEADON', label: 'High-speed head-on collision' },
    { code: 'COPASS_DEATH', label: 'Co-passenger death in RTC' },
    { code: 'EJECTION', label: 'Ejection from 4-wheeler' },
    { code: 'RAIL', label: 'Railway track injuries' },
    { code: 'RUN_OVER', label: 'Run over by vehicle' },
  ]);

  private TRAUMA_SPECIAL_MAP = this.toMap([
    { code: 'EYE_CHEM', label: 'Chemical splash in the eye' },
    { code: 'PREG_GT14W', label: 'Pregnancy > 14 weeks' },
    { code: 'AGE_GT65', label: 'Age > 65 years' },
    { code: 'BLEED_DISORDER', label: 'Bleeding disorder' },
    { code: 'BURNS_GT20_OR_FACE', label: 'Burns > 20% BSA or facial burns' },
  ]);

  private NCCT_HEAD_MAP = this.toMap([
    { code: 'VOMIT_GT2', label: 'Vomiting > 2 times' },
    { code: 'SEV_HEADACHE', label: 'Severe headache' },
    { code: 'AGE_GT65', label: 'Age > 65 years' },
    { code: 'FOCAL_DEF', label: 'Focal neurologic deficits' },
    { code: 'GCS_LT13_INIT', label: 'GCS < 13 on initial assessment' },
    { code: 'GCS_LT15_2H', label: 'GCS < 15 after 2 hours' },
    { code: 'BASAL_SKULL', label: 'Features of base of skull fracture' },
    { code: 'DANGEROUS_MECH', label: 'Dangerous mechanism of injury' },
    { code: 'COAG_OR_ANTICOAG', label: 'Coagulopathy / on anticoagulants' },
    { code: 'AMNESIA_GT30', label: 'Amnesia > 30 min' },
    { code: 'LOC_GT5', label: 'LOC > 5 min' },
    { code: 'SEIZURE', label: 'Seizures' },
  ]);

  private NT_IMMEDIATE_RED_MAP = this.toMap([
    { code: 'ELECTROCUTION', label: 'Electrocution' },
    { code: 'DROWNING', label: 'Drowning' },
    { code: 'HANGING', label: 'Hanging' },
    { code: 'OVERDOSE_TOX', label: 'Drug overdose / toxic exposure' },
    { code: 'SNAKE_NEURO', label: 'Snake bite with ptosis/neck flaccid/local swelling/bleeding' },
    { code: 'VISION_LOSS', label: 'Acute onset vision loss' },
    { code: 'SYNCOPE_24H', label: 'Syncope within 24 hours' },
    { code: 'K_DERANGED', label: 'Serum K+ > 6 or < 2.5 mEq/L' },
  ]);

  private NT_BLEEDING_MAP = this.toMap([
    { code: 'UNCONTROLLED_WOUND', label: 'Uncontrolled bleeding wound' },
    { code: 'HEMATEMESIS_12H', label: 'Hematemesis within 12 hours' },
    { code: 'HEMOPTYSIS_LARGE_12H', label: 'Large hemoptysis within 12 hours' },
    { code: 'BRISK_NRV', label: 'Brisk nasal/rectal/vaginal bleed' },
    { code: 'BLEED_ANTICOAG', label: 'Any bleed in anticoagulated patient' },
    { code: 'PV_PREG', label: 'PV bleed in pregnant patient' },
    { code: 'WET_PURPURA', label: 'Wet purpura' },
  ]);

  private NT_TIME_SENSITIVE_MAP = this.toMap([
    { code: 'STEMI_STROKE', label: 'Diagnosed/suspected STEMI or stroke' },
    { code: 'CHEST_LIKELY_CARDIAC', label: 'Acute chest discomfort likely cardiac' },
    { code: 'OBJ_WEAKNESS', label: 'Objective acute weakness' },
    { code: 'SLURRED_SPEECH', label: 'Difficulty talking / slurred speech' },
    { code: 'ANAPHYLAXIS', label: 'Suspected anaphylaxis' },
    { code: 'SCROTAL_PAIN', label: 'Acute scrotal pain in young male' },
    { code: 'URINE_RETENTION', label: 'Acute retention of urine' },
  ]);

  private NT_FEVER_DANGER_MAP = this.toMap([
    { code: 'BLEED_PETECH', label: 'Bleeding from any site / petechiae' },
    { code: 'JAUNDICE', label: 'Jaundice / icterus' },
    { code: 'VOMITING_REC', label: 'Recurrent vomiting' },
    { code: 'ABD_PAIN_SEV', label: 'Severe abdominal pain' },
    { code: 'AMS_CONF_SEIZ', label: 'Altered sensorium / confusion / seizure' },
    { code: 'IMMUNOCOMP', label: 'Immunocompromised state' },
    { code: 'SURGERY_7D', label: 'Major surgery within 7 days' },
    { code: 'CHEMO_LT14D', label: 'Received chemotherapy in < 14 days' },
    { code: 'APLASTIC_ANEMIA', label: 'Aplastic anemia' },
  ]);

  private NT_MINOR_LOW_RISK_MAP = this.toMap([
    { code: 'MINOR_EXISTING', label: 'Minor symptoms of existing illness' },
    { code: 'FEVER_NO_WARN', label: 'Fever without warning symptoms' },
    { code: 'MLE_ONLY', label: 'Medicolegal examination only' },
    { code: 'MINOR_COUGH_COLD', label: 'Minor/low-risk conditions (cough, cold, etc.)' },
  ]);


  evaluate(i: TriageInput): TriageDecision | null {
    const reasons: string[] = [];

    // =========================================================
    // 0) Gate: don't show anything until there's a real signal
    // =========================================================
    const vitalsCount =
      (i.spo2 != null ? 1 : 0) +
      (i.respRate != null ? 1 : 0) +
      (i.sbp != null ? 1 : 0) +
      (i.dbp != null ? 1 : 0) +
      (i.pulse != null ? 1 : 0);

    const hasTable1Critical =
      i.airwayCompromise === true ||
      i.seizureNow === true ||
      (i.avpu != null && i.avpu !== 'A') ||
      this.isRedPhysiology_Table1(i, []);

    const hasTraumaSignals =
      (i.emergencyType || '').toUpperCase() === 'TRAUMA' &&
      (i.traumaHighRisk ||
        i.ncctIndicated ||
        i.onAnticoagulation === true ||
        i.ambulatoryInEd === true);

    const hasNonTraumaSignals =
      (i.emergencyType || '').toUpperCase() !== 'TRAUMA' &&
      (i.immediateRed ||
        i.highRiskBleeding ||
        i.timeSensitive ||
        i.highRiskFever ||
        i.minorLowRisk ||
        i.noneOfTheAbove);

    const hasTopTriggers = i.acuteOnset === true || i.severePainOrDistress === true;

    if (!hasTopTriggers && !hasTable1Critical && vitalsCount < 2 && !hasTraumaSignals && !hasNonTraumaSignals) {
      return null;
    }

    // =========================================================
    // 1) Collect ALL RED reasons (do NOT early-return)
    // =========================================================
    let hasRed = false;

    // Top triggers => RED
    if (i.acuteOnset) {
      reasons.push('Acute onset selected');
      hasRed = true;
    }
    if (i.severePainOrDistress) {
      reasons.push('Severe pain / distress (NRS > 7) selected');
      hasRed = true;
    }

    // Table 1 red physiology => RED (also pushes reasons)
    if (this.isRedPhysiology_Table1(i, reasons)) {
      hasRed = true;
    }

    // Branch-specific RED
    const type = (i.emergencyType || '').toUpperCase();

    if (type === 'TRAUMA') {
      // --- RED from Trauma high-risk lists (Tables 3/4/5) ---
      if (i.traumaHighRisk) {
        hasRed = true;

        this.pushSelectedReasons(
          reasons,
          i.traumaAnatomySelected,
          this.TRAUMA_ANATOMY_MAP,
          'High-risk anatomy'
        );

        this.pushSelectedReasons(
          reasons,
          i.traumaMechanismSelected,
          this.TRAUMA_MECHANISM_MAP,
          'High-risk mechanism'
        );

        this.pushSelectedReasons(
          reasons,
          i.traumaSpecialSelected,
          this.TRAUMA_SPECIAL_MAP,
          'Special situations'
        );
      }

      // --- Always show low-risk gate signals in reasons (even if already RED) ---
      // Ambulatory: only show message when NO
      if (i.ambulatoryInEd === false) {
        reasons.push('Not ambulatory in ED');
      }

      // Anticoagulation: show only when YES
      if (i.onAnticoagulation === true) {
        reasons.push('On anticoagulation');
      }

      // NCCT: list selected indications (if any)
      if (i.ncctIndicated) {
        this.pushSelectedReasons(
          reasons,
          i.ncctHeadSelected,
          this.NCCT_HEAD_MAP,
          'NCCT head indication'
        );
      }
    } else {
      // Non-trauma RED groups
      if (i.immediateRed) {
        hasRed = true;
        this.pushSelectedReasons(
          reasons,
          i.nonTraumaImmediateRedSelected,
          this.NT_IMMEDIATE_RED_MAP,
          'Immediate RED'
        );
      }

      if (i.highRiskBleeding) {
        hasRed = true;
        this.pushSelectedReasons(
          reasons,
          i.highRiskBleedingSelected,
          this.NT_BLEEDING_MAP,
          'High-risk bleeding'
        );
      }

      if (i.timeSensitive) {
        hasRed = true;
        this.pushSelectedReasons(
          reasons,
          i.timeSensitiveSelected,
          this.NT_TIME_SENSITIVE_MAP,
          'Time-sensitive (<24h)'
        );
      }

      if (i.highRiskFever) {
        hasRed = true;
        this.pushSelectedReasons(
          reasons,
          i.feverDangerSelected,
          this.NT_FEVER_DANGER_MAP,
          'High-risk fever'
        );
      }
    }

    // ✅ RED wins, but reasons include everything collected so far
    if (hasRed) {
      // optional: de-dup reasons
      const uniq = Array.from(new Set(reasons));
      return { category: 'RED', reasons: uniq };
    }

    // =========================================================
    // 2) No RED found -> proceed to branch decision (YELLOW/GREEN/none)
    // =========================================================
    if (type === 'TRAUMA') {
      return this.evaluateTrauma(i, reasons);
    }

    return this.evaluateNonTrauma(i, reasons);
  }



  private isRedPhysiology_Table1(i: TriageInput, reasons: string[]): boolean {
    let isRed = false;

    // A: Airway
    if (i.airwayCompromise) {
      reasons.push('Airway compromise (stridor/drooling/noisy breathing/angioedema)');
      isRed = true;
    }

    // B: Breathing
    if (i.respRate != null && (i.respRate < 10 || i.respRate > 22)) {
      reasons.push(`RR ${i.respRate} outside 10–22/min`);
      isRed = true;
    }
    if (i.spo2 != null && i.spo2 < 90) {
      reasons.push(`SpO₂ ${i.spo2}% < 90%`);
      isRed = true;
    }

    // C: Circulation
    if (i.pulse != null && (i.pulse < 50 || i.pulse > 120)) {
      reasons.push(`Pulse ${i.pulse} outside 50–120/min`);
      isRed = true;
    }
    if (i.sbp != null && (i.sbp < 90 || i.sbp > 180)) {
      reasons.push(`SBP ${i.sbp} outside 90–180`);
      isRed = true;
    }
    if (i.dbp != null && (i.dbp < 60 || i.dbp > 110)) {
      reasons.push(`DBP ${i.dbp} outside 60–110`);
      isRed = true;
    }

    // D: Disability
    if (i.avpu != null && i.avpu !== 'A') {
      reasons.push(`Altered sensorium (AVPU = ${i.avpu}, less than Alert)`);
      isRed = true;
    }
    if (i.seizureNow) {
      reasons.push('Active seizures');
      isRed = true;
    }

    return isRed;
  }


  // ===== Trauma lane (Tables 3–6) =====
  private evaluateTrauma(i: TriageInput, reasons: string[]): TriageDecision | null {
    // Your rule: any selection in Table 3/4/5 => RED
    if (i.traumaHighRisk) {
      reasons.push('Trauma: High-risk selection present');
      return { category: 'RED', reasons };
    }

    // If user hasn't interacted with trauma gate yet, don't show anything
    const hasGateSignals = i.ambulatoryInEd || i.onAnticoagulation || i.ncctIndicated;
    if (!hasGateSignals) return null;

    // Gate:
    // GREEN only if ambulatory YES, anticoag NO, NCCT indicated NO
    const pass =
      i.ambulatoryInEd === true &&
      i.onAnticoagulation === false &&
      i.ncctIndicated === false;

    if (pass) {
      reasons.push('Trauma: Low-risk gate satisfied (ambulatory + not anticoagulated + no NCCT indication)');
      return { category: 'GREEN', reasons };
    }

    if (!i.ambulatoryInEd) reasons.push('Trauma: Not ambulatory in ED');
    if (i.onAnticoagulation) reasons.push('Trauma: On anticoagulation');
    if (i.ncctIndicated) reasons.push('Trauma: NCCT head indication present');

    return { category: 'YELLOW', reasons };
  }

  // ===== Non-trauma lane =====
  private evaluateNonTrauma(i: TriageInput, reasons: string[]): TriageDecision | null {

    // 1. RED — absolute priority
    if (i.immediateRed) {
      reasons.push('Immediate RED condition selected');
      return { category: 'RED', reasons };
    }

    if (i.highRiskBleeding) {
      reasons.push('High-risk bleeding selected');
      return { category: 'RED', reasons };
    }

    if (i.timeSensitive) {
      reasons.push('Time-sensitive condition (<24h)');
      return { category: 'RED', reasons };
    }

    if (i.highRiskFever) {
      reasons.push('High-risk fever criteria selected');
      return { category: 'RED', reasons };
    }

    // 2. GREEN — minor / low-risk
    if (i.minorLowRisk) {
      reasons.push('Minor / low-risk condition selected');
      return { category: 'GREEN', reasons };
    }

    // 3. YELLOW — explicit confirmation
    if (i.noneOfTheAbove) {
      reasons.push('Does not meet RED or GREEN criteria');
      return { category: 'YELLOW', reasons };
    }

    // 4. Otherwise → no suggestion
    return null;
  }
}
