import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClassService } from '../../../core/services/class.service';
import { Class } from '../../../core/models/class.interface';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="class-list-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Gestão de Turmas</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/dashboard">VOLTAR</button>
            <button class="new-button" routerLink="/turmas/novo">CADASTRAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando turmas...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Ano</th>
                <th>Turma</th>
                <th>Status</th>
                <th>Alunos</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let class of classes">
                <td>{{class.year_name}}</td>
                <td>{{class.division_name}}</td>
                <td>
                  <span class="status-badge" [class.active]="class.active">
                    {{class.active ? 'Ativa' : 'Inativa'}}
                  </span>
                </td>
                <td>
                  <button class="students-button" [routerLink]="['/turmas', class.id, 'alunos']">
                    <span class="icon">👥</span>
                  </button>
                </td>		
                <td>
                  <button class="edit-button" (click)="openEditModal(class)">
                    <span class="icon">✎</span>
                  </button>
                </td>
                <td>
                  <button class="delete-button" (click)="deleteClass(class)">
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
    .class-list-container {
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
    .students-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00a86b;

      .icon {
        font-size: 1.2rem;
      }

      &:hover {
        background-color: rgba(0,168,107,0.1);
      }
    }    
  `]
})
export class ClassListComponent implements OnInit {
  classes: Class[] = [];
  loading = false;
  error: string | null = null;

  constructor(private classService: ClassService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.loading = true;
    this.error = null;

    this.classService.getClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.error = 'Erro ao carregar turmas. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  openEditModal(classData: Class) {
    console.log('Editar turma:', classData);
  }

  deleteClass(classData: Class) {
    if (confirm(`Tem certeza que deseja excluir a turma ${classData.year_name} ${classData.division_name}?`)) {
      this.classService.deleteClass(classData.id).subscribe({
        next: () => {
          this.loadClasses();
        },
        error: (error) => {
          console.error('Erro ao excluir turma:', error);
          this.error = 'Erro ao excluir turma. Por favor, tente novamente.';
        }
      });
    }
  }
}
