export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joining_date: string;
  address: string;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: string | number;
  joining_date: string;
  address: string;
  status: "Active" | "Inactive";
}

export interface DashboardSummary {
  total: number;
  active: number;
  inactive: number;
  departmentSummary: Record<string, number>;
  recent: Employee[];
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  email: string;
}

export interface FormErrors {
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  salary?: string;
  joining_date?: string;
  address?: string;
  general?: string;
}

export type ViewTab = "dashboard" | "employees" | "add" | "api-guide";
