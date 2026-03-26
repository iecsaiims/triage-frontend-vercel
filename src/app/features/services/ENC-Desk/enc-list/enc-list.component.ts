import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EdConsultationService } from '../../../../api/ed-consultation.service';
import { PatientService } from '../../../../api/patient.service';
import { EncService } from '../../../../api/enc.service';

@Component({
  selector: 'app-enc-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './enc-list.component.html',
  styleUrl: './enc-list.component.css'
})
export class EncListComponent {

  patients: any[] = [];
  consultations: any[] = [];
  encStatus: any = {};  
  patientId!: number;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private consultationService: EdConsultationService,
    public patientService: PatientService,
    private encService: EncService,
  ) {}

  ngOnInit() {
    const id =
      Number(this.route?.snapshot?.paramMap?.get('id')) ||
      Number(this.route?.parent?.snapshot?.paramMap.get('id'));

    this.patientId = id;

    this.loadData();
    this.loadEncStatus(this.patientId);
    this.loadEncConsultations(this.patientId);
  }

loadData() {
  this.patientService.getPatientsWithTriage().subscribe((patientRes: any) => {
    this.patients = (patientRes.data || []).filter((p:any) => 
      p.patientTriage?.some((t:any) => ['RED','YELLOW','GREEN','BLACK'].includes(t.triage))
    );

    console.log('Filtered Patients:', this.patients);

    this.patients.forEach(p => {
      this.loadEncStatus(p.id);
      this.loadEncConsultations(p.id);
    });
  });
}

  getLatestTriage(triageList: any[]): string {
    if (!triageList || triageList.length === 0) return "Pending";

    const sorted = [...triageList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sorted[0].triage;
  }

  // Triage Colors
  getTriageColorClass(triage: string): string {
    switch (triage.toLowerCase()) {
      case "red": return "triage-red";
      case "yellow": return "triage-yellow";
      case "green": return "triage-green";
      default: return "triage-pending blinking";
    }
  }

  // Consultation Status
  getConsultationStatus(patientId: number): string {
    return this.encStatus[patientId]?.consultation ? "Completed" : "Pending";
  }

  getConsultationColorClass(status: string) {
    return status === "Completed"
      ? "triage-green"
      : "triage-pending blinking";
  }

  // Disposition Status
  getDispositionStatus(patientId: number): string {
    return this.encStatus[patientId]?.disposition ? "Completed" : "Pending";
  }

  getDispositionColorClass(status: string) {
    return status === "Completed"
      ? "triage-green"
      : "triage-pending blinking";
  }

viewPatientDetails(item: any) {
  const id = item.id || item.patientId;
  if (id) this.router.navigate(['/enc-desk', id]);
}


loadEncConsultations(patientId: number) {
  console.log('load Enc Consultations API', patientId);
  if (!patientId || patientId === 0) return;

  this.encService.getConsultations(patientId).subscribe({
    next: (res: any) => {
      console.log('Enc Consultations API:', res);
      const calls = res?.data || [];
      const latestCall = calls.length > 0 ? calls[calls.length - 1] : null;
      this.encStatus[patientId] = {
        ...this.encStatus[patientId],
        consultation: latestCall?.completed === "Yes"
      };

      console.log('Updated encStatus:', this.encStatus);
    },
    error: () => {}
  });
}

loadEncStatus(patientId: number) {
  console.log('load Enc Status API', patientId);
  if (!patientId || patientId === 0) {
    this.encStatus[patientId] = {
      consultation: false,
      disposition: false
    };
    return;
  }

  this.encService.getEncRecord(patientId).subscribe({
    next: (res: any) => {
      const data = res?.data || {};
      console.log('ENC Status API:', patientId, data);

      this.encStatus[patientId] = {
        consultation: data.completed === "Yes",
        disposition: !!data.disposition_status
      };
    },
    error: () => {
      this.encStatus[patientId] = {
        consultation: false,
        disposition: false
      };
    }
  });
}


// loadData() {
// this.patientService.getPatientsWithTriage().subscribe((patientRes: any) => {

// this.patients = patientRes.data || [];
// console.log('All Patients with Triage:', this.patients);

// this.patients.forEach(p => {
//   this.loadEncStatus(p.id);  
//   this.loadEncConsultations(p.id); 
// });

// this.consultationService.getAllConsultations().subscribe((consultRes: any) => {
//   const apiConsults = consultRes.data || [];

//   this.consultations = apiConsults.map((c: any) => {
//     const p = this.patients.find(x => x.id === c.patientId);

//     return {
//       ...c,
//       patientName: p?.name || "N/A",
//       patientTriage: p?.patientTriage || [],
//       createdAt: c.createdAt || p?.createdAt
//     };
//   });
// });

// });
// }
}
