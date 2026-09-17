import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { DashboardSummary, Employee, ViewTab } from "../types";

interface DashboardProps {
  summary: DashboardSummary;
  onNavigate: (tab: ViewTab) => void;
  onViewEmployee: (employee: Employee) => void;
  onAddEmployee: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  onNavigate,
  onViewEmployee,
  onAddEmployee
}) => {
  const departmentEntries = Object.entries(summary.departmentSummary || {});
  const activePercent = summary.total > 0 ? Math.round((summary.active / summary.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Live System Metrics
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Employee Management Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time organizational analytics, headcount distribution, and recent onboarding status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="btn-dashboard-add-employee"
            onClick={onAddEmployee}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Employee</span>
          </button>
          <button
            id="btn-dashboard-view-all"
            onClick={() => onNavigate("employees")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
          >
            <span>Employee Directory</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Workforce</span>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{summary.total}</span>
            <span className="text-xs text-slate-500 ml-2">Registered</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active database records across all departments</p>
        </div>

        {/* Active Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active Staff</span>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-emerald-700">{summary.active}</span>
            <span className="text-xs font-medium text-emerald-600 ml-2">({activePercent}% active)</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Currently engaged in active corporate duties</p>
        </div>

        {/* Inactive Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inactive Staff</span>
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-700">{summary.inactive}</span>
            <span className="text-xs text-slate-500 ml-2">On leave / Resigned</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Separated or on prolonged sabbatical leave</p>
        </div>

        {/* Departments Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">Departments</span>
            <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{departmentEntries.length}</span>
            <span className="text-xs text-slate-500 ml-2">Operational units</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Cross-functional corporate team divisions</p>
        </div>
      </div>

      {/* Grid: Department Distribution & Recent Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Summary Cards */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Department Summary</h2>
              <p className="text-xs text-slate-500">Staff distribution per business unit</p>
            </div>
            <Building2 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-3 flex-1">
            {departmentEntries.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No department data recorded.</p>
            ) : (
              departmentEntries.map(([dept, count]) => {
                const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                return (
                  <div key={dept} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center text-sm font-medium mb-1.5">
                      <span className="text-slate-800">{dept}</span>
                      <span className="text-slate-900 font-semibold">
                        {count} <span className="text-xs text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Employees Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Employee Onboarding</h2>
              <p className="text-xs text-slate-500">Latest additions to the organizational roster</p>
            </div>
            <button
              onClick={() => onNavigate("employees")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 overflow-x-auto flex-1">
            {summary.recent.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No recent employees available. Click "Add New Employee" to get started!
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase">
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Designation</th>
                    <th className="py-3 px-3">Joining Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.recent.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {emp.first_name[0]}
                            {emp.last_name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {emp.first_name} {emp.last_name}
                            </div>
                            <div className="text-xs font-mono text-slate-500">{emp.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 text-xs font-medium">{emp.department}</td>
                      <td className="py-3 px-3 text-slate-600 text-xs">{emp.designation}</td>
                      <td className="py-3 px-3 text-slate-600 text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {emp.joining_date}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          title="View Profile Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
