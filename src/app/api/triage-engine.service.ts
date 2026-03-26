import { Injectable } from '@angular/core';

export type TriageCategory = 'RED' | 'YELLOW' | 'GREEN';

export interface TriageInput {
  alertOrResponsive: boolean | null;
  acuteOnset: boolean | null;

  spo2: number | null;
  respRate: number | null;
  sbp: number | null;
  dbp: number | null;
  pulse: number | null;
  gcs: number | null;

  airwayCompromise: boolean | null;
  seizureNow: boolean | null;
}

export interface TriageDecision {
  category: TriageCategory;
  reasons: string[];
}

@Injectable({ providedIn: 'root' })
export class TriageEngineService {
  evaluate(input: TriageInput): TriageDecision | null {
    // ✅ Don’t suggest anything until we have “enough” info.
    // Keep this simple: at least 2 vitals OR any critical flag present.
    const vitalsCount =
      (input.spo2 != null ? 1 : 0) +
      (input.respRate != null ? 1 : 0) +
      (input.sbp != null ? 1 : 0) +
      (input.dbp != null ? 1 : 0) +
      (input.pulse != null ? 1 : 0) +
      (input.gcs != null ? 1 : 0);

    const hasCriticalFlag =
      input.airwayCompromise === true ||
      input.seizureNow === true ||
      input.alertOrResponsive === false;

    if (!hasCriticalFlag && vitalsCount < 2) {
      return null; // ✅ initial empty state
    }

    const reasons: string[] = [];

    if (input.alertOrResponsive === false && input.acuteOnset) {
      reasons.push('Not responsive to verbal commands with acute onset');
      return { category: 'RED', reasons };
    }

    if (this.isRedPhysiology(input, reasons)) {
      return { category: 'RED', reasons };
    }

    // Conservative default once we have some data
    reasons.push('No red physiology criteria detected');
    return { category: 'YELLOW', reasons };
  }

  private isRedPhysiology(i: TriageInput, reasons: string[]): boolean {
    if (i.airwayCompromise) {
      reasons.push('Airway compromise (stridor/drooling/noisy breathing)');
      return true;
    }

    if (i.respRate != null && (i.respRate < 10 || i.respRate > 22)) {
      reasons.push(`Respiratory rate ${i.respRate} outside 10–22`);
      return true;
    }

    if (i.spo2 != null && i.spo2 < 90) {
      reasons.push(`SpO₂ ${i.spo2}% below 90%`);
      return true;
    }

    if (i.pulse != null && (i.pulse < 50 || i.pulse > 120)) {
      reasons.push(`Pulse ${i.pulse} outside 50–120`);
      return true;
    }

    if (i.sbp != null && (i.sbp < 90 || i.sbp > 180)) {
      reasons.push(`Systolic BP ${i.sbp} outside 90–180`);
      return true;
    }

    if (i.dbp != null && (i.dbp < 60 || i.dbp > 110)) {
      reasons.push(`Diastolic BP ${i.dbp} outside 60–110`);
      return true;
    }

    if (i.seizureNow) {
      reasons.push('Active seizure');
      return true;
    }

    if (i.gcs != null && i.gcs < 12) {
      reasons.push(`GCS ${i.gcs} below 12`);
      return true;
    }

    return false;
  }
}
