import React, { useState } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, ShieldAlert, Eye, Info, Layers, Compass } from 'lucide-react';
import { useHse } from '../../context/HseContext';

interface DeckZone {
  id: string;
  name: string;
  shortName: string;
  category: string;
  safeCount: number;
  unsafeCount: number;
  swaCount: number;
  primaryHazard: string;
  coordinates: { x: number; y: number; width: number; height: number };
  level: string;
}

export const RigSchematicMap: React.FC = () => {
  const { selectedRig, setSelectedRig, setCurrentView, setSelectedObservation, observations } = useHse();
  const [selectedZone, setSelectedZone] = useState<DeckZone | null>(null);
  const [viewAngle, setViewAngle] = useState<'profile' | 'deck'>('profile');

  // Offshore Rig Structural Zones
  const zones: DeckZone[] = [
    {
      id: 'derrick',
      name: 'Mast & Crown Block (160ft Elevation)',
      shortName: 'Derrick / Mast',
      category: 'Working at Height',
      safeCount: 1420,
      unsafeCount: 890,
      swaCount: 312,
      primaryHazard: 'Gravity / Dropped Objects (DROPS)',
      coordinates: { x: 380, y: 30, width: 140, height: 160 },
      level: 'Upper Derrick'
    },
    {
      id: 'monkeyboard',
      name: 'Monkeyboard & Racking Board (90ft)',
      shortName: 'Monkeyboard',
      category: 'Working at Height',
      safeCount: 2100,
      unsafeCount: 650,
      swaCount: 145,
      primaryHazard: 'Fall Protection & Pipe Stabbing',
      coordinates: { x: 395, y: 195, width: 110, height: 45 },
      level: 'Mid Mast'
    },
    {
      id: 'drillfloor',
      name: 'Drill Floor, Rotary Table & Iron Roughneck',
      shortName: 'Drill Floor',
      category: 'Hoisting & Well Ops',
      safeCount: 10450,
      unsafeCount: 7754,
      swaCount: 2180,
      primaryHazard: 'Mechanical Pinch Points & Rotary Energy',
      coordinates: { x: 340, y: 245, width: 220, height: 60 },
      level: 'Main Deck'
    },
    {
      id: 'substructure',
      name: 'Substructure, Cellar Deck & BOP Stack',
      shortName: 'BOP & Cellar',
      category: 'Well Control',
      safeCount: 2890,
      unsafeCount: 1629,
      swaCount: 540,
      primaryHazard: 'High Pressure Gas & Fluid Systems (15,000 PSI)',
      coordinates: { x: 355, y: 310, width: 190, height: 75 },
      level: 'Sub-Deck'
    },
    {
      id: 'pipedeck',
      name: 'Pipe Deck, Catwalk & Hydraulic Skate Racks',
      shortName: 'Pipe Racks',
      category: 'Tubular Handling',
      safeCount: 3890,
      unsafeCount: 2410,
      swaCount: 620,
      primaryHazard: 'Tubular Roll-Off & Crane Slinging',
      coordinates: { x: 570, y: 255, width: 210, height: 70 },
      level: 'Forward Deck'
    },
    {
      id: 'cranes',
      name: 'Port & Starboard Offshore Pedestal Cranes',
      shortName: 'Marine Cranes',
      category: 'Lifting Operations',
      safeCount: 2450,
      unsafeCount: 1120,
      swaCount: 420,
      primaryHazard: 'Dynamic Marine Swell & Blind Lifts',
      coordinates: { x: 790, y: 180, width: 80, height: 110 },
      level: 'Crane Pedestal'
    },
    {
      id: 'mudpits',
      name: 'Mud Chemical Storage & Shale Shakers',
      shortName: 'Mud Pits / Shakers',
      category: 'Chemical & Environmental',
      safeCount: 2140,
      unsafeCount: 1450,
      swaCount: 290,
      primaryHazard: 'Chemical Exposure, H2S & Slippery Walkways',
      coordinates: { x: 140, y: 275, width: 190, height: 80 },
      level: 'Mud Module'
    },
    {
      id: 'engineroom',
      name: 'Power Generation & Main SCR Switchboard',
      shortName: 'Engine Room / SCR',
      category: 'Electrical & Power',
      safeCount: 1840,
      unsafeCount: 780,
      swaCount: 110,
      primaryHazard: 'High Voltage (600V/4160V) & Noise (>85dBA)',
      coordinates: { x: 120, y: 360, width: 210, height: 70 },
      level: 'Lower Hull'
    },
    {
      id: 'helideck',
      name: 'Aviation Helideck & Rescue Equipment',
      shortName: 'Helideck (DIFFS)',
      category: 'Aviation & Marine',
      safeCount: 1230,
      unsafeCount: 310,
      swaCount: 45,
      primaryHazard: 'Turbulent Wind Shear & Static Discharge',
      coordinates: { x: 30, y: 190, width: 110, height: 70 },
      level: 'Forward Superstructure'
    },
    {
      id: 'accommodation',
      name: 'Living Quarters, Galley & Clinic',
      shortName: 'Accommodation',
      category: 'Welfare & Life Safety',
      safeCount: 2860,
      unsafeCount: 450,
      swaCount: 28,
      primaryHazard: 'Food Hygiene, Slips/Trips & Emergency Muster',
      coordinates: { x: 30, y: 265, width: 105, height: 110 },
      level: 'Living Module'
    }
  ];

  const activeZone = selectedZone || zones[2]; // Default to Drill Floor

  return (
    <div className="space-y-4">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Offshore Rig Spatial Digital Twin ({selectedRig || 'All Fleet'})</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click on any structural rig module on the cross-section below to inspect live hazard density, SWA stops, and field safety compliance.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewAngle('profile')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              viewAngle === 'profile'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Elevation Cross-Section
          </button>
          <button
            type="button"
            onClick={() => setViewAngle('deck')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              viewAngle === 'deck'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Top-Down Deck Grid
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram & Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side (8 Cols): The Graphic Rig Architectural Schematic */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 text-white shadow-md relative overflow-hidden dark:border-slate-800">
          
          {/* Subtle Waterline & Horizon Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
          
          {/* Waterline Marker */}
          <div className="absolute bottom-6 left-0 right-0 border-b border-cyan-500/30 flex items-center justify-between px-4 text-[10px] text-cyan-400 font-mono tracking-widest pointer-events-none">
            <span>MEAN SEA LEVEL (0.0m)</span>
            <span>OFFSHORE JACK-UP / SEMI-SUB PLATFORM</span>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox="0 0 900 460"
              className="w-full min-w-[680px] h-auto select-none"
              role="img"
              aria-label="Interactive Offshore Drilling Rig Structural Schematic"
            >
              <defs>
                <linearGradient id="derrickGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="hullGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              {/* Derrick / Mast Structural Steel Lattice Lines */}
              <polygon
                points="420,30 480,30 550,245 350,245"
                fill="url(#derrickGradient)"
                stroke="#6366f1"
                strokeWidth="2"
                opacity="0.8"
              />
              {/* Internal Cross Braces for Mast */}
              <line x1="420" y1="30" x2="550" y2="245" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <line x1="480" y1="30" x2="350" y2="245" stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <line x1="390" y1="120" x2="510" y2="120" stroke="#a5b4fc" strokeWidth="1.5" opacity="0.6" />
              <line x1="370" y1="180" x2="530" y2="180" stroke="#a5b4fc" strokeWidth="1.5" opacity="0.6" />

              {/* Crown Block Cap */}
              <rect x="425" y="15" width="50" height="15" fill="#f59e0b" rx="2" />
              <text x="450" y="26" textAnchor="middle" fill="#1e1b4b" fontSize="8" fontWeight="bold">CROWN</text>

              {/* Main Deck Hull & Substructure Base */}
              <rect x="110" y="245" width="700" height="150" fill="url(#hullGradient)" stroke="#475569" strokeWidth="2" rx="6" />
              
              {/* Legs extending into sea */}
              <rect x="160" y="395" width="40" height="60" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <rect x="430" y="395" width="40" height="60" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <rect x="700" y="395" width="40" height="60" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

              {/* Helideck Cantilever Truss */}
              <polygon points="110,250 20,200 20,240 110,280" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
              <rect x="15" y="195" width="120" height="15" fill="#0284c7" rx="3" />
              <circle cx="75" cy="202" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" />
              <text x="75" y="205" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">H</text>

              {/* Pedestal Crane Arm */}
              <line x1="820" y1="245" x2="820" y2="180" stroke="#f59e0b" strokeWidth="6" />
              <line x1="820" y1="180" x2="720" y2="90" stroke="#f59e0b" strokeWidth="4" />
              <line x1="820" y1="180" x2="870" y2="150" stroke="#64748b" strokeWidth="3" />
              <line x1="720" y1="90" x2="720" y2="170" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Interactive Zone Hotspots */}
              {zones.map((zone) => {
                const isSelected = activeZone.id === zone.id;
                const safeRatio = Math.round((zone.safeCount / (zone.safeCount + zone.unsafeCount)) * 100);
                const isWarning = safeRatio < 55;

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${zone.name}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedZone(zone); }}
                  >
                    {/* Hotspot bounding box */}
                    <rect
                      x={zone.coordinates.x}
                      y={zone.coordinates.y}
                      width={zone.coordinates.width}
                      height={zone.coordinates.height}
                      fill={isSelected ? '#6366f1' : isWarning ? '#dc2626' : '#10b981'}
                      fillOpacity={isSelected ? 0.45 : 0.22}
                      stroke={isSelected ? '#a5b4fc' : isWarning ? '#f87171' : '#34d399'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      rx="8"
                      className="transition-all duration-200 group-hover:fill-opacity-50"
                    />

                    {/* Zone Badge Tag */}
                    <g transform={`translate(${zone.coordinates.x + zone.coordinates.width / 2}, ${zone.coordinates.y + zone.coordinates.height / 2})`}>
                      <rect
                        x="-50"
                        y="-12"
                        width="100"
                        height="24"
                        rx="6"
                        fill="#0f172a"
                        fillOpacity="0.9"
                        stroke={isSelected ? '#818cf8' : '#475569'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {zone.shortName}
                      </text>
                    </g>

                    {/* SWA Alert Indicator if high */}
                    {zone.swaCount > 200 && (
                      <circle
                        cx={zone.coordinates.x + zone.coordinates.width - 10}
                        cy={zone.coordinates.y + 12}
                        r="6"
                        fill="#dc2626"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Map Legend */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-3 w-3 rounded-xs bg-emerald-500/60 border border-emerald-400" /> &ge; 55% Safe Ratio
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-3 w-3 rounded-xs bg-rose-500/60 border border-rose-400" /> &lt; 55% Attention Zone
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" /> High SWA Stop Zone
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Hover &amp; click modules to isolate risk
            </span>
          </div>
        </div>

        {/* Right Side (4 Cols): Selected Deck Zone Deep-Dive Card */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 uppercase">
                {activeZone.level} · {activeZone.category}
              </span>
              <h4 className="mt-1 text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {activeZone.name}
              </h4>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs dark:bg-indigo-500">
              <MapPin className="h-5 w-5" />
            </div>
          </div>

          {/* Hazard Summary */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Primary Risk Hazard
            </span>
            <p className="mt-0.5 text-xs font-semibold text-amber-950 dark:text-amber-200">
              {activeZone.primaryHazard}
            </p>
          </div>

          {/* Metrics Stack */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Safe Compliance Ratio:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {Math.round((activeZone.safeCount / (activeZone.safeCount + activeZone.unsafeCount)) * 100)}%
              </span>
            </div>
            
            {/* Safe vs Unsafe Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex">
              <div 
                className="bg-emerald-500 h-full" 
                style={{ width: `${(activeZone.safeCount / (activeZone.safeCount + activeZone.unsafeCount)) * 100}%` }} 
                title="Safe Acts & Conditions"
              />
              <div 
                className="bg-rose-500 h-full" 
                style={{ width: `${(activeZone.unsafeCount / (activeZone.safeCount + activeZone.unsafeCount)) * 100}%` }} 
                title="Unsafe Observations"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Safe Acts</span>
                <span className="font-bold text-emerald-600 tabular-nums">{activeZone.safeCount.toLocaleString()}</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Unsafe</span>
                <span className="font-bold text-rose-600 tabular-nums">{activeZone.unsafeCount.toLocaleString()}</span>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">SWA Stops</span>
                <span className="font-bold text-indigo-600 tabular-nums">{activeZone.swaCount}</span>
              </div>
            </div>
          </div>

          {/* Action to Jump to Observation Cards for this zone */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentView('observations')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              <span>View Observation Cards for {activeZone.shortName}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
