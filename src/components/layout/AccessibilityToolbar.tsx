import React from 'react';
import { 
  X, 
  Eye, 
  Type, 
  Sparkles, 
  Contrast, 
  ZapOff, 
  Check, 
  Keyboard, 
  RotateCcw 
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const AccessibilityToolbar: React.FC = () => {
  const { 
    isAccessibilityDrawerOpen, 
    setIsAccessibilityDrawerOpen, 
    accessibility, 
    updateAccessibility,
    theme,
    toggleTheme,
    showToast
  } = useHse();

  if (!isAccessibilityDrawerOpen) return null;

  const resetAccessibility = () => {
    updateAccessibility({
      highContrast: false,
      fontSize: 'normal',
      reducedMotion: false,
      colorBlindFilter: 'none',
      showFocusIndicators: true,
    });
    showToast('Accessibility settings reset to default', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-dialog-title"
    >
      <div 
        className="w-full max-w-md bg-white p-6 shadow-2xl transition-transform dark:bg-slate-900 flex flex-col h-full border-l border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <Eye className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="a11y-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
                Accessibility Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                WCAG 2.1 AA / AAA Compliance Tools
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAccessibilityDrawerOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close accessibility settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Controls */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* Contrast Mode */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Contrast className="h-3.5 w-3.5" /> Contrast & Visual Density
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateAccessibility({ highContrast: false })}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                  !accessibility.highContrast
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span>Standard Contrast</span>
                {!accessibility.highContrast && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
              <button
                type="button"
                onClick={() => updateAccessibility({ highContrast: true })}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                  accessibility.highContrast
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500 ring-2 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <span>High Contrast (AAA)</span>
                {accessibility.highContrast && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Enhances text contrast ratio to $\ge 7:1$ and deepens field borders for visual clarity in high-glare offshore environments.
            </p>
          </div>

          {/* Text Size Scaling */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Type className="h-3.5 w-3.5" /> Text Size Scaling
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'x-large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateAccessibility({ fontSize: size })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition ${
                    accessibility.fontSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-500 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <span className={size === 'normal' ? 'text-xs' : size === 'large' ? 'text-sm font-semibold' : 'text-base font-bold'}>
                    {size === 'normal' ? '100%' : size === 'large' ? '115%' : '125%'}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">{size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <ZapOff className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Reduce Motion</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Minimizes animated chart transitions and popups</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.reducedMotion}
                onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                aria-label="Toggle reduce motion"
              />
            </div>
          </div>

          {/* Colorblind Perception Support */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Colorblind Iconography Enforcements
            </label>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/60">
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                All status indicators (Safe vs Unsafe) automatically include explicit shapes, symbols, and bold text labels alongside color.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 font-semibold">
                  ✓ Safe Act (Circle Check)
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-2 py-0.5 font-semibold">
                  ⚠ Unsafe Act (Triangle Alert)
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Keyboard className="h-3.5 w-3.5" /> Keyboard Navigation Shortcuts
            </label>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="flex items-center justify-between p-2.5">
                <span className="text-slate-600 dark:text-slate-400">Focus Global Search</span>
                <kbd className="rounded border border-slate-300 dark:border-slate-600 px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800">
                  / or Ctrl+K
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-slate-600 dark:text-slate-400">New Observation Card</span>
                <kbd className="rounded border border-slate-300 dark:border-slate-600 px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800">
                  Alt+N
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-slate-600 dark:text-slate-400">Close Open Modal / Dialog</span>
                <kbd className="rounded border border-slate-300 dark:border-slate-600 px-2 py-0.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAccessibilityDrawerOpen(false)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
