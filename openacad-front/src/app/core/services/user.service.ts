import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  user_level: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {
    console.log('UserService initialized with API URL:', this.apiUrl);
  }

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(this.apiUrl, { headers }).pipe(
      tap(users => {
        console.log('Usuários recebidos:', users);
      }),
      catchError(error => {
        console.error('Erro ao buscar usuários:', error);
        throw error;
      })
    );
  }

  createUser(userData: {
    name: string;
    email: string;
    username: string;
    phone: string;
    user_level: string;
    password: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('Criando usuário:', userData);

    return this.http.post(`${this.apiUrl}`, userData, { headers }).pipe(
      tap(response => {
        console.log('Usuário criado com sucesso:', response);
      }),
      catchError(error => {
        console.error('Erro ao criar usuário:', error);
        throw error;
      })
    );
  }

updateUser(userId: number, userData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  console.log('Atualizando usuário:', { userId, userData });

  return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers }).pipe(
    tap(response => {
      console.log('Usuário atualizado:', response);
    }),
    catchError(error => {
      console.error('Erro ao atualizar usuário:', error);
      throw error.error?.message || 'Erro ao atualizar usuário';
    })
  );
}


  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  updateUserPassword(id: number, password: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(`${this.apiUrl}/${id}/password`, { password }, { headers });
  }
}
