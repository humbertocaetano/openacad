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

  getClasses(): Observable<Class[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Class[]>(this.apiUrl, { headers });
  }

  getSchoolYears(): Observable<SchoolYear[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<SchoolYear[]>(`${this.apiUrl}/years`, { headers });
  }

  getClassDivisions(): Observable<ClassDivision[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<ClassDivision[]>(`${this.apiUrl}/divisions`, { headers });
  }

  getClassDivisionsByYear(yearId: number): Observable<ClassDivision[]> {
    return this.http.get<ClassDivision[]>(`${this.apiUrl}/divisions/${yearId}`);
  }

  createClass(classData: CreateClassDTO): Observable<Class> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Class>(this.apiUrl, classData, { headers });
  }

  updateClass(id: number, classData: CreateClassDTO): Observable<Class> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Class>(`${this.apiUrl}/${id}`, classData, { headers });
  }

  deleteClass(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  toggleClassStatus(id: number, active: boolean): Observable<Class> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch<Class>(`${this.apiUrl}/${id}/status`, { active }, { headers });
  }
}
