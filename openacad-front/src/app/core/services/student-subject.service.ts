// src/app/core/services/student-subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentSubjectService {
  private apiUrl = `${environment.apiUrl}/student-subjects`;

  constructor(private http: HttpClient) { }

  getAvailableSubjects(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available/${studentId}`);
  }

  getEnrolledSubjects(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enrolled/${studentId}`);
  }

  enrollStudent(studentId: number, teacherSubjectId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enroll`, { 
      studentId, 
      teacherSubjectId 
    });
  }

  cancelEnrollment(enrollmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${enrollmentId}`);
  }
}
