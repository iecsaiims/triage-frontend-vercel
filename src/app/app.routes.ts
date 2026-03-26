import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./website/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'service',
    loadComponent: () =>
      import('./features/services/service/service.component').then(
        (m) => m.ServiceComponent
      ),
  },
  {
    path: 'live-dashboard',
    loadComponent: () =>
      import('./features/live-dashboard/live-dashboard.component').then(
        (m) => m.LiveDashboardComponent
      ),
  },
  {
    path: 'triage-entry-desk',
    loadComponent: () =>
      import(
        './features/services/entry-desk/triage-entry-desk/triage-entry-desk.component'
      ).then((m) => m.TriageEntryDeskComponent),
  },
  {
    path: 'patient-list',
    loadComponent: () =>
      import(
        './features/services/entry-desk/patient-list/patient-list.component'
      ).then((m) => m.PatientListComponent),
  },
  {
    path: 'patient-added',
    loadComponent: () =>
      import(
        './features/services/entry-desk/patient-added/patient-added.component'
      ).then((m) => m.PatientAddedComponent),
  },
      {
    path: 'enc-list',
    loadComponent: () =>
      import(
        './features/services/ENC-Desk/enc-list/enc-list.component'
      ).then((m) => m.EncListComponent),
  },
   {
    path: 'enc-desk/:id',
    loadComponent: () =>
      import(
        './features/services/ENC-Desk/enc-desk/enc-desk.component'
      ).then((m) => m.ENCDeskComponent),
  },
  {
    path: ':deskType/patient-details',
    loadComponent: () =>
      import(
        './features/services/E-D-Desk/patient-details/patient-details.component'
      ).then((m) => m.PatientDetailsComponent),
  },
  {
    path: ':deskType/patient-details/:id',
    loadComponent: () =>
      import(
        './features/services/entry-desk/triage-entry-desk/triage-entry-desk.component'
      ).then((m) => m.TriageEntryDeskComponent),
  },
  {
    path: 'patient-details/:id',
    loadComponent: () =>
      import(
        './features/services/entry-desk/triage-entry-desk/triage-entry-desk.component'
      ).then((m) => m.TriageEntryDeskComponent),
  },
  {
    path: 'prepare-summary/:id',
    loadComponent: () =>
      import(
        './features/services/entry-desk/prepare-summary/prepare-summary.component'
      ).then((m) => m.PrepareSummaryComponent),
  },

  {
    path: ':deskType/patient-dashboard/:id',
    loadComponent: () =>
      import('./features/maincontenar/maincontenar.component').then(
        (m) => m.MaincontenarComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/patient-dashboard/patient-dashboard.component'
          ).then((m) => m.PatientDashboardComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/patient-dashboard/patient-dashboard.component'
          ).then((m) => m.PatientDashboardComponent),
      },
      {
        path: 'triage',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/triage-detail/triage-detail.component'
          ).then((m) => m.TriageDetailComponent),
      },
      {
        path: 'Primary-Assessmen',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/primary-assessmen/primary-assessmen.component'
          ).then((m) => m.PrimaryAssessmenComponent),
      },
      {
        path: 'doctor-notes',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/doctor-notes/doctor-notes.component'
          ).then((m) => m.DoctorNotesComponent),
      },
      {
        path: 'Point-of-Care-Test',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/point-of-care-test/point-of-care-test.component'
          ).then((m) => m.PointOfCareTestComponent),
      },
      {
        path: 'discharge',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/discharge/discharge.component'
          ).then((m) => m.DischargeComponent),
      },

      {
        path: 'summary',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/summary/summary.component'
          ).then((m) => m.SummaryComponent),
      },
      {
        path: 'investigation-order',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/investigation-order/investigation-order.component'
          ).then((m) => m.InvestigationOrderComponent),
      },
      {
        path: 'treatment-details',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/treatment-details/treatment-details.component'
          ).then((m) => m.TreatmentDetailsComponent),
      },
      {
        path: 'vitals-recording',
        loadComponent: () =>
          import(
            './features/services/emergency-nursing-desk/vitals-recording/vitals-recording.component'
          ).then((m) => m.VitalsRecordingComponent),
      },
      {
        path: 'treatment-details-nurs-site',
        loadComponent: () =>
          import(
            './features/services/emergency-nursing-desk/treatment-details-nurs-site/treatment-details-nurs-site.component'
          ).then((m) => m.TreatmentDetailsNursSiteComponent),
      },
      {
        path: 'nurse-handover-notes',
        loadComponent: () =>
          import(
            './features/services/emergency-nursing-desk/nurse-handover-notes/nurse-handover-notes.component'
          ).then((m) => m.NurseHandoverNotesComponent),
      },
      {
        path: 'Intake-output',
        loadComponent: () =>
          import(
            './features/services/emergency-nursing-desk/intake-output/intake-output.component'
          ).then((m) => m.IntakeOutputComponent),
      },
      {
        path: 'nursing-summary',
        loadComponent: () =>
          import(
            './features/services/emergency-nursing-desk/nursing-summary/nursing-summary.component'
          ).then((m) => m.NursingSummaryComponent),
      },
      {
        path: 'ed-consultation-record',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/ed-consultation-record/ed-consultation-record.component'
          ).then((m) => m.EDConsultationRecordComponent),
      },
      {
        path: 'Diagnosis',
        loadComponent: () =>
          import(
            './features/services/E-D-Desk/e-d-desk-allrecords/diagnosis/diagnosis.component'
          ).then((m) => m.DiagnosisComponent),
      },
    ],
  },
  {
    path: 'registration-list',
    loadComponent: () =>
      import(
        './features/services/Registration-desk/registration-list/registration-list.component'
      ).then((m) => m.RegistrationListComponent),
  },
  {
    path: 'triage-list',
    loadComponent: () =>
      import(
        './features/services/entry-desk/triage-list/triage-list.component'
      ).then((m) => m.TriageListComponent),
  },
  {
    path: 'triage-entry-desk/:id',
    loadComponent: () =>
      import(
        './features/services/entry-desk/triage-entry-desk/triage-entry-desk.component'
      ).then((m) => m.TriageEntryDeskComponent),
  },
];
