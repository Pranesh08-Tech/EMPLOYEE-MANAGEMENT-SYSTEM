import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Save, User, Building, DollarSign, Calendar, Mail, Phone, MapPin, Hash } from "lucide-react";
import { Employee, EmployeeFormData, FormErrors } from "../types";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormData, id?: number) => Promise<void>;
  initialEmployee?: Employee | null;
  existingEmployees: Employee[];
}

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Operations",
  "Sales",
  "Product Design",
  "Legal & Compliance"
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmployee,
  existingEmployees
}) => {
  const isEditMode = !!initialEmployee;

  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "Engineering",
    designation: "",
    salary: "",
    joining_date: new Date().toISOString().split("T")[0],
    address: "",
    status: "Active"
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Initialize or reset form data
  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        employee_id: initialEmployee.employee_id,
        first_name: initialEmployee.first_name,
        last_name: initialEmployee.last_name,
        email: initialEmployee.email,
        phone: initialEmployee.phone,
        department: initialEmployee.department,
        designation: initialEmployee.designation,
        salary: initialEmployee.salary,
        joining_date: initialEmployee.joining_date,
        address: initialEmployee.address,
        status: initialEmployee.status
      });
    } else {
      // Auto-suggest next employee ID like EMP-1007
      const existingNumbers = existingEmployees
        .map((e) => {
          const match = e.employee_id.match(/\d+/);
          return match ? parseInt(match[0], 10) : 1000;
        })
        .filter((n) => !isNaN(n));
      const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1000;
      const nextId = `EMP-${maxNum + 1}`;

      setFormData({
        employee_id: nextId,
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department: "Engineering",
        designation: "",
        salary: "",
        joining_date: new Date().toISOString().split("T")[0],
        address: "",
        status: "Active"
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialEmployee, isOpen, existingEmployees]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Employee ID
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = "Employee ID is required.";
    } else {
      const isDuplicateId = existingEmployees.some((e) => {
        if (isEditMode && initialEmployee && e.id === initialEmployee.id) return false;
        return e.employee_id.toLowerCase() === formData.employee_id.trim().toLowerCase();
      });
      if (isDuplicateId) {
        newErrors.employee_id = "This Employee ID is already assigned to another employee.";
      }
    }

    // First Name
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required.";
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = "First name must be at least 2 characters.";
    }

    // Last Name
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required.";
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = "Last name must be at least 2 characters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email format (e.g. name@company.com).";
    } else {
      const isDuplicateEmail = existingEmployees.some((e) => {
        if (isEditMode && initialEmployee && e.id === initialEmployee.id) return false;
        return e.email.toLowerCase() === formData.email.trim().toLowerCase();
      });
      if (isDuplicateEmail) {
        newErrors.email = "This email is already registered in the system.";
      }
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (formData.phone.trim().replace(/\D/g, "").length < 7) {
      newErrors.phone = "Please provide a valid contact number (at least 7 digits).";
    }

    // Department
    if (!formData.department.trim()) {
      newErrors.department = "Department is required.";
    }

    // Designation
    if (!formData.designation.trim()) {
      newErrors.designation = "Job title/designation is required.";
    }

    // Salary
    const salaryNum = Number(formData.salary);
    if (formData.salary === "" || formData.salary === undefined || formData.salary === null) {
      newErrors.salary = "Salary is required.";
    } else if (isNaN(salaryNum) || salaryNum <= 0) {
      newErrors.salary = "Salary must be a positive number greater than 0.";
    }

    // Joining Date
    if (!formData.joining_date) {
      newErrors.joining_date = "Joining date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData, initialEmployee?.id);
      onClose();
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred while saving employee.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditMode ? `Edit Employee: ${initialEmployee?.first_name} ${initialEmployee?.last_name}` : "Create New Employee Record"}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode ? "Update staff member details and constraints" : "Fill in all mandatory employee profile fields"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Server Error Alert */}
        {serverError && (
          <div className="m-6 mb-0 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Server Error:</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Hash className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="form-employee-id"
                  type="text"
                  placeholder="e.g. EMP-1008"
                  value={formData.employee_id}
                  onChange={(e) => {
                    setFormData({ ...formData, employee_id: e.target.value });
                    if (errors.employee_id) setErrors({ ...errors, employee_id: undefined });
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono focus:outline-none focus:ring-2 ${
                    errors.employee_id
                      ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  }`}
                />
              </div>
              {errors.employee_id && <p className="text-[11px] text-rose-600 mt-1">{errors.employee_id}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employment Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="form-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              >
                <option value="Active">Active (Fully Engaged)</option>
                <option value="Inactive">Inactive (On Leave / Separated)</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-first-name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => {
                  setFormData({ ...formData, first_name: e.target.value });
                  if (errors.first_name) setErrors({ ...errors, first_name: undefined });
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.first_name
                    ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                }`}
              />
              {errors.first_name && <p className="text-[11px] text-rose-600 mt-1">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-last-name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => {
                  setFormData({ ...formData, last_name: e.target.value });
                  if (errors.last_name) setErrors({ ...errors, last_name: undefined });
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.last_name
                    ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                }`}
              />
              {errors.last_name && <p className="text-[11px] text-rose-600 mt-1">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="form-email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="form-phone"
                  type="text"
                  placeholder="+1 (555) 000-1234"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="form-department"
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value });
                    if (errors.department) setErrors({ ...errors, department: undefined });
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Designation / Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="form-designation"
                type="text"
                placeholder="Software Engineer"
                value={formData.designation}
                onChange={(e) => {
                  setFormData({ ...formData, designation: e.target.value });
                  if (errors.designation) setErrors({ ...errors, designation: undefined });
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.designation
                    ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                    : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                }`}
              />
              {errors.designation && <p className="text-[11px] text-rose-600 mt-1">{errors.designation}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Annual Salary ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="form-salary"
                  type="number"
                  min="1"
                  step="500"
                  placeholder="75000"
                  value={formData.salary}
                  onChange={(e) => {
                    setFormData({ ...formData, salary: e.target.value });
                    if (errors.salary) setErrors({ ...errors, salary: undefined });
                  }}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.salary
                      ? "border-rose-300 focus:ring-rose-500/20 text-rose-900"
                      : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  }`}
                />
              </div>
              {errors.salary && <p className="text-[11px] text-rose-600 mt-1">{errors.salary}</p>}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Joining Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="form-joining-date"
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => {
                    setFormData({ ...formData, joining_date: e.target.value });
                    if (errors.joining_date) setErrors({ ...errors, joining_date: undefined });
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-mono"
                />
              </div>
              {errors.joining_date && <p className="text-[11px] text-rose-600 mt-1">{errors.joining_date}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <textarea
                id="form-address"
                rows={2}
                placeholder="Street address, city, state, postal code..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-employee"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? "Saving Record..." : isEditMode ? "Update Employee" : "Save Employee"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
