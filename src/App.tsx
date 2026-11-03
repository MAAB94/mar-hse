import React from 'react';
import { HseProvider, useHse } from './context/HseContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AccessibilityToolbar } from './components/layout/AccessibilityToolbar';
import { NotificationToast } from './components/common/NotificationToast';
import { HseDashboard } from './components/dashboard/HseDashboard';
import { ObservationList } from './components/observations/ObservationList';
import { CreateObservationModal } from './components/observations/CreateObservationModal';
import { ObservationDetailModal } from './components/observations/ObservationDetailModal';
import { AiInsightsCard } from './components/dashboard/AiInsightsCard';
import { SignInModal } from './components/auth/SignInModal';
import { 
  ToolboxTalksView, 
  RigInspectionsView, 
  IncidentManagementView, 
  UsersView 
} from './components/modules/ModulePlaceholders';

const AppContent: React.FC = () => {
  const { currentView, sidebarCollapsed, isAuthenticated } = useHse();

  // If user signed out, render Sign In screen
  if (!isAuthenticated || currentView === 'signin') {
    return <SignInModal />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <HseDashboard />;
      case 'observations':
        return <ObservationList />;
      case 'toolbox':
        return <ToolboxTalksView />;
      case 'inspections':
        return <RigInspectionsView />;
      case 'incidents':
      case 'investigation':
      case 'capa':
        return <IncidentManagementView />;
      case 'users':
        return <UsersView />;
      default:
        return <HseDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Skip to Main Content Link (WCAG 2.4.1 Requirement) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Main App Layout */}
      <div className="flex flex-1">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Content Wrapper */}
        <div
          className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Bar Contract Compliant Header */}
          <Navbar />

          {/* Main Viewport */}
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto outline-none">
            {renderCurrentView()}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <p>
              &copy; 2026 Octaloop IT &amp; NS · Maritime HSE Management System · ISO 45001 &amp; IADC Certified
            </p>
          </footer>
        </div>
      </div>

      {/* Modals & Accessible Drawers */}
      <CreateObservationModal />
      <ObservationDetailModal />
      <AiInsightsCard />
      <AccessibilityToolbar />
      <NotificationToast />

    </div>
  );
};

export default function App() {
  return (
    <HseProvider>
      <AppContent />
    </HseProvider>
  );
}
