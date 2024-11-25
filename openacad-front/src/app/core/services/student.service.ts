import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, CreateStudentDTO, UpdateStudentDTO } from '../models/student.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStudents(filters?: { class_id?: number; active?: boolean }): Observable<Student[]> {
    let params = new HttpParams();
    if (filters?.class_id) {
      params = params.set('class_id', filters.class_id.toString());
    }
    if (filters?.active !== undefined) {
      params = params.set('active', filters.active.toString());
    }

    return this.http.get<Student[]>(this.apiUrl, { 
      headers: this.getHeaders(),
      params
    });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createStudent(studentData: CreateStudentDTO): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, studentData, {
      headers: this.getHeaders()
    });
  }

  updateStudent(id: number, studentData: UpdateStudentDTO): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, studentData, {
      headers: this.getHeaders()
    });
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  toggleStatus(id: number, active: boolean): Observable<Student> {
    return this.http.patch<Student>(
      `${this.apiUrl}/${id}/status`,
      { active },
      { headers: this.getHeaders() }
    );
  }

  // Método auxiliar para verificar se matrícula já existe
  checkRegistration(registration: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(
      `${this.apiUrl}/check-registration/${registration}`,
      { headers: this.getHeaders() }
    );
  }
}
