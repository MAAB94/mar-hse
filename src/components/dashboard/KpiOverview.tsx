import React from 'react';
import { 
  ClipboardCheck, 
  ShieldCheck, 
  AlertTriangle, 
  PieChart, 
  Users, 
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const KpiOverview: React.FC = () => {
  const { selectedRig } = useHse();

  // Adjust stats dynamically if a specific rig is selected
  const stats = React.useMemo(() => {
    switch (selectedRig) {
      case 'BHDC-117':
        return { total: '16,200', safe: '9,865', unsafe: '6,335', ratio: '60.9%', observers: '131', corrected: '58%' };
      case 'BHDC-118':
        return { total: '7,054', safe: '3,498', unsafe: '3,556', ratio: '49.6%', observers: '92', corrected: '51%' };
      case 'BHDC-67':
        return { total: '20,775', safe: '11,883', unsafe: '8,892', ratio: '57.2%', observers: '158', corrected: '56%' };
      case 'BHDC-68':
        return { total: '8,589', safe: '5,557', unsafe: '3,032', ratio: '64.7%', observers: '90', corrected: '59%' };
      default:
        return { total: '52,808', safe: '28,273', unsafe: '24,535', ratio: '53.5%', observers: '2,887', corrected: '55%' };
    }
  }, [selectedRig]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Key Performance Indicators {selectedRig !== 'All' ? `(${selectedRig})` : '(Fleet Total)'}
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Year-to-Date 2026
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Observations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Obs</span>
            <ClipboardCheck className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.total}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +12.4% vs 2025
          </p>
        </div>

        {/* Safe Observations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Safe Obs</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {stats.safe}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Proactive safe acts
          </p>
        </div>

        {/* Unsafe Observations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unsafe Obs</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {stats.unsafe}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Hazards mitigated
          </p>
        </div>

        {/* Safe Ratio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Safe Ratio</span>
            <PieChart className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400 tabular-nums">
            {stats.ratio}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-500" 
              style={{ width: stats.ratio }} 
            />
          </div>
        </div>

        {/* Unique Observers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Observers</span>
            <Users className="h-4 w-4 text-slate-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
            {stats.observers}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            85% frontline crew
          </p>
        </div>

        {/* Corrected Immediately */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">On-Spot Fix</span>
            <CheckCircle className="h-4 w-4 text-teal-500" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-400 tabular-nums">
            {stats.corrected}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Instant correction
          </p>
        </div>

      </div>
    </div>
  );
};
