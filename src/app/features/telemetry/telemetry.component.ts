import { Component } from '@angular/core';

@Component({
  selector: 'app-telemetry',
  standalone: false,
  templateUrl: './telemetry.component.html',
  styleUrl: './telemetry.component.css'
})
export class TelemetryComponent {
  telemetryChartOptions = {
    xAxisData: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    seriesData: [
      { 
        name: 'Temperature', 
        data: [68, 65, 62, 70, 75, 72, 68],
        color: '#5b6cff'
      },
      { 
        name: 'Humidity', 
        data: [42, 45, 48, 40, 35, 42, 40],
        color: '#38bdf8'
      }
    ],
    height: '340px',
    showLegend: false,
    smooth: true,
    showSymbol: false
  };
}
