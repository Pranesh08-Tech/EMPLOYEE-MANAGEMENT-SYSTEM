import React, { useState } from "react";
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Users, Check } from "lucide-react";
import { User as UserType } from "../types";

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Invalid credentials" }));
        // Fallback for standard demo credentials
        if (
          (username.trim() === "admin" && password === "admin123") ||
          (username.trim() === "manager" && password === "password")
        ) {
          const fallbackUser: UserType = {
            id: 1,
            username: username.trim(),
            name: username.trim() === "admin" ? "System Administrator" : "Department Manager",
            role: username.trim() === "admin" ? "SuperAdmin" : "Manager",
            email: `${username.trim()}@ems-college.org`
          };
          onLoginSuccess(fallbackUser);
        } else {
          setError(errorData.error || "Authentication failed. Check your username and password.");
        }
      }
    } catch {
      // Local demo fallback
      if (
        (username.trim() === "admin" && password === "admin123") ||
        (username.trim() === "manager" && password === "password")
      ) {
        const fallbackUser: UserType = {
          id: 1,
          username: username.trim(),
          name: username.trim() === "admin" ? "System Administrator" : "Department Manager",
          role: username.trim() === "admin" ? "SuperAdmin" : "Manager",
          email: `${username.trim()}@ems-college.org`
        };
        onLoginSuccess(fallbackUser);
      } else {
        setError("Invalid username or password. Click the 'Use Demo Credentials' button below.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
    setError(null);
  };

  const fillDemoManager = () => {
    setUsername("manager");
    setPassword("password");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Visual */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white text-center relative">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg mb-3">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Employee Management System</h1>
          <p className="text-xs text-indigo-200 mt-1">
            Secure administrative portal for staff directory and analytics
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-username"
                  type="text"
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-login"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
            >
              <span>{isLoading ? "Verifying..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* College Demo Helper Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Demonstration Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl transition-colors text-center border border-slate-200"
              >
                Admin (admin / admin123)
              </button>
              <button
                type="button"
                onClick={fillDemoManager}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl transition-colors text-center border border-slate-200"
              >
                Manager (manager / password)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
