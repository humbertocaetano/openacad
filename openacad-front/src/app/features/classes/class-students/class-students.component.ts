import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ClassService } from '../../../core/services/class.service';
import { StudentService } from '../../../core/services/student.service';
import { Class } from '../../../core/models/class.interface';
import { Student } from '../../../core/models/student.interface';

@Component({
  selector: 'app-class-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="class-students-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Alunos da Turma: {{classInfo?.year_name}} {{classInfo?.division_name}}</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/turmas">VOLTAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          {{loadingMessage}}
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Status</th>
                <th>Responsável</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of students">
                <td>{{student.registration}}</td>
                <td>{{student.user_name}}</td>
                <td>
                  <span class="status-badge" [class.active]="student.active">
                    {{student.active ? 'Ativo' : 'Inativo'}}
                  </span>
                </td>
                <td>{{student.guardian_name || '-'}}</td>
                <td>{{student.guardian_phone || '-'}}</td>
              </tr>
              <tr *ngIf="students.length === 0">
                <td colspan="5" class="empty-message">
                  Nenhum aluno encontrado nesta turma
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .class-students-container {
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

          &:hover {
            opacity: 0.9;
          }
        }
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

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      
      &.active {
        background-color: #e6f4ea;
        color: #1e7e34;
      }
      
      &:not(.active) {
        background-color: #feeced;
        color: #dc3545;
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
export class ClassStudentsComponent implements OnInit {
  classId: number = 0;
  classInfo: Class | null = null;
  students: Student[] = [];
  loading = false;
  loadingMessage = '';
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.classId = +params['id'];
      this.loadClassDetails();
      this.loadStudents();
    });
  }

  loadClassDetails() {
    this.classService.getClass(this.classId).subscribe({
      next: (classInfo) => {
        this.classInfo = classInfo;
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes da turma:', error);
        this.error = 'Erro ao carregar detalhes da turma. Por favor, tente novamente.';
      }
    });
  }

  loadStudents() {
    this.loading = true;
    this.loadingMessage = 'Carregando alunos...';
    this.error = null;

    this.studentService.getStudentsByClass(this.classId).subscribe({
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
}
