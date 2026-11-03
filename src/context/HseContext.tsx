import React, { createContext, useContext, useState, useEffect } from 'react';
import { ObservationCard, RigId, UserProfile, AccessibilitySettings } from '../types/hse';
import { MOCK_OBSERVATIONS } from '../data/mockHseData';

export type AppView = 
  | 'dashboard'
  | 'observations'
  | 'toolbox'
  | 'inspections'
  | 'incidents'
  | 'investigation'
  | 'capa'
  | 'ptw'
  | 'jsa'
  | 'users'
  | 'signin';

interface HseContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Global Filters
  selectedRig: 'All' | RigId;
  setSelectedRig: (rig: 'All' | RigId) => void;
  dateRangePreset: 'today' | 'week' | 'month' | 'year' | 'custom';
  setDateRangePreset: (preset: 'today' | 'week' | 'month' | 'year' | 'custom') => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;

  // Observation Cards Data & Operations
  observations: ObservationCard[];
  addObservation: (card: Omit<ObservationCard, 'id' | 'serialNumber' | 'createdAt' | 'status'>) => void;
  updateObservation: (id: string, updates: Partial<ObservationCard>) => void;
  deleteObservation: (id: string) => void;
  batchDeleteObservations: (ids: string[]) => void;
  batchApproveObservations: (ids: string[]) => void;

  // Modals & Panels
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  selectedObservation: ObservationCard | null;
  setSelectedObservation: (obs: ObservationCard | null) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isAccessibilityDrawerOpen: boolean;
  setIsAccessibilityDrawerOpen: (open: boolean) => void;

  // User & Auth
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  signOut: () => void;

  // Theme & Accessibility (WCAG 2.1 AA/AAA)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;

  // Search & Global Feedback
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  activeToast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-admin-1',
  name: 'HSE Admin',
  email: 'hse.admin@octaloop.io',
  role: 'HSE Admin',
  rig: 'BHDC-67',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  reducedMotion: false,
  colorBlindFilter: 'none',
  showFocusIndicators: true,
};

const HseContext = createContext<HseContextType | undefined>(undefined);

export const HseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [selectedRig, setSelectedRig] = useState<'All' | RigId>('All');
  const [dateRangePreset, setDateRangePreset] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('year');
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-12-31' });

  const [observations, setObservations] = useState<ObservationCard[]>(() => {
    const saved = localStorage.getItem('maritime_hse_observations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_OBSERVATIONS;
      }
    }
    return MOCK_OBSERVATIONS;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<ObservationCard | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAccessibilityDrawerOpen, setIsAccessibilityDrawerOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Theme setup
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('maritime_hse_theme') as 'light' | 'dark') || 'light';
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('maritime_hse_a11y');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ACCESSIBILITY;
      }
    }
    return DEFAULT_ACCESSIBILITY;
  });

  const [globalSearch, setGlobalSearch] = useState('');
  const [activeToast, setActiveToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Save observations to localStorage
  useEffect(() => {
    localStorage.setItem('maritime_hse_observations', JSON.stringify(observations));
  }, [observations]);

  // Synchronize dark class to html documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('maritime_hse_theme', theme);
  }, [theme]);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    // Contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font scaling
    root.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (accessibility.fontSize === 'large') {
      root.classList.add('text-scale-large');
    } else if (accessibility.fontSize === 'x-large') {
      root.classList.add('text-scale-xlarge');
    }

    localStorage.setItem('maritime_hse_a11y', JSON.stringify(accessibility));
  }, [accessibility]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => {
      setActiveToast(current => (current?.message === message ? null : current));
    }, 4000);
  };

  const clearToast = () => setActiveToast(null);

  const addObservation = (cardData: Omit<ObservationCard, 'id' | 'serialNumber' | 'createdAt' | 'status'>) => {
    const randSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newCard: ObservationCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      serialNumber: `OBS-${randSuffix}`,
      status: cardData.wasStopWorkAuthorityUsed ? 'Pending' : 'Approved',
      createdAt: new Date().toISOString(),
    };
    setObservations(prev => [newCard, ...prev]);
    showToast(`Observation ${newCard.serialNumber} created successfully!`, 'success');
  };

  const updateObservation = (id: string, updates: Partial<ObservationCard>) => {
    setObservations(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Observation updated.', 'info');
  };

  const deleteObservation = (id: string) => {
    setObservations(prev => prev.filter(item => item.id !== id));
    showToast('Observation deleted.', 'warning');
  };

  const batchDeleteObservations = (ids: string[]) => {
    setObservations(prev => prev.filter(item => !ids.includes(item.id)));
    showToast(`Deleted ${ids.length} observation card(s).`, 'warning');
  };

  const batchApproveObservations = (ids: string[]) => {
    setObservations(prev =>
      prev.map(item => (ids.includes(item.id) ? { ...item, status: 'Approved' } : item))
    );
    showToast(`Approved ${ids.length} pending observation(s).`, 'success');
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setCurrentView('signin');
    showToast('Signed out successfully.', 'info');
  };

  return (
    <HseContext.Provider
      value={{
        currentView,
        setCurrentView,
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedRig,
        setSelectedRig,
        dateRangePreset,
        setDateRangePreset,
        dateRange,
        setDateRange,
        observations,
        addObservation,
        updateObservation,
        deleteObservation,
        batchDeleteObservations,
        batchApproveObservations,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedObservation,
        setSelectedObservation,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isAccessibilityDrawerOpen,
        setIsAccessibilityDrawerOpen,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        signOut,
        theme,
        toggleTheme,
        accessibility,
        updateAccessibility,
        globalSearch,
        setGlobalSearch,
        activeToast,
        showToast,
        clearToast,
      }}
    >
      {children}
    </HseContext.Provider>
  );
};

export const useHse = () => {
  const context = useContext(HseContext);
  if (!context) {
    throw new Error('useHse must be used within an HseProvider');
  }
  return context;
};
