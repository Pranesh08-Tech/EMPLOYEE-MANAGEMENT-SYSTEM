import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  ArrowUpDown,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Employee } from "../types";

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
  onRefresh: () => void;
  onView: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onAdd: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  isLoading,
  onRefresh,
  onView,
  onEdit,
  onDelete,
  onAdd
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<keyof Employee>("joining_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Extract distinct departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return ["All", ...Array.from(set).sort()];
  }, [employees]);

  // Filter and sort
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        // Search across ID, full name, email, phone, designation, department
        const matchesSearch =
          searchTerm === "" ||
          emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = departmentFilter === "All" || emp.department === departmentFilter;
        const matchesStatus = statusFilter === "All" || emp.status === statusFilter;

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string") valA = (valA as string).toLowerCase();
        if (typeof valB === "string") valB = (valB as string).toLowerCase();

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [employees, searchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

  const toggleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage, search, and update staff member accounts ({filteredEmployees.length} of {employees.length} records)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            title="Refresh list from backend"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
          <button
            id="btn-add-employee-top"
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search"
              type="text"
              placeholder="Search by ID, name, email, role, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-3">
            <select
              id="select-department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Filter by department"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            >
              <option value="All">All Departments</option>
              {departments
                .filter((d) => d !== "All")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              id="select-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(searchTerm || departmentFilter !== "All" || statusFilter !== "All") && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-medium">Applied Filters:</span>
              {searchTerm && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                  Search: "{searchTerm}"
                </span>
              )}
              {departmentFilter !== "All" && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-100">
                  Dept: {departmentFilter}
                </span>
              )}
              {statusFilter !== "All" && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                  Status: {statusFilter}
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th
                  onClick={() => toggleSort("employee_id")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Employee ID</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("first_name")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th
                  onClick={() => toggleSort("department")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Designation</th>
                <th
                  onClick={() => toggleSort("salary")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Salary</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("joining_date")}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Joining Date</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6" />
                      </div>
                      <p className="text-base font-semibold text-slate-700">No employees match your criteria</p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Try adjusting your search query, clearing filters, or adding a new employee to the database.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    id={`employee-row-${emp.id}`}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700 whitespace-nowrap">
                      {emp.employee_id}
                    </td>

                    {/* Name with initials avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {emp.first_name[0]}
                          {emp.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 leading-tight">
                            {emp.first_name} {emp.last_name}
                          </div>
                          <span className="text-[11px] text-slate-400 md:hidden">{emp.designation}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <a
                          href={`mailto:${emp.email}`}
                          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{emp.email}</span>
                        </a>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{emp.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-800 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        <Building className="h-3 w-3 text-slate-400" />
                        {emp.department}
                      </span>
                    </td>

                    {/* Designation */}
                    <td className="py-3.5 px-4 text-xs text-slate-700 font-medium whitespace-nowrap">
                      {emp.designation}
                    </td>

                    {/* Salary */}
                    <td className="py-3.5 px-4 text-xs font-mono font-semibold text-slate-900 text-right whitespace-nowrap">
                      ${emp.salary.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </td>

                    {/* Joining Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {emp.joining_date}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Action Buttons: View, Edit, Delete */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`btn-view-${emp.id}`}
                          onClick={() => onView(emp)}
                          title="View Employee Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          id={`btn-edit-${emp.id}`}
                          onClick={() => onEdit(emp)}
                          title="Edit Employee Information"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          id={`btn-delete-${emp.id}`}
                          onClick={() => onDelete(emp)}
                          title="Delete Employee Record"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
