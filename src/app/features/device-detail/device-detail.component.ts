import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-device-detail',
  standalone: false,
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.css'
})
export class DeviceDetailComponent implements OnInit {
  deviceId: string = '';
  loading = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.deviceId = params['id'] || 'DV-001';
    });
  }


}
