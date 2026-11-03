import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  Trash2, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Printer, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  ArrowUpDown, 
  Check, 
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useHse } from '../../context/HseContext';
import { ObservationCard, ObservationClassification, RigId } from '../../types/hse';
import { DRILLING_RIGS, OPERATION_CATEGORIES } from '../../data/mockHseData';

export const ObservationList: React.FC = () => {
  const { 
    observations, 
    deleteObservation, 
    batchDeleteObservations, 
    batchApproveObservations,
    setIsCreateModalOpen, 
    setSelectedObservation, 
    showToast,
    globalSearch
  } = useHse();

  // Local view tabs
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRigFilter, setSelectedRigFilter] = useState<'All' | RigId>('All');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [swaOnly, setSwaOnly] = useState<boolean>(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof ObservationCard>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync global search if typed in navbar
  const effectiveSearch = searchQuery || globalSearch;

  // Filter logic
  const filteredData = useMemo(() => {
    return observations.filter((item) => {
      // Tab filter
      if (activeTab === 'pending' && item.status !== 'Pending') {
        return false;
      }

      // Rig filter
      if (selectedRigFilter !== 'All' && item.rig !== selectedRigFilter) {
        return false;
      }

      // Classification
      if (selectedClassification !== 'All' && item.classification !== selectedClassification) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && item.operationCategory !== selectedCategory) {
        return false;
      }

      // SWA only
      if (swaOnly && !item.wasStopWorkAuthorityUsed) {
        return false;
      }

      // Dates
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;

      // Text Search
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase();
        const matchSerial = item.serialNumber.toLowerCase().includes(q);
        const matchObserver = item.observerName.toLowerCase().includes(q);
        const matchLocation = `${item.location} ${item.subLocation}`.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchRig = item.rig.toLowerCase().includes(q);
        const matchCategory = item.operationCategory.toLowerCase().includes(q);
        const matchActivity = item.activity.toLowerCase().includes(q);
        if (!matchSerial && !matchObserver && !matchLocation && !matchDesc && !matchRig && !matchCategory && !matchActivity) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortDirection === 'asc' ? (Number(aVal) - Number(bVal)) : (Number(bVal) - Number(aVal));
    });
  }, [
    observations, 
    activeTab, 
    selectedRigFilter, 
    selectedClassification, 
    selectedCategory, 
    swaOnly, 
    dateFrom, 
    dateTo, 
    effectiveSearch, 
    sortField, 
    sortDirection
  ]);

  // Paginated records
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedRowIds.length === paginatedData.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedData.map(d => d.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field: keyof ObservationCard) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRigFilter('All');
    setSelectedClassification('All');
    setSelectedCategory('All');
    setDateFrom('');
    setDateTo('');
    setSwaOnly(false);
    setCurrentPage(1);
    showToast('Filters reset.', 'info');
  };

  const exportToCSV = () => {
    const headers = ['Sr #', 'Rig', 'Location', 'Sub Location', 'Date', 'Time', 'Observer', 'Role', 'Category', 'Activity', 'Classification', 'Status', 'SWA Used'];
    const rows = filteredData.map(o => [
      o.serialNumber,
      o.rig,
      `"${o.location}"`,
      `"${o.subLocation}"`,
      o.date,
      o.time,
      `"${o.observerName}"`,
      `"${o.observerPosition}"`,
      `"${o.operationCategory}"`,
      `"${o.activity}"`,
      o.classification,
      o.status,
      o.wasStopWorkAuthorityUsed ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HSE_Observations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredData.length} records to CSV`, 'success');
  };

  // Accessible classification rendering with colors + symbols + text
  const renderClassificationBadge = (classification: ObservationClassification) => {
    switch (classification) {
      case 'Safe_Act':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Safe Act</span>
          </span>
        );
      case 'Safe_Condition':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            <span>Safe Condition</span>
          </span>
        );
      case 'Unsafe_Act':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Unsafe Act</span>
          </span>
        );
      case 'Unsafe_Condition':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            <span>Unsafe Condition</span>
          </span>
        );
      default:
        return <span>{classification}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Field Safety Observation Cards
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Record, review, and follow up on maritime field safety observations, offshore imports, and Stop Work Authority audits.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            title="Export filtered records to CSV"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>CSV Export</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
            title="Print Safety Log"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-98 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Observation Card</span>
          </button>
        </div>
      </div>

      {/* Segmented View Tabs (Clean Accessible Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span>All Observation Cards</span>
            <span className="rounded-md bg-slate-200/80 px-1.5 py-0.2 text-[10px] font-bold dark:bg-slate-600">
              {observations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span>Pending Observation Cards</span>
            <span className="rounded-md bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {observations.filter(o => o.status === 'Pending').length}
            </span>
          </button>
        </div>

        {/* SWA Filter Quick Switch */}
        <button
          type="button"
          onClick={() => setSwaOnly(!swaOnly)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            swaOnly
              ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300 ring-2 ring-red-400'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
          aria-pressed={swaOnly}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>Stop Work Authority (SWA) Used</span>
        </button>
      </div>

      {/* Filter Bar (Optimized High-Efficiency Grid) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Rig Filter */}
          <div>
            <label htmlFor="filter-rig" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Rig
            </label>
            <select
              id="filter-rig"
              value={selectedRigFilter}
              onChange={(e) => setSelectedRigFilter(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Rigs</option>
              {DRILLING_RIGS.map(r => (
                <option key={r.id} value={r.id}>{r.id} ({r.name.split(' ')[1]})</option>
              ))}
            </select>
          </div>

          {/* Classification Filter */}
          <div>
            <label htmlFor="filter-classification" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Classification
            </label>
            <select
              id="filter-classification"
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Classifications</option>
              <option value="Safe_Act">Safe Act</option>
              <option value="Safe_Condition">Safe Condition</option>
              <option value="Unsafe_Act">Unsafe Act</option>
              <option value="Unsafe_Condition">Unsafe Condition</option>
            </select>
          </div>

          {/* Operation Category */}
          <div>
            <label htmlFor="filter-category" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Operation Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 truncate"
            >
              <option value="All">All Categories</option>
              {OPERATION_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="filter-date-from" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Date From
            </label>
            <input
              id="filter-date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="filter-date-to" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Date To
            </label>
            <input
              id="filter-date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Search & Reset */}
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Search All Columns Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all columns (Observer, Serial #, Rig, Activity, Hazard)..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Showing <strong className="text-slate-900 dark:text-white">{filteredData.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* Batch Action Bar (Appears when items are checked) */}
      {selectedRowIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2.5 dark:border-indigo-900 dark:bg-indigo-950/60 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{selectedRowIds.length} card(s) selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                batchApproveObservations(selectedRowIds);
                setSelectedRowIds([]);
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Approve Selected</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${selectedRowIds.length} observation card(s)?`)) {
                  batchDeleteObservations(selectedRowIds);
                  setSelectedRowIds([]);
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRowIds([])}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Observation Cards Data Grid (Accessible, High-Density, Clear Alignment) */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Field Safety Observation Cards">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th scope="col" className="w-10 px-3 py-3">
                  <span className="sr-only">Select All</span>
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedRowIds.length === paginatedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                    aria-label="Select all rows on current page"
                  />
                </th>
                <th scope="col" className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('serialNumber')}
                    className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    <span>Sr #</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('rig')}
                    className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    <span>Rig</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-3 py-3">Location & Area</th>
                <th scope="col" className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    <span>Date & Time</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th scope="col" className="px-3 py-3">Observer</th>
                <th scope="col" className="px-3 py-3">Operation & Activity</th>
                <th scope="col" className="px-3 py-3">Classification</th>
                <th scope="col" className="px-3 py-3">Status / SWA</th>
                <th scope="col" className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                      No matching observations found
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Try adjusting your search criteria, rig selection, or date range.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedData.map((obs) => {
                  const isSelected = selectedRowIds.includes(obs.id);

                  return (
                    <tr
                      key={obs.id}
                      className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50 ${
                        isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(obs.id)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700"
                          aria-label={`Select observation ${obs.serialNumber}`}
                        />
                      </td>

                      {/* Serial # */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedObservation(obs)}
                          className="font-mono text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
                        >
                          {obs.serialNumber}
                        </button>
                      </td>

                      {/* Rig Badge */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {obs.rig}
                        </span>
                      </td>

                      {/* Location & Sub Location */}
                      <td className="px-3 py-3.5 max-w-[180px]">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {obs.location}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {obs.subLocation}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="px-3 py-3.5 whitespace-nowrap tabular-nums">
                        <p className="text-slate-700 dark:text-slate-300">{obs.date}</p>
                        <p className="text-[11px] text-slate-400">{obs.time}</p>
                      </td>

                      {/* Observer */}
                      <td className="px-3 py-3.5 max-w-[160px]">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {obs.observerName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {obs.observerPosition}
                        </p>
                      </td>

                      {/* Operation Category & Activity */}
                      <td className="px-3 py-3.5 max-w-[200px]">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {obs.operationCategory}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {obs.activity}
                        </p>
                      </td>

                      {/* Classification Badge */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        {renderClassificationBadge(obs.classification)}
                      </td>

                      {/* Status & SWA Flag */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            obs.status === 'Approved'
                              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {obs.status}
                          </span>
                          {obs.wasStopWorkAuthorityUsed && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                              <ShieldAlert className="h-3 w-3" /> SWA STOP
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedObservation(obs)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                            title={`View details for ${obs.serialNumber}`}
                            aria-label={`View details for ${obs.serialNumber}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete observation ${obs.serialNumber}?`)) {
                                deleteObservation(obs.id);
                              }
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                            title={`Delete ${obs.serialNumber}`}
                            aria-label={`Delete ${obs.serialNumber}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Accessible Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-slate-200 bg-white py-1 px-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
