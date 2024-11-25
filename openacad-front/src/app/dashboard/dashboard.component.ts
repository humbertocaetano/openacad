import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
        <h2>Bem vindo(a), {{userName}}</h2>
        
        <div class="menu-grid">
          <button (click)="navigateTo('usuarios')">USUÁRIOS</button>
          <button (click)="navigateTo('turmas')">TURMAS</button>
          <button (click)="navigateTo('professores')">PROFESSORES</button>
          <button (click)="navigateTo('alunos')">ALUNOS</button>
          <button (click)="navigateTo('disciplinas')">DISCIPLINAS</button>
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
      flex: 1;
      padding: 2rem;

      h2 {
        margin-bottom: 2rem;
        text-align: center;
      }
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;

      button {
        padding: 1.5rem;
        font-size: 1.1rem;
        border: none;
        background: #f5f5f5;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
      }
    }
  `]
})
export class DashboardComponent {
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
