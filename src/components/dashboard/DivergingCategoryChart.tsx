import React, { useState } from 'react';

interface CategoryData {
  category: string;
  safeCount: number;
  unsafeCount: number;
}

export const DivergingCategoryChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Data from screenshot 2: Safe vs Unsafe by Category
  const categories: CategoryData[] = [
    { category: 'Rig Floor & Hoisting Activities', safeCount: 10450, unsafeCount: 7754 },
    { category: 'Mechanical & Equipment Maintenance', safeCount: 4210, unsafeCount: 2240 },
    { category: 'Drilling & Well Operations', safeCount: 3890, unsafeCount: 3420 },
    { category: 'Supervision & Non-Operational', safeCount: 3120, unsafeCount: 1450 },
    { category: 'Manual Handling & Ergonomics', safeCount: 2890, unsafeCount: 2980 },
    { category: 'Chemical, Toxic & Environment', safeCount: 1650, unsafeCount: 1224 },
    { category: 'Housekeeping & Storage', safeCount: 2240, unsafeCount: 890 },
    { category: 'Work at Height / Scaffold', safeCount: 740, unsafeCount: 1633 },
    { category: 'Vehicles & Deck Equipment', safeCount: 2100, unsafeCount: 1649 },
    { category: 'Electrical & Instrumentation', safeCount: 1210, unsafeCount: 479 },
  ];

  const maxVal = 11000;
  const svgWidth = 600;
  const svgHeight = 320;
  const zeroX = 300; // Centerline
  const rowHeight = 28;
  const startY = 30;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[540px]">
        
        {/* Top Header Label */}
        <div className="flex items-center justify-between text-xs font-bold mb-2 px-6">
          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-rose-600" /> &larr; Unsafe Observations (High Risk)
          </span>
          <span className="text-slate-400 font-mono">0 Centerline</span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            Safe Observations (Good Practices) &rarr; <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
          </span>
        </div>

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full text-xs font-sans select-none"
          role="img"
          aria-label="Safe vs Unsafe Diverging Bar Chart by Operational Category"
        >
          {/* Vertical Center Grid Line */}
          <line
            x1={zeroX}
            y1={startY - 10}
            x2={zeroX}
            y2={startY + categories.length * rowHeight + 10}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
            strokeWidth="1.5"
          />

          {/* Scale Axis Lines */}
          {[-8000, -4000, 4000, 8000].map((v) => {
            const x = zeroX + (v / maxVal) * 260;
            return (
              <g key={v}>
                <line
                  x1={x}
                  y1={startY - 10}
                  x2={x}
                  y2={startY + categories.length * rowHeight + 10}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={x}
                  y={startY - 14}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-mono"
                >
                  {Math.abs(v).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Diverging Bars */}
          {categories.map((c, i) => {
            const y = startY + i * rowHeight;
            const unsafeWidth = (c.unsafeCount / maxVal) * 260;
            const safeWidth = (c.safeCount / maxVal) * 260;
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={c.category}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Background hover pill */}
                {isHovered && (
                  <rect
                    x="20"
                    y={y - 2}
                    width={svgWidth - 40}
                    height={rowHeight - 4}
                    fill="currentColor"
                    className="text-indigo-50/70 dark:text-indigo-950/40"
                    rx="4"
                  />
                )}

                {/* Left (Unsafe) Red Bar */}
                <rect
                  x={zeroX - unsafeWidth}
                  y={y + 2}
                  width={unsafeWidth}
                  height={rowHeight - 10}
                  fill="#dc2626"
                  rx="3"
                  className="transition-all duration-200"
                />

                {/* Right (Safe) Green Bar */}
                <rect
                  x={zeroX}
                  y={y + 2}
                  width={safeWidth}
                  height={rowHeight - 10}
                  fill="#16a34a"
                  rx="3"
                  className="transition-all duration-200"
                />

                {/* Category Text Label over centerline or above */}
                <text
                  x={zeroX}
                  y={y + 12}
                  textAnchor="middle"
                  className={`text-[9px] font-bold ${
                    isHovered
                      ? 'fill-indigo-900 dark:fill-indigo-200'
                      : 'fill-slate-700 dark:fill-slate-200'
                  }`}
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                    paintOrder: 'stroke fill',
                    stroke: 'var(--color-slate-900, #0f172a)',
                    strokeWidth: '2px',
                  }}
                >
                  {c.category}
                </text>

                {/* Left numeric label (Unsafe) */}
                <text
                  x={zeroX - unsafeWidth - 6}
                  y={y + 12}
                  textAnchor="end"
                  className="fill-rose-600 dark:fill-rose-400 text-[9px] font-mono font-bold"
                >
                  {c.unsafeCount.toLocaleString()}
                </text>

                {/* Right numeric label (Safe) */}
                <text
                  x={zeroX + safeWidth + 6}
                  y={y + 12}
                  textAnchor="start"
                  className="fill-emerald-600 dark:fill-emerald-400 text-[9px] font-mono font-bold"
                >
                  {c.safeCount.toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend / Insight Note */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            <strong>Key Insight:</strong> Work at Height and Manual Handling show highest ratio of unsafe conditions relative to volume.
          </span>
          <span className="font-mono text-slate-400">Total: 52,808 Observations</span>
        </div>
      </div>
    </div>
  );
};
