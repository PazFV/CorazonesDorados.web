
import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseMapComponent } from './components/house-map/house-map.component';
import { StatusWidgetsComponent } from './components/status-widgets/status-widgets.component';
import { DailyReportComponent } from './components/daily-report/daily-report.component';

import { SupabaseService } from './services/supabase.service';
import { PatientData } from './models/patient-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    HouseMapComponent,
    StatusWidgetsComponent,
    DailyReportComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  private intervalId: any;

  patientData = signal<PatientData | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.fetchData();
    this.intervalId = setInterval(() => this.fetchData(), 10000); // Refresh every 10 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async fetchData() {
    try {
      const data = await this.supabaseService.getLatestPatientData();
      if (data) {
        this.patientData.set(data);
      } else {
        this.error.set('No se encontraron datos del paciente.');
      }
      this.error.set(null);
    } catch (err) {
      console.error(err);
      this.error.set('Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
