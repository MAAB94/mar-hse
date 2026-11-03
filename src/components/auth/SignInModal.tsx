import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowRight, Check } from 'lucide-react';
import { useHse } from '../../context/HseContext';
import { UserProfile } from '../../types/hse';

export const SignInModal: React.FC = () => {
  const { setCurrentUser, setIsAuthenticated, setCurrentView, showToast } = useHse();

  const [email, setEmail] = useState('hse.admin@octaloop.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const demoUsers: UserProfile[] = [
    {
      id: 'usr-admin-1',
      name: 'HSE Admin',
      email: 'hse.admin@octaloop.io',
      role: 'HSE Admin',
      rig: 'BHDC-67',
    },
    {
      id: 'usr-advisor-2',
      name: 'Usama Tariq',
      email: 'u.tariq@bhdc.com',
      role: 'Rig HSE Advisor',
      rig: 'BHDC-117',
    },
    {
      id: 'usr-crew-3',
      name: 'OMAN HASSAN',
      email: 'o.hassan@bhdc.com',
      role: 'Floorhand / Roustabout',
      rig: 'BHDC-67',
    },
  ];

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter a valid work email.');
      return;
    }
    setError('');
    const matched = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'HSE Admin',
      rig: 'BHDC-67',
    };
    setCurrentUser(matched as UserProfile);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    showToast(`Signed in successfully as ${matched.name}`, 'success');
  };

  const handleQuickLogin = (u: UserProfile) => {
    setCurrentUser(u);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    showToast(`Signed in as ${u.name} (${u.role})`, 'success');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1e1b4b] p-4 text-slate-900 transition-colors">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-2xl transition dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Octaloop Logo & Subtitle */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 via-purple-600 to-indigo-500 text-white shadow-lg">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
            </svg>
          </div>

          <div className="mt-3">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              octal<span className="text-indigo-600 dark:text-indigo-400">oop</span>
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-400">IT & NS</span>
          </div>

          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            HSE Management System
          </p>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>

            <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Reset instructions sent to admin.', 'info'); }} className="text-indigo-600 hover:underline dark:text-indigo-400">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7c3aed] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#6d28d9] focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-98 transition"
          >
            Sign In
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            Or Quick Switch Profile (Demo)
          </p>
          <div className="space-y-1.5">
            {demoUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-indigo-950/40"
              >
                <div className="text-left">
                  <span className="font-semibold">{u.name}</span>
                  <span className="text-[11px] text-slate-400 block">{u.role} · {u.rig}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
