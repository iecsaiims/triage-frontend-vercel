import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientReportService {
  generatePatientReportHtml(data: any, baseUrl: string) {
    console.log('Data to generate report:', data);
    const patientName = data?.patientDetails?.patientName || 'Unknown';
    const imageFields = [
      'xrayImage', 'ecgImage', 'bloodGasImage', 
      'lamaConsentDocument', 'admistions', 
      'consultationImage', 'wardConsentDocument'
    ];

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patient Report - ${patientName}</title>        
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; background: white; }
          h1, h2 { color: #2c3e50; margin: 0; }
          h1 { text-align: center; border-bottom: 2px solid #2c3e50; padding: 8px 0; }
          table { width: 100%; border-collapse: collapse; page-break-inside: avoid; page-break-before: auto; }
          th, td { border: 1px solid #ddd; padding: 6px; text-align: left; word-wrap: break-word; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .section { position: relative; border: 2px solid #e0e0e0; border-radius: 8px; padding: 10px; background: #fafafa; page-break-inside: avoid; page-break-before: auto; }
          .section img { width: 100%; max-width: 100%; height: auto; display: block; page-break-inside: avoid; page-break-before: auto; }
          .section-header { display: flex; justify-content: space-between; align-items: center; padding-right: 8px; }
          .section-checkbox { display: flex; align-items: center; background: white; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; font-weight: 500; }
          .section-checkbox input[type="checkbox"] { margin-right: 6px; width: 16px; height: 16px; cursor: pointer; }
          .section-checkbox label { cursor: pointer; user-select: none; }
          .section-content.strikethrough { position: relative; opacity: 0.4; }
          .section-content.strikethrough::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255, 0, 0, 0.3) 5px, rgba(255, 0, 0, 0.3) 10px);
            pointer-events: none; z-index: 1;
          }
          .section-content.strikethrough * { text-decoration: line-through; }
          .section-content.strikethrough img { filter: grayscale(100%) blur(1px); }
          .control-buttons { text-align: center; padding: 8px; background: #f8f9fa; border-radius: 8px; page-break-before: auto; }
          .control-buttons button { margin: 0 5px; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; }
          .btn-select-all { background: #28a745; color: white; }
          .btn-deselect-all { background: #dc3545; color: white; }
          .btn-print { background: #007bff; color: white; }
          .btn-select-all:hover { background: #218838; }
          .btn-deselect-all:hover { background: #c82333; }
          .btn-print:hover { background: #0056b3; }
          @media print {
            @page { margin: 0; }
            body { margin: 0 !important; padding: 10mm !important; font-size: 11pt !important; background: white !important; }
            .no-print, .section-checkbox, .control-buttons { display: none !important; }
            .section.unchecked { display: none !important; }
            .section { border: 1px solid #ccc !important; background: white !important; padding: 8px !important; page-break-inside: avoid; page-break-before: auto !important; }
            .section-header { padding: 0 8px 0 0 !important; }
            h1 { font-size: 18pt !important; padding: 0 !important; page-break-before: auto !important; }
            h2 { font-size: 14pt !important; page-break-before: auto !important; }
            table { font-size: 10pt !important; page-break-inside: avoid; page-break-before: auto !important; }
            th, td { padding: 4px !important; }
            img { width: 100% !important; max-width: 100% !important; height: auto !important; display: block !important; page-break-inside: avoid; page-break-before: auto !important; }
            .footer { padding-top: 8px !important; page-break-before: auto !important; }
          }
        </style>
      </head>
      <body>
        <div class="control-buttons no-print">
          <button class="btn-select-all" onclick="selectAllSections()">Select All Sections</button>
          <button class="btn-deselect-all" onclick="deselectAllSections()">Deselect All Sections</button>
          <button class="btn-print" onclick="window.print()">Print Document</button>
        </div>
        <h1>Patient Report</h1>
    `;

    const formatKey = (key: string): string =>
      key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const renderObject = (obj: any, title: string, sectionKey: string): string => {
      if (!obj || typeof obj !== 'object') return '';
      let sectionHtml = `<div class="section" data-section="${sectionKey}" id="section-${sectionKey}">
        <div class="section-header">
          <h2>${title}</h2>
          <div class="section-checkbox no-print">
            <input type="checkbox" id="checkbox-${sectionKey}" checked onchange="toggleSection('${sectionKey}')">
            <label for="checkbox-${sectionKey}">Include in Print</label>
          </div>
        </div>
        <div class="section-content" id="content-${sectionKey}">
          <table><tr><th>Field</th><th>Value</th></tr>`;
     
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && !Array.isArray(value) && typeof value !== 'object') {
          if (imageFields.includes(key)) {
            const largeImages = ['xrayImage', 'ecgImage'];
            const imageStyle = largeImages.includes(key)
              ? 'width: 100%; height: auto; display: block;'
              : 'max-width: 300px; height: 200px; display: block; margin: 10px auto;'; // small images

            sectionHtml += `</table><img src="${baseUrl}/${value}" alt="${formatKey(key)}" style="${imageStyle}">
            <table><tr><th>Field</th><th>Value</th></tr>`;
          } else {
            sectionHtml += `<tr><td>${formatKey(key)}</td><td>${value}</td></tr>`;
          }
        }
      }
      sectionHtml += '</table></div></div>';
      return sectionHtml;
    };

    const renderArray = (arr: any[], title: string, sectionKey: string): string => {
      if (!arr || arr.length === 0) return '';
      let sectionHtml = `<div class="section" data-section="${sectionKey}" id="section-${sectionKey}">
        <div class="section-header">
          <h2>${title}</h2>
          <div class="section-checkbox no-print">
            <input type="checkbox" id="checkbox-${sectionKey}" checked onchange="toggleSection('${sectionKey}')">
            <label for="checkbox-${sectionKey}">Include in Print</label>
          </div>
        </div>
        <div class="section-content" id="content-${sectionKey}">`;
     
      arr.forEach((item, index) => {
        sectionHtml += `<table><tr><th>Field</th><th>Value</th></tr>`;
        const headers = Object.keys(item).filter(
          key => !Array.isArray(item[key]) && typeof item[key] !== 'object'
        );
        headers.forEach(header => {
          const value = item[header] ?? '-';
          if (imageFields.includes(header) && value) {
            const largeImages = ['xrayImage', 'ecgImage'];
            const imageStyle = largeImages.includes(header)
              ? 'width: 100%; height: auto; display: block;'
              : 'max-width: 300px; height: auto; display: block; margin: 10px auto;';
              
            sectionHtml += `</table><img src="${baseUrl}/${value}" alt="${formatKey(header)}" style="${imageStyle}">
            <table><tr><th>Field</th><th>Value</th></tr>`;
          } else {
            sectionHtml += `<tr><td>${formatKey(header)}</td><td>${value}</td></tr>`;
          }
        });
        sectionHtml += `</table>`;
        if (index < arr.length - 1) sectionHtml += `<hr style="border: 1px solid #ddd;">`;
      });
      sectionHtml += '</div></div>';
      return sectionHtml;
    };

    const renderImageSection = (imagePath: string, title: string, sectionKey: string): string => {
      const largeImages = ['xrayImage', 'ecgImage'];
      const imageStyle = largeImages.includes(sectionKey)
        ? 'width: 100%; height: auto; display: block;'
        : 'max-width: 300px; height: auto; display: block; margin: 10px auto;';
      return `<div class="section" data-section="${sectionKey}" id="section-${sectionKey}">
        <div class="section-header">
          <h2>${title}</h2>
          <div class="section-checkbox no-print">
            <input type="checkbox" id="checkbox-${sectionKey}" checked onchange="toggleSection('${sectionKey}')">
            <label for="checkbox-${sectionKey}">Include in Print</label>
          </div>
        </div>
        <div class="section-content" id="content-${sectionKey}">
          <img src="${baseUrl}/${imagePath}" alt="${title}" style="${imageStyle}">
        </div>
      </div>`;
    };

    // Render sections
    if (data?.patientDetails) html += renderObject(data.patientDetails, 'Patient Details', 'patientDetails');
    if (data?.triageDetails) html += renderArray(data.triageDetails, 'Triage Details', 'triageDetails');
    if (data?.primaryAssesment) html += renderObject(data.primaryAssesment, 'Primary Assessment', 'primaryAssessment');
    if (data?.generalEmergencyCare) html += renderObject(data.generalEmergencyCare[0], 'General Emergency Care', 'generalEmergencyCare');
    if (data?.traumaTemplateImage) html += renderImageSection(data.traumaTemplateImage, 'Trauma Template', 'traumaTemplate');
    else if (data?.traumaTemplates?.[0]?.image) html += renderImageSection(data.traumaTemplates[0].image, 'Trauma Template', 'traumaTemplate');
    else if (data?.traumaTemplates?.[0]) html += renderObject(data.traumaTemplates[0], 'Trauma Templates', 'traumaTemplate');
    if (data?.progressNotes) html += renderArray(data.progressNotes, 'Progress Notes', 'progressNotes');
    if (data?.otherTests) html += renderArray(data.otherTests, 'Other Tests', 'otherTests');
    if (data?.xray?.length) html += renderArray(data.xray, 'X-Ray', 'xray');
    if (data?.ecg?.length) html += renderArray(data.ecg, 'ECG', 'ecg');
    if (data?.bloodGas?.length) html += renderArray(data.bloodGas, 'Blood Gas', 'bloodGas');
    if (data?.cbc) html += renderArray(data.cbc, 'CBC Test', 'cbc');
    if (data?.pocus) html += renderArray(data.pocus, 'POCUS', 'pocus');
    if (data?.troponin) html += renderArray(data.troponin, 'Troponin Test', 'troponin');
    if (data?.lft) html += renderArray(data.lft, 'LFT', 'lft');
    if (data?.rft) html += renderArray(data.rft, 'RFT', 'rft');
    if (data?.treatment) html += renderArray(data.treatment, 'Treatment', 'treatment');
    if (data?.urineTest) html += renderArray(data.urineTest, 'Urine Test', 'urineTest');
    if (data?.coagulation) html += renderArray(data.coagulation, 'Coagulation Test', 'coagulation');
    if (data?.treatmentNursing) html += renderArray(data.treatmentNursing, 'Treatment Nursing', 'treatmentNursing');
    if (data?.vitalRecording) html += renderArray(data.vitalRecording, 'Vital Recording', 'vitalRecording');
    if (data?.inOut?.length) html += renderObject(data.inOut[0], 'In/Out Records', 'inOut');
    if (data?.handoverNotes?.length) html += renderObject(data.handoverNotes[0], 'Handover Notes', 'handoverNotes');
    if (data?.admission) {
      html += renderObject(data.admission, 'Admission Details', 'admission');
      if (data.admission.wardConsentDocument) {
        html += renderImageSection(data.admission.wardConsentDocument, 'Ward Consent Document', 'wardConsentDocument');
      }
    }
    if (data?.dischargeSummary) html += renderObject(data.dischargeSummary, 'Discharge Details', 'discharge');
    if (data?.transferOut) html += renderObject(data.transferOut, 'Transfer Out Slip', 'transferOut');
    if (data?.lamaConsent) {
      html += renderObject(data.lamaConsent, 'Lama Consent', 'lamaConsent');
      if (data.lamaConsent.lamaConsentDocument) {
        html += renderImageSection(data.lamaConsent.lamaConsentDocument, 'Lama Consent', 'lamaConsentDocument');
      }
    }
    if (data?.admissionConsents) html += renderArray(data.admissionConsents, 'Admission Consents', 'admissionConsents');
    if (data?.edConsultation) html += renderArray(data.edConsultation, 'ED Consultation Record', 'edConsultation');
    if (data?.diagnosisRecord) html += renderArray(data.diagnosisRecord, 'Diagnosis', 'diagnosis');

    // Scripts
    html += `
      <script>
        function toggleSection(sectionKey) {
          const checkbox = document.getElementById('checkbox-' + sectionKey);
          const content = document.getElementById('content-' + sectionKey);
          const section = document.getElementById('section-' + sectionKey);
          if (checkbox && content && section) {
            if (checkbox.checked) {
              content.classList.remove('strikethrough');
              section.classList.remove('unchecked');
              section.style.display = 'block';
            } else {
              content.classList.add('strikethrough');
              section.classList.add('unchecked');
              section.style.display = 'block';
            }
          }
        }
        function selectAllSections() {
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox.id.startsWith('checkbox-')) {
              checkbox.checked = true;
              const sectionKey = checkbox.id.replace('checkbox-', '');
              toggleSection(sectionKey);
            }
          });
        }
        function deselectAllSections() {
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox.id.startsWith('checkbox-')) {
              checkbox.checked = false;
              const sectionKey = checkbox.id.replace('checkbox-', '');
              toggleSection(sectionKey);
            }
          });
        }
        document.addEventListener('DOMContentLoaded', function() {
          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox.id.startsWith('checkbox-')) {
              checkbox.addEventListener('change', function() {
                const sectionKey = this.id.replace('checkbox-', '');
                toggleSection(sectionKey);
              });
            }
          });
        });
      </script>
    `;

    html += `
      <div class="footer" style="text-align: center; font-style: italic; color: #666;"></div>
      </body></html>`;

    return html;
  }
}
