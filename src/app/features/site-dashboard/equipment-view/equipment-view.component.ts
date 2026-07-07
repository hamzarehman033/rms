import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-equipment-view',
  standalone: false,
  templateUrl: './equipment-view.component.html',
  styleUrl: './equipment-view.component.css'
})
export class EquipmentViewComponent {
  @Input() deviceDetails: any = null;
}
