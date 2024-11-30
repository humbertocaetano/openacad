import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LessonContentService } from '../../core/services/lesson-content.service';
import { AttendanceService } from '../../core/services/attendance.service'; 

@Component({
  selector: 'app-attendance-form',
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
          <h2>Registro de Frequência</h2>
          <div class="action-buttons">
            <button class="back-button" (click)="navigateTo('/frequencia')">VOLTAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="content-container" *ngIf="!loading && lesson">
          <div class="lesson-info">
            <div class="info-row">
              <strong>Data:</strong> {{lesson.date | date:'dd/MM/yyyy'}}
            </div>
            <div class="info-row">
              <strong>Disciplina:</strong> {{lesson.subject_name}}
            </div>
            <div class="info-row">
              <strong>Turma:</strong> {{lesson.class_year_name}} {{lesson.class_division_name}}
            </div>
            <div class="info-row">
              <strong>Conteúdo:</strong> {{lesson.content}}
            </div>
          </div>

          <div class="attendance-container" *ngIf="students.length > 0">
            <h3>Lista de Presença</h3>
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nome</th>
                  <th>Presença</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of students">
                  <td>{{student.registration}}</td>
                  <td>{{student.name}}</td>
                  <td>
                    <div class="attendance-toggle">
                      <label class="toggle">
                        <input 
                          type="checkbox" 
                          [(ngModel)]="student.present"
                          (change)="onAttendanceChange(student)">
                        <span class="slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="form-actions">
              <button 
                class="save-button" 
                (click)="saveAttendance()"
                [disabled]="saving">
                {{saving ? 'Salvando...' : 'Salvar'}}
              </button>
            </div>
          </div>

          <div class="empty-state" *ngIf="students.length === 0">
            <p>Nenhum aluno encontrado para esta turma.</p>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .content-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .lesson-info {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;

      .info-row {
        margin-bottom: 0.5rem;

        strong {
          color: #333;
          margin-right: 0.5rem;
        }
      }
    }

    .attendance-container {
      h3 {
        margin-bottom: 1rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;

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
    }

    .attendance-toggle {
      display: flex;
      justify-content: center;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: #00a86b;
        }

        &:checked + .slider:before {
          transform: translateX(26px);
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;

        &:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
      }
    }

    .form-actions {
      margin-top: 2rem;
      text-align: right;

      .save-button {
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
  `]
})
export class AttendanceFormComponent implements OnInit {
  loading = false;
  saving = false;
  error: string | null = null;
  lesson: any = null;
  students: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private lessonContentService: LessonContentService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (lessonId) {
      this.loadLesson(+lessonId);
    }
  }

  loadLesson(lessonId: number) {
    this.loading = true;
    this.lessonContentService.getLesson(lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson;
        this.loadStudents(lesson.teacher_subject_id);
      },
      error: (error) => {
        console.error('Erro ao carregar aula:', error);
        this.error = 'Erro ao carregar aula. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  loadStudents(teacherSubjectId: number) {
    const lessonId = this.lesson.id;
    this.attendanceService.getStudentsByLesson(lessonId).subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar alunos:', error);
        this.error = 'Erro ao carregar alunos. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }
  
  saveAttendance() {
    this.saving = true;
    const attendanceData = {
      lessonId: this.lesson.id,
      attendances: this.students.map(student => ({
        studentId: student.id,
        present: student.present
      }))
    };
  
    this.attendanceService.saveAttendance(attendanceData).subscribe({
      next: () => {
        this.saving = false;
        this.navigateTo('/frequencia');
      },
      error: (error) => {
        console.error('Erro ao salvar frequência:', error);
        this.error = 'Erro ao salvar frequência. Por favor, tente novamente.';
        this.saving = false;
      }
    });
  }

  onAttendanceChange(student: any) {
    console.log('Alteração de presença:', student);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}