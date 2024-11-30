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

  getStudents(filters?: { class_id?: string; active?: boolean }): Observable<Student[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (filters) {
      if (filters.class_id) {
        params.push(`class_id=${filters.class_id}`);
      }
      if (filters.active !== undefined && filters.active !== null) {
        params.push(`active=${filters.active}`);
      }
    }
  
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
  
    return this.http.get<Student[]>(url);
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

  getStudentsByClass(classId: number): Observable<Student[]> {
    return this.http.get<Student[]>(
      `${this.apiUrl}/class/${classId}`,
      { headers: this.getHeaders() }
    );
  }

  importStudentsToClass(classId: number): Observable<Student[]> {
    return this.http.post<Student[]>(
      `${this.apiUrl}/class/${classId}/import`,
      {},
      { headers: this.getHeaders() }
    );
  }

  removeStudentFromClass(classId: number, studentId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/class/${classId}/student/${studentId}`,
      { headers: this.getHeaders() }
    );
  }

  getAvailableStudentsForClass(classId: number): Observable<Student[]> {
    return this.http.get<Student[]>(
      `${this.apiUrl}/available/class/${classId}`,
      { headers: this.getHeaders() }
    );
  }  

}
