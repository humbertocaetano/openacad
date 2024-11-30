import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeacherAllocationService } from '../../core/services/teacher-allocation.service';
import { LessonContentService } from '../../core/services/lesson-content.service';

@Component({
  selector: 'app-attendance-list',
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
          <h2>Frequência</h2>
          <div class="action-buttons">
            <button class="back-button" (click)="navigateTo('/dashboard')">VOLTAR</button>
          </div>
        </div>

        <div class="filter-section">
          <label>Professor:</label>
          <select [(ngModel)]="selectedTeacherId" (change)="onTeacherChange()">
            <option value="">Selecione um professor</option>
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

        <div class="table-container" *ngIf="!loading && !error && classes.length > 0">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Disciplina</th>
                <th>Turma</th>
                <th>Conteúdo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let class of classes">
                <td>{{class.date | date:'dd/MM/yyyy'}}</td>
                <td>{{class.subject_name}}</td>
                <td>{{class.class_year_name}} {{class.class_division_name}}</td>
                <td>{{class.content}}</td>
                <td>
                  <span [class.status-pending]="!class.has_attendance" 
                        [class.status-done]="class.has_attendance">
                    {{class.has_attendance ? 'Realizada' : 'Pendente'}}
                  </span>
                </td>
                <td>
                  <button class="action-button" 
                          [routerLink]="['/frequencia/realizar', class.id]"
                          [class.edit-button]="class.has_attendance"
                          [class.new-button]="!class.has_attendance">
                    {{class.has_attendance ? 'Editar' : 'Realizar'}}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="!loading && !error && classes.length === 0">
          <p>Nenhuma aula encontrada para este professor.</p>
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
    }    .status-pending {
      background-color: #fff3cd;
      color: #856404;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .status-done {
      background-color: #d4edda;
      color: #155724;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
    }

    .action-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &.edit-button {
        background-color: #17a2b8;
        color: white;
      }
      
      &.new-button {
        background-color: #28a745;
        color: white;
      }

      &:hover {
        opacity: 0.9;
      }
    }
  `]
})
export class AttendanceListComponent implements OnInit {
  loading = false;
  error: string | null = null;
  teachers: any[] = [];
  selectedTeacherId: number | null = null;
  classes: any[] = [];

  constructor(
    private router: Router,
    private teacherAllocationService: TeacherAllocationService,
    private lessonContentService: LessonContentService
  ) {}

  ngOnInit() {
    this.loadTeachers();
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

  onTeacherChange() {
    if (this.selectedTeacherId !== null) {
        this.loadClasses();
      } else {
        this.classes = [];
      }
  }

  loadClasses() {
    if (!this.selectedTeacherId) return;

    this.loading = true;
    this.lessonContentService.getLessonsByTeacher(this.selectedTeacherId).subscribe({
      next: (classes) => {
        this.classes = classes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar aulas:', error);
        this.error = 'Erro ao carregar aulas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}