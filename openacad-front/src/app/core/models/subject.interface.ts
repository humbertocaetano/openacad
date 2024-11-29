export interface KnowledgeArea {
    id: number;
    name: string;
}

export interface SchoolSubject {
    id: number;
    name: string;
    year_id?: number;
    knowledge_area_id?: number;
    objective?: string;
    syllabus?: string;
    basic_bibliography?: string;
    complementary_bibliography?: string;
    active: boolean;
    year_name?: string;
    knowledge_area_name?: string;
    hours_per_year: number;
}

export interface CreateSubjectDTO {
    name: string;
    year_id: number;
    knowledge_area_id?: number;
    objective?: string;
    syllabus?: string;
    basic_bibliography?: string;
    complementary_bibliography?: string;
    active?: boolean;
}

export interface Subject {
    id: number;
    name: string;
    year_id: number;
    knowledge_area_id?: number;
    objective?: string;
    syllabus?: string;
    basic_bibliography?: string;
    complementary_bibliography?: string;
    active: boolean;
    hours_per_year: number;
    created_at?: string;
    updated_at?: string;
    // Campos relacionados
    year_name?: string;
    knowledge_area_name?: string;
}