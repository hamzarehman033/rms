import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css',
  standalone: true,
  imports: [RouterOutlet],
})
export class PublicLayoutComponent {
  currentYear: number = new Date().getFullYear();
}
