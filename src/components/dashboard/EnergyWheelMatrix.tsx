import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Wind, 
  RotateCw, 
  ArrowDown, 
  Radio, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Shield, 
  Layers 
} from 'lucide-react';
import { HazardEnergyType } from '../../types/hse';

interface EnergyItem {
  type: HazardEnergyType;
  title: string;
  icon: React.ElementType;
  color: string;
  count: number;
  pct: string;
  swaCount: number;
  mitigation: string;
  primaryControl: 'Engineering' | 'Administrative' | 'PPE';
}

export const EnergyWheelMatrix: React.FC = () => {
  const energies: EnergyItem[] = [
    {
      type: 'Gravity / Dropped Objects',
      title: 'Gravity & Drops',
      icon: ArrowDown,
      color: '#dc2626', // Red
      count: 7815,
      pct: '14.8%',
      swaCount: 1680,
      mitigation: 'Dual retention secondary safety clamps, tool tethers, DROPS survey nets',
      primaryControl: 'Engineering'
    },
    {
      type: 'Mechanical / Rotating',
      title: 'Mechanical & Rotary',
      icon: RotateCw,
      color: '#f59e0b', // Amber
      count: 4858,
      pct: '9.2%',
      swaCount: 940,
      mitigation: 'Physical perimeter interlock barrier gates, emergency stop kill switches',
      primaryControl: 'Engineering'
    },
    {
      type: 'Pressure',
      title: 'High Pressure Systems',
      icon: Wind,
      color: '#8b5cf6', // Purple
      count: 2059,
      pct: '3.9%',
      swaCount: 620,
      mitigation: 'Certified whipcheck cables, 15k psi hammer-union test flanging, LOTO bleeder valves',
      primaryControl: 'Engineering'
    },
    {
      type: 'Chemical',
      title: 'Chemical & H2S Toxic',
      icon: Activity,
      color: '#0d9488', // Teal
      count: 4805,
      pct: '9.1%',
      swaCount: 510,
      mitigation: 'Fixed wireless H2S sensor grid, eye-wash stations, splash suits & SCBA gear',
      primaryControl: 'PPE'
    },
    {
      type: 'Electrical',
      title: 'Electrical & Arc Flash',
      icon: Zap,
      color: '#eab308', // Yellow
      count: 1689,
      pct: '3.2%',
      swaCount: 310,
      mitigation: 'Padlock LOTO lockboxes, zero-energy arc flash face shields, insulated mats',
      primaryControl: 'Administrative'
    },
    {
      type: 'Thermal / Heat',
      title: 'Thermal & Hot Work',
      icon: Flame,
      color: '#ea580c', // Orange
      count: 1240,
      pct: '2.4%',
      swaCount: 180,
      mitigation: 'Fire blankets, 35ft combustible clearance perimeter, continuous gas monitoring',
      primaryControl: 'Administrative'
    },
    {
      type: 'Work at height',
      title: 'Height & Fall Hazard',
      icon: Layers,
      color: '#ec4899', // Pink
      count: 1373,
      pct: '2.6%',
      swaCount: 420,
      mitigation: 'Self-retracting inertia lanyards, 100% tie-off harness, monkeyboard cages',
      primaryControl: 'PPE'
    },
    {
      type: 'Vehicle / Mobile equipment',
      title: 'Deck Equipment & Cranes',
      icon: Shield,
      color: '#3b82f6', // Blue
      count: 3749,
      pct: '7.1%',
      swaCount: 680,
      mitigation: 'Designated pedestrian walkways, marshaling horns, marine transfer matrix',
      primaryControl: 'Administrative'
    }
  ];

  const [selectedEnergy, setSelectedEnergy] = useState<EnergyItem>(energies[0]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Hazard Energy Matrix &amp; Barrier Bowtie Model</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            IADC/OSHA Energy Wheel standard: categorize stored energies and verify effective defensive barrier status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side (7 Cols): The Graphical Energy Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {energies.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedEnergy.title === item.title;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelectedEnergy(item)}
                className={`relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-xs"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {item.pct}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {item.count.toLocaleString()} obs
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side (5 Cols): Selected Energy Bowtie & Control Chain */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ backgroundColor: selectedEnergy.color }}
            >
              <selectedEnergy.icon className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Hazard Classification ({selectedEnergy.pct} of fleet total)
              </span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedEnergy.title}
              </h4>
            </div>
          </div>

          {/* Bowtie Defense Status */}
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                Active Barrier Defense Mechanism
              </span>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedEnergy.mitigation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">SWA Interventions</span>
                <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                  {selectedEnergy.swaCount}
                </span>
                <span className="text-[10px] text-slate-500 block">Jobs paused</span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 block">Control Hierarchy</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {selectedEnergy.primaryControl}
                </span>
                <span className="text-[10px] text-emerald-600 block">Primary barrier</span>
              </div>
            </div>

            {/* Hierarchy Level Visual Stepper */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Hierarchy of Controls Defense Rating
              </span>
              <div className="flex items-center gap-1">
                {['Elimination', 'Substitution', 'Engineering', 'Administrative', 'PPE'].map((step, idx) => {
                  const isCurrent = step === selectedEnergy.primaryControl;
                  return (
                    <div
                      key={step}
                      className={`flex-1 text-center py-1 rounded text-[9px] font-bold transition ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {step.slice(0, 3)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
