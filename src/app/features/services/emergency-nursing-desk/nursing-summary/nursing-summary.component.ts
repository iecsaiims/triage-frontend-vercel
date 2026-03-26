import { Component } from '@angular/core';
import { PrimaryAssessmentService } from '../../../../api/primary-assessment.service';
import { ActivatedRoute } from '@angular/router';
import { PatientReportService } from '../../E-D-Desk/e-d-desk-allrecords/summary/patient-report.service';
import { NursingSummaryService } from '../../../../api/nursing-summary.service';

@Component({
  selector: 'app-nursing-summary',
  imports: [],
  templateUrl: './nursing-summary.component.html',
  styleUrl: './nursing-summary.component.css'
})
export class NursingSummaryComponent {

  patientData: any;
  patientId: number = 0;

  constructor(
    private nursingSummaryService: NursingSummaryService,
    private route: ActivatedRoute,
    public patientReportService: PatientReportService 
  ) {}

  ngOnInit() {
    const idFromRoute =
      this.route?.snapshot?.paramMap.get('id') ||
      this.route.parent?.snapshot?.paramMap.get('id');

    if (idFromRoute) {
      this.patientId = +idFromRoute;
      console.log('Patient ID:', this.patientId);

      this.nursingSummaryService.getNursingSummary(this.patientId).subscribe({
        next: (data: any) => {
          this.patientData = data;
          console.log('✅ Patient Data:', this.patientData);
        },
        error: (err) => {
          console.error('❌ Error loading summary', err);
          alert('Failed to load patient data');
        },
      });
    } 
    else {
      console.error('🚫 No patient ID found in route');
    }
  }

  printPatientData() {
      const renameMap = {
        createdAt: 'creationDate',
        name: 'patientName',
        hemoglobin:'Hemoglobin Level',
    };
    this.patientData = this.removeAndRenameFields(this.patientData, renameMap);
    console.log('patient data ',this.patientData)
    const reportContent =
      this.patientReportService.generatePatientReportHtml(this.patientData,"http://localhost:8000/api/files") ??
      '';
    console.log('Generated Report Content:', reportContent);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    } else {
      alert('Popup blocked!');
    }
  }
  

  removeAndRenameFields(data: any, renameMap: any ): any {
    // List of fields to remove
    const fieldsToRemove = ['updatedAt', 'id', 'patientId', 'designation', 'submittedBy', 'patient_id','crNumber'];

    // Handle non-object or null data
    if (typeof data !== 'object' || data === null) {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => this.removeAndRenameFields(item, renameMap));
    }

    // Handle objects
    let newObj: any = {};
    for (const key in data) {
        if (!fieldsToRemove.includes(key)) {
            // Use renamed key if it exists in renameMap, otherwise keep original key
            const newKey = renameMap[key] || key;
            newObj[newKey] = this.removeAndRenameFields(data[key], renameMap);
        }
    }
    return newObj;
}
}
