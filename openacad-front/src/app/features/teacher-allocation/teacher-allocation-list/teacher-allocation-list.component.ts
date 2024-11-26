import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeacherAllocationService } from '../../../core/services/teacher-allocation.service';
import { TeacherAllocation } from '../../../core/models/teacher-allocation.interface';

@Component({
  selector: 'app-teacher-allocation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Alocação de Professores</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/dashboard">VOLTAR</button>
            <button class="new-button" (click)="createNewAllocation()">CADASTRAR</button>
          </div>
        </div>

        <div class="year-select-container">
          <select class="form-select" [(ngModel)]="selectedYear" (change)="onYearChange($event)">
            <option [value]="currentYear" *ngFor="let currentYear of [2024, 2025, 2026]">
              {{ currentYear }}
            </option>
          </select>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Professor</th>
                <th>Disciplina</th>
                <th>Turma</th>
                <th>Horários</th>
	        <th>Editar</th>
        	<th>Excluir</th>
	      </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading">
                <td colspan="5" class="text-center">Carregando...</td>
              </tr>
              <tr *ngIf="!loading && allocations.length === 0">
                <td colspan="5" class="text-center">Nenhuma alocação encontrada</td>
              </tr>
              <tr *ngFor="let allocation of allocations">
                <td>{{ allocation.teacher?.name }}</td>
                <td>{{ allocation.subject?.name }}</td>
                <td>{{ allocation.class?.name }}</td>
                <td>
                  <div *ngFor="let schedule of allocation.schedules">
                    {{ schedule.displayText }}
                  </div>
                </td>
                <td>
                  <button class="edit-button" (click)="editAllocation(allocation)">
                    <span class="icon">✎</span>
                  </button>
                </td>
                <td>
                  <button class="delete-button" (click)="deleteAllocation(allocation)">
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
    .container-fluid {
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin: 0;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;

        .back-button {
          padding: 0.5rem 1rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          
          &:hover {
            background-color: #e0e0e0;
          }
        }

        .new-button {
          padding: 0.5rem 1rem;
          background-color: #00a86b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            background-color: #009660;
          }
        }
      }
    }

    .year-select-container {
      margin-bottom: 1rem;
      
      select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 200px;
      }
    }

    .table-container {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
      }

    }

    .alert {
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;

      &.alert-danger {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
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
    
  `]
})

export class TeacherAllocationListComponent implements OnInit {
  allocations: TeacherAllocation[] = [];   
  selectedYear: number = new Date().getFullYear();
  loading: boolean = true;
  error: string = '';

  constructor(
    private teacherAllocationService: TeacherAllocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllocations();
  }

  loadAllocations(): void {
    this.loading = true;
    this.teacherAllocationService.getAllocations(this.selectedYear)
      .subscribe({
        next: (data) => {
          this.allocations = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar alocações:', error);
          this.error = 'Erro ao carregar as alocações. Tente novamente mais tarde.';
          this.loading = false;
        }
      });
  }

  onYearChange(event: any): void {
    this.loadAllocations();
  }

  createNewAllocation(): void {
    this.router.navigate(['/alocacoes/novo']);
  }

  editAllocation(allocation: TeacherAllocation): void {
    if (allocation.id) {
      this.router.navigate([`/alocacoes/editar/${allocation.id}`]);
    }
  }

  deleteAllocation(allocation: TeacherAllocation): void {
    if (allocation.id && confirm('Tem certeza que deseja excluir esta alocação?')) {
      this.teacherAllocationService.deleteAllocation(allocation.id)
        .subscribe({
          next: () => {
            this.loadAllocations();
          },
          error: (error) => {
            console.error('Erro ao excluir alocação:', error);
            this.error = 'Erro ao excluir a alocação. Tente novamente mais tarde.';
          }
        });
    }
  }
}
