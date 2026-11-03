import React from 'react';
import { ShieldCheck, AlertTriangle, Users, Calendar, Gauge } from 'lucide-react';
import { RIG_HEALTH_SCORES } from '../../data/mockHseData';
import { useHse } from '../../context/HseContext';
import { RigId } from '../../types/hse';

export const RigHealthCards: React.FC = () => {
  const { selectedRig, setSelectedRig } = useHse();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Rig Health Scores (Fleet Operational Readiness)
        </h3>
        <span className="text-xs text-slate-400">
          Click any rig card to filter the entire dashboard
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RIG_HEALTH_SCORES.map((r) => {
          const isSelected = selectedRig === r.rig;
          const isGood = r.score >= 80;

          return (
            <button
              key={r.rig}
              type="button"
              onClick={() => setSelectedRig(selectedRig === r.rig ? 'All' : r.rig)}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
              aria-pressed={isSelected}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {r.rig}
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offshore Jack-Up / Semi-Sub
                  </span>
                </div>

                {/* Score Circle */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl font-extrabold text-base shadow-2xs tabular-nums ${
                    isGood
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {r.score}
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" /> Total Obs:
                  </span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                    {r.totalObservations.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-3.5 w-3.5" /> Unique Observers:
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                    {r.uniqueObservers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Gauge className="h-3.5 w-3.5" /> Safe Ratio:
                  </span>
                  <span className={`font-bold tabular-nums ${isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {r.safeRatio}%
                  </span>
                </div>
              </div>

              {/* Active selection kicker */}
              {isSelected && (
                <div className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  ✓ Active Filter
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
