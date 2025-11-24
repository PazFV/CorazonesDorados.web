
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientData } from '../../models/patient-data.model';

@Component({
  selector: 'app-status-widgets',
  templateUrl: './status-widgets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class StatusWidgetsComponent {
  patientData = input.required<PatientData | null>();
}
