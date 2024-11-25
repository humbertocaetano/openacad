import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { ClassService } from '../../../core/services/class.service';
import { Class } from '../../../core/models/class.interface';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="student-form-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>{{ isEditMode ? 'Editar' : 'Novo' }} Aluno</h2>
        </div>

        <div class="form-container" *ngIf="!loading">
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
            <div class="tabs">
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'basic'"
                (click)="activeTab = 'basic'"
              >
                Dados Básicos
              </button>
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'guardian'"
                (click)="activeTab = 'guardian'"
              >
                Responsável
              </button>
              <button 
                type="button" 
                class="tab-button" 
                [class.active]="activeTab === 'additional'"
                (click)="activeTab = 'additional'"
              >
                Informações Adicionais
              </button>
            </div>

            <!-- Aba de Dados Básicos -->
            <div class="tab-content" *ngIf="activeTab === 'basic'">
              <div class="form-group">
                <label for="name">Nome do Aluno:</label>
                <input 
                  id="name" 
                  type="text" 
                  formControlName="name"
                  [class.invalid]="studentForm.get('name')?.invalid && studentForm.get('name')?.touched"
                >
                <div class="error-message" *ngIf="studentForm.get('name')?.invalid && studentForm.get('name')?.touched">
                  Nome é obrigatório
                </div>
              </div>

              <div class="form-group">
                <label for="email">E-mail:</label>
                <input 
                  id="email" 
                  type="email" 
                  formControlName="email"
                  [class.invalid]="studentForm.get('email')?.invalid && studentForm.get('email')?.touched"
                >
                <div class="error-message" *ngIf="studentForm.get('email')?.invalid && studentForm.get('email')?.touched">
                  <span *ngIf="studentForm.get('email')?.errors?.['required']">E-mail é obrigatório</span>
                  <span *ngIf="studentForm.get('email')?.errors?.['email']">E-mail inválido</span>
                </div>
              </div>

              <div class="form-group">
                <label for="registration">Matrícula:</label>
                <input 
                  id="registration" 
                  type="text" 
                  formControlName="registration"
                  [class.invalid]="studentForm.get('registration')?.invalid && studentForm.get('registration')?.touched"
                >
                <div class="error-message" *ngIf="studentForm.get('registration')?.invalid && studentForm.get('registration')?.touched">
                  Matrícula é obrigatória
                </div>
              </div>

              <div class="form-group">
                <label for="phone">Telefone do Aluno:</label>
                <input 
                  id="phone" 
                  type="text" 
                  formControlName="phone"
                >
              </div>

              <div class="form-group">
                <label for="class_id">Turma:</label>
                <select 
                  id="class_id" 
                  formControlName="class_id"
                  [class.invalid]="studentForm.get('class_id')?.invalid && studentForm.get('class_id')?.touched"
                >
                  <option value="">Selecione a turma</option>
                  <option *ngFor="let class of classes" [value]="class.id">
                    {{class.year_name}} {{class.division_name}}
                  </option>
                </select>
                <div class="error-message" *ngIf="studentForm.get('class_id')?.invalid && studentForm.get('class_id')?.touched">
                  Turma é obrigatória
                </div>
              </div>

              <div class="form-group">
                <label for="birth_date">Data de Nascimento:</label>
                <input 
                  id="birth_date" 
                  type="date" 
                  formControlName="birth_date"
                >
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" formControlName="active">
                  Aluno ativo
                </label>
              </div>
            </div>

            <!-- Aba do Responsável -->
            <div class="tab-content" *ngIf="activeTab === 'guardian'">
              <div class="form-group">
                <label for="guardian_name">Nome do Responsável:</label>
                <input 
                  id="guardian_name" 
                  type="text" 
                  formControlName="guardian_name"
                >
              </div>

              <div class="form-group">
                <label for="guardian_phone">Telefone do Responsável:</label>
                <input 
                  id="guardian_phone" 
                  type="text" 
                  formControlName="guardian_phone"
                >
              </div>

              <div class="form-group">
                <label for="guardian_email">E-mail do Responsável:</label>
                <input 
                  id="guardian_email" 
                  type="email" 
                  formControlName="guardian_email"
                  [class.invalid]="studentForm.get('guardian_email')?.invalid && studentForm.get('guardian_email')?.touched"
                >
                <div class="error-message" *ngIf="studentForm.get('guardian_email')?.errors?.['email'] && studentForm.get('guardian_email')?.touched">
                  E-mail inválido
                </div>
              </div>
            </div>

            <!-- Aba de Informações Adicionais -->
            <div class="tab-content" *ngIf="activeTab === 'additional'">
              <div class="form-group">
                <label for="address">Endereço:</label>
                <textarea 
                  id="address" 
                  formControlName="address"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="health_info">Informações de Saúde:</label>
                <textarea 
                  id="health_info" 
                  formControlName="health_info"
                  rows="4"
                  placeholder="Alergias, medicações, condições especiais..."
                ></textarea>
              </div>

              <div class="form-group">
                <label for="notes">Observações:</label>
                <textarea 
                  id="notes" 
                  formControlName="notes"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="back-button" routerLink="/alunos">VOLTAR</button>
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
                  *ngIf="activeTab !== 'additional'"
                  (click)="nextTab()"
                >
                  Próximo
                </button>
                <button 
                  type="submit" 
                  class="save-button" 
                  [disabled]="studentForm.invalid || isSubmitting"
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
    .student-form-container {
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

export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isSubmitting = false;
  loading = false;
  errorMessage = '';
  activeTab: 'basic' | 'guardian' | 'additional' = 'basic';
  isEditMode = false;
  classes: Class[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.studentForm = this.fb.group({
      // Dados básicos
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      registration: ['', [Validators.required]],
      phone: [''],
      class_id: ['', [Validators.required]],
      birth_date: [''],
      active: [true],

      // Dados do responsável
      guardian_name: [''],
      guardian_phone: [''],
      guardian_email: ['', [Validators.email]],

      // Informações adicionais
      address: [''],
      health_info: [''],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadClasses();

    // Verifica se está em modo de edição
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadStudent(id);
    }
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.errorMessage = 'Erro ao carregar turmas. Por favor, recarregue a página.';
      }
    });
  }

  loadStudent(id: number) {
    this.loading = true;
    this.studentService.getStudent(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          name: student.user_name,
          email: student.user_email,
          registration: student.registration,
          class_id: student.class_id,
          birth_date: student.birth_date,
          guardian_name: student.guardian_name,
          guardian_phone: student.guardian_phone,
          guardian_email: student.guardian_email,
          address: student.address,
          health_info: student.health_info,
          notes: student.notes,
          active: student.active
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar aluno:', error);
        this.errorMessage = 'Erro ao carregar aluno';
        this.loading = false;
      }
    });
  }

  nextTab() {
    if (this.activeTab === 'basic') {
      // Só avança se os campos obrigatórios estiverem preenchidos
      if (this.studentForm.get('name')?.valid &&
          this.studentForm.get('email')?.valid &&
          this.studentForm.get('registration')?.valid &&
          this.studentForm.get('class_id')?.valid) {
        this.activeTab = 'guardian';
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
        return;
      }
    } else if (this.activeTab === 'guardian') {
      // Verifica se o e-mail do responsável é válido, se foi preenchido
      if (this.studentForm.get('guardian_email')?.valid) {
        this.activeTab = 'additional';
      } else {
        this.errorMessage = 'Por favor, verifique o e-mail do responsável';
        return;
      }
    }
    this.errorMessage = ''; // Limpa mensagens de erro ao mudar de aba
  }

  previousTab() {
    if (this.activeTab === 'additional') {
      this.activeTab = 'guardian';
    } else if (this.activeTab === 'guardian') {
      this.activeTab = 'basic';
    }
    this.errorMessage = ''; // Limpa mensagens de erro ao mudar de aba
  }

  onSubmit() {
    if (this.studentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Verifica primeiro se a matrícula já existe
      this.studentService.checkRegistration(this.studentForm.value.registration)
        .subscribe({
          next: (response) => {
            if (response.exists && !this.isEditMode) {
              this.errorMessage = 'Esta matrícula já está em uso';
              this.isSubmitting = false;
              this.activeTab = 'basic'; // Volta para a primeira aba
              return;
            }
            this.saveStudent();
          },
          error: (error) => {
            console.error('Erro ao verificar matrícula:', error);
            this.errorMessage = 'Erro ao verificar matrícula';
            this.isSubmitting = false;
          }
        });
    } else {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.studentForm.controls).forEach(key => {
        const control = this.studentForm.get(key);
        control?.markAsTouched();
      });

      // Se houver erros de validação, mostra mensagem e move para a primeira aba
      if (this.studentForm.get('name')?.invalid ||
          this.studentForm.get('email')?.invalid ||
          this.studentForm.get('registration')?.invalid ||
          this.studentForm.get('class_id')?.invalid) {
        this.activeTab = 'basic';
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios';
      }
    }
  }

  private saveStudent() {
    const studentData = this.studentForm.value;

    const request = this.isEditMode ?
      this.studentService.updateStudent(this.route.snapshot.params['id'], studentData) :
      this.studentService.createStudent(studentData);

    request.subscribe({
      next: () => {
        console.log(`Aluno ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`);
        this.router.navigate(['/alunos']);
      },
      error: (error) => {
        console.error('Erro ao salvar aluno:', error);
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} aluno. Por favor, tente novamente.`;
        }
        this.isSubmitting = false;
      }
    });
  }
}
