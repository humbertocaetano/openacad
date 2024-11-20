export interface SchoolYear {
    id: number;
    name: string;
}

export interface ClassDivision {
    id: number;
    name: string;
}

export interface Class {
    id: number;
    year_id: number;
    division_id: number;
    year_name?: string;
    division_name?: string;
    active: boolean;
}

export interface CreateClassDTO {
    year_id: number;
    division_id: number;
    active?: boolean;
}
