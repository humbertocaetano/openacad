import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LessonContentService } from '../../core/services/lesson-content.service';
import { TeacherService } from '../../core/services/teacher.service';
import { TeacherAllocationService } from '../../core/services/teacher-allocation.service';

@Component({
  selector: 'app-lesson-plan-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
          <h2>Planos de Aula</h2>
          <div class="action-buttons">
            <button class="back-button" (click)="navigateTo('/dashboard')">VOLTAR</button>
            <button class="new-button" (click)="navigateTo('/plano-aula/novo')">CADASTRAR</button>
          </div>
        </div>

        <div class="filter-section">
          <label>Filtrar por Professor:</label>
          <select [(ngModel)]="selectedTeacherId" (change)="onTeacherChange()">
            <option value="">Todos os Professores</option>
            <option *ngFor="let teacher of teachers" [value]="teacher.id">
              {{teacher.user_name}}
            </option>
          </select>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Professor</th>
                <th>Disciplina</th>
                <th>Turma</th>
                <th>Data</th>
                <th>Conteúdo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let lesson of lessonPlans">
                <td>{{lesson.teacher_name}}</td>
                <td>{{lesson.subject_name}}</td>
                <td>{{lesson.class_year_name}} {{lesson.class_division_name}}</td>
                <td>{{lesson.date | date:'dd/MM/yyyy'}}</td>
                <td>{{lesson.content}}</td>
                <td>
                  <button class="edit-button" (click)="navigateTo('/plano-aula/editar/' + lesson.id)">✎</button>
                  <button class="delete-button" (click)="deleteLesson(lesson)">✕</button>
                </td>
              </tr>
              <tr *ngIf="lessonPlans.length === 0">
                <td colspan="6" class="empty-message">
                  Nenhum plano de aula encontrado
                </td>
              </tr>
            </tbody>
          </table>
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
          
          &.new-button {
            background-color: #00a86b;
            color: white;
          }
  
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  
    .filter-section {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
      label {
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 0.5rem;
      }
  
      select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 100%;
        max-width: 300px;
      }
    }
  
    .table-container {
      width: 100%;
      overflow-x: auto;
  
      table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
  
        th {
          font-weight: 500;
          color: #333;
          background-color: #f8f8f8;
        }
  
        .empty-message {
          text-align: center;
          color: #666;
        }
      }
    }
  
    .edit-button, .delete-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
  
      .icon {
        font-size: 1.2rem;
      }
    }
  
    .edit-button {
      color: #00a86b;
      &:hover {
        background-color: rgba(0,168,107,0.1);
      }
    }
  
    .delete-button {
      color: #ff4444;
      &:hover {
        background-color: rgba(255,68,68,0.1);
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
export class LessonPlanListComponent implements OnInit {
  loading = false;
  error: string | null = null;
  teachers: any[] = [];
  selectedTeacherId: number | null = null;
  lessonPlans: any[] = [];

  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private teacherAllocationService: TeacherAllocationService,
    private lessonContentService: LessonContentService
  ) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadLessonPlans();
  }

  loadTeachers() {
    console.log('Iniciando carregamento de professores com alocações');
    this.loading = true;
    
    this.teacherAllocationService.getAllocations(new Date().getFullYear()).subscribe({
      next: (allocations) => {
        // Usando Map para garantir professores únicos
        const teacherMap = new Map();
        
        allocations.forEach(allocation => {
          if (allocation.teacher) {
            teacherMap.set(allocation.teacher.id, {
              id: allocation.teacher.id,
              user_name: allocation.teacher.name
            });
          }
        });
        
        // Convertendo o Map para array
        this.teachers = Array.from(teacherMap.values());
        
        // Ordenando por nome
        this.teachers.sort((a, b) => a.user_name.localeCompare(b.user_name));
        
        console.log('Professores com alocações:', this.teachers);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar professores:', error);
        this.error = 'Erro ao carregar professores. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }


  loadLessonPlans() {
    this.loading = true;
    const teacherId = this.selectedTeacherId ?? undefined;
    this.lessonContentService.getLessons(teacherId).subscribe({
      next: (lessons) => {
        this.lessonPlans = lessons;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar planos de aula:', error);
        this.error = 'Erro ao carregar planos de aula. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  onTeacherChange() {
    this.loadLessonPlans();
  }

  deleteLesson(lesson: any) {
    if (confirm('Tem certeza que deseja excluir este plano de aula?')) {
      this.lessonContentService.deleteLesson(lesson.id).subscribe({
        next: () => {
          this.loadLessonPlans();
        },
        error: (error) => {
          console.error('Erro ao excluir plano de aula:', error);
          this.error = 'Erro ao excluir plano de aula. Por favor, tente novamente.';
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