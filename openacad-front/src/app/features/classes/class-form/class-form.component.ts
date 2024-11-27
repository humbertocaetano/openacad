import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClassService } from '../../../core/services/class.service';
import { SchoolYear, ClassDivision } from '../../../core/models/class.interface';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="class-form-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Cadastro de Turma</h2>
        </div>

        <div class="form-container">
          <form [formGroup]="classForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="year_id">Ano:</label>
              <select 
                id="year_id" 
                formControlName="year_id"
                [class.invalid]="classForm.get('year_id')?.invalid && classForm.get('year_id')?.touched"
              >
                <option value="">Selecione o ano</option>
                <option *ngFor="let year of schoolYears" [value]="year.id">
                  {{year.name}}
                </option>
              </select>
              <div class="error-message" *ngIf="classForm.get('year_id')?.invalid && classForm.get('year_id')?.touched">
                Ano é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="division_id">Turma:</label>
              <select 
                id="division_id" 
                formControlName="division_id"
                [class.invalid]="classForm.get('division_id')?.invalid && classForm.get('division_id')?.touched"
              >
                <option value="">Selecione a turma</option>
                <option *ngFor="let division of classDivisions" [value]="division.id">
                  {{division.name}}
                </option>
              </select>
              <div class="error-message" *ngIf="classForm.get('division_id')?.invalid && classForm.get('division_id')?.touched">
                Turma é obrigatória
              </div>
            </div>

            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" formControlName="active">
                Turma ativa
              </label>
            </div>

            <div class="form-actions">
              <button type="button" class="back-button" routerLink="/turmas">VOLTAR</button>
              <button type="submit" [disabled]="classForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Salvando...' : 'SALVAR' }}
              </button>
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
    .class-form-container {
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

      select {
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

    .checkbox-group {
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
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
export class ClassFormComponent implements OnInit {
  classForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  schoolYears: SchoolYear[] = [];
  classDivisions: ClassDivision[] = [];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private router: Router
  ) {
    this.classForm = this.fb.group({
      year_id: ['', [Validators.required]],
      division_id: ['', [Validators.required]],
      active: [true]
    });
  }

  ngOnInit() {
    this.loadSchoolYears();
    this.loadClassDivisions();
  }

  loadSchoolYears() {
    this.classService.getSchoolYears().subscribe({
      next: (years) => {
        this.schoolYears = years;
        console.log('Anos escolares carregados:', years);
      },
      error: (error) => {
        console.error('Erro ao carregar anos escolares:', error);
        this.errorMessage = 'Erro ao carregar anos escolares. Por favor, recarregue a página.';
      }
    });
  }

  loadClassDivisions() {
    this.classService.getClassDivisions().subscribe({
      next: (divisions) => {
        this.classDivisions = divisions;
        console.log('Divisões carregadas:', divisions);
      },
      error: (error) => {
        console.error('Erro ao carregar divisões:', error);
        this.errorMessage = 'Erro ao carregar divisões. Por favor, recarregue a página.';
      }
    });
  }

  onSubmit() {
    if (this.classForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const classData = {
        year_id: Number(this.classForm.value.year_id),
        division_id: Number(this.classForm.value.division_id),
        active: this.classForm.value.active
      };

      console.log('Dados a serem enviados:', classData);

      this.classService.createClass(classData).subscribe({
        next: () => {
          console.log('Turma criada com sucesso');
          this.router.navigate(['/turmas']);
        },
        error: (error) => {
          console.error('Erro ao criar turma:', error);
          if (error.status === 400 && error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erro ao criar turma. Por favor, tente novamente.';
          }
          this.isSubmitting = false;
        }
      });
    } else {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.classForm.controls).forEach(key => {
        const control = this.classForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}    
