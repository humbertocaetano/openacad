import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  level_id: number;
  level_name?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  username: string;
  phone: string;
  level_id: number;
  password: string;
}

export interface UpdateUserDTO {
  name: string;
  email: string;
  username: string;
  phone: string;
  level_id: number;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  createUser(userData: CreateUserDTO): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, userData, { headers });
  }

  updateUser(id: number, userData: UpdateUserDTO): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/${id}`, userData, { headers });
  }

  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
