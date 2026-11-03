import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useHse } from '../../context/HseContext';
import { 
  RigId, 
  ObservationClassification, 
  HazardEnergyType, 
  HazardControlMethod 
} from '../../types/hse';
import { 
  DRILLING_RIGS, 
  LOCATION_TAXONOMY, 
  OPERATION_CATEGORIES, 
  ACTIVITIES_BY_CATEGORY 
} from '../../data/mockHseData';

export const CreateObservationModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addObservation, currentUser } = useHse();

  // Form states
  const [rig, setRig] = useState<RigId>('BHDC-67');
  const [location, setLocation] = useState<string>('Rig Floor');
  const [subLocation, setSubLocation] = useState<string>('Rotary Table & Cathead');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [company, setCompany] = useState<string>('BHDC Drilling Corp');

  const [observerPosition, setObserverPosition] = useState<string>(currentUser.role);
  const [observerName, setObserverName] = useState<string>(currentUser.name);

  const [operationCategory, setOperationCategory] = useState<string>('Rig Floor & Hoisting Activities');
  const [activity, setActivity] = useState<string>('Hoisting and lifting operations');

  const [classification, setClassification] = useState<ObservationClassification>('Safe_Act');
  const [mainCategory, setMainCategory] = useState<string>('Lifting & Hoisting');
  const [subCategory, setSubCategory] = useState<string>('Secondary Retention Check');

  const [latitude, setLatitude] = useState<string>('24.8607');
  const [longitude, setLongitude] = useState<string>('67.0011');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [description, setDescription] = useState<string>('');
  const [wasCorrectedImmediately, setWasCorrectedImmediately] = useState<boolean>(true);
  const [wasStopWorkAuthorityUsed, setWasStopWorkAuthorityUsed] = useState<boolean>(false);

  const [hazardEnergy, setHazardEnergy] = useState<HazardEnergyType>('Gravity / Dropped Objects');
  const [hazardControlMethod, setHazardControlMethod] = useState<HazardControlMethod>('Engineering control');
  const [werePeopleExposed, setWerePeopleExposed] = useState<boolean>(false);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCreateModalOpen) return null;

  // Handle location taxonomy changes
  const handleLocationChange = (loc: string) => {
    setLocation(loc);
    const subOpts = LOCATION_TAXONOMY[loc] || [];
    setSubLocation(subOpts[0] || 'General Deck Area');
  };

  const handleCategoryChange = (cat: string) => {
    setOperationCategory(cat);
    const actOpts = ACTIVITIES_BY_CATEGORY[cat] || [];
    setActivity(actOpts[0] || 'General operations');
  };

  // Simulated GPS fetch
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          setIsLocating(false);
        },
        () => {
          // Fallback offshore coordinate
          setTimeout(() => {
            setLatitude((24.8600 + Math.random() * 0.01).toFixed(4));
            setLongitude((67.0010 + Math.random() * 0.01).toFixed(4));
            setIsLocating(false);
          }, 400);
        }
      );
    } else {
      setTimeout(() => {
        setLatitude('24.8608');
        setLongitude('67.0012');
        setIsLocating(false);
      }, 400);
    }
  };

  // Quick hazard text template inserter
  const insertTemplate = (text: string) => {
    setDescription(prev => (prev ? `${prev} ${text}` : text));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Please provide a detailed description of the observation.';
    if (!observerName.trim()) errs.observerName = 'Observer name is required.';
    if (!rig) errs.rig = 'Rig selection is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addObservation({
      rig,
      location,
      subLocation,
      date,
      time,
      company,
      observerPosition,
      observerName,
      operationCategory,
      activity,
      classification,
      mainCategory,
      subCategory,
      description,
      latitude: parseFloat(latitude) || undefined,
      longitude: parseFloat(longitude) || undefined,
      wasCorrectedImmediately,
      wasStopWorkAuthorityUsed,
      hazardEnergy,
      hazardControlMethod,
      werePeopleExposed,
      photos: uploadedPhotos,
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition dark:border-slate-800 dark:bg-slate-900">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 id="modal-headline" className="text-lg font-bold text-slate-900 dark:text-white">
              Create Field Observation Card
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Submit proactive safety observations, unsafe acts/conditions, or SWA interventions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body with Optimized 2-Column Responsive Layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: GENERAL INFORMATION */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              1. General Information & Rig Location
            </legend>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label htmlFor="card-rig" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rig <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-rig"
                  value={rig}
                  onChange={(e) => setRig(e.target.value as RigId)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  {DRILLING_RIGS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="card-location" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location Area <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-location"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  {Object.keys(LOCATION_TAXONOMY).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="card-sublocation" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sub Location <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-sublocation"
                  value={subLocation}
                  onChange={(e) => setSubLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  {(LOCATION_TAXONOMY[location] || ['General Area']).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="card-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="card-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="card-time" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="card-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="card-company" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Contractor <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  <option value="BHDC Drilling Corp">BHDC Drilling Corp</option>
                  <option value="Schlumberger M-I SWACO">Schlumberger M-I SWACO</option>
                  <option value="Halliburton Sperry">Halliburton Sperry</option>
                  <option value="Baker Hughes">Baker Hughes</option>
                  <option value="Caterpillar Marine Service">Caterpillar Marine Service</option>
                  <option value="Compass Maritime Catering">Compass Maritime Catering</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* SECTION 2: OBSERVER & OPERATION */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              2. Observer Profile & Operation
            </legend>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label htmlFor="card-observer-pos" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observer Position <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-observer-pos"
                  value={observerPosition}
                  onChange={(e) => setObserverPosition(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  <option value="HSE Admin">HSE Admin</option>
                  <option value="Rig HSE Advisor">Rig HSE Advisor</option>
                  <option value="Driller">Driller</option>
                  <option value="Assistant Driller">Assistant Driller</option>
                  <option value="Derrickman">Derrickman</option>
                  <option value="Floorhand / Roustabout">Floorhand / Roustabout</option>
                  <option value="Rig Mechanic">Rig Mechanic</option>
                  <option value="Chief Electrician">Chief Electrician</option>
                  <option value="Crane Operator">Crane Operator</option>
                  <option value="Toolpusher">Toolpusher</option>
                </select>
              </div>

              <div>
                <label htmlFor="card-observer-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observer Name <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="card-observer-name"
                  type="text"
                  value={observerName}
                  onChange={(e) => setObserverName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
                {errors.observerName && <p className="mt-1 text-[11px] text-rose-500">{errors.observerName}</p>}
              </div>

              <div>
                <label htmlFor="card-op-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Operation Category <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-op-category"
                  value={operationCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white truncate"
                  required
                >
                  {OPERATION_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="card-activity" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Activity <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white truncate"
                  required
                >
                  {(ACTIVITIES_BY_CATEGORY[operationCategory] || ['General Activity']).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* SECTION 3: CLASSIFICATION & COORDINATES */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              3. Classification & Deck Coordinates
            </legend>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label htmlFor="card-classification" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classification of Observation <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <select
                  id="card-classification"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value as ObservationClassification)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                >
                  <option value="Safe_Act">Safe Act (Observed Safe Behavior)</option>
                  <option value="Safe_Condition">Safe Condition (Observed Good Barrier/Equipment)</option>
                  <option value="Unsafe_Act">Unsafe Act (At-Risk Behavior)</option>
                  <option value="Unsafe_Condition">Unsafe Condition (Hazardous Environment/Defect)</option>
                </select>
              </div>

              <div>
                <label htmlFor="card-main-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Main Category <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="card-main-cat"
                  type="text"
                  value={mainCategory}
                  onChange={(e) => setMainCategory(e.target.value)}
                  placeholder="e.g. Lifting & Hoisting"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="card-sub-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sub Category <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="card-sub-cat"
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="e.g. Secondary Retention"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Coordinates & Visual Deck Pin Picker */}
            <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-32">
                    <label htmlFor="card-lat" className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Latitude
                    </label>
                    <input
                      id="card-lat"
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g. 24.8607"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="w-32">
                    <label htmlFor="card-lng" className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Longitude
                    </label>
                    <input
                      id="card-lng"
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g. 67.0011"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Detecting...' : 'GPS Auto-Detect'}</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">
                  Or select a fast visual pin on the rig deck plan below:
                </span>
              </div>

              {/* Graphical Rig Deck Hotspot Quick-Pin Strip */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  🗺️ Fast Visual Deck Pin Selection (Click to auto-locate)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'Drill Floor / Rotary', loc: 'Rig Floor', sub: 'Rotary Table & Cathead', lat: '24.8607', lng: '67.0011' },
                    { label: 'Crown Block (DROPS)', loc: 'Derrick & Mast', sub: 'Crown Block', lat: '24.8615', lng: '67.0018' },
                    { label: 'Catwalk / Pipe Deck', loc: 'Pipe Deck', sub: 'Catwalk & Racks', lat: '24.8609', lng: '67.0018' },
                    { label: 'BOP Stack & Wellhead', loc: 'Substructure', sub: 'BOP Stack & Choke Manifold', lat: '24.8605', lng: '67.0008' },
                    { label: 'Mud Shakers & Pits', loc: 'Mud Pit Deck', sub: 'Shale Shakers & Degasser', lat: '24.8602', lng: '67.0019' },
                    { label: 'SCR / Engine Room', loc: 'Engine Room', sub: 'Generator Unit #3', lat: '24.8598', lng: '67.0005' },
                    { label: 'Port Crane Pedestal', loc: 'Cranes & Pedestal', sub: 'Port Crane Cab & Boompole', lat: '24.8650', lng: '67.0080' },
                    { label: 'Helideck Fire Area', loc: 'Helideck & Marine Bridge', sub: 'Helideck Fire Monitor Station', lat: '24.8620', lng: '67.0028' },
                  ].map((pin) => {
                    const isActivePin = location === pin.loc && subLocation === pin.sub;
                    return (
                      <button
                        key={pin.label}
                        type="button"
                        onClick={() => {
                          setLocation(pin.loc);
                          setSubLocation(pin.sub);
                          setLatitude(pin.lat);
                          setLongitude(pin.lng);
                        }}
                        className={`flex items-center gap-1.5 rounded-lg border p-2 text-left transition ${
                          isActivePin
                            ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700 ring-2 ring-indigo-500 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <MapPin className={`h-3.5 w-3.5 shrink-0 ${isActivePin ? 'text-indigo-600 dark:text-indigo-400 fill-indigo-600' : 'text-slate-400'}`} />
                        <span className="truncate text-[11px]">{pin.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </fieldset>

          {/* SECTION 4: OBSERVATION DETAILS & STOP WORK AUTHORITY */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              4. Observation Narrative & Stop Work Authority
            </legend>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="card-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Description of Observation <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {description.length} / 5000 characters
                </span>
              </div>

              {/* Fast Template Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Quick inserts:</span>
                {[
                  'Line of fire hazard identified',
                  'Secondary retention clamp verified',
                  'Tool lanyard missing at height',
                  'LOTO applied and verified',
                  'Good communication during pick up'
                ].map(txt => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => insertTemplate(txt)}
                    className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    + {txt}
                  </button>
                ))}
              </div>

              <textarea
                id="card-desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a factual, clear description of the situation, actions observed, equipment involved, and immediate corrections taken..."
                className={`w-full rounded-xl border bg-white p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white ${
                  errors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
                required
              />
              {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
            </div>

            {/* SWA and Immediate Response Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Was the situation corrected immediately? <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="corrected"
                      checked={wasCorrectedImmediately}
                      onChange={() => setWasCorrectedImmediately(true)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Yes, rectified on the spot</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="corrected"
                      checked={!wasCorrectedImmediately}
                      onChange={() => setWasCorrectedImmediately(false)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>No, CAPA required</span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 dark:border-rose-900/60 dark:bg-rose-950/20">
                <label className="block text-xs font-bold text-rose-800 dark:text-rose-300 mb-1.5">
                  Was Stop Work Authority (SWA) Used? <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="swa"
                      checked={wasStopWorkAuthorityUsed}
                      onChange={() => setWasStopWorkAuthorityUsed(true)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-rose-700 dark:text-rose-400">Yes (Work was stopped)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="swa"
                      checked={!wasStopWorkAuthorityUsed}
                      onChange={() => setWasStopWorkAuthorityUsed(false)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* SECTION 5: HAZARD & EXPOSURE QUESTIONS */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              5. Hazard Energy & Control Hierarchy
            </legend>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label htmlFor="card-hazard-energy" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What hazard or energy was present?
                </label>
                <select
                  id="card-hazard-energy"
                  value={hazardEnergy}
                  onChange={(e) => setHazardEnergy(e.target.value as HazardEnergyType)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Gravity / Dropped Objects">Gravity / Dropped Objects</option>
                  <option value="Mechanical / Rotating">Mechanical / Rotating</option>
                  <option value="Pressure">Pressure</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Work at height">Work at height</option>
                  <option value="Vehicle / Mobile equipment">Vehicle / Mobile equipment</option>
                  <option value="Thermal / Heat">Thermal / Heat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="card-hazard-control" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  How was the hazard controlled?
                </label>
                <select
                  id="card-hazard-control"
                  value={hazardControlMethod}
                  onChange={(e) => setHazardControlMethod(e.target.value as HazardControlMethod)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Engineering control">Engineering control (Guard, physical barrier, interlock)</option>
                  <option value="Administrative control">Administrative control (PTW, JSA, procedures)</option>
                  <option value="PPE">PPE (Personal Protective Equipment)</option>
                  <option value="Human control (spotter, manual lock)">Human control (Spotter, watchman)</option>
                  <option value="Elimination">Elimination (Hazard removed)</option>
                </select>
              </div>

              <div>
                <label htmlFor="card-people-exposed" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Were people exposed to the hazard?
                </label>
                <select
                  id="card-people-exposed"
                  value={werePeopleExposed ? 'yes' : 'no'}
                  onChange={(e) => setWerePeopleExposed(e.target.value === 'yes')}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="no">No personnel in direct line of fire</option>
                  <option value="yes">Yes, personnel were directly exposed</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* SECTION 6: PHOTOS & EVIDENCE */}
          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/50 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
            <legend className="px-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              6. Photographic Evidence & Field Attachments
            </legend>
            <div className="mt-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 text-center bg-white dark:bg-slate-800/60">
              <Camera className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Upload photos or field inspection tags
              </p>
              <p className="text-[11px] text-slate-400">
                PNG, JPG or WEBP up to 10MB. On offshore tablets, camera upload is automatically enabled.
              </p>
              <label className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
                <Upload className="h-3.5 w-3.5" />
                <span>Select Files from Device</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setUploadedPhotos([
                        'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=400&auto=format&fit=crop'
                      ]);
                    }
                  }}
                />
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ 1 Photo Attached (Rig inspection capture ready)
                  </span>
                </div>
              )}
            </div>
          </fieldset>
        </form>

        {/* Sticky Footer Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fields marked with <span className="text-rose-500">*</span> are mandatory for audit compliance.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Submit Observation Card
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
