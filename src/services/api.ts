import { Employee, EmployeeFormData, DashboardSummary, User } from "../types";

const LOCAL_STORAGE_KEY = "ems_local_employees";
const AUTH_STORAGE_KEY = "ems_auth_user";

const defaultEmployees: Employee[] = [
  {
    id: 1,
    employee_id: "EMP-1001",
    first_name: "Aarav",
    last_name: "Sharma",
    email: "aarav.sharma@techcorp.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    designation: "Senior Full Stack Engineer",
    salary: 85000,
    joining_date: "2023-01-15",
    address: "Plot 42, Tech Park Avenue, Bengaluru, Karnataka",
    status: "Active",
    created_at: "2023-01-15T09:00:00.000Z",
    updated_at: "2024-02-10T14:30:00.000Z"
  },
  {
    id: 2,
    employee_id: "EMP-1002",
    first_name: "Priya",
    last_name: "Nair",
    email: "priya.nair@techcorp.com",
    phone: "+91 98234 56789",
    department: "Human Resources",
    designation: "HR Operations Lead",
    salary: 62000,
    joining_date: "2023-03-20",
    address: "Flat 102, Palm Heights, Powai, Mumbai",
    status: "Active",
    created_at: "2023-03-20T10:00:00.000Z",
    updated_at: "2024-01-05T11:20:00.000Z"
  },
  {
    id: 3,
    employee_id: "EMP-1003",
    first_name: "Rohan",
    last_name: "Mehta",
    email: "rohan.mehta@techcorp.com",
    phone: "+91 97123 45678",
    department: "Finance",
    designation: "Financial Analyst",
    salary: 70000,
    joining_date: "2023-06-01",
    address: "B-4, Green Meadows, Sector 62, Noida",
    status: "Active",
    created_at: "2023-06-01T09:30:00.000Z",
    updated_at: "2023-06-01T09:30:00.000Z"
  },
  {
    id: 4,
    employee_id: "EMP-1004",
    first_name: "Ananya",
    last_name: "Deshmukh",
    email: "ananya.d@techcorp.com",
    phone: "+91 99887 76655",
    department: "Marketing",
    designation: "Digital Growth Specialist",
    salary: 58000,
    joining_date: "2023-08-11",
    address: "24 Shivaji Nagar, Pune, Maharashtra",
    status: "Inactive",
    created_at: "2023-08-11T10:15:00.000Z",
    updated_at: "2024-03-01T16:45:00.000Z"
  },
  {
    id: 5,
    employee_id: "EMP-1005",
    first_name: "Vikram",
    last_name: "Singh",
    email: "vikram.singh@techcorp.com",
    phone: "+91 91234 56780",
    department: "Engineering",
    designation: "DevOps & Cloud Architect",
    salary: 92000,
    joining_date: "2023-10-05",
    address: "House 18, Defence Colony, New Delhi",
    status: "Active",
    created_at: "2023-10-05T09:00:00.000Z",
    updated_at: "2024-04-12T08:20:00.000Z"
  },
  {
    id: 6,
    employee_id: "EMP-1006",
    first_name: "Kavita",
    last_name: "Rao",
    email: "kavita.rao@techcorp.com",
    phone: "+91 94455 66778",
    department: "Operations",
    designation: "Supply Chain Manager",
    salary: 68000,
    joining_date: "2024-01-10",
    address: "55 Jubilee Hills, Hyderabad, Telangana",
    status: "Active",
    created_at: "2024-01-10T11:00:00.000Z",
    updated_at: "2024-01-10T11:00:00.000Z"
  }
];

function getStoredLocalEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultEmployees));
      return defaultEmployees;
    }
    return JSON.parse(raw);
  } catch {
    return defaultEmployees;
  }
}

function saveStoredLocalEmployees(list: Employee[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Local storage error", err);
  }
}

export const api = {
  async getEmployees(params?: { search?: string; department?: string; status?: string }): Promise<Employee[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.department && params.department !== "All") query.append("department", params.department);
      if (params?.status && params.status !== "All") query.append("status", params.status);

      const res = await fetch(`/api/employees?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      saveStoredLocalEmployees(data);
      return data;
    } catch {
      // Offline fallback
      let list = getStoredLocalEmployees();
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            e.employee_id.toLowerCase().includes(q) ||
            `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q) ||
            e.phone.toLowerCase().includes(q) ||
            e.designation.toLowerCase().includes(q)
        );
      }
      if (params?.department && params.department !== "All") {
        list = list.filter((e) => e.department.toLowerCase() === params.department!.toLowerCase());
      }
      if (params?.status && params.status !== "All") {
        list = list.filter((e) => e.status.toLowerCase() === params.status!.toLowerCase());
      }
      return list;
    }
  },

  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const res = await fetch(`/api/employees/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const list = getStoredLocalEmployees();
      const item = list.find((e) => e.id === id);
      if (!item) throw new Error("Employee not found");
      return item;
    }
  },

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || responseData.detail || "Failed to create employee");
      }
      return responseData;
    } catch (err: any) {
      // Check local duplicates in fallback
      const list = getStoredLocalEmployees();
      if (list.some((e) => e.employee_id.toLowerCase() === data.employee_id.trim().toLowerCase())) {
        throw new Error("Employee ID already exists. Please use a unique ID.");
      }
      if (list.some((e) => e.email.toLowerCase() === data.email.trim().toLowerCase())) {
        throw new Error("Email address already exists in the system.");
      }
      const maxId = list.reduce((m, x) => (x.id > m ? x.id : m), 0);
      const newEmp: Employee = {
        id: maxId + 1,
        employee_id: data.employee_id.trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        department: data.department.trim(),
        designation: data.designation.trim(),
        salary: Number(data.salary),
        joining_date: data.joining_date,
        address: data.address.trim(),
        status: data.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      list.push(newEmp);
      saveStoredLocalEmployees(list);
      return newEmp;
    }
  },

  async updateEmployee(id: number, data: Partial<EmployeeFormData>): Promise<Employee> {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || responseData.detail || "Failed to update employee");
      }
      return responseData;
    } catch (err: any) {
      const list = getStoredLocalEmployees();
      const index = list.findIndex((e) => e.id === id);
      if (index === -1) throw new Error("Employee not found");

      if (data.employee_id) {
        const dup = list.find((e) => e.id !== id && e.employee_id.toLowerCase() === data.employee_id!.trim().toLowerCase());
        if (dup) throw new Error("Employee ID already in use by another record.");
      }
      if (data.email) {
        const dup = list.find((e) => e.id !== id && e.email.toLowerCase() === data.email!.trim().toLowerCase());
        if (dup) throw new Error("Email already in use by another record.");
      }

      const updated: Employee = {
        ...list[index],
        ...data,
        salary: data.salary !== undefined ? Number(data.salary) : list[index].salary,
        updated_at: new Date().toISOString()
      };
      list[index] = updated;
      saveStoredLocalEmployees(list);
      return updated;
    }
  },

  async deleteEmployee(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete employee");
      return data;
    } catch {
      const list = getStoredLocalEmployees();
      const filtered = list.filter((e) => e.id !== id);
      saveStoredLocalEmployees(filtered);
      return { message: "Employee successfully deleted." };
    }
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const res = await fetch("/api/dashboard/summary");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      const list = getStoredLocalEmployees();
      const total = list.length;
      const active = list.filter((e) => e.status === "Active").length;
      const inactive = total - active;
      const departmentSummary: Record<string, number> = {};
      list.forEach((e) => {
        departmentSummary[e.department] = (departmentSummary[e.department] || 0) + 1;
      });
      const recent = [...list]
        .sort((a, b) => new Date(b.joining_date).getTime() - new Date(a.joining_date).getTime())
        .slice(0, 5);
      return { total, active, inactive, departmentSummary, recent };
    }
  },

  getStoredAuthUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        // Return default logged in user so student immediately interacts without blocker,
        // while also being able to log out and log in anytime!
        const defaultUser: User = {
          id: 1,
          username: "admin",
          name: "System Administrator",
          role: "SuperAdmin",
          email: "admin@ems-college.org"
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setStoredAuthUser(user: User | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
};
