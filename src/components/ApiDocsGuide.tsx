import React, { useState } from "react";
import {
  Code2,
  Terminal,
  FileText,
  HelpCircle,
  Play,
  Copy,
  Check,
  CheckCircle,
  Database,
  Layers,
  ChevronRight
} from "lucide-react";

export const ApiDocsGuide: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"api-test" | "postman" | "django-code" | "viva">("api-test");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("GET /api/employees");
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiStatusCode, setApiStatusCode] = useState<number | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExecuteLiveTest = async (endpoint: string) => {
    setIsCallingApi(true);
    setApiResponse(null);
    setApiStatusCode(null);

    try {
      if (endpoint === "GET /api/employees") {
        const res = await fetch("/api/employees");
        const data = await res.json();
        setApiStatusCode(res.status);
        setApiResponse(JSON.stringify(data, null, 2));
      } else if (endpoint === "GET /api/employees/1") {
        const res = await fetch("/api/employees/1");
        const data = await res.json();
        setApiStatusCode(res.status);
        setApiResponse(JSON.stringify(data, null, 2));
      } else if (endpoint === "GET /api/dashboard/summary") {
        const res = await fetch("/api/dashboard/summary");
        const data = await res.json();
        setApiStatusCode(res.status);
        setApiResponse(JSON.stringify(data, null, 2));
      } else if (endpoint === "POST /api/employees (Validation Test)") {
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: "EMP-TEST",
            first_name: "Test",
            last_name: "User",
            email: "not-an-email", // intentional invalid email
            phone: "123",
            department: "Engineering",
            designation: "Tester",
            salary: -500, // intentional invalid salary
            joining_date: "2024-01-01",
            status: "Active"
          })
        });
        const data = await res.json();
        setApiStatusCode(res.status);
        setApiResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setApiStatusCode(500);
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const postmanTests = [
    {
      title: "1. Create Employee (Valid)",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "201 Created",
      body: `{
  "employee_id": "EMP-1008",
  "first_name": "Siddharth",
  "last_name": "Verma",
  "email": "siddharth.v@techcorp.com",
  "phone": "+91 98765 00001",
  "department": "Engineering",
  "designation": "Backend Developer",
  "salary": 78000,
  "joining_date": "2024-03-15",
  "address": "Sector 14, Gurgaon, Haryana",
  "status": "Active"
}`
    },
    {
      title: "2. Get All Employees",
      method: "GET",
      url: "http://localhost:3000/api/employees/",
      status: "200 OK",
      body: "None (Query params supported: ?search=Aarav&department=Engineering&status=Active)"
    },
    {
      title: "3. Get Single Employee",
      method: "GET",
      url: "http://localhost:3000/api/employees/1/",
      status: "200 OK",
      body: "None"
    },
    {
      title: "4. Update Employee",
      method: "PUT",
      url: "http://localhost:3000/api/employees/1/",
      status: "200 OK",
      body: `{
  "first_name": "Aarav",
  "last_name": "Sharma",
  "designation": "Lead Full Stack Architect",
  "salary": 95000,
  "status": "Active"
}`
    },
    {
      title: "5. Delete Employee",
      method: "DELETE",
      url: "http://localhost:3000/api/employees/1/",
      status: "200 OK / 204 No Content",
      body: "None"
    },
    {
      title: "6. Invalid Employee ID",
      method: "GET",
      url: "http://localhost:3000/api/employees/9999/",
      status: "404 Not Found",
      body: `Expected: { "error": "Employee with ID '9999' was not found." }`
    },
    {
      title: "7. Missing Required Field",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "400 Bad Request",
      body: `{
  "first_name": "Neha"
  // Missing employee_id, email, phone, etc.
}`
    },
    {
      title: "8. Duplicate Employee ID",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "400 Bad Request",
      body: `{
  "employee_id": "EMP-1001", // already exists
  "first_name": "Duplicate",
  "last_name": "Test",
  "email": "unique@example.com"
}`
    },
    {
      title: "9. Duplicate Email",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "400 Bad Request",
      body: `{
  "employee_id": "EMP-9999",
  "first_name": "Duplicate",
  "last_name": "Email",
  "email": "aarav.sharma@techcorp.com" // already assigned to EMP-1001
}`
    },
    {
      title: "10. Invalid Email Format",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "400 Bad Request",
      body: `{
  "email": "not-a-valid-email"
}`
    },
    {
      title: "11. Invalid Salary (Negative / Zero)",
      method: "POST",
      url: "http://localhost:3000/api/employees/",
      status: "400 Bad Request",
      body: `{
  "salary": -5000
}`
    }
  ];

  const djangoCodeFiles: Record<string, string> = {
    "models.py": `from django.db import models
from django.core.validators import MinValueValidator

class Employee(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    employee_id = models.CharField(max_length=20, unique=True, db_index=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    joining_date = models.DateField()
    address = models.TextField(blank=True, default='')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"`,

    "serializers.py": `from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    def validate_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError("Salary must be a positive number greater than 0.")
        return value

    def validate_phone(self, value):
        digits = [c for c in value if c.isdigit()]
        if len(digits) < 7:
            raise serializers.ValidationError("Phone number must contain at least 7 digits.")
        return value`,

    "views.py": `from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'status']
    search_fields = ['employee_id', 'first_name', 'last_name', 'email', 'designation', 'phone']
    ordering_fields = ['joining_date', 'salary', 'first_name', 'employee_id']

@api_view(['GET'])
def dashboard_summary(request):
    total = Employee.objects.count()
    active = Employee.objects.filter(status='Active').count()
    inactive = total - active
    
    # Department summary
    from django.db.models import Count
    dept_counts = Employee.objects.values('department').annotate(count=Count('department'))
    department_summary = {d['department']: d['count'] for d in dept_counts}

    # Recent 5 employees
    recent = EmployeeSerializer(Employee.objects.order_by('-joining_date')[:5], many=True).data

    return Response({
        'total': total,
        'active': active,
        'inactive': inactive,
        'departmentSummary': department_summary,
        'recent': recent
    })`,

    "urls.py": `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, dashboard_summary

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', dashboard_summary, name='dashboard-summary'),
]`,

    "admin.py": `from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'department',
        'designation',
        'salary',
        'status',
        'joining_date'
    )
    search_fields = ('employee_id', 'first_name', 'last_name', 'email', 'department')
    list_filter = ('department', 'status', 'joining_date')
    ordering = ('-joining_date',)`
  };

  const [selectedDjangoFile, setSelectedDjangoFile] = useState<string>("models.py");

  const vivaQA = [
    {
      q: "1. What is CRUD and how is it implemented in this system?",
      a: "CRUD stands for Create, Read, Update, Delete. In our application, Create adds a new employee (POST /api/employees), Read fetches all or individual employees with filters/search (GET /api/employees), Update modifies existing records (PUT/PATCH /api/employees/:id), and Delete safely deletes records with confirmation (DELETE /api/employees/:id)."
    },
    {
      q: "2. Why is both client-side and server-side validation necessary?",
      a: "Client-side validation provides immediate, user-friendly feedback before making an HTTP network request. However, client-side validation can be bypassed using Postman or scripts. Server-side validation guarantees data integrity, security, and unique constraints (like unique employee_id and unique email) at the application and database level."
    },
    {
      q: "3. What is the role of Django REST Framework (DRF) and Serializers?",
      a: "DRF bridges the Django backend and frontend by converting complex database QuerySets and model instances into standard JSON (serialization) and deserializing JSON requests back into validated Python objects to save to the database."
    },
    {
      q: "4. What is the advantage of using SQLite for development?",
      a: "SQLite is a lightweight, zero-configuration relational database engine embedded directly into Python. It writes to a single file (db.sqlite3) without needing a separate database server process, making it ideal for development, testing, and student viva demonstrations."
    },
    {
      q: "5. What are HTTP status codes and which ones are used here?",
      a: "HTTP status codes communicate the result of an API request: 200 OK (successful read/update), 201 Created (successful creation of employee), 204 No Content / 200 OK (successful deletion), 400 Bad Request (validation errors), 401 Unauthorized (invalid login), and 404 Not Found (employee ID does not exist)."
    },
    {
      q: "6. What is CORS and why must it be configured?",
      a: "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts resources requested from a different domain or port. Because the React frontend and Django backend run on different ports during development, Django must allow CORS headers for the frontend's origin."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Viva & Demonstration Kit
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
              REST API v1.0
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">API Testing, Postman & College Viva Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Test live REST endpoints, inspect Postman request payloads, and review Django source files for your project presentation.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveSubTab("api-test")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === "api-test" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Live Endpoint Tester
          </button>
          <button
            onClick={() => setActiveSubTab("postman")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === "postman" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Postman Test Cases (11)
          </button>
          <button
            onClick={() => setActiveSubTab("django-code")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === "django-code" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Django Source Files
          </button>
          <button
            onClick={() => setActiveSubTab("viva")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === "viva" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Viva Q&A
          </button>
        </div>
      </div>

      {/* SubTab 1: Live Endpoint Tester */}
      {activeSubTab === "api-test" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Endpoint to Test</h2>
            <div className="space-y-2">
              {[
                { name: "GET /api/employees", desc: "List all employees" },
                { name: "GET /api/employees/1", desc: "Retrieve employee #1" },
                { name: "GET /api/dashboard/summary", desc: "Metrics & department counts" },
                { name: "POST /api/employees (Validation Test)", desc: "Trigger 400 Bad Request" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedEndpoint(item.name)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedEndpoint === item.name
                      ? "border-indigo-600 bg-indigo-50/70 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-slate-900 block">{item.name}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{item.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleExecuteLiveTest(selectedEndpoint)}
              disabled={isCallingApi}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{isCallingApi ? "Executing Request..." : "Send Live HTTP Request"}</span>
            </button>
          </div>

          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-slate-300">HTTP Response Console</span>
              </div>
              {apiStatusCode && (
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-md font-bold ${
                    apiStatusCode >= 200 && apiStatusCode < 300
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  HTTP {apiStatusCode}
                </span>
              )}
            </div>

            <div className="mt-4 flex-1 font-mono text-xs overflow-x-auto">
              {apiResponse ? (
                <pre className="text-emerald-300 whitespace-pre-wrap">{apiResponse}</pre>
              ) : (
                <div className="py-20 text-center text-slate-500">
                  Select an endpoint from the left and click <strong>"Send Live HTTP Request"</strong> to view the JSON output and status codes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Postman Test Cases */}
      {activeSubTab === "postman" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Postman Test Suite:</strong> Use these 11 test cases during your college demonstration to prove full-stack validation, status codes, and error handling.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {postmanTests.map((test, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{test.title}</span>
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-md font-bold ${
                      test.status.startsWith("2")
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {test.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      test.method === "GET"
                        ? "bg-blue-100 text-blue-700"
                        : test.method === "POST"
                        ? "bg-emerald-100 text-emerald-700"
                        : test.method === "PUT"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {test.method}
                  </span>
                  <span className="text-slate-700 truncate">{test.url}</span>
                </div>

                <div className="relative">
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-36">
                    {test.body}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(test.body, `postman-${index}`)}
                    className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedIndex === `postman-${index}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedIndex === `postman-${index}` ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Django Code Viewer */}
      {activeSubTab === "django-code" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Backend Architecture</h2>
            {Object.keys(djangoCodeFiles).map((filename) => (
              <button
                key={filename}
                onClick={() => setSelectedDjangoFile(filename)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-between ${
                  selectedDjangoFile === filename
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{filename}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>
            ))}
          </div>

          <div className="lg:col-span-9 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-200 shadow-xs relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-mono text-xs font-bold text-amber-400">{selectedDjangoFile}</span>
              <button
                onClick={() => copyToClipboard(djangoCodeFiles[selectedDjangoFile], "django-file")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                {copiedIndex === "django-file" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedIndex === "django-file" ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {djangoCodeFiles[selectedDjangoFile]}
            </pre>
          </div>
        </div>
      )}

      {/* SubTab 4: Viva Questions and Answers */}
      {activeSubTab === "viva" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs">
            <strong>College Project Viva Preparation:</strong> Review these frequently asked questions by external examiners regarding full-stack architecture, DRF, and database constraints.
          </div>

          <div className="space-y-3">
            {vivaQA.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
