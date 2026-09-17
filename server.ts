import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Employee {
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
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "employees.json");

const initialEmployees: Employee[] = [
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

function getEmployees(): Employee[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialEmployees, null, 2));
      return initialEmployees;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading employees file:", err);
    return initialEmployees;
  }
}

function saveEmployees(employees: Employee[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(employees, null, 2));
  } catch (err) {
    console.error("Error saving employees file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers for flexibility
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth: Login endpoint
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }
    // Demo credential validation (supports admin/admin123 or any reasonable student testing credentials)
    if (
      (username === "admin" && password === "admin123") ||
      (username === "manager" && password === "password")
    ) {
      res.json({
        token: "jwt-demo-token-" + Date.now(),
        user: {
          id: 1,
          username,
          name: username === "admin" ? "System Administrator" : "Department Manager",
          role: username === "admin" ? "SuperAdmin" : "Manager",
          email: `${username}@ems-college.org`
        }
      });
      return;
    }
    res.status(401).json({ error: "Invalid credentials. (Hint: Use username 'admin' and password 'admin123')" });
  });

  // Auth: Logout endpoint
  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.json({ message: "Successfully logged out." });
  });

  // Stats / Dashboard summary
  app.get("/api/dashboard/summary", (_req: Request, res: Response) => {
    const employees = getEmployees();
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const inactive = total - active;

    const departmentSummary: Record<string, number> = {};
    employees.forEach((e) => {
      departmentSummary[e.department] = (departmentSummary[e.department] || 0) + 1;
    });

    const recent = [...employees]
      .sort((a, b) => new Date(b.joining_date).getTime() - new Date(a.joining_date).getTime())
      .slice(0, 5);

    res.json({
      total,
      active,
      inactive,
      departmentSummary,
      recent
    });
  });

  // GET /api/employees/ - List with Search and Filters
  app.get("/api/employees", (req: Request, res: Response) => {
    let list = getEmployees();
    const { search, department, status } = req.query;

    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.employee_id.toLowerCase().includes(q) ||
          e.first_name.toLowerCase().includes(q) ||
          e.last_name.toLowerCase().includes(q) ||
          `${e.first_name} ${e.last_name}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    if (department && typeof department === "string" && department !== "All") {
      list = list.filter((e) => e.department.toLowerCase() === department.toLowerCase());
    }

    if (status && typeof status === "string" && status !== "All") {
      list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
    }

    res.json(list);
  });

  // GET /api/employees/:id - Retrieve single employee
  app.get("/api/employees/:id", (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    const employees = getEmployees();
    const emp = employees.find((e) => e.id === id || e.employee_id.toLowerCase() === idParam.toLowerCase());

    if (!emp) {
      res.status(404).json({ error: `Employee with ID '${idParam}' was not found.` });
      return;
    }
    res.json(emp);
  });

  // POST /api/employees/ - Create employee
  app.post("/api/employees", (req: Request, res: Response) => {
    const employees = getEmployees();
    const {
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
      address,
      status
    } = req.body;

    const errors: Record<string, string> = {};

    // Validation
    if (!employee_id || !employee_id.trim()) {
      errors.employee_id = "Employee ID is required.";
    } else if (employees.some((e) => e.employee_id.toLowerCase() === employee_id.trim().toLowerCase())) {
      errors.employee_id = "Employee ID already exists. Please use a unique ID.";
    }

    if (!first_name || !first_name.trim()) {
      errors.first_name = "First name is required.";
    }

    if (!last_name || !last_name.trim()) {
      errors.last_name = "Last name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    } else if (employees.some((e) => e.email.toLowerCase() === email.trim().toLowerCase())) {
      errors.email = "Email address already registered to another employee.";
    }

    if (!phone || !phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (phone.trim().length < 7) {
      errors.phone = "Phone number must be at least 7 characters long.";
    }

    if (!department || !department.trim()) {
      errors.department = "Department is required.";
    }

    if (!designation || !designation.trim()) {
      errors.designation = "Designation is required.";
    }

    const numericSalary = Number(salary);
    if (salary === undefined || salary === null || isNaN(numericSalary) || numericSalary <= 0) {
      errors.salary = "Salary must be a positive number greater than 0.";
    }

    if (!joining_date) {
      errors.joining_date = "Joining date is required.";
    }

    const finalStatus = status === "Inactive" ? "Inactive" : "Active";

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors, error: "Validation failed. Please correct the highlighted errors." });
      return;
    }

    const maxId = employees.reduce((max, e) => (e.id > max ? e.id : max), 0);
    const newEmployee: Employee = {
      id: maxId + 1,
      employee_id: employee_id.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department: department.trim(),
      designation: designation.trim(),
      salary: numericSalary,
      joining_date,
      address: address ? address.trim() : "",
      status: finalStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    employees.push(newEmployee);
    saveEmployees(employees);

    res.status(201).json(newEmployee);
  });

  // PUT / PATCH /api/employees/:id - Update employee
  const handleUpdate = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const employees = getEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).json({ error: `Employee with ID ${req.params.id} does not exist.` });
      return;
    }

    const existing = employees[index];
    const {
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      department,
      designation,
      salary,
      joining_date,
      address,
      status
    } = req.body;

    const errors: Record<string, string> = {};

    if (employee_id !== undefined) {
      if (!employee_id.trim()) {
        errors.employee_id = "Employee ID cannot be blank.";
      } else if (
        employees.some(
          (e) => e.id !== id && e.employee_id.toLowerCase() === employee_id.trim().toLowerCase()
        )
      ) {
        errors.employee_id = "Employee ID is already in use by another employee.";
      }
    }

    if (first_name !== undefined && !first_name.trim()) {
      errors.first_name = "First name cannot be blank.";
    }

    if (last_name !== undefined && !last_name.trim()) {
      errors.last_name = "Last name cannot be blank.";
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) {
        errors.email = "Email cannot be blank.";
      } else if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address format.";
      } else if (
        employees.some((e) => e.id !== id && e.email.toLowerCase() === email.trim().toLowerCase())
      ) {
        errors.email = "Email already in use by another employee.";
      }
    }

    if (phone !== undefined && !phone.trim()) {
      errors.phone = "Phone number cannot be blank.";
    }

    if (salary !== undefined) {
      const numSalary = Number(salary);
      if (isNaN(numSalary) || numSalary <= 0) {
        errors.salary = "Salary must be a positive number greater than 0.";
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors, error: "Validation failed." });
      return;
    }

    const updatedEmployee: Employee = {
      ...existing,
      employee_id: employee_id !== undefined ? employee_id.trim() : existing.employee_id,
      first_name: first_name !== undefined ? first_name.trim() : existing.first_name,
      last_name: last_name !== undefined ? last_name.trim() : existing.last_name,
      email: email !== undefined ? email.trim().toLowerCase() : existing.email,
      phone: phone !== undefined ? phone.trim() : existing.phone,
      department: department !== undefined ? department.trim() : existing.department,
      designation: designation !== undefined ? designation.trim() : existing.designation,
      salary: salary !== undefined ? Number(salary) : existing.salary,
      joining_date: joining_date !== undefined ? joining_date : existing.joining_date,
      address: address !== undefined ? address.trim() : existing.address,
      status: status !== undefined ? (status === "Inactive" ? "Inactive" : "Active") : existing.status,
      updated_at: new Date().toISOString()
    };

    employees[index] = updatedEmployee;
    saveEmployees(employees);

    res.json(updatedEmployee);
  };

  app.put("/api/employees/:id", handleUpdate);
  app.patch("/api/employees/:id", handleUpdate);

  // DELETE /api/employees/:id - Delete employee
  app.delete("/api/employees/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const employees = getEmployees();
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).json({ error: `Employee with ID ${req.params.id} does not exist.` });
      return;
    }

    const deleted = employees.splice(index, 1)[0];
    saveEmployees(employees);

    res.status(200).json({
      message: `Employee '${deleted.first_name} ${deleted.last_name}' (${deleted.employee_id}) successfully deleted.`,
      deleted_id: id
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
