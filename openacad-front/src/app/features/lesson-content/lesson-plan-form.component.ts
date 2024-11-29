import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from '../../core/services/teacher.service';
import { TeacherSubjectService } from '../../core/services/teacher-subject.service';
import { LessonContentService } from '../../core/services/lesson-content.service';

@Component({
  selector: 'app-lesson-plan-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button (click)="navigateTo('')">INÍCIO</button>
          <button (click)="logout()">SAIR</button>
        </div>
      </header>

      <main class="main-content">
        <div class="content-header">
          <h2>{{ isEditing ? 'Editar' : 'Novo' }} Plano de Aula</h2>
          <div class="action-buttons">
            <button class="back-button" (click)="navigateTo('/plano-aula')">VOLTAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="form-container" *ngIf="!loading">
          <form [formGroup]="lessonForm" (ngSubmit)="onSubmit()">
            <!-- Seleção do Professor -->
            <div class="form-group">
              <label>Professor:</label>
              <select 
                formControlName="teacher_id" 
                (change)="onTeacherChange()"
                [attr.disabled]="isEditing">
                <option value="">Selecione um professor</option>
                <option *ngFor="let teacher of teachers" [value]="teacher.id">
                  {{teacher.user_name}}
                </option>
              </select>
            </div>

            <!-- Seleção da Disciplina/Turma -->
            <div class="form-group" *ngIf="teacherSubjects.length > 0">
              <label>Disciplina/Turma:</label>
              <select 
                formControlName="teacher_subject_id"
                [attr.disabled]="isEditing">
                <option value="">Selecione uma disciplina</option>
                <option *ngFor="let subject of teacherSubjects" [value]="subject.id">
                  {{subject.subject_name}} - {{subject.class_year_name}} {{subject.class_division_name}}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Data da Aula:</label>
              <input type="date" formControlName="date">
            </div>

            <div class="form-group">
              <label>Objetivo da Aula:</label>
              <textarea rows="2" formControlName="objective"></textarea>
            </div>

            <div class="form-group">
              <label>Conteúdo Programático:</label>
              <textarea rows="4" formControlName="content"></textarea>
            </div>

            <div class="form-group">
              <label>Recursos Necessários:</label>
              <textarea rows="2" formControlName="resources"></textarea>
            </div>

            <div class="form-group">
              <label>Método de Avaliação:</label>
              <textarea rows="2" formControlName="evaluation_method"></textarea>
            </div>

            <div class="form-group">
              <label>Observações:</label>
              <textarea rows="2" formControlName="observations"></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="!lessonForm.valid || saving">
                {{ saving ? 'SALVANDO...' : 'SALVAR' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
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

    .main-content {
      flex: 1;
      padding: 2rem;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
      }
    }

    .action-buttons {
      display: flex;
      gap: 1rem;

      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        
        &.back-button {
          background-color: #f0f0f0;
          color: #333;
        }

        &:hover {
          opacity: 0.9;
        }
      }
    }

    .form-container {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);

      .subject-selector {
        margin-bottom: 2rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      }

      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;

          &:focus {
            outline: none;
            border-color: #00a86b;
          }
        }
      }

      .form-actions {
        margin-top: 2rem;
        text-align: right;

        button {
          padding: 0.75rem 1.5rem;
          background-color: #00a86b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;

          &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        }
      }
    }

    .lessons-list {
      margin-top: 3rem;

      h3 {
        margin-bottom: 1rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          font-weight: 500;
          background-color: #f8f8f8;
        }
      }

      .edit-button, .delete-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        margin: 0 0.25rem;
      }

      .edit-button {
        color: #00a86b;
      }

      .delete-button {
        color: #ff4444;
      }
    }

    .loading-message {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      color: #ff4444;
      background-color: #fff5f5;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class LessonPlanFormComponent implements OnInit {
  loading = false;
  saving = false;
  error: string | null = null;
  isEditing = false;
  lessonId: number | null = null;
  
  teachers: any[] = [];
  teacherSubjects: any[] = [];
  
  lessonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private teacherSubjectService: TeacherSubjectService,
    private lessonContentService: LessonContentService
  ) {
    this.lessonForm = this.fb.group({
      teacher_id: ['', Validators.required],
      teacher_subject_id: ['', Validators.required],
      date: ['', Validators.required],
      objective: ['', Validators.required],
      content: ['', Validators.required],
      resources: ['', Validators.required],
      evaluation_method: ['', Validators.required],
      observations: ['']
    });
  }

  ngOnInit() {
    this.loadTeachers();
    
    // Verificar se está em modo de edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.lessonId = +id;
      this.loadLesson(this.lessonId);
    }
  }

  loadTeachers() {
    this.loading = true;
    this.teacherService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar professores:', error);
        this.error = 'Erro ao carregar professores. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  onTeacherChange() {
    const teacherId = this.lessonForm.get('teacher_id')?.value;
    if (teacherId) {
      this.loadTeacherSubjects(teacherId);
    } else {
      this.teacherSubjects = [];
      this.lessonForm.patchValue({ teacher_subject_id: '' });
    }
  }

  loadTeacherSubjects(teacherId: number) {
    this.loading = true;
    this.teacherSubjectService.getTeacherSubjects(teacherId).subscribe({
      next: (subjects) => {
        this.teacherSubjects = subjects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplinas:', error);
        this.error = 'Erro ao carregar disciplinas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  loadLesson(id: number) {
    this.loading = true;
    this.lessonContentService.getLesson(id).subscribe({
      next: (lesson) => {
        // Carregar os subjects do professor antes de setar o form
        this.loadTeacherSubjects(lesson.teacher_id);
        
        this.lessonForm.patchValue({
          teacher_id: lesson.teacher_id,
          teacher_subject_id: lesson.teacher_subject_id,
          date: lesson.date,
          objective: lesson.objective,
          content: lesson.content,
          resources: lesson.resources,
          evaluation_method: lesson.evaluation_method,
          observations: lesson.observations
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar plano de aula:', error);
        this.error = 'Erro ao carregar plano de aula. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.lessonForm.valid) {
      this.saving = true;
      const lessonData = this.lessonForm.value;

      const request = this.isEditing
        ? this.lessonContentService.updateLesson(this.lessonId!, lessonData)
        : this.lessonContentService.createLesson(lessonData);

      request.subscribe({
        next: () => {
          this.saving = false;
          this.navigateTo('/plano-aula');
        },
        error: (error) => {
          console.error('Erro ao salvar plano de aula:', error);
          this.error = 'Erro ao salvar plano de aula. Por favor, tente novamente.';
          this.saving = false;
        }
      });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}