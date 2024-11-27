// src/app/features/subjects/subject-students/subject-students.component.ts
@Component({
  selector: 'app-subject-students',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <h2>Alunos - {{ subject?.name }}</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/disciplinas">VOLTAR</button>
            <button class="import-button" (click)="importStudents()">
              IMPORTAR ALUNOS
            </button>
          </div>
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Status</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading">
                <td colspan="4" class="text-center">Carregando...</td>
              </tr>
              <tr *ngIf="!loading && students.length === 0">
                <td colspan="4" class="text-center">Nenhum aluno encontrado</td>
              </tr>
              <tr *ngFor="let student of students">
                <td>{{ student.registration }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.status }}</td>
                <td>
                  <button class="delete-button" (click)="removeStudent(student.id)">
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
      flex: 1;
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

        .back-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .import-button {
          background-color: #00a86b;
          color: white;
        }

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-x: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background-color: #f8f8f8;
          font-weight: 500;
        }

        .text-center {
          text-align: center;
        }
      }
    }

    .delete-button {
      background: none;
      border: none;
      cursor: pointer;
      color: #ff4444;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: rgba(255,68,68,0.1);
      }

      .icon {
        font-size: 1.2rem;
      }
    }

    .error-message {
      background-color: #fff5f5;
      color: #ff4444;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})

