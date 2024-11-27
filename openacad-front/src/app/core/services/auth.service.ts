import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  userLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { email: string; password: string; schoolCode: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login bem-sucedido:', response);
          this.handleLoginSuccess(response);
        }),
        catchError(this.handleError)
      );
  }

  private handleLoginSuccess(response: any) {
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na autenticação:', error);
    if (error.status === 0) {
      return throwError(() => new Error('Erro de conexão com o servidor'));
    }
    return throwError(() => new Error(error.error?.message || 'Erro no login'));
  }
}
