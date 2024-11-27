import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../models/student.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createStudent(data: CreateStudentDTO): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, data, { headers: this.getHeaders() });
  }

  updateStudent(id: number, data: UpdateStudentDTO): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  toggleStatus(id: number, active: boolean): Observable<Student> {
    return this.http.patch<Student>(
      `${this.apiUrl}/${id}/status`,
      { active },
      { headers: this.getHeaders() }
    );
  }
}
