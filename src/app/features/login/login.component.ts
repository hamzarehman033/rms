import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CustomerService } from '../../core/services/customer.service';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';

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
    private customerService: CustomerService,
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

    this.authService.login(loginPayload).pipe(
      tap((response: any) => {
        this.authService.handleLoginSuccess(response);
      }),
      switchMap(() => this.initializeCustomerFlow()),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        // Redirect to return URL or dashboard
        setTimeout(() => {
          if (this.returnUrl && this.returnUrl !== '/') {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 500);
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.toastService.showError('Login Failed', 'Invalid username or password. Please try again.');
        // Error toast is handled by the global error interceptor
      }
    });
  }

  private initializeCustomerFlow() {
    return this.customerService.getCustomers().pipe(
      tap((response: any) => {
        this.customerService.initializeFromApiResponse(response);
      }),
      map(() => void 0),
      catchError((error) => {
        console.error('Failed to initialize customers:', error);
        this.customerService.clear();
        return of(void 0);
      })
    );
  }
}
