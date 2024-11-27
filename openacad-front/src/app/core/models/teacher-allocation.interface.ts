import { Teacher } from './teacher.interface';
import { SchoolSubject } from './subject.interface';
import { Schedule } from './schedule.interface';
import { Class } from './class.interface';


export interface TeacherAllocation {
  id: number;
  teacherId: number;
  subjectId: number;
  year: number;
  schedules: Schedule[];
  teacher?: {
    id: number;
    name: string;
  };
  subject?: {
    id: number;
    name: string;
  };
  class?: {
    name: string;
  };
  active?: boolean;
  subjects: SchoolSubject[];
}
