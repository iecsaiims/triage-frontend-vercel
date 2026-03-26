import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NursingPatientSummaryService {
  generatePatientReportHtml(data: any, baseUrl: string) {
    const patientName = data?.patientDetails?.patientName || 'Unknown';

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patient Report - ${patientName}</title>        
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          h1 {
            text-align: center;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 10px;
          }
          h2 {
            margin-top: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .section {
            margin-bottom: 30px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            text-align: center;
            color: #555;
          }
          @media print {
            body {
              margin: 0;
              font-size: 12pt;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
      <h1>Patient Report</h1>
    `;

    const formatKey = (key: string): string => {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const renderObject = (obj: any, title: string): string => {
      if (!obj || typeof obj !== 'object') return '';
      let tableHtml = `<div class="section"><h2>${title}</h2><table><tr><th>Field</th><th>Value</th></tr>`;
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && !Array.isArray(value) && typeof value !== 'object') {
          tableHtml += `<tr><td>${formatKey(key)}</td><td>${value}</td></tr>`;
        }
      }
      tableHtml += '</table></div>';
      return tableHtml;
    };

    const renderArray = (arr: any[], title: string): string => {
      if (!arr || arr.length === 0) return '';
      let tableHtml = `<div class="section"><h2>${title}</h2><table><tr>`;

      const headers = Object.keys(arr[0]).filter(key =>
        key !== 'patient_id' && key !== 'createdAt' && key !== 'updatedAt' &&
        !Array.isArray(arr[0][key]) && typeof arr[0][key] !== 'object'
      );

      headers.forEach(header => {
        tableHtml += `<th>${formatKey(header)}</th>`;
      });
      tableHtml += '</tr>';

      arr.forEach(item => {
        tableHtml += '<tr>';
        headers.forEach(header => {
          const value = item[header] !== null && item[header] !== undefined ? item[header] : '-';
          tableHtml += `<td>${value}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table></div>';
      return tableHtml;
    };

    // Render sections
    if (data?.patientDetails) {
      html += renderObject(data?.patientDetails, 'Patient Details');
    }
    if (data?.treatmentNursing) {
      html += renderArray(data?.treatmentNursing, 'Treatment Nursing');
    }
    if (data?.inOut) {
      html += renderArray(data?.inOut, 'Intake/Output');
    }
    if (data?.handoverNotes) {
      html += renderArray(data?.handoverNotes, 'Handover Notes');
    }

    html += `<div class="footer">Prepared by: Yamini Verma</div></body></html>`;
    return html;
  }
}
