import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../../core/services/user.service';
import { EditUserModalComponent } from '../components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EditUserModalComponent],
  template: `
    <div class="user-list-container">
      <header>
        <h1>OPENACAD</h1>
        <div class="header-buttons">
          <button routerLink="/inicio">INÍCIO</button>
          <button routerLink="/login">SAIR</button>
        </div>
      </header>

      <main>
        <div class="content-header">
          <h2>Gestão de Usuários</h2>
          <div class="action-buttons">
            <button class="back-button" routerLink="/dashboard">VOLTAR</button>
            <button class="new-button" routerLink="/usuarios/novo">CADASTRAR</button>
          </div>
        </div>

        <div class="loading-message" *ngIf="loading">
          Carregando usuários...
        </div>

        <div class="error-message" *ngIf="error">
          {{ error }}
        </div>

        <div class="table-container" *ngIf="!loading && !error">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Usuário</th>
                <th>e-mail</th>
                <th>Telefone</th>
                <th>Nível</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{user.name}}</td>
                <td>{{user.username}}</td>
                <td>{{user.email}}</td>
                <td>{{user.phone}}</td>
                <td>{{user.level_name}}</td>
                <td>
                  <button class="edit-button" (click)="openEditModal(user)">
                    <span class="icon">✎</span>
                  </button>
                </td>
                <td>
                  <button class="delete-button" (click)="deleteUser(user)">
                    <span class="icon">✕</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal de edição -->
        <app-edit-user-modal
          *ngIf="showEditModal && selectedUser"
          [user]="selectedUser"
          (close)="closeEditModal()"
          (save)="saveUserChanges($event)"
        ></app-edit-user-modal>
      </main>
    </div>
  `,

styles: [`
    .user-list-container {
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
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  showEditModal = false;
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.error = 'Erro ao carregar usuários. Por favor, tente novamente.';
        this.loading = false;
      }
    });
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveUserChanges(userData: any) {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Erro ao atualizar usuário:', error);
          // Adicione aqui uma notificação de erro se desejar
        }
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Erro ao excluir usuário:', error);
          this.error = 'Erro ao excluir usuário. Por favor, tente novamente.';
        }
      });
    }
  }
}
