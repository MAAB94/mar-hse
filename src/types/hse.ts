/**
 * Maritime HSE Management System Data Types & Definitions
 */

export type RigId = 'BHDC-67' | 'BHDC-68' | 'BHDC-117' | 'BHDC-118';

export type ObservationClassification = 
  | 'Safe_Act' 
  | 'Safe_Condition' 
  | 'Unsafe_Act' 
  | 'Unsafe_Condition';

export type ObservationStatus = 'Approved' | 'Pending' | 'Under Review' | 'Closed';

export type HazardEnergyType = 
  | 'Gravity / Dropped Objects' 
  | 'Mechanical / Rotating' 
  | 'Pressure' 
  | 'Chemical' 
  | 'Electrical' 
  | 'Work at height' 
  | 'Vehicle / Mobile equipment' 
  | 'Noise / Vibration' 
  | 'Thermal / Heat' 
  | 'Other';

export type HazardControlMethod = 
  | 'Elimination' 
  | 'Substitution' 
  | 'Engineering control' 
  | 'Administrative control' 
  | 'PPE' 
  | 'Human control (spotter, manual lock)';

export interface ObservationCard {
  id: string;
  serialNumber: string; // e.g. OBS-PLORVLJQ
  rig: RigId;
  location: string;
  subLocation: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  company: string;
  observerPosition: string;
  observerName: string;
  operationCategory: string;
  activity: string;
  classification: ObservationClassification;
  mainCategory: string;
  subCategory: string;
  status: ObservationStatus;
  description: string;
  latitude?: number;
  longitude?: number;
  wasCorrectedImmediately: boolean;
  wasStopWorkAuthorityUsed: boolean;
  hazardEnergy?: HazardEnergyType;
  hazardControlMethod?: HazardControlMethod;
  werePeopleExposed: boolean;
  exposureDuration?: '< 15 mins' | 'Shift duration' | '72-96 hours' | 'Ongoing / uncorrected';
  photos?: string[];
  createdAt: string;
  supervisorNotes?: string;
  tags?: string[];
}

export interface RigHealthScore {
  rig: RigId;
  score: number;
  totalObservations: number;
  uniqueObservers: number;
  monthsActive: number;
  safeRatio: number; // percentage e.g. 60.9
  status: 'Nominal' | 'Attention' | 'Critical';
  radarScores: {
    volume: number;
    safeRatio: number;
    observerBreadth: number;
    descriptionQuality: number;
    categoryDiversity: number;
  };
}

export interface BestObserver {
  id: string;
  name: string;
  score: number;
  role: string;
  rig: RigId;
  totalObservations: number;
  categoriesCount: number;
  monthsActive: number;
  avatarUrl?: string;
  unsafeIdentified?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'HSE Admin' | 'Rig HSE Advisor' | 'Drilling Supervisor' | 'Toolpusher' | 'Floorhand / Roustabout';
  rig?: RigId;
  avatar?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  reducedMotion: boolean;
  colorBlindFilter: 'none' | 'protanopia' | 'deuteranopia';
  showFocusIndicators: boolean;
}
