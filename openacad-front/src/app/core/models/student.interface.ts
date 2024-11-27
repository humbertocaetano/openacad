export interface Student {
    id: number;
    registration: string;
    user_id: number;
    class_id: number;
    birth_date?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    address?: string;
    health_info?: string;
    notes?: string;
    active: boolean;
    // Campos relacionados
    user_name?: string;
    user_email?: string;
    user_phone: string;
    class_year_name?: string;
    class_division_name?: string;
}

export interface CreateStudentDTO {
    name: string;          // Para criação do usuário
    email: string;         // Para criação do usuário
    phone?: string;        // Para criação do usuário
    class_id: number;
    birth_date?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    address?: string;
    health_info?: string;
    notes?: string;
    active?: boolean;
    user_data?: {  
      name: string;
      email: string;
      phone: string;
    };    
}

export interface UpdateStudentDTO {
    name?: string;
    email?: string;
    phone?: string;
    class_id?: number;
    birth_date?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    address?: string;
    health_info?: string;
    notes?: string;
    active?: boolean;
}
