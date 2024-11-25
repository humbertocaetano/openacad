import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { ClassListComponent } from './features/classes/class-list/class-list.component';
import { ClassFormComponent } from './features/classes/class-form/class-form.component';
import { SubjectListComponent } from './features/subjects/subject-list/subject-list.component';
import { SubjectFormComponent } from './features/subjects/subject-form/subject-form.component';
import { StudentListComponent } from './features/students/student-list/student-list.component';
import { StudentFormComponent } from './features/students/student-form/student-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'usuarios', component: UserListComponent },
  { path: 'usuarios/novo', component: UserFormComponent },
  { path: 'turmas', component: ClassListComponent },
  { path: 'turmas/novo', component: ClassFormComponent }, 
  { path: 'disciplinas', component: SubjectListComponent },
  { path: 'disciplinas/novo', component: SubjectFormComponent },
  { path: 'disciplinas/editar/:id', component: SubjectFormComponent },
  { path: 'alunos', component: StudentListComponent },
  { path: 'alunos/novo', component: StudentFormComponent },
  { path: 'alunos/editar/:id', component: StudentFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];
