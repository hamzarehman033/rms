import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-equipment-view',
  standalone: false,
  templateUrl: './equipment-view.component.html',
  styleUrl: './equipment-view.component.css'
})
export class EquipmentViewComponent {
  @Input() deviceDetails: any = null;
  selectedDeviceDetails: any = null;

  ngOnInit(): void {
    this.syncDeviceSelection(this.deviceDetails);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('deviceDetails' in changes) {
      this.syncDeviceSelection(this.deviceDetails);
    }
  }

  private syncDeviceSelection(details: any): void {
    if (!details) {
      this.selectedDeviceDetails = null;
      return;
    }
    this.selectedDeviceDetails = details;
  }

}
