import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['Sysadmin', [Validators.required]],
      password: ['Aa@123', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.toastService.showError('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;

    const loginPayload = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        // Use AuthService to handle login success and token storage
        this.authService.handleLoginSuccess(response);
        this.isLoading = false;
        
        // Redirect to return URL or dashboard
        setTimeout(() => {
            if(this.returnUrl && this.returnUrl !== '/') {
                this.router.navigateByUrl(this.returnUrl);
            } else {
                this.router.navigate(['/dashboard']);
            }
        }, 500);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Login error:', error);
        this.toastService.showError('Login Failed', 'Invalid username or password. Please try again.');
        // Error toast is handled by the global error interceptor
      }
    });
  }
}
