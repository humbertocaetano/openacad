import { Teacher } from './teacher.interface';
import { Subject } from './subject.interface';
import { Schedule } from './schedule.interface';


export interface TeacherSubject {

  id: number;
  teacher: Teacher;
  subject: Subject;
  class?: {
    id: number;
    name: string;
  };
  year: number;
  schedules: Schedule[];
  active?: boolean;

}

export interface StudentSubject {
    id: number;
    student_id: number;
    teacher_subject_id: number;
    status: 'CURSANDO' | 'APROVADO' | 'REPROVADO';
    // Campos relacionados
    student_name?: string;
    registration?: string;
}

export interface LessonContent {
    id: number;
    teacher_subject_id: number;
    date: string;
    content: string;
    observations?: string;
}

export interface Attendance {
    id: number;
    student_subject_id: number;
    date: string;
    present: boolean;
    // Campos relacionados
    student_name?: string;
}

export interface Grade {
    id: number;
    student_subject_id: number;
    evaluation_type: string;
    grade: number;
    weight: number;
    date: string;
    observations?: string;
    // Campos relacionados
    student_name?: string;
}

// DTOs para criação/atualização
export interface CreateTeacherSubjectDTO {
    teacher_id: number;
    subject_id: number;
    year: number;
    active?: boolean;
}

export interface CreateStudentSubjectDTO {
    student_id: number;
    teacher_subject_id: number;
}

export interface CreateLessonContentDTO {
    teacher_subject_id: number;
    date: string;
    content: string;
    observations?: string;
}

export interface CreateAttendanceDTO {
    student_subject_id: number;
    date: string;
    present: boolean;
}

export interface CreateGradeDTO {
    student_subject_id: number;
    evaluation_type: string;
    grade: number;
    weight?: number;
    date: string;
    observations?: string;
}
