import React, { useState } from 'react';

// Monthly Volume & Safe Ratio Combo Chart
export const MonthlyTrendChart: React.FC<{ selectedRig?: string }> = ({ selectedRig }) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Data for stacked bars + safe ratio
  const data = [
    { month: 'Jan', safeAct: 1800, safeCond: 800, unsafeAct: 1200, unsafeCond: 900, safeRatio: 55.3 },
    { month: 'Feb', safeAct: 2100, safeCond: 950, unsafeAct: 1300, unsafeCond: 850, safeRatio: 58.6 },
    { month: 'Mar', safeAct: 2400, safeCond: 1100, unsafeAct: 1500, unsafeCond: 1000, safeRatio: 58.3 },
    { month: 'Apr', safeAct: 2000, safeCond: 900, unsafeAct: 1600, unsafeCond: 1100, safeRatio: 51.7 },
    { month: 'May', safeAct: 2200, safeCond: 1050, unsafeAct: 1400, unsafeCond: 950, safeRatio: 57.0 },
    { month: 'Jun', safeAct: 2500, safeCond: 1200, unsafeAct: 1350, unsafeCond: 850, safeRatio: 62.7 },
    { month: 'Jul', safeAct: 2300, safeCond: 1100, unsafeAct: 1450, unsafeCond: 950, safeRatio: 58.6 },
    { month: 'Aug', safeAct: 2100, safeCond: 900, unsafeAct: 1700, unsafeCond: 1200, safeRatio: 50.8 },
    { month: 'Sep', safeAct: 1950, safeCond: 850, unsafeAct: 1800, unsafeCond: 1300, safeRatio: 47.4 },
    { month: 'Oct', safeAct: 2400, safeCond: 1150, unsafeAct: 1500, unsafeCond: 950, safeRatio: 59.1 },
    { month: 'Nov', safeAct: 2600, safeCond: 1300, unsafeAct: 1400, unsafeCond: 800, safeRatio: 63.9 },
    { month: 'Dec', safeAct: 2550, safeCond: 1250, unsafeAct: 1450, unsafeCond: 850, safeRatio: 62.2 },
  ];

  const maxTotal = 7000;
  const svgHeight = 240;
  const svgWidth = 640;
  const barWidth = 32;
  const chartBottom = 200;
  const chartTop = 30;
  const chartHeight = chartBottom - chartTop;

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[540px] text-xs font-sans"
        role="img"
        aria-label="Monthly Safety Observation Volume and Safe Ratio Trend Chart"
      >
        <title>Monthly Safety Observation Volume and Safe Ratio</title>
        <desc>Stacked bar chart showing safe acts, safe conditions, unsafe acts, unsafe conditions, and line representing safe ratio percent.</desc>

        {/* Grid lines */}
        {[0, 2000, 4000, 6000].map((val) => {
          const y = chartBottom - (val / maxTotal) * chartHeight;
          return (
            <g key={val}>
              <line
                x1="45"
                y1={y}
                x2={svgWidth - 45}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray="3 3"
              />
              <text x="38" y={y + 3} textAnchor="end" className="fill-slate-400 text-[10px]">
                {val}
              </text>
            </g>
          );
        })}

        {/* Right axis labels (Safe Ratio %) */}
        {[40, 50, 60, 70].map((pct) => {
          // map 40% to chartBottom, 70% to chartTop
          const y = chartBottom - ((pct - 40) / 30) * chartHeight;
          return (
            <text key={pct} x={svgWidth - 38} y={y + 3} textAnchor="start" className="fill-indigo-500 font-semibold text-[10px]">
              {pct}%
            </text>
          );
        })}

        {/* Stacked Bars */}
        {data.map((d, i) => {
          const x = 55 + i * 46;
          const hSafeAct = (d.safeAct / maxTotal) * chartHeight;
          const hSafeCond = (d.safeCond / maxTotal) * chartHeight;
          const hUnsafeAct = (d.unsafeAct / maxTotal) * chartHeight;
          const hUnsafeCond = (d.unsafeCond / maxTotal) * chartHeight;

          const ySafeAct = chartBottom - hSafeAct;
          const ySafeCond = ySafeAct - hSafeCond;
          const yUnsafeAct = ySafeCond - hUnsafeAct;
          const yUnsafeCond = yUnsafeAct - hUnsafeCond;

          const isHovered = hoveredMonth === i;

          return (
            <g 
              key={d.month} 
              onMouseEnter={() => setHoveredMonth(i)} 
              onMouseLeave={() => setHoveredMonth(null)}
              className="cursor-pointer"
            >
              {/* Hover highlight background column */}
              {isHovered && (
                <rect
                  x={x - 4}
                  y={chartTop}
                  width={barWidth + 8}
                  height={chartHeight}
                  fill="currentColor"
                  className="text-indigo-50/70 dark:text-indigo-950/40"
                  rx="4"
                />
              )}

              {/* Safe Act (Green) */}
              <rect x={x} y={ySafeAct} width={barWidth} height={hSafeAct} fill="#16a34a" rx="1" />
              {/* Safe Condition (Teal) */}
              <rect x={x} y={ySafeCond} width={barWidth} height={hSafeCond} fill="#0d9488" rx="1" />
              {/* Unsafe Act (Amber) */}
              <rect x={x} y={yUnsafeAct} width={barWidth} height={hUnsafeAct} fill="#f59e0b" rx="1" />
              {/* Unsafe Condition (Crimson) */}
              <rect x={x} y={yUnsafeCond} width={barWidth} height={hUnsafeCond} fill="#dc2626" rx="1" />

              {/* Month label */}
              <text
                x={x + barWidth / 2}
                y={chartBottom + 16}
                textAnchor="middle"
                className={`text-[10px] ${isHovered ? 'fill-indigo-600 font-bold dark:fill-indigo-400' : 'fill-slate-500'}`}
              >
                {d.month}
              </text>
            </g>
          );
        })}

        {/* Safe Ratio Line (Blue / Indigo) */}
        <polyline
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          points={data
            .map((d, i) => {
              const x = 55 + i * 46 + barWidth / 2;
              const y = chartBottom - ((d.safeRatio - 40) / 30) * chartHeight;
              return `${x},${y}`;
            })
            .join(' ')}
        />

        {/* Line dots */}
        {data.map((d, i) => {
          const x = 55 + i * 46 + barWidth / 2;
          const y = chartBottom - ((d.safeRatio - 40) / 30) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hoveredMonth === i ? 5 : 3}
              fill="#ffffff"
              stroke="#4f46e5"
              strokeWidth="2.5"
            />
          );
        })}
      </svg>

      {/* Tooltip on Hover */}
      {hoveredMonth !== null && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] shadow-lg dark:border-slate-700 dark:bg-slate-800 pointer-events-none flex items-center gap-3">
          <span className="font-bold text-slate-900 dark:text-white">{data[hoveredMonth].month} 2026:</span>
          <span className="text-emerald-600 font-semibold">Safe: {data[hoveredMonth].safeAct + data[hoveredMonth].safeCond}</span>
          <span className="text-rose-600 font-semibold">Unsafe: {data[hoveredMonth].unsafeAct + data[hoveredMonth].unsafeCond}</span>
          <span className="text-indigo-600 font-bold">Safe Ratio: {data[hoveredMonth].safeRatio}%</span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-xs bg-[#16a34a]" /> Safe Act
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-xs bg-[#0d9488]" /> Safe Condition
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-xs bg-[#f59e0b]" /> Unsafe Act
        </span>
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-xs bg-[#dc2626]" /> Unsafe Condition
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="h-0.5 w-4 bg-[#4f46e5]" /> Safe Ratio %
        </span>
      </div>
    </div>
  );
};

// Rig Performance Radar Chart
export const RigRadarChart: React.FC = () => {
  const axes = [
    { name: 'Volume / Month', angle: 0 },
    { name: 'Safe Ratio', angle: 72 },
    { name: 'Observer Breadth', angle: 144 },
    { name: 'Desc. Quality', angle: 216 },
    { name: 'Category Diversity', angle: 288 },
  ];

  const center = 150;
  const radius = 100;

  const rigs = [
    { name: 'BHDC-117', color: '#3b82f6', values: [0.88, 0.92, 0.85, 0.90, 0.86] },
    { name: 'BHDC-118', color: '#f59e0b', values: [0.68, 0.60, 0.72, 0.75, 0.78] },
    { name: 'BHDC-67', color: '#10b981', values: [0.95, 0.88, 0.92, 0.87, 0.91] },
    { name: 'BHDC-68', color: '#ec4899', values: [0.74, 0.84, 0.78, 0.82, 0.79] },
  ];

  const getCoordinates = (angleDeg: number, val: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + radius * val * Math.cos(rad),
      y: center + radius * val * Math.sin(rad),
    };
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-[280px]" role="img" aria-label="Rig Performance Radar">
        {/* Background concentric webs */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
          <polygon
            key={level}
            points={axes
              .map((a) => {
                const pt = getCoordinates(a.angle, level);
                return `${pt.x},${pt.y}`;
              })
              .join(' ')}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="1"
          />
        ))}

        {/* Radial axes lines */}
        {axes.map((a) => {
          const pt = getCoordinates(a.angle, 1.0);
          return (
            <line
              key={a.name}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* Polygons for each Rig */}
        {rigs.map((r) => {
          const points = axes
            .map((a, i) => {
              const pt = getCoordinates(a.angle, r.values[i]);
              return `${pt.x},${pt.y}`;
            })
            .join(' ');

          return (
            <polygon
              key={r.name}
              points={points}
              fill={r.color}
              fillOpacity="0.2"
              stroke={r.color}
              strokeWidth="2"
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((a) => {
          const pt = getCoordinates(a.angle, 1.18);
          return (
            <text
              key={a.name}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              className="fill-slate-600 dark:fill-slate-400 text-[9px] font-semibold"
            >
              {a.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
        {rigs.map((r) => (
          <span key={r.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Hierarchy of Controls Donut Chart
export const HierarchyOfControlsDonut: React.FC = () => {
  const slices = [
    { label: 'Engineering control', percent: 65, color: '#16a34a' },
    { label: 'PPE', percent: 18, color: '#3b82f6' },
    { label: 'Administrative control', percent: 9, color: '#f59e0b' },
    { label: 'Human control / Spotter', percent: 8, color: '#8b5cf6' },
  ];

  let cumulativeAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {slices.map((slice) => {
            const strokeDasharray = `${slice.percent} ${100 - slice.percent}`;
            const strokeDashoffset = -cumulativeAngle;
            cumulativeAngle += slice.percent;

            return (
              <circle
                key={slice.label}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={slice.color}
                strokeWidth="14"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">65%</span>
          <span className="text-[10px] font-semibold text-slate-500">Engineering Barrier</span>
        </div>
      </div>

      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-slate-700 dark:text-slate-300">{s.label}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// SWA Trend Over Time
export const SwaTrendChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const stops = [380, 420, 510, 450, 480, 540, 490, 430, 410, 490, 560, 520];
  const rates = [18.2, 19.5, 22.8, 20.4, 21.1, 24.3, 22.0, 19.8, 18.9, 22.1, 25.0, 23.4];

  const maxStops = 700;
  const svgWidth = 500;
  const svgHeight = 180;
  const bottom = 150;
  const top = 20;
  const height = bottom - top;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[420px]" role="img" aria-label="SWA Interventions Trend">
        {/* Bars for stops */}
        {stops.map((val, i) => {
          const x = 30 + i * 38;
          const barH = (val / maxStops) * height;
          const y = bottom - barH;

          return (
            <g key={i}>
              <rect x={x} y={y} width="22" height={barH} fill="#dc2626" rx="2" />
              <text x={x + 11} y={bottom + 14} textAnchor="middle" className="fill-slate-500 text-[9px]">
                {months[i]}
              </text>
            </g>
          );
        })}

        {/* Rate line */}
        <polyline
          fill="none"
          stroke="#1e1b4b"
          className="dark:stroke-indigo-400"
          strokeWidth="2.5"
          points={rates
            .map((r, i) => {
              const x = 30 + i * 38 + 11;
              const y = bottom - ((r - 15) / 15) * height;
              return `${x},${y}`;
            })
            .join(' ')}
        />
      </svg>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-xs bg-[#dc2626]" /> SWA Stop Events
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-indigo-400">
          <span className="h-0.5 w-4 bg-slate-900 dark:bg-indigo-400" /> SWA Usage Rate (%)
        </span>
      </div>
    </div>
  );
};

// Location Treemap Representation (Rig Floor, Others, Vehicles, Well Control, Accommodation)
export const LocationTreemap: React.FC = () => {
  const zones = [
    { name: 'Rig Floor & Hoisting Areas', count: '18,204', pct: '34.5%', color: 'bg-slate-800 text-white', span: 'col-span-2 row-span-2' },
    { name: 'Others & General Transit', count: '8,571', pct: '16.2%', color: 'bg-indigo-800 text-white', span: 'col-span-1 row-span-1' },
    { name: 'Vehicles, Traffic & External', count: '6,978', pct: '13.2%', color: 'bg-slate-700 text-white', span: 'col-span-1 row-span-1' },
    { name: 'Well Control & Pressure Systems', count: '4,519', pct: '8.6%', color: 'bg-teal-800 text-white', span: 'col-span-1 row-span-1' },
    { name: 'Accommodation & Welfare', count: '4,166', pct: '7.9%', color: 'bg-indigo-700 text-white', span: 'col-span-1 row-span-1' },
    { name: 'Mechanical & Equipment Deck', count: '2,931', pct: '5.6%', color: 'bg-slate-600 text-white', span: 'col-span-1 row-span-1' },
    { name: 'Chemical / Mud Plant Deck', count: '2,874', pct: '5.4%', color: 'bg-teal-700 text-white', span: 'col-span-1 row-span-1' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 h-64">
      {zones.map((z) => (
        <div
          key={z.name}
          className={`${z.span} ${z.color} rounded-xl p-3 flex flex-col justify-between transition hover:opacity-95 shadow-2xs`}
        >
          <span className="text-[11px] font-semibold leading-tight line-clamp-2">{z.name}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base font-extrabold font-mono tabular-nums">{z.count}</span>
            <span className="text-[10px] opacity-80">{z.pct}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Fatigue & Time Heatmap (Hour vs Day of week)
export const TimeIntelligenceHeatmap: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = [
    '00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'
  ];

  // Simulated intensity 0-3
  const getIntensity = (dIdx: number, hIdx: number) => {
    // Night shift handover fatigue around 02:00-04:00 (hIdx 1, 2)
    if (hIdx === 1 || hIdx === 2) return 3;
    if (hIdx >= 4 && hIdx <= 7) return 2; // Midday tour
    return 1;
  };

  const getColor = (lvl: number) => {
    switch (lvl) {
      case 3:
        return 'bg-rose-500 text-white';
      case 2:
        return 'bg-indigo-500 text-white';
      default:
        return 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
    }
  };

  return (
    <div className="space-y-2 overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Hours Header */}
        <div className="flex pl-10 text-[10px] text-slate-400 mb-1">
          {hours.map((h) => (
            <div key={h} className="flex-1 text-center font-mono">{h}h</div>
          ))}
        </div>

        {/* Days grid */}
        {days.map((day, dIdx) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="w-9 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{day}</span>
            <div className="flex-1 grid grid-cols-12 gap-1">
              {hours.map((_, hIdx) => {
                const lvl = getIntensity(dIdx, hIdx);
                return (
                  <div
                    key={hIdx}
                    className={`h-5 rounded-xs flex items-center justify-center text-[9px] font-bold ${getColor(lvl)}`}
                    title={`${day} at ${hours[hIdx]}:00 - Risk tier ${lvl}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>02:00 - 04:00 Handover window shows elevated dropped object fatigue risk</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-xs bg-slate-200 dark:bg-slate-700" /> Low</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-xs bg-indigo-500" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-xs bg-rose-500" /> High Fatigue</span>
        </div>
      </div>
    </div>
  );
};
