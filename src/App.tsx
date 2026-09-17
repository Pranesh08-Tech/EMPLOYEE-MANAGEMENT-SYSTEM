import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { EmployeeList } from "./components/EmployeeList";
import { EmployeeFormModal } from "./components/EmployeeFormModal";
import { EmployeeDetailsModal } from "./components/EmployeeDetailsModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { LoginPage } from "./components/LoginPage";
import { ApiDocsGuide } from "./components/ApiDocsGuide";
import { api } from "./services/api";
import { Employee, EmployeeFormData, DashboardSummary, User, ViewTab } from "./types";
import { CheckCircle2, AlertCircle, X, ShieldAlert } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => api.getStoredAuthUser());
  const [currentTab, setCurrentTab] = useState<ViewTab>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>({
    total: 0,
    active: 0,
    inactive: 0,
    departmentSummary: {},
    recent: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Show auto-dismissing notifications
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Fetch employees and dashboard summary
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [empList, summary] = await Promise.all([
        api.getEmployees(),
        api.getDashboardSummary()
      ]);
      setEmployees(empList);
      setDashboardSummary(summary);
    } catch (err: any) {
      showNotification("error", "Failed to load employee records from backend.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, loadData]);

  // Auth actions
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    api.setStoredAuthUser(user);
    showNotification("success", `Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    api.setStoredAuthUser(null);
    setCurrentUser(null);
    showNotification("success", "You have been securely logged out.");
  };

  // Save (Create or Update) handler
  const handleSaveEmployee = async (formData: EmployeeFormData, id?: number) => {
    try {
      if (id) {
        const updated = await api.updateEmployee(id, formData);
        showNotification("success", `Employee '${updated.first_name} ${updated.last_name}' (${updated.employee_id}) updated successfully.`);
      } else {
        const created = await api.createEmployee(formData);
        showNotification("success", `Employee '${created.first_name} ${created.last_name}' (${created.employee_id}) added successfully.`);
      }
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  // Delete handler
  const handleDeleteConfirm = async (id: number) => {
    try {
      const res = await api.deleteEmployee(id);
      showNotification("success", res.message || "Employee successfully deleted.");
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsFormModalOpen(true);
  };

  // If user is not authenticated, show login page
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAddModal={handleOpenCreate}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
              notification.type === "success"
                ? "bg-slate-900 text-emerald-400 border-slate-700"
                : "bg-rose-900 text-rose-200 border-rose-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "dashboard" && (
          <Dashboard
            summary={dashboardSummary}
            onNavigate={setCurrentTab}
            onViewEmployee={(emp) => setViewingEmployee(emp)}
            onAddEmployee={handleOpenCreate}
          />
        )}

        {currentTab === "employees" && (
          <EmployeeList
            employees={employees}
            isLoading={isLoading}
            onRefresh={loadData}
            onView={(emp) => setViewingEmployee(emp)}
            onEdit={handleOpenEdit}
            onDelete={(emp) => setDeletingEmployee(emp)}
            onAdd={handleOpenCreate}
          />
        )}

        {currentTab === "api-guide" && <ApiDocsGuide />}
      </main>

      {/* Modals */}
      {/* 1. Add / Edit Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialEmployee={editingEmployee}
        existingEmployees={employees}
      />

      {/* 2. Details Profile Modal */}
      <EmployeeDetailsModal
        isOpen={!!viewingEmployee}
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={(emp) => {
          setViewingEmployee(null);
          handleOpenEdit(emp);
        }}
        onDelete={(emp) => {
          setViewingEmployee(null);
          setDeletingEmployee(emp);
        }}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingEmployee}
        employee={deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Employee Management System (EMS) • Full-Stack CRUD College Project</span>
          <span className="font-mono text-[11px] text-slate-400">
            Tech Stack: React + Vite + Tailwind CSS + Python / Django REST Architecture + SQLite
          </span>
        </div>
      </footer>
    </div>
  );
}
