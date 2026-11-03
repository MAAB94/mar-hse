import React from 'react';
import { ShieldAlert, ArrowRight, CheckCircle2, UserX, AlertCircle, RefreshCw } from 'lucide-react';

export const SwaFlowDiagram: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          <span>Stop Work Authority (SWA) Intervention Lifecycle</span>
        </h4>
        <span className="text-xs text-slate-400 font-mono">
          21.9% Overall SWA Intervention Rate
        </span>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        {/* Stage 1 */}
        <div className="relative rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200 uppercase">
                Step 1: Detection
              </span>
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h5 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              Hazard / At-Risk Act Observed
            </h5>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Line of fire, missing pin, or uncertified rigging spotted during active tour.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
            <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-400 tabular-nums">24,535</span>
            <span className="text-[10px] text-slate-500 block">Total Unsafe Conditions</span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="relative rounded-2xl border border-rose-200 bg-rose-50/70 p-4 dark:border-rose-900/60 dark:bg-rose-950/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200 uppercase">
                Step 2: Authority
              </span>
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <h5 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              Job Halted via SWA
            </h5>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Crew member exercises zero-blame authority to stop hoisting/rotary action.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40">
            <span className="text-xl font-black font-mono text-rose-700 dark:text-rose-400 tabular-nums">5,379</span>
            <span className="text-[10px] text-slate-500 block">21.9% of all unsafe events</span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="relative rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-indigo-200/80 px-2 py-0.5 text-[10px] font-bold text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200 uppercase">
                Step 3: Action
              </span>
              <RefreshCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h5 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              Intervention Resolution
            </h5>
            <div className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Self-stopped:</span>
                <strong className="text-emerald-600">87% (4,680)</strong>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">Supervisor:</span>
                <strong className="text-amber-600">10% (538)</strong>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600 dark:text-slate-400">HSE Advisor:</span>
                <strong className="text-indigo-600">3% (161)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 4 */}
        <div className="relative rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 uppercase">
                Step 4: Clearance
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h5 className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
              Barrier Restored &amp; Resume
            </h5>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
              Positive barrier re-verified by Driller before lifting suspension.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40">
            <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">100%</span>
            <span className="text-[10px] text-slate-500 block">Safely resumed without incident</span>
          </div>
        </div>

      </div>
    </div>
  );
};
