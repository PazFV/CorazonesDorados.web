
import { Component, ChangeDetectionStrategy, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientData } from '../../models/patient-data.model';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class DailyReportComponent {
  patientData = input.required<PatientData | null>();
  private geminiService = inject(GeminiService);

  isLoading = signal<boolean>(false);
  report = signal<string | null>(null);
  error = signal<string | null>(null);

  async generateReport() {
    const data = this.patientData();
    if (!data) {
      this.error.set("No hay datos del paciente para generar el informe.");
      return;
    }

    this.isLoading.set(true);
    this.report.set(null);
    this.error.set(null);
    
    try {
      const result = await this.geminiService.generateDailyReport(data);
      this.report.set(result);
    } catch (err) {
      console.error(err);
      this.error.set("Ocurrió un error al generar el informe.");
    } finally {
      this.isLoading.set(false);
    }
  }
}
