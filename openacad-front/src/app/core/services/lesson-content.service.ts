import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LessonContent, CreateLessonContentDTO } from '../models/teacher-subject.interface';

@Injectable({
  providedIn: 'root'
})
export class LessonContentService {
  private apiUrl = `${environment.apiUrl}/lesson-contents`;

  constructor(private http: HttpClient) {}

  // Listagem com filtro por professor
  getLessons(teacherId?: number): Observable<LessonContent[]> {
    let url = this.apiUrl;
    if (teacherId) {
      url += `?teacher_id=${teacherId}`;
    }
    return this.http.get<LessonContent[]>(url);
  }

  // Buscar um plano de aula específico
  getLesson(id: number): Observable<LessonContent> {
    return this.http.get<LessonContent>(`${this.apiUrl}/${id}`);
  }

  // Buscar planos de aula de uma disciplina específica
  getLessonsBySubject(teacherSubjectId: number): Observable<LessonContent[]> {
    return this.http.get<LessonContent[]>(`${this.apiUrl}/teacher-subject/${teacherSubjectId}`);
  }

  // Criar novo plano de aula
  createLesson(lesson: CreateLessonContentDTO): Observable<LessonContent> {
    return this.http.post<LessonContent>(this.apiUrl, lesson);
  }

  // Atualizar plano existente
  updateLesson(id: number, lesson: Partial<LessonContent>): Observable<LessonContent> {
    return this.http.put<LessonContent>(`${this.apiUrl}/${id}`, lesson);
  }

  // Excluir plano
  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getLessonsByTeacher(teacherId: number): Observable<LessonContent[]> {
    return this.http.get<LessonContent[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }
}