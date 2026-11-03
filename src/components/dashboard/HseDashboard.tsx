import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Compass, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  BarChart3, 
  Clock, 
  MapPin, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useHse } from '../../context/HseContext';
import { RigHealthCards } from './RigHealthCards';
import { KpiOverview } from './KpiOverview';
import { BestObservers } from './BestObservers';
import { RigSchematicMap } from './RigSchematicMap';
import { EnergyWheelMatrix } from './EnergyWheelMatrix';
import { DivergingCategoryChart } from './DivergingCategoryChart';
import { TopActivitiesLollipopChart } from './TopActivitiesLollipopChart';
import { SwaFlowDiagram } from './SwaFlowDiagram';
import { 
  MonthlyTrendChart, 
  RigRadarChart, 
  HierarchyOfControlsDonut, 
  SwaTrendChart, 
  LocationTreemap, 
  TimeIntelligenceHeatmap 
} from './Charts';
import { DRILLING_RIGS } from '../../data/mockHseData';
import { RigId } from '../../types/hse';

export const HseDashboard: React.FC = () => {
  const { 
    selectedRig, 
    setSelectedRig, 
    dateRangePreset, 
    setDateRangePreset,
    setIsAiDrawerOpen,
    setCurrentView
  } = useHse();

  // Graphical Section Navigation Tabs
  const [activeSection, setActiveSection] = useState<
    'overview' | 'schematic' | 'trends' | 'swa' | 'hazards' | 'locations' | 'all'
  >('overview');

  return (
    <div className="space-y-6">
      
      {/* 1. Global Filter & Date Control Header (Optimized sticky ribbon) */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Date Preset Range Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Date Range:
          </span>
          {(['today', 'week', 'month', 'year', 'custom'] as const).map((preset) => {
            const labels = {
              today: 'Today',
              week: 'This Week',
              month: 'This Month',
              year: 'This Year (2026)',
              custom: 'Custom Range',
            };
            const isSelected = dateRangePreset === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => setDateRangePreset(preset)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs dark:bg-indigo-500'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750'
                }`}
                aria-pressed={isSelected}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>

        {/* Rig Filter & Incident Link */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="dashboard-rig-select" className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Filter by Rig:
            </label>
            <select
              id="dashboard-rig-select"
              value={selectedRig}
              onChange={(e) => setSelectedRig(e.target.value as 'All' | RigId)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="All">All Fleet Rigs (4)</option>
              {DRILLING_RIGS.map((r) => (
                <option key={r.id} value={r.id}>{r.id}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('incidents')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>BHDC Incident Log</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 2. AI Decision Support Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white p-4.5 dark:border-indigo-900 dark:bg-gradient-to-r dark:from-indigo-950/50 dark:via-slate-900 dark:to-slate-900 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md dark:bg-indigo-500">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>HSE AI Intelligence & Decision Support</span>
              <span className="rounded-md bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                Active Analysis
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              Evaluates current filtered scope ({selectedRig}, {dateRangePreset}) against dropped-object indicators and shift fatigue to suggest targeted pre-tour talks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAiDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-600 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Insights</span>
        </button>
      </div>

      {/* 3. Graphical Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Executive Health & KPIs', icon: ShieldCheck },
          { id: 'schematic', label: 'Rig Spatial Digital Twin', icon: Compass },
          { id: 'trends', label: 'Trends & Diverging Matrix', icon: BarChart3 },
          { id: 'swa', label: 'SWA Intervention Pipeline', icon: ShieldAlert },
          { id: 'hazards', label: 'Energy Wheel & Bowtie', icon: Zap },
          { id: 'locations', label: 'Locations & Top Activities', icon: MapPin },
          { id: 'all', label: 'Unified Layout (All Sections)', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT BLOCKS */}

      {/* 1. OVERVIEW & FLEET HEALTH */}
      {(activeSection === 'overview' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          {/* Rig Health Cards */}
          <RigHealthCards />

          {/* Top KPI Cards */}
          <KpiOverview />

          {/* Best Observers Leaderboard */}
          <BestObservers />

          {/* 2-Column Split: Radar vs Hierarchy of Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Fleet Rig Performance Radar (5 Balanced Dimensions)
              </h3>
              <RigRadarChart />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Hierarchy of Controls Barrier Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Higher order controls (Elimination, Engineering) provide resilient defense.
              </p>
              <HierarchyOfControlsDonut />
            </div>
          </div>
        </div>
      )}

      {/* 2. RIG SPATIAL DIGITAL TWIN */}
      {(activeSection === 'schematic' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <RigSchematicMap />
          </div>
        </div>
      )}

      {/* 3. TRENDS & DIVERGING ANALYSIS */}
      {(activeSection === 'trends' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Monthly Trajectory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Observation Volume & Safe Ratio Trajectory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stacked breakdown of Safe Acts vs Unsafe Conditions with Safe Ratio (%) trajectory overlay.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Fleet Safe Target: &ge; 60%
              </span>
            </div>
            <MonthlyTrendChart selectedRig={selectedRig} />
          </div>

          {/* Diverging Category Bar Chart (Directly from Screenshot 2) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Safe vs Unsafe Diverging Bar Matrix by Operational Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Bi-directional horizontal bars comparing positive safe practices (green, right) versus at-risk conditions (red, left).
            </p>
            <DivergingCategoryChart />
          </div>

          {/* Fatigue & Time Intelligence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Time Intelligence: 24-Hour Cycle & Fatigue Hotspots</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Heatmap tracking observation frequency to pinpoint fatigue and shift-handover blindspots.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">24-Hour Cycle</span>
            </div>
            <TimeIntelligenceHeatmap />
          </div>
        </div>
      )}

      {/* 4. STOP WORK AUTHORITY (SWA) PIPELINE */}
      {(activeSection === 'swa' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Visual SWA Flow Diagram */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <SwaFlowDiagram />
          </div>

          {/* SWA Highlight Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4.5 dark:border-rose-900/60 dark:bg-rose-950/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                SWA Exercised Rate
              </span>
              <p className="mt-1 text-3xl font-black font-mono text-rose-700 dark:text-rose-300 tabular-nums">
                21.9%
              </p>
              <p className="mt-1 text-xs text-rose-900 dark:text-rose-200">
                5,379 jobs safely halted out of 24,535 unsafe observations
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Who Stopped the Job?
              </span>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Roustabout / Floorhand:</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">38.7% (Frontline)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Rig Site HSE Advisor:</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">13.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Driller / Assistant Driller:</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">15.9%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Intervention Pattern
              </span>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Self-Stopped & Corrected:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Escalated to Supervisor:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Escalated to Rig HSE:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* SWA Monthly Trajectory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Stop Work Authority (SWA) Monthly Trajectory
            </h3>
            <SwaTrendChart />
          </div>
        </div>
      )}

      {/* 5. HAZARDS & ENERGY WHEEL */}
      {(activeSection === 'hazards' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Energy Wheel & Bowtie Model */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <EnergyWheelMatrix />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exposure Duration & Control Hierarchy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  How Long Did the Hazard Exposure Exist?
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Duration before intervention or detection by field personnel.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Momentary (&lt; 15 mins)</span>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">65%</p>
                    <span className="text-[11px] text-slate-500">Caught immediately</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Shift Duration</span>
                    <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">24%</p>
                    <span className="text-[11px] text-slate-500">Handover detection</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated 72-96h</span>
                    <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">8%</p>
                    <span className="text-[11px] text-slate-500">Latent barrier gap</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Ongoing / Uncorrected</span>
                    <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 tabular-nums">3%</p>
                    <span className="text-[11px] text-slate-500">Under CAPA review</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs text-indigo-900 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
                <strong>Safety Takeaway:</strong> 89% of potential hazard exposures are caught within the active shift due to frontline peer observation vigilance.
              </div>
            </div>

            {/* Hierarchy of Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Hierarchy of Controls Barrier Distribution
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Higher order controls (Elimination, Engineering) provide resilient defense.
              </p>
              <HierarchyOfControlsDonut />
            </div>
          </div>
        </div>
      )}

      {/* 6. LOCATIONS & TOP ACTIVITIES */}
      {(activeSection === 'locations' || activeSection === 'all') && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top 12 Activities Lollipop Chart (Directly from Screenshot 2) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Top 12 Observed Field Activities (Lollipop Analysis)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Green stems indicate safe practice compliance; red stems isolate frequent offshore non-conformances (e.g., PPE, tools, line of fire).
            </p>
            <TopActivitiesLollipopChart />
          </div>

          {/* Deck Location Treemap */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Deck Location Density Treemap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Volume of observations mapped to rig physical zones. Larger block indicates higher operational activity.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">52,808 Total Points</span>
            </div>
            <LocationTreemap />
          </div>
        </div>
      )}

    </div>
  );
};
