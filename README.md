# Employee Management System (EMS)

An enterprise-ready, beginner-friendly full-stack web application designed for organization-wide staff management, record tracking, analytics, and college project demonstrations.

---

## 1. Project Title
**StaffSync: Employee Management System (EMS)**

---

## 2. Project Overview
The Employee Management System is a full-stack solution allowing human resources and organizational administrators to manage employee lifecycle data, track departmental distribution, perform real-time searching and filtering, and conduct audited CRUD operations over a robust REST API.

---

## 3. Problem Statement
Many medium and small organizations manage employee records using scattered spreadsheets and manual paperwork. This causes:
- Inconsistent employee records and missing contact details.
- Accidental duplicate employee IDs and duplicate corporate emails.
- Lack of immediate visibility into headcount and department metrics.
- Security vulnerabilities and data loss risks.

---

## 4. Objectives
- Implement full **CRUD (Create, Read, Update, Delete)** operations with client & server-side validation.
- Provide a clean, modern **Dashboard** with department distribution and onboarding timelines.
- Build a standard **REST API** following HTTP semantics (`200`, `201`, `204`, `400`, `404`).
- Prevent duplicate IDs and emails at both API and database layers.
- Implement responsive UI supporting desktop, tablet, and mobile displays.

---

## 5. Features
- **Administrative Authentication**: Protected views and role-based demonstration credentials.
- **Analytics Dashboard**: Real-time KPI cards (Total Workforce, Active Staff, Inactive Staff, Department counts).
- **Search & Filter**: Live text search across ID, name, role, email, phone + Department & Status dropdown filters.
- **Employee Creation**: Strict field validation, unique constraint checks, auto-assigned Employee IDs.
- **Detailed Profile View**: Modal dialog displaying complete employment history, contact info, salary, and calculated tenure.
- **Safe Deletion**: Dual-action confirmation modal displaying target employee details to prevent accidental data loss.
- **Interactive REST API & Postman Test Center**: Built-in test console with all 11 Postman test cases.

---

## 6. Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, TypeScript
- **Backend**: Python 3.10+, Django 5.0, Django REST Framework (DRF), django-cors-headers, django-filter
- **Development Server**: Express.js REST API with file persistence & Vite middleware
- **Database**: SQLite (`db.sqlite3`)
- **API Testing**: Postman Collection (v2.1)
- **Version Control**: Git & GitHub

---

## 7. System Architecture
```text
User / Browser
      ↓
React.js Frontend (Vite + Tailwind CSS)
      ↓ HTTP / JSON (REST API)
Django REST Framework (DRF Views & Serializers)
      ↓ Django ORM
SQLite Relational Database (db.sqlite3)
```

---

## 8. Database Structure (Employee Entity)
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigAutoField | Primary Key | Internal record identifier |
| `employee_id` | CharField(20) | Unique, Indexed | Human-readable ID (e.g. `EMP-1001`) |
| `first_name` | CharField(50) | Not Null | Employee given name |
| `last_name` | CharField(50) | Not Null | Employee family name |
| `email` | EmailField | Unique, Indexed | Corporate email address |
| `phone` | CharField(25) | Min 7 digits | Phone contact number |
| `department` | CharField(100) | Choices | Business unit |
| `designation` | CharField(100) | Not Null | Job position / title |
| `salary` | DecimalField(12,2) | MinValueValidator(0.01) | Positive annual compensation |
| `joining_date` | DateField | YYYY-MM-DD | Employment start date |
| `address` | TextField | Blank allowed | Residential address |
| `status` | CharField(10) | 'Active' / 'Inactive' | Employment state |
| `created_at` | DateTimeField | Auto Now Add | Record creation timestamp |
| `updated_at` | DateTimeField | Auto Now | Last updated timestamp |

---

## 9. REST API Endpoints
| HTTP Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees/` | Retrieve all employees (supports `?search=`, `?department=`, `?status=`) | `200 OK` |
| `POST` | `/api/employees/` | Create a new employee record | `201 Created` / `400 Bad Request` |
| `GET` | `/api/employees/{id}/` | Retrieve employee by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/employees/{id}/` | Full update of employee details | `200 OK` / `400 Bad Request` |
| `PATCH` | `/api/employees/{id}/` | Partial update of employee fields | `200 OK` / `400 Bad Request` |
| `DELETE` | `/api/employees/{id}/` | Delete employee record | `200 OK` / `204 No Content` |
| `GET` | `/api/dashboard/summary/` | Headcount metrics & department distribution | `200 OK` |
| `POST` | `/api/auth/login/` | Administrative login endpoint | `200 OK` / `401 Unauthorized` |

---

## 10. CRUD Operations Workflow
1. **Create**: User clicks "Add Employee", fills validated form, POST request persists to database.
2. **Read**: Table lists records with sort, search, and department/status filters; eye icon opens full profile.
3. **Update**: Pencil icon loads pre-populated modal; updates are validated on client and backend.
4. **Delete**: Trash icon opens warning modal showing employee name and ID; deletion updates state immediately.

---

## 11. Installation Steps
Clone the project repository:
```bash
git clone https://github.com/your-username/employee-management-system.git
cd employee-management-system
```

---

## 12. Backend Setup (Django & Python)
Navigate to backend directory:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 13. Frontend Setup (React & Vite)
Install dependencies from root directory:
```bash
npm install
```

---

## 14. Database Setup & Migrations
Inside the `backend/` folder:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional admin user
```

---

## 15. Running the Application
### Option A: Development Server (AI Studio Live Preview)
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Option B: Running Standalone Django + React
1. Start Django backend (port 8000):
   ```bash
   cd backend
   python manage.py runserver
   ```
2. In a second terminal, start Vite frontend:
   ```bash
   npm run dev
   ```

---

## 16. Postman Testing
Import `postman/Employee_Management_API.postman_collection.json` into Postman.
Execute tests 1 through 11 in sequence to verify happy paths, uniqueness checks, and negative validation tests.

---

## 17. Screenshots Section
- **Dashboard**: KPI widgets, department distribution progress bars, and recent onboarding table.
- **Employee Directory**: Paginated, sortable responsive table with avatar chips and filter badges.
- **Form Modals**: Client-side feedback showing red error states for invalid emails or negative salaries.
- **Profile Modal**: Full employee detail card with badge, calculated tenure, and contact details.

---

## 18. Challenges & Solutions
- **Duplicate Prevention**: Resolved by enforcing both database `unique=True` constraints and DRF serializer `validate_employee_id()` and `validate_email()` checks.
- **CORS Errors**: Handled using `django-cors-headers` middleware placed before Django CommonMiddleware.
- **Accidental Deletions**: Designed a dedicated confirmation modal that displays employee name and ID before execution.

---

## 19. Future Enhancements
- Export records to PDF / Excel formats.
- Department transfer workflow with audit history.
- Payroll generation and payslip distribution.
- Role-based fine-grained permissions (Employee, HR Manager, Admin).

---

## 20. GitHub Preparation & Commits
```bash
git init
git add .
git commit -m "feat: complete employee management system with full-stack CRUD and viva suite"
```
