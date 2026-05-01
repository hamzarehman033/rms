import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ModalDialogComponent } from '@app/shared';
import { AddDeviceComponent } from './add-device.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
  standalone: false,
})
export class DevicesComponent {
  displayAddDeviceDialog = false;

  openAddDeviceDialog() {
    this.displayAddDeviceDialog = true;
  }

  onDeviceAdded(deviceData: any) {
    this.displayAddDeviceDialog = false;
  }
}
