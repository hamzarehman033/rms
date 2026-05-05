import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BarChartOptions, PieChartOptions } from '@app/shared';

@Component({
  selector: 'app-ai-analytics',
  templateUrl: './ai-analytics.component.html',
  styleUrl: './ai-analytics.component.css',
  standalone: false,
})
export class AiAnalyticsComponent {
  alertsChartOptions!: BarChartOptions;
  pieChartOptions!: PieChartOptions;
  
  constructor() {
    this.alertsChartOptions = this.initAlertsBarChart();
    this.pieChartOptions = this.initPieChart();
  }
  
  initAlertsBarChart(): BarChartOptions {
    return {
      xAxisData: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
                  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
      seriesData: [
        {
          name: 'Critical Alerts',
          data: [0, 0, 1, 0, 0, 0, 2, 1, 0, 1, 2, 3, 2, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
          color: '#ef4444'
        },
        {
          name: 'Warning Alerts',
          data: [0, 1, 0, 2, 0, 1, 2, 3, 2, 1, 2, 2, 3, 2, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0],
          color: '#f59e0b'
        }
      ],
      height: '300px',
      showLegend: true,
    };
  }

  initPieChart(): PieChartOptions {
    return {
      data: [
        { name: 'Compliant', value: 94.2, color: '#22c55e' },
        { name: 'Non-Compliant', value: 5.8, color: '#ef4444' }
      ],
      height: '300px',
      showLegend: true
    };
  }
}
