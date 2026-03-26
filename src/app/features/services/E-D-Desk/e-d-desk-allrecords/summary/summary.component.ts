import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryAssessmentService } from '../../../../../api/primary-assessment.service';
import { PatientReportService } from './patient-report.service';

@Component({
  selector: 'app-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent implements OnInit {
  patientData: any;
  patientId: number = 0;
  showPreview: boolean = false;
  reportContent: string = '';

  constructor(
    private primaryAssessmentService: PrimaryAssessmentService,
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
      this.loadPatientData();
    } else {
      console.error('No patient ID found in route');
      alert('No patient ID found in URL');
    }
  }

  loadPatientData() {
    this.primaryAssessmentService.getSummary(this.patientId).subscribe({
      next: (data: any) => {
        this.patientData = data;
        console.log('Patient Data:', this.patientData);
        this.processPatientData();
      },
      error: (err) => {
        console.error('Error loading summary', err);
        alert('Failed to load patient data. Please try again.');
      },
    });
  }

  processPatientData() {
    const renameMap = {
      createdAt: 'creationDate',
      name: 'patientName',
      hemoglobin: 'Hemoglobin Level',
    };
   
    this.patientData = this.removeAndRenameFields(this.patientData, renameMap);
  }

  generatePreview() {
    if (!this.patientData) {
      alert('No patient data available. Please try reloading.');
      return;
    }

    this.reportContent = this.patientReportService.generatePatientReportHtml(
      this.patientData,
      "https://triage-backend-vercel.vercel.app/api/files"
    );
    this.showPreview = true;
   
    setTimeout(() => {
      this.setupEventListeners();
    }, 100);
  }

  setupEventListeners() {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      const script = iframe.contentDocument.createElement('script');
      script.textContent = `
        function toggleSection(sectionKey) {
          const checkbox = document.getElementById('checkbox-' + sectionKey);
          const content = document.getElementById('content-' + sectionKey);
          const section = document.getElementById('section-' + sectionKey);
         
          if (checkbox && content && section) {
            if (checkbox.checked) {
              content.classList.remove('strikethrough');
              section.classList.remove('unchecked');
            } else {
              content.classList.add('strikethrough');
              section.classList.add('unchecked');
            }
          }
        }
      `;
      iframe.contentDocument.head.appendChild(script);
    }
  }

printReport() {
    if (!this.reportContent) {
      this.generatePreview();
    }
    
    // Get screen dimensions
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = 800;
    const windowHeight = 600;
    
    // Calculate position to center the window
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;
    
    const printWindow = window.open('', '_blank', `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`);
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(this.reportContent);
      printWindow.document.close();
    } else {
      alert('Print window was blocked by browser. Please allow popups and try again.');
    }
}

  removeAndRenameFields(data: any, renameMap: any): any {
    const fieldsToRemove = ['updatedAt', 'id', 'patientId', 'designation', 'submittedBy', 'patient_id', 'crNumber'];
   
    if (typeof data !== 'object' || data === null) {
      return data;
    }
   
    if (Array.isArray(data)) {
      return data.map(item => this.removeAndRenameFields(item, renameMap));
    }
   
    let newObj: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key) && !fieldsToRemove.includes(key)) {
        const newKey = renameMap[key] || key;
        newObj[newKey] = this.removeAndRenameFields(data[key], renameMap);
      }
    }
    return newObj;
  }
}
