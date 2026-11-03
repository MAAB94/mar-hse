import React from 'react';
import { 
  MessageSquareQuote, 
  SearchCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileKey, 
  Shield, 
  Users2, 
  Plus, 
  Download, 
  Filter, 
  Check, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const ToolboxTalksView: React.FC = () => {
  const { showToast } = useHse();

  const talks = [
    { id: 'TBT-101', title: 'DROPS: Secondary Retention & Mast Safety Clamps', date: '2026-11-03', leader: 'WU XIU BIN', rig: 'BHDC-67', attendance: 24, status: 'Completed' },
    { id: 'TBT-102', title: 'Crane Tagline Control & Swing Path Exclusion Zones', date: '2026-11-03', leader: 'SHI JI TAO', rig: 'BHDC-67', attendance: 18, status: 'Completed' },
    { id: 'TBT-103', title: 'Night Shift Fatigue Management & 03:00 Handover Focus', date: '2026-11-02', leader: 'Usama Tariq', rig: 'BHDC-117', attendance: 31, status: 'Completed' },
    { id: 'TBT-104', title: 'H2S Sensor Calibration & Emergency Muster Protocols', date: '2026-11-01', leader: 'JAWAD', rig: 'BHDC-118', attendance: 20, status: 'Scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Toolbox Talks (TBT)</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pre-tour safety meetings, hazard identification briefings, and team sign-offs.</p>
        </div>
        <button
          onClick={() => showToast('New Toolbox Talk session scheduled.', 'success')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Safety Briefing</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Topic Title</th>
              <th className="px-4 py-3">Rig</th>
              <th className="px-4 py-3">Leader</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {talks.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t.title}</td>
                <td className="px-4 py-3">{t.rig}</td>
                <td className="px-4 py-3">{t.leader}</td>
                <td className="px-4 py-3 font-mono">{t.date}</td>
                <td className="px-4 py-3 tabular-nums font-semibold">{t.attendance} crew</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RigInspectionsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Rig Safety Inspections & Audits</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Periodic physical barrier audits, DROPS surveys, and equipment integrity checklists.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Weekly Derrick & Mast DROPS Survey', rig: 'BHDC-67', score: '98% Pass', inspector: 'HSE Advisor', date: 'Due in 2 days' },
          { title: 'BOP Accumulator & Choke Manifold Check', rig: 'BHDC-118', score: '92% Pass', inspector: 'BOP Specialist', date: 'Completed Yesterday' },
          { title: 'Lifeboat & TEMPSC Evacuation Integrity', rig: 'BHDC-117', score: '100% Pass', inspector: 'Marine Superintendent', date: 'Completed 3 days ago' },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{item.rig}</span>
            <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs">
              <span className="font-bold text-emerald-600">{item.score}</span>
              <span className="text-slate-400">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IncidentManagementView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">BHDC HSE Incident Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Formal incident reporting, Near Miss tracking, First Aid cases, and environmental spills.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
          <span className="text-base font-bold">Zero Lost Time Incidents (LTI) in the last 412 Days</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Total fleet safe man-hours logged: <strong>1,842,500 hours</strong>. Active proactive reporting and peer-to-peer observations remain the key drivers of accident prevention.
        </p>
      </div>
    </div>
  );
};

export const UsersView: React.FC = () => {
  const users = [
    { name: 'WU XIU BIN', role: 'Driller', rig: 'BHDC-67', email: 'wu.xiubin@bhdc.com', status: 'On Duty' },
    { name: 'SHI JI TAO', role: 'Assistant Driller', rig: 'BHDC-67', email: 'shi.jitao@bhdc.com', status: 'On Duty' },
    { name: 'OMAN HASSAN', role: 'Floorhand / Roustabout', rig: 'BHDC-67', email: 'oman.hassan@bhdc.com', status: 'On Duty' },
    { name: 'Usama Tariq', role: 'Rig HSE Advisor', rig: 'BHDC-117', email: 'usama.tariq@bhdc.com', status: 'On Duty' },
    { name: 'JAWAD', role: 'Mud Plant Operator', rig: 'BHDC-118', email: 'jawad@bhdc.com', status: 'On Duty' },
    { name: 'Saqlain Abbas', role: 'Roustabout', rig: 'BHDC-68', email: 'saqlain.abbas@bhdc.com', status: 'Shore Leave' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Personnel & Access Roles</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Roster of certified offshore personnel, drill crews, and assigned HSE advisors.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Crew Member</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Assigned Rig</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 font-semibold">{u.rig}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${u.status === 'On Duty' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'}`}>
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
