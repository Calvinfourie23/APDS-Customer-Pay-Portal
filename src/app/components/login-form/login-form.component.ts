import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.apiService.login(this.loginForm.value)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          }),
          catchError(error => {
            if (error.status === 0) {
              this.errorMessage = 'Unable to connect to the server. Please check if the server is running.';
            } else if (error.status === 404) {
              this.errorMessage = 'API endpoint not found. Please check server configuration.';
            } else {
              this.errorMessage = error.error?.message || 'An unexpected error occurred';
            }
            return of(null);
          })
        )
        .subscribe({
          next: (response) => {
            if (response) {
              console.log('Login successful:', response);
              console.log('Redirect URL from response:', response.redirectUrl);
              
              const redirectUrl = response.redirectUrl || '/customer-dashboard';
              console.log('Final redirect URL:', redirectUrl);
              
              this.router.navigate([redirectUrl]);
            }
          }
        });
    }
  }

  onRegister() {
    // Navigate to registration page
    this.router.navigate(['/register']);
  }
}
