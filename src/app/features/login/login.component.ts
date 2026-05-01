import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private authService: AuthService) { }

    login(): void {
        // For demonstration, we use hardcoded credentials
        this.authService.login();
    }
}
