import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subject, CreateSubjectDTO, KnowledgeArea } from '../models/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSubject(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getKnowledgeAreas(): Observable<KnowledgeArea[]> {
    return this.http.get<KnowledgeArea[]>(`${this.apiUrl}/knowledge-areas`, { headers: this.getHeaders() });
  }

  createSubject(subjectData: CreateSubjectDTO): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subjectData, { headers: this.getHeaders() });
  }

  updateSubject(id: number, subjectData: CreateSubjectDTO): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}/${id}`, subjectData, { headers: this.getHeaders() });
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  toggleStatus(id: number, active: boolean): Observable<Subject> {
    return this.http.patch<Subject>(
      `${this.apiUrl}/${id}/status`,
      { active },
      { headers: this.getHeaders() }
    );
  }
}
