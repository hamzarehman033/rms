import { Component } from '@angular/core';
import { DeviceMapComponent } from '../../shared/components/device-map/device-map.component';

@Component({
  selector: 'app-dashboard',
  imports: [DeviceMapComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
