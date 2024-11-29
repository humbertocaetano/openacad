import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherSubjectService } from '../../core/services/teacher-subject.service';
import { LessonContentService } from '../../core/services/lesson-content.service';
import { LessonContent, CreateLessonContentDTO, TeacherSubject } from '../../core/models/teacher-subject.interface';
import { AuthService } from '../../core/services/auth.service';

interface TeacherSubjectView {
  id: number;
  subject_name: string;
  class_year_name: string;
  class_division_name: string;
  year: number;
  subject_id: number;
  }

  @Component({
    selector: 'app-lesson-plan',
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
            <h2>Plano de Aula</h2>
            <div class="action-buttons">
              <button class="back-button" (click)="navigateTo('/dashboard')">VOLTAR</button>
            </div>
          </div>
  
          <div class="loading-message" *ngIf="loading">
            Carregando...
          </div>
  
          <div class="error-message" *ngIf="error">
            {{ error }}
          </div>
  
          <div class="form-container" *ngIf="!loading">
            <div class="subject-selector">
              <label>Disciplina/Turma:</label>
              <select [(ngModel)]="selectedSubjectId" (change)="onSubjectChange()">
                <option value="">Selecione uma disciplina</option>
                <option *ngFor="let subject of teacherSubjects" [value]="subject.id">
                  {{subject.subject_name}} - {{subject.class_year_name}} {{subject.class_division_name}}
                </option>
              </select>
            </div>
  
            <form [formGroup]="lessonForm" *ngIf="selectedSubjectId" (ngSubmit)="onSubmit()">
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
                <button type="submit" [disabled]="!lessonForm.valid">SALVAR</button>
              </div>
            </form>
  
            <div class="lessons-list" *ngIf="selectedSubjectId && lessons.length > 0">
              <h3>Aulas Cadastradas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Objetivo</th>
                    <th>Conteúdo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let lesson of lessons">
                    <td>{{lesson.date | date:'dd/MM/yyyy'}}</td>
                    <td>{{lesson.objective}}</td>
                    <td>{{lesson.content}}</td>
                    <td>
                      <button class="edit-button" (click)="editLesson(lesson)">✎</button>
                      <button class="delete-button" (click)="deleteLesson(lesson)">✕</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
export class LessonPlanComponent implements OnInit {
    loading = false;
    error: string | null = null;
    teacherSubjects: TeacherSubjectView[] = [];
    selectedSubjectId: number | null = null;
    lessons: LessonContent[] = [];
    lessonForm: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService,      
      private teacherSubjectService: TeacherSubjectService,
      private lessonContentService: LessonContentService
    ) {
      this.lessonForm = this.fb.group({
        date: ['', Validators.required],
        objective: ['', Validators.required],
        content: ['', Validators.required],
        resources: ['', Validators.required],
        evaluation_method: ['', Validators.required],
        observations: ['']
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  ngOnInit() {
    this.loadTeacherSubjects();
  }

  loadTeacherSubjects() {
    console.log('Iniciando carregamento de disciplinas');
    this.loading = true;
    this.teacherSubjectService.getTeacherSubjects().subscribe({
      next: (subjects) => {
        console.log('Dados recebidos do backend:', subjects);
        this.teacherSubjects = subjects;
        console.log('Disciplinas carregadas:', this.teacherSubjects);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplinas:', error);
        this.error = 'Erro ao carregar disciplinas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }
  
  onSubjectChange() {
    if (this.selectedSubjectId) {
      this.loadLessons();
    }
  }

  loadLessons() {
    if (!this.selectedSubjectId) return;

    this.loading = true;
    this.lessonContentService.getLessonsBySubject(this.selectedSubjectId).subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar aulas:', error);
        this.error = 'Erro ao carregar aulas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.lessonForm.valid && this.selectedSubjectId) {
      const lessonData = {
        ...this.lessonForm.value,
        teacher_subject_id: this.selectedSubjectId
      };

      this.loading = true;
      this.lessonContentService.createLesson(lessonData).subscribe({
        next: () => {
          this.loadLessons();
          this.lessonForm.reset();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao salvar aula:', error);
          this.error = 'Erro ao salvar aula. Por favor, tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  editLesson(lesson: LessonContent) {
    this.lessonForm.patchValue({
      date: lesson.date,
      objective: lesson.objective,
      content: lesson.content,
      resources: lesson.resources,
      evaluation_method: lesson.evaluation_method,
      observations: lesson.observations
    });
  }

  deleteLesson(lesson: LessonContent) {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      this.lessonContentService.deleteLesson(lesson.id!).subscribe({
        next: () => {
          this.loadLessons();
        },
        error: (error) => {
          console.error('Erro ao excluir aula:', error);
          this.error = 'Erro ao excluir aula. Por favor, tente novamente.';
        }
      });
    }
  }
}