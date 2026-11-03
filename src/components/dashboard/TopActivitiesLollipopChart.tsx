import React, { useState } from 'react';

interface ActivityItem {
  activity: string;
  count: number;
  isSafeMajority: boolean;
  safePct: number;
}

export const TopActivitiesLollipopChart: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<ActivityItem | null>(null);

  const activities: ActivityItem[] = [
    { activity: 'PPE not worn / non-compliant', count: 3250, isSafeMajority: false, safePct: 22 },
    { activity: 'Guardrails installed & secure', count: 3050, isSafeMajority: true, safePct: 88 },
    { activity: 'Correct tool not selected', count: 2600, isSafeMajority: false, safePct: 28 },
    { activity: 'Clean unobstructed walkways', count: 2450, isSafeMajority: true, safePct: 91 },
    { activity: 'Load controlled throughout lift', count: 2310, isSafeMajority: true, safePct: 84 },
    { activity: 'Entered red line of fire zone', count: 2190, isSafeMajority: false, safePct: 15 },
    { activity: 'Defective or uninspected tool', count: 1980, isSafeMajority: false, safePct: 19 },
    { activity: 'Correct PPE worn & inspected', count: 1840, isSafeMajority: true, safePct: 94 },
    { activity: 'Missing / frayed safety lanyard', count: 1650, isSafeMajority: false, safePct: 31 },
    { activity: 'Walkways wet / oil slip hazard', count: 1520, isSafeMajority: false, safePct: 24 },
    { activity: 'Pipe handled with certified tag line', count: 1410, isSafeMajority: true, safePct: 89 },
    { activity: 'LOTO verified before servicing', count: 1290, isSafeMajority: true, safePct: 96 },
  ];

  const maxCount = 3500;
  const svgWidth = 560;
  const svgHeight = 310;
  const labelWidth = 200;
  const chartWidth = svgWidth - labelWidth - 40;
  const rowHeight = 24;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full text-xs font-sans select-none"
          role="img"
          aria-label="Top 12 Observed Activities Lollipop Chart"
        >
          {activities.map((item, idx) => {
            const y = 20 + idx * rowHeight;
            const lineLength = (item.count / maxCount) * chartWidth;
            const dotX = labelWidth + lineLength;
            const isHovered = hoveredItem?.activity === item.activity;

            return (
              <g
                key={item.activity}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer"
              >
                {/* Background hover bar */}
                {isHovered && (
                  <rect
                    x="5"
                    y={y - 10}
                    width={svgWidth - 10}
                    height={rowHeight - 2}
                    fill="currentColor"
                    className="text-indigo-50/70 dark:text-indigo-950/40"
                    rx="4"
                  />
                )}

                {/* Activity Label */}
                <text
                  x={labelWidth - 10}
                  y={y + 3}
                  textAnchor="end"
                  className={`text-[10px] font-medium ${
                    isHovered
                      ? 'fill-indigo-600 dark:fill-indigo-400 font-bold'
                      : 'fill-slate-700 dark:fill-slate-300'
                  }`}
                >
                  {item.activity}
                </text>

                {/* Lollipop Stem Line */}
                <line
                  x1={labelWidth}
                  y1={y}
                  x2={dotX}
                  y2={y}
                  stroke={item.isSafeMajority ? '#16a34a' : '#dc2626'}
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />

                {/* Lollipop Head Circle */}
                <circle
                  cx={dotX}
                  cy={y}
                  r={isHovered ? 7 : 5}
                  fill={item.isSafeMajority ? '#16a34a' : '#dc2626'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Value Label */}
                <text
                  x={dotX + 12}
                  y={y + 3}
                  textAnchor="start"
                  className="fill-slate-500 dark:fill-slate-400 font-mono text-[9px] font-bold"
                >
                  {item.count.toLocaleString()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Details */}
        {hoveredItem && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md dark:border-slate-800 dark:bg-slate-800 flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">
              {hoveredItem.activity}
            </span>
            <span className={`font-bold ${hoveredItem.isSafeMajority ? 'text-emerald-600' : 'text-rose-600'}`}>
              {hoveredItem.safePct}% Safe Compliance Ratio ({hoveredItem.count.toLocaleString()} total logged)
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#16a34a]" /> Safe Practice Majority (&ge; 70%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#dc2626]" /> Unsafe Risk Majority (&gt; 50% Unsafe)
          </span>
        </div>
      </div>
    </div>
  );
};
