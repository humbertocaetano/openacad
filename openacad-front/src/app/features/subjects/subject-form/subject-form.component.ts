import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SubjectService } from '../../../core/services/subject.service';
import { ClassService } from '../../../core/services/class.service';
import { KnowledgeArea, Subject } from '../../../core/models/subject.interface';
import { SchoolYear } from '../../../core/models/class.interface';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="subject-form-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>{{ isEditMode ? 'Editar' : 'Nova' }} Disciplina</h2>
        </div>

        <div class="form-container" *ngIf="!loading">
          <form [formGroup]="subjectForm" (ngSubmit)="onSubmit()">
            <div class="tabs">
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'basic'"
                (click)="activeTab = 'basic'"
              >
                Informações Básicas
              </button>
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'content'"
                (click)="activeTab = 'content'"
              >
                Conteúdo
              </button>
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'bibliography'"
                (click)="activeTab = 'bibliography'"
              >
                Bibliografia
              </button>
            </div>

            <!-- Aba de Informações Básicas -->
            <div class="tab-content" *ngIf="activeTab === 'basic'">
              <div class="form-group">
                <label for="name">Nome da Disciplina:</label>
                <input 
                  id="name" 
                  type="text" 
                  formControlName="name"
                  [class.invalid]="subjectForm.get('name')?.invalid && subjectForm.get('name')?.touched"
                >
                <div class="error-message" *ngIf="subjectForm.get('name')?.invalid && subjectForm.get('name')?.touched">
                  Nome é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label for="year_id">Ano:</label>
                <select 
                  id="year_id" 
                  formControlName="year_id"
                  [class.invalid]="subjectForm.get('year_id')?.invalid && subjectForm.get('year_id')?.touched"
                >
                  <option value="">Selecione o ano</option>
                  <option *ngFor="let year of schoolYears" [value]="year.id">
                    {{year.name}}
                  </option>
                </select>
                <div class="error-message" *ngIf="subjectForm.get('year_id')?.invalid && subjectForm.get('year_id')?.touched">
                  Ano é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label for="knowledge_area_id">Área de Conhecimento:</label>
                <select 
                  id="knowledge_area_id" 
                  formControlName="knowledge_area_id"
                >
                  <option value="">Selecione a área</option>
                  <option *ngFor="let area of knowledgeAreas" [value]="area.id">
                    {{area.name}}
                  </option>
                </select>
              </div>

  <div class="form-group">
    <label for="hours_per_year">Carga Horária Anual:</label>
    <input 
      id="hours_per_year" 
      type="number" 
      formControlName="hours_per_year"
      min="0"
      [class.invalid]="subjectForm.get('hours_per_year')?.invalid && subjectForm.get('hours_per_year')?.touched"
    >
    <div class="error-message" *ngIf="subjectForm.get('hours_per_year')?.invalid && subjectForm.get('hours_per_year')?.touched">
      <span *ngIf="subjectForm.get('hours_per_year')?.errors?.['required']">Carga horária é obrigatória</span>
      <span *ngIf="subjectForm.get('hours_per_year')?.errors?.['min']">Carga horária deve ser maior que 0</span>
    </div>
  </div>

	      <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" formControlName="active">
                  Disciplina ativa
                </label>
              </div>
            </div>

            <!-- Aba de Conteúdo -->
            <div class="tab-content" *ngIf="activeTab === 'content'">
              <div class="form-group">
                <label for="objective">Objetivo da Disciplina:</label>
                <textarea 
                  id="objective" 
                  formControlName="objective"
                  rows="6"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="syllabus">Conteúdo Programático:</label>
                <textarea 
                  id="syllabus" 
                  formControlName="syllabus"
                  rows="10"
                ></textarea>
              </div>
            </div>

            <!-- Aba de Bibliografia -->
            <div class="tab-content" *ngIf="activeTab === 'bibliography'">
              <div class="form-group">
                <label for="basic_bibliography">Bibliografia Básica:</label>
                <textarea 
                  id="basic_bibliography" 
                  formControlName="basic_bibliography"
                  rows="6"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="complementary_bibliography">Bibliografia Complementar:</label>
                <textarea 
                  id="complementary_bibliography" 
                  formControlName="complementary_bibliography"
                  rows="6"
                ></textarea>
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="back-button" routerLink="/disciplinas">VOLTAR</button>
              <div class="right-buttons">
                <button 
                  type="button" 
                  class="tab-nav-button" 
                  *ngIf="activeTab !== 'basic'"
                  (click)="previousTab()"
                >
                  Anterior
                </button>
                <button 
                  type="button" 
                  class="tab-nav-button" 
                  *ngIf="activeTab !== 'bibliography'"
                  (click)="nextTab()"
                >
                  Próximo
                </button>
                <button 
                  type="submit" 
                  class="save-button" 
                  [disabled]="subjectForm.invalid || isSubmitting"
                >
                  {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando...
        </div>
      </main>
    </div>
  `,
  styles: [`
    .subject-form-container {
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
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #ddd;
      padding-bottom: 1rem;
    }

    .tab-button {
      padding: 0.5rem 1rem;
      border: none;
      background: none;
      color: #666;
      cursor: pointer;
      font-size: 1rem;
      border-bottom: 2px solid transparent;

      &.active {
        color: #00a86b;
        border-bottom-color: #00a86b;
      }

      &:hover:not(.active) {
        color: #333;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      input, select, textarea {
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

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .checkbox-group {
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="checkbox"] {
          width: auto;
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
      align-items: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;

      .right-buttons {
        display: flex;
        gap: 1rem;
      }

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        
        &.back-button {
          background-color: #f0f0f0;
          color: #333;
        }
        
        &.tab-nav-button {
          background-color: #e0e0e0;
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

    .loading-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  `]
})
export class SubjectFormComponent implements OnInit {

  subjectForm!: FormGroup;
  isSubmitting = false;
  loading = false;
  errorMessage = '';
  activeTab: 'basic' | 'content' | 'bibliography' = 'basic';
  isEditMode = false;
  schoolYears: SchoolYear[] = [];
  knowledgeAreas: KnowledgeArea[] = [];

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      year_id: ['', [Validators.required]],
      knowledge_area_id: [''],
      hours_per_year: ['', [Validators.required, Validators.min(0)]],
      objective: [''],
      syllabus: [''],
      basic_bibliography: [''],
      complementary_bibliography: [''],
      active: [true]
    });
  }

  ngOnInit() {
    this.loadSchoolYears();
    this.loadKnowledgeAreas();

    // Verifica se está em modo de edição
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadSubject(id);
    }
  }
      
  loadSchoolYears() {
    this.classService.getSchoolYears().subscribe({
      next: (years) => {
        this.schoolYears = years;
      },
      error: (error) => {
        console.error('Erro ao carregar anos:', error);
        this.errorMessage = 'Erro ao carregar anos escolares';
      }
    });
  }

  loadKnowledgeAreas() {
    this.subjectService.getKnowledgeAreas().subscribe({
      next: (areas) => {
        this.knowledgeAreas = areas;
      },
      error: (error) => {
        console.error('Erro ao carregar áreas de conhecimento:', error);
        this.errorMessage = 'Erro ao carregar áreas de conhecimento';
      }
    });
  }

  loadSubject(id: number) {
    this.loading = true;
    this.subjectService.getSubject(id).subscribe({
      next: (subject) => {
        this.subjectForm.patchValue(subject);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplina:', error);
        this.errorMessage = 'Erro ao carregar disciplina';
        this.loading = false;
      }
    });
  }

  nextTab() {
    if (this.activeTab === 'basic') this.activeTab = 'content';
    else if (this.activeTab === 'content') this.activeTab = 'bibliography';
  }

  previousTab() {
    if (this.activeTab === 'bibliography') this.activeTab = 'content';
    else if (this.activeTab === 'content') this.activeTab = 'basic';
  }

  onSubmit() {
    if (this.subjectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const formData = {
        ...this.subjectForm.value,
        year_id: Number(this.subjectForm.value.year_id),
        knowledge_area_id: this.subjectForm.value.knowledge_area_id ? 
          Number(this.subjectForm.value.knowledge_area_id) : null,
	hours_per_year: Number(this.subjectForm.value.hours_per_year)
      };
      console.log('Dados do formulário:', formData);
      const request = this.isEditMode ?
        this.subjectService.updateSubject(this.route.snapshot.params['id'], formData) :
        this.subjectService.createSubject(formData);

      request.subscribe({
        next: () => {
          console.log(`Disciplina ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso`);
          this.router.navigate(['/disciplinas']);
        },
        error: (error) => {
          console.error('Erro ao salvar disciplina:', error);
          if (error.status === 400 && error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} disciplina. Por favor, tente novamente.`;
          }
          this.isSubmitting = false;
        }
      });
    } else {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.subjectForm.controls).forEach(key => {
        const control = this.subjectForm.get(key);
        control?.markAsTouched();
      });

      // Se houver erros de validação, mostra mensagem e move para a primeira aba
      if (this.subjectForm.get('name')?.invalid || this.subjectForm.get('year_id')?.invalid) {
        this.activeTab = 'basic';
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      }
    }
  }

  // Método para verificar se pode navegar para outra aba
  canNavigateTab(): boolean {
  if (this.activeTab === 'basic') {
    const nameControl = this.subjectForm.get('name');
    const yearControl = this.subjectForm.get('year_id');
    
    // Verifica se os controles existem e são válidos
    return !!(nameControl?.valid && yearControl?.valid);
  }
  return true;
  }
}
