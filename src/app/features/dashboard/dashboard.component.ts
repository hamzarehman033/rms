import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Live Telemetry Chart Data
  telemetryChartOptions = {
    xAxisData: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'],
    seriesData: [
      { 
        name: 'Temperature °F', 
        data: [65, 62, 60, 68, 75, 78, 72, 68, 65],
        color: '#5b6cff'
      },
      { 
        name: 'Humidity %', 
        data: [55, 58, 62, 65, 60, 55, 58, 62, 60],
        color: '#38bdf8'
      }
    ],
    height: '250px',
    showLegend: false,
    showSymbol: false
  };

  // Device Breakdown Chart Data
  deviceBreakdownOptions = {
    data: [
      { name: 'Sensors', value: 86, color: '#5b6cff' },
      { name: 'Gateways', value: 24, color: '#8a7bff' },
      { name: 'Actuators', value: 28, color: '#38bdf8' },
      { name: 'Cameras', value: 12, color: '#22c55e' }
    ],
    height: '280px',
    donut: true,
    showLegend: false
  };

  // Weekly Activity Chart Data
  weeklyActivityOptions = {
    xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    seriesData: [
      { 
        name: 'Online', 
        data: [140, 150, 135, 160, 148, 130, 155],
        color: '#22c55e'
      },
      { 
        name: 'Offline', 
        data: [6, 4, 8, 3, 5, 10, 4],
        color: '#ef4444'
      }
    ],
    height: '250px',
    showLegend: false
  };
}
