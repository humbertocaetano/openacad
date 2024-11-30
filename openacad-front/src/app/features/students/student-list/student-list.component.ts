import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { ClassService } from '../../../core/services/class.service';
import { Student } from '../../../core/models/student.interface';
import { Class } from '../../../core/models/class.interface';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="student-list-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Gestão de Alunos</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/dashboard">VOLTAR</button>
            <button class="new-button" routerLink="/alunos/novo">CADASTRAR</button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <form [formGroup]="filterForm" (change)="applyFilters()">
            <div class="filter-group">
              <label>Turma:</label>
              <select formControlName="class_id">
                <option value="">Todas as turmas</option>
                <option *ngFor="let class of classes" [value]="class.id">
                  {{class.year_name}} {{class.division_name}}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Status:</label>
              <select formControlName="active">
                <option value="">Todos</option>
                <option [value]="true">Ativos</option>
                <option [value]="false">Inativos</option>
              </select>
            </div>
          </form>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando alunos...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Turma</th>
                <th>E-mail</th>
                <th>Responsável</th>
                <th>Telefone Resp.</th>
                <th>Status</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of students">
                <td>{{student.user_name}}</td>
                <td>{{student.registration}}</td>
                <td>{{student.class_year_name}} {{student.class_division_name}}</td>
                <td>{{student.user_email}}</td>
                <td>{{student.guardian_name || '-'}}</td>
                <td>{{student.guardian_phone || '-'}}</td>
                <td>
                  <span class="status-badge" [class.active]="student.active">
                    {{student.active ? 'Ativo' : 'Inativo'}}
                  </span>
                </td>
                <td>
                  <button class="edit-button" [routerLink]="['/alunos/editar', student.id]">
                    <span class="icon">✎</span>
                  </button>
                </td>
                <td>
                  <button class="delete-button" (click)="deleteStudent(student)">
                    <span class="icon">✕</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .student-list-container {
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

    .filters {
      background: white;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);

      form {
        display: flex;
        gap: 2rem;
      }

      .filter-group {
        display: flex;
        align-items: center;
        gap: 1rem;

        label {
          font-weight: 500;
          color: #333;
        }

        select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 200px;
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
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  classes: Class[] = [];
  loading = false;
  error: string | null = null;
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private classService: ClassService
  ) {
    this.filterForm = this.fb.group({
      class_id: [''],
      active: ['']
    });
  }

  ngOnInit() {
    this.loadClasses();
    this.loadStudents();
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
      }
    });
  }

  loadStudents() {

    this.loading = true;
    this.error = null;

    const filters = {
      class_id: this.filterForm.get('class_id')?.value,
      active: this.filterForm.get('active')?.value
    };

    this.studentService.getStudents(filters).subscribe({
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

  applyFilters() {
    this.loadStudents();
  }

  deleteStudent(student: Student) {
    if (confirm(`Tem certeza que deseja excluir o aluno ${student.user_name}?`)) {
      this.studentService.deleteStudent(student.id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Erro ao excluir aluno:', error);
          this.error = 'Erro ao excluir aluno. Por favor, tente novamente.';
        }
      });
    }
  }
}
