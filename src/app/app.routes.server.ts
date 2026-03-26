import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    { path: 'triage-entry-desk/:id', renderMode: RenderMode.Server },
  { path: ':deskType/patient-details', renderMode: RenderMode.Server },
  { path: ':deskType/patient-details/:id', renderMode: RenderMode.Server },
  { path: 'prepare-summary/:id', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/dashboard', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/triage', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/Primary-Assessmen', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/doctor-notes', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/Point-of-Care-Test', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/discharge', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/summary', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/investigation-order', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/treatment-details', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/vitals-recording', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/treatment-details-nurs-site', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/nurse-handover-notes', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/Intake-output', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/nursing-summary', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/ed-consultation-record', renderMode: RenderMode.Server },
  { path: ':deskType/patient-dashboard/:id/Diagnosis', renderMode: RenderMode.Server },
  { path: 'patient-details/:id', renderMode: RenderMode.Server },
  { path: 'enc-desk/:id', renderMode: RenderMode.Server },

  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
