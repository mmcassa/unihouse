export interface EmploymentPositionInterface {
    id?: number;
    title?: string;
    department?: string;
    is_prostaff: boolean;
    archive: boolean;
    code?: string;
    has_community: boolean;
    parent_id?: number;
    staged: boolean;
    supervisor_position_id?: number;
}



export interface Community {
  name: string;
  code?: string;
  description: string;
}