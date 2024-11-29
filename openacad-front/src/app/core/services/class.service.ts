import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Class, CreateClassDTO, SchoolYear, ClassDivision } from '../models/class.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getClass(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getSchoolYears(): Observable<SchoolYear[]> {
    return this.http.get<SchoolYear[]>(`${this.apiUrl}/years`, { headers: this.getHeaders() });
  }

  getClassDivisions(): Observable<ClassDivision[]> {
    return this.http.get<ClassDivision[]>(`${this.apiUrl}/divisions`, { headers: this.getHeaders() });
  }

  getClassDivisionsByYear(yearId: number): Observable<ClassDivision[]> {
    return this.http.get<ClassDivision[]>(`${this.apiUrl}/divisions/${yearId}`, { headers: this.getHeaders() });
  }

  createClass(classData: CreateClassDTO): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, classData, { headers: this.getHeaders() });
  }

  updateClass(id: number, classData: CreateClassDTO): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/${id}`, classData, { headers: this.getHeaders() });
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  toggleClassStatus(id: number, active: boolean): Observable<Class> {
    return this.http.patch<Class>(`${this.apiUrl}/${id}/status`, { active }, { headers: this.getHeaders() });
  }
}
