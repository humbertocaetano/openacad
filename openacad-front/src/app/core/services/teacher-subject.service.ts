import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { 
    TeacherSubject,
    StudentSubject,
    LessonContent,
    Attendance,
    Grade,
    CreateTeacherSubjectDTO,
    CreateStudentSubjectDTO,
    CreateLessonContentDTO,
    CreateAttendanceDTO,
    CreateGradeDTO
} from '../models/teacher-subject.interface';

@Injectable({
    providedIn: 'root'
})
export class TeacherSubjectService {
    private apiUrl = `${environment.apiUrl}/teacher-subjects`;

    constructor(private http: HttpClient) {}

    getTeacherSubjects(teacherId?: number, year?: number): Observable<TeacherSubject[]> {
        let url = this.apiUrl;
        if (teacherId) url += `?teacher_id=${teacherId}`;
        if (year) url += `${teacherId ? '&' : '?'}year=${year}`;
        return this.http.get<TeacherSubject[]>(url);
    }

    createTeacherSubject(data: CreateTeacherSubjectDTO): Observable<TeacherSubject> {
        return this.http.post<TeacherSubject>(this.apiUrl, data);
    }

    getStudentSubjects(teacherSubjectId: number): Observable<StudentSubject[]> {
        return this.http.get<StudentSubject[]>(
            `${this.apiUrl}/${teacherSubjectId}/students`);
    }

    addStudentToSubject(teacherSubjectId: number, data: CreateStudentSubjectDTO): Observable<StudentSubject> {
        return this.http.post<StudentSubject>(
            `${this.apiUrl}/${teacherSubjectId}/students`,
            data,
            { // headers: this.getHeaders() 
                }
        );
    }

    getLessonContents(teacherSubjectId: number): Observable<LessonContent[]> {
        return this.http.get<LessonContent[]>(
            `${this.apiUrl}/${teacherSubjectId}/contents`,
            { // headers: this.getHeaders() 
                }
        );
    }

    createLessonContent(data: CreateLessonContentDTO): Observable<LessonContent> {
        return this.http.post<LessonContent>(
            `${this.apiUrl}/${data.teacher_subject_id}/contents`,
            data,
            { // headers: this.getHeaders()
                 }
        );
    }

    getAttendances(teacherSubjectId: number, date: string): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(
            `${this.apiUrl}/${teacherSubjectId}/attendances?date=${date}`,
            { // headers: this.getHeaders() 
                }
        );
    }

    saveAttendances(teacherSubjectId: number, data: CreateAttendanceDTO[]): Observable<Attendance[]> {
        return this.http.post<Attendance[]>(
            `${this.apiUrl}/${teacherSubjectId}/attendances`,
            data,
            { // headers: this.getHeaders() 
                }
        );
    }

    getGrades(teacherSubjectId: number): Observable<Grade[]> {
        return this.http.get<Grade[]>(
            `${this.apiUrl}/${teacherSubjectId}/grades`,
            { // headers: this.getHeaders() 
                }
        );
    }

    saveGrades(teacherSubjectId: number, data: CreateGradeDTO[]): Observable<Grade[]> {
        return this.http.post<Grade[]>(
            `${this.apiUrl}/${teacherSubjectId}/grades`,
            data,
            { // headers: this.getHeaders() 
                }
        );
    }
}
