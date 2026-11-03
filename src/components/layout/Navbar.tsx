import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Eye, 
  ChevronDown, 
  Bell, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Command
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    sidebarCollapsed, 
    setSidebarCollapsed, 
    theme, 
    toggleTheme, 
    setIsAccessibilityDrawerOpen,
    currentUser, 
    signOut,
    globalSearch,
    setGlobalSearch,
    setIsAiDrawerOpen,
    setIsCreateModalOpen
  } = useHse();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
          ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard':
        return { section: 'HSE', page: 'Executive Safety Dashboard' };
      case 'observations':
        return { section: 'HSE', page: 'Observation Cards' };
      case 'toolbox':
        return { section: 'HSE Operations', page: 'Toolbox Talks' };
      case 'inspections':
        return { section: 'Field Assurance', page: 'Rig Inspections' };
      case 'incidents':
        return { section: 'Incident Management', page: 'Event Reporting' };
      case 'investigation':
        return { section: 'Incident Management', page: 'Root Cause Investigation' };
      case 'capa':
        return { section: 'Assurance', page: 'Corrective Actions (CAPA)' };
      case 'ptw':
        return { section: 'Control of Work', page: 'Permit to Work (PTW)' };
      case 'jsa':
        return { section: 'Control of Work', page: 'Job Safety Analysis' };
      case 'users':
        return { section: 'Administration', page: 'Personnel & Access' };
      default:
        return { section: 'HSE', page: 'Management System' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left Zone: Sidebar Toggle & Contextual Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={sidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Clean Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {breadcrumb.section}
          </span>
          <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {breadcrumb.page}
          </span>
        </nav>
      </div>

      {/* Middle Zone: Fast Global Search with Accessibility Shortcut */}
      <div className="flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <label htmlFor="global-search-input" className="sr-only">
            Search safety observations, rig equipment, hazards or personnel
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="global-search-input"
            ref={searchInputRef}
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search cards, rigs, hazards (Press '/' to focus)..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
            <kbd className="hidden sm:inline-block rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 shadow-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Zone: AI Copilot, Accessibility Toolbar, Theme Toggle, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: New Observation Button */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>New Observation</span>
        </button>

        {/* AI HSE Intelligence Button */}
        <button
          type="button"
          onClick={() => setIsAiDrawerOpen(true)}
          className="relative flex h-9 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
          title="Open AI HSE Risk Advisor"
          aria-label="Open AI HSE Risk Advisor"
        >
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" aria-hidden="true" />
          <span className="hidden sm:inline">AI Insights</span>
        </button>

        {/* Accessibility Toolbar Drawer Button */}
        <button
          type="button"
          onClick={() => setIsAccessibilityDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          title="Accessibility Preferences (WCAG AA/AAA)"
          aria-label="Accessibility Preferences"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" aria-hidden="true" />
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800"
            aria-expanded={userDropdownOpen}
            aria-haspopup="true"
            aria-label="User profile and account settings"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-xs dark:bg-indigo-500">
              HA
            </div>
            <div className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">
                {currentUser.name}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          </button>

          {/* Accessible Dropdown Menu */}
          {userDropdownOpen && (
            <div 
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl transition dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-700/60">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Signed in as</p>
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{currentUser.email}</p>
                <span className="mt-1 inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Rig: {currentUser.rig || 'All Fleet'}
                </span>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setCurrentView('users');
                  setUserDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60"
              >
                <UserCheck className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>Personnel & User Roles</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsAccessibilityDrawerOpen(true);
                  setUserDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60"
              >
                <Eye className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <span>Accessibility Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setUserDropdownOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-4 w-4 text-red-500" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
