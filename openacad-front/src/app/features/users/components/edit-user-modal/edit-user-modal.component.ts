import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../core/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Editar Usuário</h3>
          <button class="close-button" (click)="onClose()">×</button>
        </div>

        <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nome:</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name"
              [class.invalid]="editForm.get('name')?.invalid && editForm.get('name')?.touched"
            >
            <div class="error-message" *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched">
              Nome é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="email">E-mail:</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              [class.invalid]="editForm.get('email')?.invalid && editForm.get('email')?.touched"
            >
            <div class="error-message" *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched">
              <span *ngIf="editForm.get('email')?.errors?.['required']">E-mail é obrigatório</span>
              <span *ngIf="editForm.get('email')?.errors?.['email']">E-mail inválido</span>
            </div>
          </div>

          <div class="form-group">
            <label for="username">Usuário:</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username"
              [class.invalid]="editForm.get('username')?.invalid && editForm.get('username')?.touched"
            >
            <div class="error-message" *ngIf="editForm.get('username')?.invalid && editForm.get('username')?.touched">
              Usuário é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Telefone:</label>
            <input 
              id="phone" 
              type="text" 
              formControlName="phone"
            >
          </div>

          <div class="form-group">
            <label for="user_level">Nível:</label>
            <select 
              id="user_level" 
              formControlName="user_level"
              [class.invalid]="editForm.get('user_level')?.invalid && editForm.get('user_level')?.touched"
            >
              <option value="">Selecione um nível</option>
              <option value="Administrador(a)">Administrador(a)</option>
              <option value="Professor(a)">Professor(a)</option>
              <option value="Secretário(a)">Secretário(a)</option>
            </select>
            <div class="error-message" *ngIf="editForm.get('user_level')?.invalid && editForm.get('user_level')?.touched">
              Nível é obrigatório
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" formControlName="changePassword"> Alterar senha
            </label>
          </div>

          <ng-container *ngIf="editForm.get('changePassword')?.value">
            <div class="form-group">
              <label for="password">Nova Senha:</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password"
                [class.invalid]="editForm.get('password')?.invalid && editForm.get('password')?.touched"
              >
              <div class="error-message" *ngIf="editForm.get('password')?.invalid && editForm.get('password')?.touched">
                <span *ngIf="editForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
                <span *ngIf="editForm.get('password')?.errors?.['minlength']">Senha deve ter no mínimo 6 caracteres</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar Senha:</label>
              <input 
                id="confirmPassword" 
                type="password" 
                formControlName="confirmPassword"
                [class.invalid]="editForm.get('confirmPassword')?.invalid && editForm.get('confirmPassword')?.touched"
              >
              <div class="error-message" *ngIf="editForm.get('confirmPassword')?.invalid && editForm.get('confirmPassword')?.touched">
                Confirmação de senha é obrigatória
              </div>
              <div class="error-message" *ngIf="editForm.errors?.['passwordMismatch'] && editForm.get('confirmPassword')?.touched">
                As senhas não coincidem
              </div>
            </div>
          </ng-container>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="button-group">
            <button type="button" class="cancel-button" (click)="onClose()">Cancelar</button>
            <button type="submit" class="save-button" [disabled]="editForm.invalid || isSubmitting">
              {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h3 {
        margin: 0;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        color: #666;

        &:hover {
          color: #333;
        }
      }
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

      input[type="checkbox"] {
        width: auto;
        margin-right: 0.5rem;
      }
    }

    .error-message {
      color: #ff4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;

        &.cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        &.save-button {
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
export class EditUserModalComponent implements OnInit {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      phone: [''],
      user_level: ['', [Validators.required]],
      changePassword: [false],
      password: [''],
      confirmPassword: ['']
    });

    // Adicionar validadores condicionais para senha
    this.editForm.get('changePassword')?.valueChanges.subscribe(changePassword => {
      const passwordControl = this.editForm.get('password');
      const confirmPasswordControl = this.editForm.get('confirmPassword');
      
      if (changePassword) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        passwordControl?.clearValidators();
        confirmPasswordControl?.clearValidators();
      }
      
      passwordControl?.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    if (this.user) {
      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        username: this.user.username,
        phone: this.user.phone,
        user_level: this.user.user_level
      });
    }
  }

  onSubmit() {
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const userData = {
        ...this.editForm.value,
        id: this.user.id
      };

      // Se não estiver alterando a senha, remove os campos relacionados
      if (!userData.changePassword) {
        delete userData.password;
        delete userData.confirmPassword;
        delete userData.changePassword;
      }

      this.save.emit(userData);
    }
  }

  onClose() {
    this.close.emit();
  }
}
