import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Tag, 
  Printer, 
  Building2 
} from 'lucide-react';
import { useHse } from '../../context/HseContext';

export const ObservationDetailModal: React.FC = () => {
  const { 
    selectedObservation, 
    setSelectedObservation, 
    updateObservation, 
    showToast 
  } = useHse();

  if (!selectedObservation) return null;

  const handleApprove = () => {
    updateObservation(selectedObservation.id, { status: 'Approved' });
    setSelectedObservation({ ...selectedObservation, status: 'Approved' });
    showToast(`Observation ${selectedObservation.serialNumber} marked as Approved!`, 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition dark:border-slate-800 dark:bg-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {selectedObservation.serialNumber}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
              selectedObservation.status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {selectedObservation.status}
            </span>
            {selectedObservation.wasStopWorkAuthorityUsed && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                <ShieldAlert className="h-3.5 w-3.5" /> SWA EXERCISED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Print card"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedObservation(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* Key Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rig Assigned</span>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selectedObservation.rig}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedObservation.date} {selectedObservation.time}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Observer</span>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">{selectedObservation.observerName}</p>
              <p className="text-[11px] text-slate-500">{selectedObservation.observerPosition}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classification</span>
              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selectedObservation.classification.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Detailed Observation Narrative
            </h4>
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
              {selectedObservation.description}
            </p>
          </div>

          {/* Location & Taxonomy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Operational Taxonomy
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Operation Category:</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{selectedObservation.operationCategory}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Activity:</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{selectedObservation.activity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Company:</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{selectedObservation.company}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Rig Deck Location & Coordinates
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Deck Zone:</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{selectedObservation.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Sub-Location:</dt>
                  <dd className="font-semibold text-slate-900 dark:text-white">{selectedObservation.subLocation}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">GPS Coordinates:</dt>
                  <dd className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedObservation.latitude || '24.8607'}°N, {selectedObservation.longitude || '67.0011'}°E
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Hazard & Control Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3">
              Hazard & Energy Control Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 text-[11px] block">Hazard Energy Present</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {selectedObservation.hazardEnergy || 'Gravity / Dropped Objects'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Hierarchy of Control Applied</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  {selectedObservation.hazardControlMethod || 'Engineering control'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Immediate Correction</span>
                <span className={`font-bold text-xs ${selectedObservation.wasCorrectedImmediately ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedObservation.wasCorrectedImmediately ? '✓ Corrected On The Spot' : '⚠ Open for Corrective Action'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500">
            Recorded in HSE Audit Registry · ISO 45001 Compliant
          </p>

          <div className="flex items-center gap-2">
            {selectedObservation.status !== 'Approved' && (
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Observation</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedObservation(null)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
