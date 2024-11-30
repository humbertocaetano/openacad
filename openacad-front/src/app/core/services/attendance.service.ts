import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceStudent {
  id: number;
  registration: string;
  name: string;
  present: boolean;
}

export interface AttendanceData {
  lessonId: number;
  attendances: {
    studentId: number;
    present: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendances`;

  constructor(private http: HttpClient) {}

  // Buscar alunos de uma turma com status de presença
  getStudentsByLesson(lessonId: number): Observable<AttendanceStudent[]> {
    return this.http.get<AttendanceStudent[]>(`${this.apiUrl}/lesson/${lessonId}`);
  }

  // Salvar frequência da aula
  saveAttendance(data: AttendanceData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Atualizar frequência existente
  updateAttendance(lessonId: number, data: AttendanceData): Observable<any> {
    return this.http.put(`${this.apiUrl}/lesson/${lessonId}`, data);
  }
}