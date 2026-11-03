import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareQuote,
  SearchCheck,
  Eye,
  QrCode,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  FolderGit2,
  ShieldAlert,
  ClipboardList,
  GraduationCap,
  FileKey,
  Shield,
  Users2,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useHse, AppView } from '../../context/HseContext';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    observations,
    signOut
  } = useHse();

  const pendingCount = observations.filter(o => o.status === 'Pending').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'toolbox', label: 'Toolbox Talks', icon: MessageSquareQuote },
    { id: 'inspections', label: 'Rig Inspections', icon: SearchCheck },
    { 
      id: 'observations', 
      label: 'Observation Card', 
      icon: Eye, 
      badge: pendingCount > 0 ? `${pendingCount} review` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
    },
    { id: 'incidents', label: 'Incident Management', icon: AlertTriangle },
    { id: 'investigation', label: 'Incident Investigation', icon: FileSearch },
    { id: 'capa', label: 'Corrective Action', icon: CheckCircle2 },
    { id: 'ptw', label: 'Permit to Work', icon: FileKey },
    { id: 'jsa', label: 'JSA (Job Safety Analysis)', icon: Shield },
    { id: 'users', label: 'Users & Access', icon: Users2 },
  ];

  return (
    <aside
      aria-label="Main application sidebar navigation"
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Octaloop Logo Mark */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-700 via-purple-600 to-indigo-500 text-white shadow-md">
            <svg
              className="h-5 w-5"
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

          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                octal<span className="text-indigo-600 dark:text-indigo-400">oop</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Maritime HSE
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Modules navigation">
        {!sidebarCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            HSE Operations
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentView(item.id)}
              className={`group relative flex w-full items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
              } ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
              aria-current={isActive ? 'page' : undefined}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                  aria-hidden="true"
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!sidebarCollapsed && item.badge && (
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip on collapsed state */}
              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:block group-hover:opacity-100 dark:bg-slate-800">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Sign Out Action */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={signOut}
          className={`flex w-full items-center rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-300 ${
            sidebarCollapsed ? 'justify-center' : 'gap-3'
          }`}
          title="Sign Out"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-400 hover:text-red-600 dark:text-slate-500" aria-hidden="true" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
