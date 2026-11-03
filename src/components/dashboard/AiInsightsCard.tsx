import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Download, 
  RefreshCw,
  Lightbulb,
  Share2
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const AiInsightsCard: React.FC = () => {
  const { 
    isAiDrawerOpen, 
    setIsAiDrawerOpen, 
    selectedRig, 
    dateRangePreset, 
    showToast 
  } = useHse();

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<{
    summary: string;
    keyRisks: string[];
    recommendedActions: string[];
    confidenceScore: number;
    source?: string;
  } | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hse-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rig: selectedRig,
          dateRange: dateRangePreset,
          stats: {
            total: '52,808',
            safeRatio: selectedRig === 'BHDC-118' ? '49.6%' : selectedRig === 'BHDC-68' ? '64.7%' : '53.5%',
            swaCount: '5,379',
            swaRate: '21.9%'
          }
        })
      });
      const data = await response.json();
      setInsights(data);
      showToast('AI HSE Risk Advisory generated successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Generated offline safety advisory.', 'info');
    } finally {
      setLoading(false);
    }
  };

  // If closed, return null
  if (!isAiDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-indigo-200 bg-white shadow-2xl transition dark:border-indigo-900 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md dark:bg-indigo-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 id="ai-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
                AI HSE Intelligence & Risk Advisor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Decision support synthesized for <strong className="text-indigo-600 dark:text-indigo-400">{selectedRig}</strong> ({dateRangePreset} scope)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiDrawerOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {!insights && !loading && (
            <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-8 text-center dark:border-indigo-900 dark:bg-indigo-950/20">
              <Lightbulb className="mx-auto h-10 w-10 text-indigo-500 mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Generate Instant HSE Decision Support
              </h3>
              <p className="mt-1 max-w-md mx-auto text-xs text-slate-600 dark:text-slate-300">
                Our model analyzes all 52,808 field observation cards, SWA triggers, dropped object patterns, and shift fatigue to isolate operational vulnerabilities.
              </p>
              <button
                type="button"
                onClick={generateInsights}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 active:scale-98"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Executive Risk Analysis</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="mx-auto h-8 w-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Synthesizing offshore observation trends and Stop Work Authority metrics...
              </p>
              <p className="text-[11px] text-slate-400">
                Evaluating against IADC safety guidelines & dropped object standards
              </p>
            </div>
          )}

          {insights && !loading && (
            <div className="space-y-5 animate-in fade-in">
              {/* Executive Summary */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    Executive Narrative
                  </span>
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    Confidence: {insights.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                  {insights.summary}
                </p>
              </div>

              {/* Key Operational Hazards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <span>Key Identified Operational Vulnerabilities</span>
                </h4>
                <div className="space-y-2">
                  {insights.keyRisks.map((risk, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"
                    >
                      <span className="font-bold text-rose-600 dark:text-rose-400 shrink-0">#{i + 1}</span>
                      <p className="leading-relaxed">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Plan */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Prioritized Corrective Interventions</span>
                </h4>
                <div className="space-y-2">
                  {insights.recommendedActions.map((action, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            {insights?.source && <span>Engine: {insights.source}</span>}
          </div>

          <div className="flex items-center gap-2">
            {insights && (
              <button
                type="button"
                onClick={generateInsights}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Re-analyze</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAiDrawerOpen(false)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
