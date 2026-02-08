export interface EmployeeApiResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  code: string;
  department: {
    code: string;
    description: string;
  } | null;
}

export interface EmployeeFilters {
  firstName: string;
  lastName: string;
}