import { Component } from '@angular/core';

@Component({
  selector: 'app-locations',
  standalone: false,
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent {
  displayAddLocationDialog = false;

  openAddLocationDialog() {
    this.displayAddLocationDialog = true;
  }

  onLocationAdded(locationData: any) {
    console.log('Location added:', locationData);
    this.displayAddLocationDialog = false;
  }
}
