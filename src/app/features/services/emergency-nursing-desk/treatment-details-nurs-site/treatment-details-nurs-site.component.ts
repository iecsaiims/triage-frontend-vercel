import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TreatmentService } from '../../../../api/treatment.service';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../../api/patient.service';
import { AuthService } from '../../../../api/auth.service';
import { MaterialModule } from '../../../../shared/material/material.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-treatment-details-nurs-site',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MaterialModule,
  ],
  templateUrl: './treatment-details-nurs-site.component.html',
  styleUrl: './treatment-details-nurs-site.component.css',
})
export class TreatmentDetailsNursSiteComponent {
  patientId!: number;
  patient: any = null;
  treatments: any[] = [];

  constructor(
    private treatmentService: TreatmentService,
    private route: ActivatedRoute,
    public patientService: PatientService,
    private authService: AuthService
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

    console.log('✅ Patient ID from route:', this.patientId);
    this.loadPatientDetails();
    this.loadAllTreatments(this.patientId);
  }

  loadPatientDetails() {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (data: any) => (this.patient = data),
      error: (err: any) => console.error('Patient fetch error:', err),
    });
  }

  // loadAllTreatments(patientId: number) {
  //   const user = this.authService.getCurrentUserFromToken();

  //   forkJoin({
  //     doctor: this.treatmentService.getTreatment(patientId),
  //     nursing: this.treatmentService.getTreatmentNursing(patientId),
  //   }).subscribe({
  //     next: (res: any) => {
  //       const doctorRecords = res?.doctor?.data
  //         ? (Array.isArray(res.doctor.data) ? res.doctor.data : [res.doctor.data])
  //         : [];

  //       const nursingRecords = res?.nursing?.data
  //         ? (Array.isArray(res.nursing.data) ? res.nursing.data : [res.nursing.data])
  //         : [];

  //       const groupedNursing: Record<number, any[]> = {};
  //       nursingRecords.forEach((r: any) => {
  //         if (!groupedNursing[r.treatmentId]) {
  //           groupedNursing[r.treatmentId] = [];
  //         }
  //         groupedNursing[r.treatmentId].push({
  //           nextDose: r.nextDose,
  //           dosageTime: r.dosageTime,
  //           createdAt: r.createdAt,
  //           submitted_by: r.submittedBy || r.submitted_by || user?.user || 'Unknown',
  //           designation: r.designation || user?.designation || 'N/A',
  //         });
  //       });

  //       this.treatments = doctorRecords.map((doc: any) => ({

  //         ...doc,
  //         type: 'Doctor',
  //         submitted_by: doc.submittedBy || doc.submitted_by || user?.user || 'Unknown',
  //         designation: doc.designation || user?.designation || 'N/A',
  //         showDetails: false,
  //         history: groupedNursing[doc.id] || [],
  //       }));

  //       console.log('✅ Final Grouped Treatments with Dose Info:', this.treatments);
  //     },
  //     error: (err: any) => console.error('❌ Error loading treatments', err),
  //   });
  // }

  loadAllTreatments(patientId: number) {
    const user = this.authService.getCurrentUserFromToken();

    forkJoin({
      doctor: this.treatmentService.getTreatment(patientId), // doctor prescribed treatments
      nursing: this.treatmentService.getTreatmentNursing(patientId), // nursing administrations
    }).subscribe({
      next: (res: any) => {
        // ✅ Doctor treatments
        const doctorRecords = res?.doctor?.data
          ? Array.isArray(res.doctor.data)
            ? res.doctor.data
            : [res.doctor.data]
          : [];

        // ✅ Nursing administrations
        const nursingRecords = res?.nursing?.data
          ? Array.isArray(res.nursing.data)
            ? res.nursing.data
            : [res.nursing.data]
          : [];

        // 🔹 Group nursing records by treatmentId
        const groupedNursing: Record<number, any[]> = {};
        nursingRecords.forEach((r: any) => {
          if (!groupedNursing[r.treatmentId]) {
            groupedNursing[r.treatmentId] = [];
          }

          // ✅ Formula: dosageTime + nextDose interval
          let nextDoseTime: Date | null = null;
          let drugTime = false;
          let isChecked = false;
          if (r.dosageTime && r.nextDose) {
            const [h, m, s] = r.dosageTime.split(':').map(Number);
            const givenTime = new Date();
            givenTime.setHours(h, m, s || 0);

            const intervalHours = parseInt(
              r.nextDose.replace(/[^0-9]/g, ''),
              10
            );
            nextDoseTime = new Date(
              givenTime.getTime() + intervalHours * 60 * 60 * 1000
            );

            // check if < 30 min left
            const now = new Date();
            const diffMinutes =
              (nextDoseTime.getTime() - now.getTime()) / (1000 * 60);
            drugTime = diffMinutes <= 30 && diffMinutes > 0;
          }

          groupedNursing[r.treatmentId].push({
            nextDose: r.nextDose,
            dosageTime: r.dosageTime,
            createdAt: r.createdAt,
            submitted_by:
              r.submittedBy || r.submitted_by || user?.user || 'Unknown',
            designation: r.designation || user?.designation || 'N/A',
            nextDoseTime, // ✅ calculated field
            drugTime, // ✅ blinking flag
          });
        });

        // 🔹 Merge doctor treatments with their nursing history
        this.treatments = doctorRecords.map((doc: any) => {
          const history = groupedNursing[doc.id] || [];

          // ✅ Check if First Dose already given
          const firstDoseGiven = history.some(
            (h: any) => h.nextDose === 'First Dose'
          );

          return {
            ...doc,
            type: 'Doctor',
            submitted_by:
              doc.submittedBy || doc.submitted_by || user?.user || 'Unknown',
            designation: doc.designation || user?.designation || 'N/A',
            showDetails: false,
            history,
            firstDoseGiven, // ✅ Added flag
          };
        });

        console.log(
          '✅ Final Grouped Treatments with Dose Info:',
          this.treatments
        );
      },
      error: (err: any) => console.error('❌ Error loading treatments', err),
    });
  }

  saveTreatmentStatus(treatment: any) {
    console.log('Treatment to save:', treatment);
    console.log('All Treatments:', this.treatments);

    const payload = {
      patientId: this.patientId,
      submittedBy: treatment.submitted_by || '',
      designation: treatment.designation || '',
      dosageTime: treatment.dosageTime ? treatment.dosageTime + ':00' : null,
      nextDose: treatment.nextDose || 'N/A',
      treatmentId: treatment.id,
    };

    console.log('Payload to save:', payload);

    this.treatmentService.saveTreatmentNursing(payload).subscribe({
      next: (res: any) => {
        console.log('Server response after save:', res);
        alert('Treatment status saved successfully!');

        if (res?.data) {
          this.loadAllTreatments(this.patientId);
        }

        treatment.dosageTime = '';
        treatment.nextDose = '';
        treatment.isChecked = false;
      },
      error: (err) => console.error('Error saving treatment', err),
    });
  }
  toggleCompletion(h: any) {
    if (h.isChecked) {
      h.drugTime = false;
    } else {
      const now = new Date();
      if (h.nextDoseTime) {
        const diffMinutes =
          (h.nextDoseTime.getTime() - now.getTime()) / (1000 * 60);
        h.drugTime = diffMinutes <= 30;
      }
    }
  }
}
