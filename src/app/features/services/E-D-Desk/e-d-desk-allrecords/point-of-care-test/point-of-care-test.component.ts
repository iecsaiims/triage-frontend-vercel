import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PointOfCareTestService } from '../../../../../api/point-of-care-test.service';
import { FileService } from '../../../../../api/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-point-of-care-test',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './point-of-care-test.component.html',
  styleUrl: './point-of-care-test.component.css',
})
export class PointOfCareTestComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  // Toggle state
  activeSection: string | null = null;
  filesurl: string = '';
  // POCUS
  date: string = '';
  time: string = '';
  protocol: string = '';
  findings: string = '';
  doctorSign: string = '';

  // ECG
  ecgDate: Date | null = null;
  ecgTime: string = '';
  ecgFindings: string = '';
  // ecgDoctorSign: string = '';
  ecgImagePreview: string | null = null;
  ecgImageFile: File | null = null;
  ecgData: any[] = [];
  // Blood Gas
  bloodGasDate: Date | null = null;
  bloodGasTime: string = '';
  bloodGasType: string = '';

  ph: string = '';
  pco2: string = '';
  hco3: string = '';
  be: string = '';
  hct: string = '';
  hb: string = '';
  so2: string = '';
  cohb: string = '';
  mchb: string = '';
  na: string = '';
  k: string = '';
  ca: string = '';
  mosm: string = '';
  glu: string = '';
  lac: string = '';

  bloodGasOther: string = '';
  bloodGasInterpretation: string = '';
  bloodGasImagePreview: string | null = null;

  // Troponin
  troponinDate: Date | null = null;
  troponinTime: string = '';
  troponinType: string = '';
  troponinTestType: string = '';
  troponinValue: number | null = null;
  troponinInterpretation: string = '';
  // troponinDoctorSign: string = '';
  troponinDataList: any[] = [];
  // Troponin multiple selections
  isQualitative: boolean = false;
  isQuantitative: boolean = false;
  isTropI: boolean = false;
  isTropT: boolean = false;

  // Other Tests
  otherDate: Date | null = null;
  otherTime: string = '';

  showProBnp = false;
  showDdimer = false;
  showCrp = false;
  showEsr = false;

  proBnpValue: string = '';
  proBnpInterpretation: string = '';

  dDimerValue: string = '';
  dDimerInterpretation: string = '';

  crpValue: string = '';
  crpInterpretation: string = '';

  esrValue: string = '';
  esrInterpretation: string = '';
  patientId: number = 0;
  pocusData: any[] = [];
  bloodGasImageFile: File | null = null;
  bloodGasData: any[] = [];
  otherTestData: any = null;
  otherTestDataList: any[] = [];

  xrayType: string = '';
  xrayFindings: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  ctType: string = '';
  ctFindings: string = '';
  ctScanImage: File | null = null;
  ctScanList: any[] = [];
  ctTypes: string[] = ['Chest', 'Pelvis', 'Extremities', 'Other'];
  xrayDataList: any[] = [];
   fullscreenImageUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private pocService: PointOfCareTestService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();

    // Set current Date
    this.date = now.toISOString().split('T')[0]; // for POCUS
    this.ecgDate = now;
    this.bloodGasDate = now;
    this.troponinDate = now;
    this.otherDate = now;

    // Set current Time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    this.time = currentTime; // POCUS
    this.ecgTime = currentTime;
    this.bloodGasTime = currentTime;
    this.troponinTime = currentTime;
    this.otherTime = currentTime;
  }

  ngOnInit() {
    const idFromRoute =
      this.route?.snapshot?.paramMap?.get('id') ||
      this.route?.parent?.snapshot?.paramMap?.get('id');
    if (idFromRoute) {
      this.patientId = +idFromRoute;
      console.log(' Patient ID:', this.patientId);
      this.loadPocusData();
      this.loadEcgData();
      this.loadBloodGasData();
      this.loadTroponinData(this.patientId);
      this.loadOtherTestData(this.patientId);
      this.loadCtScanData(this.patientId);
      this.getXrayData(this.patientId);
    }
  }
  // Function to handle image upload for ECG
  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
  // Function to handle image upload for POCUS
  onBloodGasImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.bloodGasImageFile = input.files[0]; // Save the file

      const reader = new FileReader();
      reader.onload = (e) => {
        this.bloodGasImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  savePocus(patientId: number) {
    // ✅ Validation check
    if (!this.protocol?.trim() && !this.findings?.trim()) {
      this.snackBar.open(
        'Please fill at least Protocol or Findings before saving!',
        'Close',
        { duration: 3000, panelClass: ['snackbar-error'] }
      );
      return;
    }

    const data = {
      patientId: patientId,
      protocol: this.protocol,
      findings: this.findings,
      submittedBy: 'Phantom Manence',
      designation: 'Doctor',
    };

    this.pocService.savePocus(data).subscribe({
      next: (res: any) => {
        console.log('✅ POCUS saved successfully', res);
        this.snackBar.open('POCUS data saved successfully.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        // Refresh the data
        this.loadPocusData();

        // Clear fields
        this.protocol = '';
        this.findings = '';
      },
      error: (err) => {
        console.error('❌ Failed to save POCUS:', err);
        this.snackBar.open('Failed to save POCUS data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
  // Function to load POCUS data
  loadPocusData() {
    this.pocService.getPocusByPatientId(this.patientId).subscribe({
      next: (res: any) => {
        this.pocusData = res.data.map((record: any) => ({
          ...record,
          showDetails: false,
        }));
      },
      error: (err) => {
        console.error('❌ Error loading POCUS data:', err);
      },
    });
  }
  // Function to handle image upload for ECG
  onEcgImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.ecgImageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.ecgImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.ecgImageFile);
    }
  }
  // Function to handle image upload for ECG
  saveEcg(patientId: number) {
    // if (!this.ecgImageFile) {
    //   alert('Please upload an ECG image');
    //   return;
    // }

    const formData = new FormData();
    formData.append('patientId', patientId.toString());
    formData.append('ecgFindings', this.ecgFindings);
    if (this.ecgImageFile) {
      formData.append('ecgImage', this.ecgImageFile);
    }

    this.pocService.saveEcg(formData).subscribe({
      next: (res: any) => {
        this.snackBar.open('ECG data saved successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.loadEcgData();

        // Reset
        this.ecgFindings = '';
        this.ecgImagePreview = null;
        this.ecgImageFile = null;
      },
      error: (err) => {
        this.snackBar.open('Failed to save ECG data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
  // Function to load ECG data
  loadEcgData() {
    this.pocService.getEcgByPatientId(this.patientId).subscribe({
      next: (res: any) => {
        this.ecgData = res.data.map((item: any) => ({
          ...item,
          showDetails: false,
          showImage: false,
        }));
        console.log('✅ ECG data loaded:', this.ecgData);
      },
      error: (err) => {
        console.error('❌ Failed to load ECG data:', err);
      },
    });
  }
  // Function to handle image upload for ECG
  saveBloodGas(patientId: number) {
    const formData = new FormData();
    formData.append('patientId', this.patientId.toString());
    formData.append('bloodGasType', this.bloodGasType || '');
    formData.append('ph', this.ph || '');
    formData.append('cohb', this.cohb || '');
    formData.append('pco2', this.pco2 || '');
    formData.append('mchb', this.mchb || '');
    formData.append('hco3', this.hco3 || '');
    formData.append('na', this.na || '');
    formData.append('be', this.be || '');
    formData.append('k', this.k || '');
    formData.append('hct', this.hct || '');
    formData.append('ca', this.ca || '');
    formData.append('hb', this.hb || '');
    formData.append('mosm', this.mosm || '');
    formData.append('so2', this.so2 || '');
    formData.append('glu', this.glu || '');
    formData.append('lac', this.lac || '');
    formData.append('bloodGasOther', this.bloodGasOther || '');
    formData.append(
      'bloodGasInterpretation',
      this.bloodGasInterpretation || ''
    );
    if (this.bloodGasImageFile) {
      formData.append('bloodGasImage', this.bloodGasImageFile);
    }
    console.log('Submitting Blood Gas FormData:', formData);
    this.pocService.saveBloodGas(formData).subscribe({
      next: (res) => {
        this.loadBloodGasData();
        this.snackBar.open('Blood Gas data saved successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to save Blood Gas data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  // Function to load blood gas data
  loadBloodGasData() {
    this.pocService.getBloodGasByPatientId(this.patientId).subscribe({
      next: (res) => {
        console.log(' Blood Gas response:', res);
        console.log('Blood Gas Loaded:', this.bloodGasData);

        this.bloodGasData = res.data || [];
      },

      error: (err) => {
        console.error('❌ Error loading blood gas data', err);
      },
    });
  }
  toggleImage(item: any, imageKey: string) {
    if (item.showImage) {
      item.showImage = false;
      return;
    }

    if (item.image_blobUrl) {
      item.showImage = true;
      return;
    }

    console.log('Fetching image for:', item);

    const fileName = item[imageKey];
    if (!fileName) {
      console.error('❌ Invalid file URL');
      return;
    }

    this.fileService.getfile(fileName).subscribe({
      next: (blob: Blob) => {
        const objectUrl = URL.createObjectURL(blob);
        item.image_blobUrl = objectUrl;
        item.showImage = true;
      },
      error: (err) => {
        console.error('❌ Error fetching file:', err);
        item.showImage = false;
      },
    });
  }

  // Function to handle image upload for ECG
  saveTroponin(patientId: number) {
    const data = {
      troponinType: this.isTropI ? 'trop I' : this.isTropT ? 'Trop T' : '',
      testType: this.isQualitative
        ? 'Qualitative'
        : this.isQuantitative
        ? 'Quantitative'
        : '',
      troponinInterpretation: this.troponinInterpretation || 'Normal',
      troponinValue: this.troponinValue || 0,
      patientId: patientId,
      designation: 'Doctor',
    };

    this.pocService.saveTroponin(data).subscribe({
      next: (res) => {
        this.loadTroponinData(patientId);
        this.snackBar.open('Troponin data saved successfully.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to save Troponin data', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  loadTroponinData(patientId: number) {
    this.pocService.getTroponinTests(patientId).subscribe({
      next: (res) => {
        this.troponinDataList = res.data.map((item: any) => ({
          ...item,
          showDetails: false,
        }));
      },
      error: (err) => {
        console.error('❌ Failed to load troponin data', err);
      },
    });
  }

  // Function to load Other Test
  saveOtherTest(patientId: number) {
    const isAnyFieldFilled =
      this.proBnpValue ||
      this.proBnpInterpretation ||
      this.dDimerValue ||
      this.dDimerInterpretation ||
      this.crpValue ||
      this.crpInterpretation ||
      this.esrValue ||
      this.esrInterpretation;

    if (!isAnyFieldFilled) {
      this.snackBar.open(
        'Please fill at least one field before saving!',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
      return;
    }

    const data = {
      patientId: patientId,
      proBnpValue: this.proBnpValue || null,
      proBnpInterpretaion: this.proBnpInterpretation || '',
      dDimerValue: this.dDimerValue || null,
      dDimerInterpretaion: this.dDimerInterpretation || '',
      crpValue: this.crpValue || null,
      crpInterpretaion: this.crpInterpretation || '',
      esrValue: this.esrValue || null,
      esrInterpretaion: this.esrInterpretation || '',
      submittedBy: '',
      designation: 'Doctor',
    };

    this.pocService.saveOtherTest(data).subscribe({
      next: (res) => {
        this.loadOtherTestData(patientId);
        this.snackBar.open('Other test saved successfully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to save other test', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  loadOtherTestData(patientId: number) {
    this.pocService.getOtherTestByPatientId(patientId).subscribe({
      next: (res: any) => {
        this.otherTestDataList = res.data.map((item: any) => ({
          ...item,
          showDetails: false, // add toggle flag
        }));
        console.log('Other Test Data:', this.otherTestDataList);
      },
      error: (err: any) => {
        console.error('Failed to load other test data', err);
      },
    });
  }

  onFileSelected(event: any){
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitXray(){
    // if (!this.selectedFile || !this.patientId || !this.xrayType) {
    //   console.error('Missing required fields!');
    //   this.snackBar.open('Please fill all required fields!', 'Close', {
    //     duration: 3000,
    //     panelClass: ['snackbar-error'],
    //   });
    //   return;
    // }

    const xrayData = {
      xrayType: this.xrayType,
      xrayFindings: this.xrayFindings,
      xrayImage: this.selectedFile,
      patientId: this.patientId,
    };

    this.pocService.addXray(xrayData).subscribe({
      next: (res: any) => {
        this.getXrayData(this.patientId);

        this.snackBar.open('X-Ray submitted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
        // ✅ Reset inputs
        this.xrayType = '';
        this.xrayFindings = '';
        this.selectedFile = null;
        this.previewUrl = null;
        this.fileInput.nativeElement.value = '';
      },
      error: (err) => {
        console.error('Error submitting x-ray', err);

        this.snackBar.open('Failed to submit X-Ray. Try again!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  onCTFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.ctScanImage = file;
      console.log('Selected CT Scan Image:', this.ctScanImage);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  submitCTScan() {
    // if (!this.ctScanImage || !this.patientId || !this.ctType) {
    //   console.error('Missing required fields for CT Scan!');
    //   this.snackBar.open(
    //     'Please fill all required fields for CT Scan!',
    //     'Close',
    //     {
    //       duration: 3000,
    //       panelClass: ['snackbar-error'],
    //     }
    //   );
    //   return;
    // }

    const ctScanFormData = {
      patientId: this.patientId,
      ctType: this.ctType || '',
      ctFindings: this.ctFindings || '',
      ctScanList: this.ctScanList || [],
      ctTypes: this.ctTypes || [],
      xrayDataList: this.xrayDataList || [],
      ctScanImage: this.ctScanImage,
    };

    console.log('CT Scan Form Data:', ctScanFormData);

    this.pocService.submitCTScan(ctScanFormData).subscribe({
      next: (res: any) => {
        this.loadCtScanData(this.patientId);

        this.snackBar.open('CT Scan submitted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });

        this.ctType = '';
        this.ctFindings = '';
        this.ctScanImage = null;
      },
      error: (err) => {
        console.error('Error submitting CT scan data:', err);

        this.snackBar.open('Failed to submit CT Scan. Try again!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  loadCtScanData(patientId: number) {
    this.pocService.getCtScanData(patientId).subscribe({
      next: (res: any) => {
        console.log('CT Scan Data:', res);
        const data = res.data ? res.data : [];
        this.ctScanList = data.map((item: any) => ({
          ...item,
          showDetails: false,
        }));
      },
      error: (err) => {
        console.error('Error loading CT scan data:', err);
      },
    });
  }

  // Open fullscreen for ECG or Gas image
  openFullScreen(imageUrl: string) {
    this.fullscreenImageUrl = imageUrl;
  }

  closeFullScreen() {
    this.fullscreenImageUrl = null;
  }

  getXrayData(patientId: number){
    this.pocService.getXrayData(patientId).subscribe({
      next: (res: any) => {
        console.log('✔️ Raw X-ray response:', res);

        const xrayArray = res.data ? res.data : [];
        console.log('✔️ Processed X-ray data:', typeof xrayArray, xrayArray);
        if (xrayArray.length > 0) {
          console.warn('❗ No X-ray data found for patient:', patientId);
          this.xrayDataList = xrayArray.map((x: any) => ({
            ...x,
            showImage: false,
            xrayImage_blobUrl: x.xrayImage_url, //  use direct URL
          }));
          console.log('✔️ X-ray item:', this.xrayDataList);
        }
      },
      error: (err: any) => {
        console.error('❌ Error fetching x-ray data', err);
      },
    });
  }

  createBlobUrl(base64Data: string): string {
    if (!base64Data) return '';
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Invalid base64 image:', error);
      return '';
    }
  }
  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !d ? false : d >= today;
  };
}
