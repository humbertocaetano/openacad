import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SchoolSubject, CreateSubjectDTO, KnowledgeArea } from '../models/subject.interface';

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

  getSubjects(): Observable<SchoolSubject[]> {
    return this.http.get<SchoolSubject[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSubject(id: number): Observable<SchoolSubject> {
    return this.http.get<SchoolSubject>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getSubjectsForAllocation(): Observable<SchoolSubject[]> {
    return this.http.get<SchoolSubject[]>(`${this.apiUrl}/for-allocation`);
}

  getKnowledgeAreas(): Observable<KnowledgeArea[]> {
    return this.http.get<KnowledgeArea[]>(`${this.apiUrl}/knowledge-areas`, { headers: this.getHeaders() });
  }

  createSubject(subjectData: CreateSubjectDTO): Observable<SchoolSubject> {
    return this.http.post<SchoolSubject>(this.apiUrl, subjectData, { headers: this.getHeaders() });
  }

  updateSubject(id: number, subjectData: CreateSubjectDTO): Observable<SchoolSubject> {
    return this.http.put<SchoolSubject>(`${this.apiUrl}/${id}`, subjectData, { headers: this.getHeaders() });
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getSubjectsByYearAndDivision(yearId: number, divisionId: number): Observable<SchoolSubject[]> {
    return this.http.get<SchoolSubject[]>(`${this.apiUrl}/by-class`, {
      params: {
        yearId: yearId.toString(),
        divisionId: divisionId.toString()
      }
    });
  }

  toggleStatus(id: number, active: boolean): Observable<SchoolSubject> {
    return this.http.patch<SchoolSubject>(
      `${this.apiUrl}/${id}/status`,
      { active },
      { headers: this.getHeaders() }
    );
  }
}
