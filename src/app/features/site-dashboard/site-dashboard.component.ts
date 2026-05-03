import { Component } from '@angular/core';
import { LineChartOptions } from '../../shared/components/chart-components';

@Component({
  selector: 'app-site-dashboard',
  standalone: false,
  templateUrl: './site-dashboard.component.html',
  styleUrl: './site-dashboard.component.css'
})
export class SiteDashboardComponent {
  solarChartOptions: LineChartOptions;

  constructor() {
    this.solarChartOptions = this.initSolarChart();
  }

  initSolarChart(): LineChartOptions {
    return {
      xAxisData: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
                  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [0, 0, 0, 0, 0, 0.1, 0.3, 1.2, 2.4, 3.8, 4.5, 5.1, 5.2, 5.0, 4.8, 4.2, 3.5, 2.1, 0.8, 0.2, 0, 0, 0, 0],
          color: '#f59e0b'
        }
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false
    };
  }
}
