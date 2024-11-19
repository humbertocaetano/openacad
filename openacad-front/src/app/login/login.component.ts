import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="login-container">
      <div class="login-header">
        <h1 class="logo">OPENACAD</h1>
      </div>

      <div class="login-content">
        <h2>Acessar</h2>
        <p>Digite o usuário e a senha para continuar</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>EMAIL</label>
            <input type="email" formControlName="email">
            <div class="error-message" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
              Email é obrigatório
            </div>
            <div class="error-message" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
              Email inválido
            </div>
          </div>

          <div class="form-group">
            <label>SENHA</label>
            <input type="password" formControlName="password">
            <div class="error-message" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
              Senha é obrigatória
            </div>
          </div>

          <div class="form-group">
            <label>CÓDIGO DA ESCOLA</label>
            <input type="text" formControlName="schoolCode">
            <div class="error-message" *ngIf="loginForm.get('schoolCode')?.errors?.['required'] && loginForm.get('schoolCode')?.touched">
              Código da escola é obrigatório
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="network-error" *ngIf="networkError">
            Erro de conexão com o servidor. Verifique sua conexão de rede.
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Carregando...' : 'login' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  networkError = false;
  private loginSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      schoolCode: ['', Validators.required]
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido, redirecionando...');
        this.isLoading = false;
        this.router.navigate(['/dashboard'])
          .then(() => console.log('Navegação completada'))
          .catch(err => console.error('Erro na navegação:', err));
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
