import { Component } from '@angular/core';

@Component({
  selector: 'app-alarm',
  standalone: false,
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent {
  selectedTab = 0;
  tabOptions = [
    { label: 'Open', value: 0 },
    { label: 'Acknowledged', value: 1 },
    { label: 'Resolved', value: 2 }
  ];
}
