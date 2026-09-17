import React from "react";
import {
  X,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Employee } from "../types";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
}

export const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !employee) return null;

  // Calculate approximate tenure
  const joiningDate = new Date(employee.joining_date);
  const now = new Date();
  const diffMonths =
    (now.getFullYear() - joiningDate.getFullYear()) * 12 +
    (now.getMonth() - joiningDate.getMonth());
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  const tenureText =
    years > 0
      ? `${years} yr${years > 1 ? "s" : ""} ${months > 0 ? `${months} mo${months > 1 ? "s" : ""}` : ""}`
      : `${Math.max(1, months)} month${months !== 1 ? "s" : ""}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600 border-2 border-indigo-400/40 text-white font-bold text-xl flex items-center justify-center shadow-lg">
              {employee.first_name[0]}
              {employee.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {employee.first_name} {employee.last_name}
                </h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    employee.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-700 text-slate-300 border border-slate-600"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <p className="text-indigo-300 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3.5 w-3.5" />
                {employee.designation}
              </p>
              <p className="text-xs font-mono text-slate-400 mt-1">ID: {employee.employee_id}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Department</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate">{employee.department}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Annual Comp</span>
              <span className="text-xs font-bold text-emerald-700 font-mono mt-1 block">
                ${employee.salary.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">Tenure</span>
              <span className="text-xs font-bold text-indigo-700 mt-1 block">{tenureText}</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Contact & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/70">
                <Mail className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Email Address</span>
                  <a href={`mailto:${employee.email}`} className="text-xs font-medium text-slate-800 hover:text-indigo-600">
                    {employee.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/70">
                <Phone className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Direct Phone</span>
                  <span className="text-xs font-mono font-medium text-slate-800">{employee.phone}</span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50/70">
                <MapPin className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Residential Address</span>
                  <span className="text-xs text-slate-800">{employee.address || "No address provided on record."}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              Employment Timeline & Metadata
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Joining Date: <strong className="text-slate-800 font-mono">{employee.joining_date}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Updated:{" "}
                  <span className="text-slate-700">
                    {employee.updated_at ? new Date(employee.updated_at).toLocaleDateString() : "Initial record"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onDelete(employee);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Employee</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
