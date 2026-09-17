import React from "react";
import { Users, LayoutDashboard, UserPlus, Code2, LogOut, ShieldCheck } from "lucide-react";
import { User, ViewTab } from "../types";

interface NavbarProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  onOpenAddModal
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab("dashboard")}>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-inner font-bold tracking-wider">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-tight">
                StaffSync <span className="text-indigo-400 font-normal text-sm">EMS</span>
              </span>
              <span className="text-xs text-slate-400 block">Enterprise Employee Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-dashboard"
              onClick={() => setCurrentTab("dashboard")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === "dashboard"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-employees"
              onClick={() => setCurrentTab("employees")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === "employees"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Employees</span>
            </button>

            <button
              id="nav-tab-add"
              onClick={() => {
                onOpenAddModal();
              }}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm ml-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>

            <button
              id="nav-tab-api"
              onClick={() => setCurrentTab("api-guide")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ml-2 ${
                currentTab === "api-guide"
                  ? "bg-slate-800 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>REST API & Viva Guide</span>
            </button>
          </nav>

          {/* User Profile & Auth Controls */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-end gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {currentUser.role}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-700">
                  {currentUser.name.slice(0, 1)}
                </div>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login"
                onClick={() => setCurrentTab("dashboard")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center justify-between py-2.5 border-t border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`px-2.5 py-1.5 rounded-md ${currentTab === "dashboard" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab("employees")}
            className={`px-2.5 py-1.5 rounded-md ${currentTab === "employees" ? "bg-indigo-600 text-white" : "text-slate-300"}`}
          >
            Employees
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-2.5 py-1.5 rounded-md bg-emerald-600 text-white font-medium"
          >
            + Add New
          </button>
          <button
            onClick={() => setCurrentTab("api-guide")}
            className={`px-2.5 py-1.5 rounded-md ${currentTab === "api-guide" ? "bg-slate-800 text-amber-400" : "text-slate-400"}`}
          >
            API & Viva
          </button>
        </div>
      </div>
    </header>
  );
};
