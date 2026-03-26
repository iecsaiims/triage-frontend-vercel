import { Component, DestroyRef, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, KeyValue, isPlatformBrowser } from '@angular/common';
import { catchError, finalize, of, switchMap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type DispositionKey = 'discharge' | 'transfer_out' | 'lama' | 'admission';

interface DashboardResponse {
  totals: {
    patients: { allTime: number; today: number };
    activePatients: { allTime: number; today: number };
  };
  triage: {
    allTime: Record<string, number>;
    today: Record<string, number>;
  };
  disposition: {
    allTime: Record<DispositionKey, number>;
    today: Record<DispositionKey, number>;
  };
  activePatients: {
    count: number;
    list: ActivePatient[];
  };
}

interface ActivePatient {
  id: number;
  name: string;
  crNumber: string;
  triage?: string;
  emergencyType?: string;
  triageTime?: string;
}

@Component({
  selector: 'app-live-dashboard',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './live-dashboard.component.html',
  styleUrl: './live-dashboard.component.css',
})
export class LiveDashboardComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly pollIntervalMs = 30000;
  private readonly apiBase = 'http://localhost:8000/api';

  protected readonly isDownloading = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly dashboard = signal<DashboardResponse | null>(null);
  protected readonly lastUpdated = signal<Date | null>(null);

  protected readonly triageAllTime = computed(() => this.dashboard()?.triage.allTime ?? {});
  protected readonly triageToday = computed(() => this.dashboard()?.triage.today ?? {});
  protected readonly dispositionAllTime = computed(
    () => this.dashboard()?.disposition.allTime ?? {}
  );
  protected readonly dispositionToday = computed(() => this.dashboard()?.disposition.today ?? {});
  protected readonly activeList = computed(() => this.dashboard()?.activePatients.list ?? []);

  protected readonly triageTotalAllTime = computed(() =>
    Object.values(this.triageAllTime() as Record<string, number>).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    )
  );
  protected readonly triageTotalToday = computed(() =>
    Object.values(this.triageToday() as Record<string, number>).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    )
  );
  protected readonly dispositionTotalAllTime = computed(() =>
    Object.values(this.dispositionAllTime() as Record<string, number>).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    )
  );
  protected readonly dispositionTotalToday = computed(() =>
    Object.values(this.dispositionToday() as Record<string, number>).reduce(
      (sum, n) => sum + Number(n || 0),
      0
    )
  );

  constructor() {
    if(this.isBrowser) {
      this.startPolling();
    }
  }

  private startPolling(): void {
    timer(0, this.pollIntervalMs)
      .pipe(
        switchMap(() => this.loadDashboard()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  refreshNow(): void {
    this.loadDashboard().subscribe();
  }

  private loadDashboard() {
    if (this.loading()) {
      return of(null);
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http
      .get<DashboardResponse>(`${this.apiBase}/dashboard/doctor`)
      .pipe(
        catchError((err) => {
          console.error('Failed to load dashboard', err);
          this.error.set('Unable to load dashboard right now.');
          return of(null);
        }),
        switchMap((data) => {
          if (data) {
            this.dashboard.set(data);
            this.lastUpdated.set(new Date());
          }
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      );
  }

  download(): void {
    if (!this.isBrowser || this.isDownloading()) {
      return;
    }

    this.isDownloading.set(true);
    this.http
      .get(`${this.apiBase}/export`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'patient_triageData.xlsx';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Failed to download triage data', error);
        },
        complete: () => this.isDownloading.set(false),
      });
  }

  protected percent(value: number, total: number): number {
    if (!total || !value) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  }

  protected toNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  protected formatDate(value?: string): string {
    if (!value) return '-';
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  protected sortDescending = (a: KeyValue<string, unknown>, b: KeyValue<string, unknown>) =>
    this.toNumber(b.value) - this.toNumber(a.value);
}

