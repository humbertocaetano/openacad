export interface LessonContent {
    id?: number;
    teacher_subject_id: number;
    date: string;
    content: string;
    objective: string;
    resources: string;
    evaluation_method: string;
    observations?: string;
    created_at?: string;
    updated_at?: string;
  }