import React from 'react';
import { Award, ShieldAlert, CheckCircle, Flame } from 'lucide-react';
import { BEST_OBSERVERS } from '../../data/mockHseData';

export const BestObservers: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-amber-500" />
          <span>Top Safety Observers (Frontline Recognition)</span>
        </h3>
        <span className="text-xs text-slate-400">
          Ranked by observation frequency & quality
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {BEST_OBSERVERS.map((obs, idx) => (
          <div
            key={obs.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-black text-white shadow-2xs">
                  {obs.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {obs.name}
                    </span>
                    {idx === 0 && (
                      <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        #1
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {obs.role} · <strong className="text-slate-700 dark:text-slate-300">{obs.rig}</strong>
                  </p>
                </div>
              </div>

              {/* HSE Score */}
              <div className="flex flex-col items-end">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 tabular-nums">
                  {obs.score} pts
                </span>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Obs</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{obs.totalObservations}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Categories</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{obs.categoriesCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Active</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{obs.monthsActive} mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
