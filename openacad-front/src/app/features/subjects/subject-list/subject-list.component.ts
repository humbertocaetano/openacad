import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.interface';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="subject-list-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Gestão de Disciplinas</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/dashboard">VOLTAR</button>
            <button class="new-button" routerLink="/disciplinas/novo">CADASTRAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando disciplinas...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ano</th>
                <th>Área de Conhecimento</th>
                <th>Carga Horária</th>
                <th>Status</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let subject of subjects">
                <td>{{subject.name}}</td>
                <td>{{subject.year_name}}</td>
                <td>{{subject.knowledge_area_name || 'Não definida'}}</td>
                <td>{{subject.hours_per_year}}</td>
                <td>
                  <span class="status-badge" [class.active]="subject.active">
                    {{subject.active ? 'Ativa' : 'Inativa'}}
                  </span>
                </td>
                <td>
                  <button class="edit-button" [routerLink]="['/disciplinas/editar', subject.id]">
                    <span class="icon">✎</span>
                  </button>
                </td>
                <td>
                  <button class="delete-button" (click)="deleteSubject(subject)">
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
    .subject-list-container {
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
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.loading = true;
    this.error = null;

    this.subjectService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplinas:', error);
        this.error = 'Erro ao carregar disciplinas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  deleteSubject(subject: Subject) {
    if (confirm(`Tem certeza que deseja excluir a disciplina ${subject.name}?`)) {
      this.subjectService.deleteSubject(subject.id).subscribe({
        next: () => {
          this.loadSubjects();
        },
        error: (error) => {
          console.error('Erro ao excluir disciplina:', error);
          this.error = 'Erro ao excluir disciplina. Por favor, tente novamente.';
        }
      });
    }
  }
}
