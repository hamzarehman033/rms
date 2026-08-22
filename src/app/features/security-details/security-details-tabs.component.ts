import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-security-details-tabs',
  standalone: false,
  templateUrl: './security-details-tabs.component.html',
  styleUrl: './security-details-tabs.component.css'
})
export class SecurityDetailsTabsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
