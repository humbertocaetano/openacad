import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="user-form-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Cadastro de Usuários</h2>
        </div>

        <div class="form-container">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Nome:</label>
              <input 
                id="name" 
                type="text" 
                formControlName="name"
                [class.invalid]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
              >
              <div class="error-message" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
                Nome é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="email">E-mail:</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                [class.invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
              >
              <div class="error-message" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                <span *ngIf="userForm.get('email')?.errors?.['required']">E-mail é obrigatório</span>
                <span *ngIf="userForm.get('email')?.errors?.['email']">E-mail inválido</span>
              </div>
            </div>

            <div class="form-group">
              <label for="username">Usuário:</label>
              <input 
                id="username" 
                type="text" 
                formControlName="username"
                [class.invalid]="userForm.get('username')?.invalid && userForm.get('username')?.touched"
              >
              <div class="error-message" *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched">
                Usuário é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Telefone:</label>
              <input 
                id="phone" 
                type="text" 
                formControlName="phone"
                [class.invalid]="userForm.get('phone')?.invalid && userForm.get('phone')?.touched"
              >
            </div>

            <div class="form-group">
              <label for="level">Nível:</label>
              <select 
                id="level" 
                formControlName="level"
                [class.invalid]="userForm.get('level')?.invalid && userForm.get('level')?.touched"
              >
                <option value="">Selecione um nível</option>
                <option value="Administrador(a)">Administrador(a)</option>
                <option value="Professor(a)">Professor(a)</option>
                <option value="Secretário(a)">Secretário(a)</option>
              </select>
              <div class="error-message" *ngIf="userForm.get('level')?.invalid && userForm.get('level')?.touched">
                Nível é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="password">Senha:</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password"
                [class.invalid]="userForm.get('password')?.invalid && userForm.get('password')?.touched"
              >
              <div class="error-message" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                Senha é obrigatória
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirma a senha:</label>
              <input 
                id="confirmPassword" 
                type="password" 
                formControlName="confirmPassword"
                [class.invalid]="userForm.get('confirmPassword')?.invalid && userForm.get('confirmPassword')?.touched"
              >
              <div class="error-message" *ngIf="userForm.get('confirmPassword')?.invalid && userForm.get('confirmPassword')?.touched">
                Confirmação de senha é obrigatória
              </div>
              <div class="error-message" *ngIf="userForm.errors?.['passwordMismatch'] && userForm.get('confirmPassword')?.touched">
                As senhas não coincidem
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="back-button" routerLink="/usuarios">VOLTAR</button>
              <button type="submit" [disabled]="userForm.invalid || isSubmitting">SALVAR</button>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .user-form-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      background-color: #00a86b;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        color: white;
        margin: 0;
      }

      .header-buttons {
        display: flex;
        gap: 1rem;

        button {
          padding: 0.5rem 1rem;
          border: 1px solid white;
          background: transparent;
          color: white;
          cursor: pointer;

          &:hover {
            background: rgba(255,255,255,0.1);
          }
        }
      }
    }

    main {
      padding: 2rem;
      flex: 1;
    }

    .content-header {
      margin-bottom: 2rem;
      
      h2 {
        margin: 0;
      }
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input, select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #00a86b;
        }

        &.invalid {
          border-color: #ff4444;
        }
      }
    }

    .error-message {
      color: #ff4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        
        &.back-button {
          background-color: #f0f0f0;
          color: #333;
        }
        
        &[type="submit"] {
          background-color: #00a86b;
          color: white;

          &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        }

        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      }
    }
  `]
})
export class UserFormComponent {
  userForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      phone: [''],
      level: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { passwordMismatch: true };
  }

  onSubmit() {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const userData = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        username: this.userForm.value.username,
        phone: this.userForm.value.phone,
        user_level: this.userForm.value.level,
        password: this.userForm.value.password
      };

      this.userService.createUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Erro ao criar usuário:', error);
          this.errorMessage = error.message || 'Erro ao criar usuário. Tente novamente.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
