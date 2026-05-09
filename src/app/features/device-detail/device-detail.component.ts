import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineChartOptions } from '../../shared/components/chart-components';

@Component({
  selector: 'app-device-detail',
  standalone: false,
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent implements OnInit {
  deviceId: string = '';
  loading = true;
  selectedSection: string = 'live-data';

  dockItems1 = [
    { id: 'live-data', label: 'Live Data', icon: 'pi pi-bolt', command: () => this.selectSection('live-data') },
    { id: 'alerts', label: 'Alerts', icon: 'pi pi-bell', command: () => this.selectSection('alerts') },
    { id: 'devices', label: 'Devices', icon: 'pi pi-server', command: () => this.selectSection('devices') },
    { id: 'charts', label: 'Charts', icon: 'pi pi-chart-line', command: () => this.selectSection('charts') },
    { id: 'specs', label: 'Specs', icon: 'pi pi-info-circle', command: () => this.selectSection('specs') },
  ];

  // Live Data
  liveData = {
    grid: { voltage: '230V', status: 'ON', device: 'GRIDG001' },
    solar: { current: '18.2A', power: '4.92kW', today: '28.4 kWh', peak: '6.1 kW' },
    battery: { current: '0A', soc: '100%' },
    backup: { available: '6.2 hrs', load: '5.16 kW', remaining: '1h 12m' }
  };

  // Alerts
  alerts = [
    { id: 1, icon: 'pi pi-exclamation-circle-fill', title: 'Solar Inverter Voltage Warning', device: 'DV-003', time: '42 min ago', severity: 'major' },
    { id: 2, icon: 'pi pi-info-circle-fill', title: 'Firmware Update Available', device: 'DV-001', time: '5 hrs ago', severity: 'info' }
  ];

  // Chart Options
  chartOptions: LineChartOptions | null = null;
  chartInitialized = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.deviceId = params['id'] || 'DV-001';
    });
  }

  selectSection(section: string) {
    this.selectedSection = section;
    if (section === 'charts' && !this.chartInitialized) {
      this.initializeChart();
      this.chartInitialized = true;
    }
  }

  initializeChart() {
    this.chartOptions = {
      xAxisData: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      seriesData: [
        {
          name: 'Solar Output (kW)',
          data: [0.2, 1.5, 4.2, 6.1, 4.8, 1.2, 0.1],
          color: '#f59e0b'
        },
        {
          name: 'System Load (kW)',
          data: [4.2, 4.0, 4.5, 5.2, 5.5, 5.0, 4.8],
          color: '#38bdf8'
        },
        {
          name: 'Battery SoC (%)',
          data: [95, 97, 99, 100, 100, 98, 96],
          color: '#34d399'
        }
      ],
      height: '300px',
      showLegend: true,
      smooth: true,
      showSymbol: false
    };
  }
}
