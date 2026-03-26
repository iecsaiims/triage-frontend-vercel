import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { NurseHandoverNotesService } from '../../../../api/nurse-handover-notes.service';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-nurse-handover-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './nurse-handover-notes.component.html',
  styleUrl: './nurse-handover-notes.component.css'
})
export class NurseHandoverNotesComponent {
  handover = {
    date: '',
    shift: '',
    handoverTo: '',
    vitalDetails: '',
    investigationDetails: '',
    medicationDetails: '',
    pendingInvestigations: '',
    pendingTreatment: '',
    transferNotes: '',
    handoverNotes: ''
  };

  patientId!: number;
  patient: any = null;
  handoverRecords: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private nurseHandoverNotesService: NurseHandoverNotesService
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
    this.loadPatientDetails();
    this.getHandoverNotes(); 
  }

  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Patient fetch error:', err),
    });
  }

saveHandover() {
const payload = { 
  ...this.handover, 
  patientId: this.patientId, 
  date: this.handover.date ? new Date(this.handover.date).toISOString() : null 
};

  console.log("📌 Save Payload:", payload); 

  this.nurseHandoverNotesService.createHandover(payload).subscribe({
    next: (res) => {
      console.log("✅ Save Response:", res);
       res.data.createdAt = this.handover.date;
      alert('✅ Handover notes saved successfully!');
      this.getHandoverNotes(); 
    },
    error: (err) => console.error('❌ Save error:', err),
  });
}

getHandoverNotes() {
  console.log("📌 Fetching handover notes for patientId:", this.patientId);

  this.nurseHandoverNotesService.getHandoverByPatient(this.patientId).subscribe({
    next: (res: any) => {
      console.log("📥 Full API Response:", res);
    
      // 👇 abhi res.data me array hai
      this.handoverRecords = res.data || [];

      console.log("✅ Handover Records Assigned:", this.handoverRecords);
    },
    error: (err) => console.error('❌ Fetch error:', err),
  });
}

dateFilter = (d: Date | null): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !d ? false : d >= today;
};


}
