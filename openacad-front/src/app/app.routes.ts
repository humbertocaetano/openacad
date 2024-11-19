import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: 'usuarios/novo', component: UserFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];
