import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherAllocation } from '../models/teacher-allocation.interface';
import { Schedule } from '../models/schedule.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherAllocationService {
  private apiUrl = `${environment.apiUrl}/allocations`;

  constructor(private http: HttpClient) {}

  // Métodos existentes
  getAllocations(year: number): Observable<TeacherAllocation[]> {
    return this.http.get<TeacherAllocation[]>(`${this.apiUrl}?year=${year}`);
  }

  getAllocation(id: number): Observable<TeacherAllocation> {
    return this.http.get<TeacherAllocation>(`${this.apiUrl}/${id}`);
  }

  getTeacherAllocations(teacherId: number): Observable<TeacherAllocation[]> {
    return this.http.get<TeacherAllocation[]>(`${this.apiUrl}/teacher/${teacherId}`);
  }

  createAllocation(allocation: TeacherAllocation): Observable<TeacherAllocation> {
    return this.http.post<TeacherAllocation>(this.apiUrl, allocation);
  }

  updateAllocation(id: number, allocation: TeacherAllocation): Observable<TeacherAllocation> {
    return this.http.put<TeacherAllocation>(`${this.apiUrl}/${id}`, allocation);
  }

  deleteAllocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  checkConflicts(teacherId: number, schedules: Schedule[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/check-conflicts`, {
      teacherId,
      schedules
    });
  }
}