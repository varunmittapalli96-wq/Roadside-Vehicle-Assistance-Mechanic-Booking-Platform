'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/ui';
import { api, Vehicle } from '@/lib/api';
import {
  Car,
  Plus,
  Trash2,
  Edit2,
  FileText,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Wrench,
  Info,
  Clock,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

const emptyForm = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  color: '',
  fuelType: 'petrol',
  transmission: 'Automatic',
  vin: '',
  odometer: '12,500 km',
};

export default function VehiclesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State lists
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, Sort
  const [search, setSearch] = useState('');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Modal Dialog Form
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState(1);
  const [error, setError] = useState('');

  // Expandable sections toggles
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getVehicles().then(setVehicles).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'user') load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalStep < 3) {
      setModalStep((prev) => prev + 1);
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (editId) {
        await api.updateVehicle(editId, {
          make: form.make,
          model: form.model,
          year: form.year,
          licensePlate: form.licensePlate,
          color: form.color,
          fuelType: form.fuelType,
        });
      } else {
        await api.addVehicle({
          make: form.make,
          model: form.model,
          year: form.year,
          licensePlate: form.licensePlate,
          color: form.color,
          fuelType: form.fuelType,
        });
      }
      setShowModal(false);
      setEditId(null);
      setForm(emptyForm);
      setModalStep(1);
      setError('');
      load();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle from your Digital Garage?')) {
      await api.deleteVehicle(id);
      load();
    }
  };

  const startEdit = (v: Vehicle) => {
    setForm({
      make: v.make,
      model: v.model,
      year: v.year,
      licensePlate: v.licensePlate,
      color: v.color || '',
      fuelType: v.fuelType || 'petrol',
      transmission: 'Automatic',
      vin: `VIN-${v._id.slice(-8).toUpperCase()}`,
      odometer: '14,200 km',
    });
    setEditId(v._id);
    setModalStep(1);
    setShowModal(true);
    setError('');
  };

  // Toggle helpers
  const toggleDocs = (vid: string) => {
    setExpandedDocs((prev) => ({ ...prev, [vid]: !prev[vid] }));
  };

  const toggleHistory = (vid: string) => {
    setExpandedHistory((prev) => ({ ...prev, [vid]: !prev[vid] }));
  };

  if (authLoading || !user) return <LoadingSpinner />;

  // Filter and Sort vehicle listing
  const filteredVehicles = vehicles
    .filter((v) => {
      const matchSearch =
        v.make.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(search.toLowerCase());
      
      const matchFuel = fuelFilter === 'All' || v.fuelType.toLowerCase() === fuelFilter.toLowerCase();
      
      return matchSearch && matchFuel;
    })
    .sort((a, b) => {
      if (sortOrder === 'Newest') return b.year - a.year;
      if (sortOrder === 'Oldest') return a.year - b.year;
      return a.make.localeCompare(b.make);
    });

  return (
    <DashboardLayout navItems={navItems} title="My Garage">
      <div className="space-y-8 animate-fadeIn max-w-[1400px] mx-auto">
        
        {/* 1. PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-100 p-6 rounded-3xl shadow-sm gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight">Digital Garage</h2>
            <p className="text-xs sm:text-sm text-slate-450 font-semibold mt-1">
              Manage your vehicles, documentation, and emergency readiness checks from one workspace.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); setModalStep(1); setError(''); }}
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-12 px-6 rounded-xl flex items-center gap-1.5 text-xs transition shadow-md shadow-orange-500/10 hover:-translate-y-0.5"
            >
              <Plus className="w-4.5 h-4.5" /> Add Vehicle
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/80 h-12 px-5 rounded-xl text-xs transition hidden sm:block">
              Import Vehicle
            </button>
          </div>
        </div>

        {/* 2. OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/5 text-[#FF6B00] border border-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Garage</span>
              <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{vehicles.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Vehicles</span>
              <p className="text-2xl font-black text-slate-900 leading-tight mt-0.5">{vehicles.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/5 text-blue-600 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Insurance Status</span>
              <p className="text-sm font-black text-emerald-600 leading-tight mt-1.5 uppercase">100% Active</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/5 text-amber-600 border border-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Health Score</span>
              <p className="text-2xl font-black text-emerald-600 leading-tight mt-0.5">95%</p>
            </div>
          </div>
        </div>

        {/* 3. SEARCH & FILTERS BAR */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search garage (e.g. make, plate, model)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white text-sm outline-none focus:ring-1 focus:ring-[#FF6B00] transition"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-650">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Fuel:</span>
              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white outline-none focus:ring-1 focus:ring-[#FF6B00]"
              >
                <option value="All">All Fuels</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-655">
              <span>Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white outline-none focus:ring-1 focus:ring-[#FF6B00]"
              >
                <option value="Newest">Model Year (Newest)</option>
                <option value="Oldest">Model Year (Oldest)</option>
                <option value="Brand">Manufacturer Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. DIGITAL GARAGE VEHICLES GRID */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">Your Garage is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed mt-2 mb-6">
              Add your first vehicle profile to configure active logs, insurance limits, and request emergency roadside help.
            </p>
            <button
              onClick={() => { setShowModal(true); setEditId(null); setForm(emptyForm); setModalStep(1); }}
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold h-12 px-6 rounded-xl text-xs transition"
            >
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((v) => {
              const hasDocs = expandedDocs[v._id];
              const hasHistory = expandedHistory[v._id];
              return (
                <div
                  key={v._id}
                  className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm hover:border-[#FF6B00]/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: make & model details */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#FF6B00]">
                          <Car className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 leading-tight">
                            {v.make} {v.model}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mt-1">
                            {v.licensePlate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startEdit(v)}
                          className="p-2 text-slate-400 hover:text-[#FF6B00] bg-slate-50 border border-slate-100 rounded-lg transition"
                          aria-label="Edit vehicle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-2 text-slate-400 hover:text-red-655 bg-slate-50 border border-slate-100 rounded-lg transition"
                          aria-label="Delete vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Specifications grid list */}
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs font-bold text-slate-400 uppercase tracking-wide mb-6 pb-4 border-b border-slate-100/60">
                      <div>Year: <span className="text-slate-800">{v.year}</span></div>
                      <div>Fuel: <span className="text-slate-800 capitalize">{v.fuelType}</span></div>
                      <div>Odometer: <span className="text-slate-800">12,450 km</span></div>
                      <div>Health: <span className="text-emerald-600">95% (Good)</span></div>
                    </div>

                    {/* Simulated SVG vehicle health indicator */}
                    <div className="bg-slate-50/50 border border-slate-100/60 rounded-2xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0.5">System Diagnoses</span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Road Ready</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">
                        <div className="bg-white border border-slate-100 p-2 rounded-lg">
                          <span className="block text-slate-500">Engine</span>
                          <span className="text-emerald-600 mt-1 block">94%</span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2 rounded-lg">
                          <span className="block text-slate-500">Battery</span>
                          <span className="text-emerald-600 mt-1 block">90%</span>
                        </div>
                        <div className="bg-white border border-slate-100 p-2 rounded-lg">
                          <span className="block text-slate-500">Tyres</span>
                          <span className="text-emerald-600 mt-1 block">98%</span>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDABLE SECTION: DOCUMENT VAULT */}
                    <div className="border-t border-slate-100/60 pt-3">
                      <button
                        onClick={() => toggleDocs(v._id)}
                        className="w-full flex items-center justify-between text-xs font-bold text-slate-650 py-2.5 pl-0.5 hover:text-[#FF6B00]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> Digital Document Vault</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${hasDocs ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {hasDocs && (
                        <div className="mt-2.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2.5 text-xs font-semibold text-slate-600 animate-fadeIn">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
                            <span>Registration Certificate</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Verified</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200/40">
                            <span>Insurance policy</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Pollution certificate (PUC)</span>
                            <span className="text-[10px] bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 rounded font-bold uppercase">Expiring Soon</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EXPANDABLE SECTION: MAINTENANCE TIMELINE */}
                    <div className="border-t border-slate-100/60 mt-1 pt-1">
                      <button
                        onClick={() => toggleHistory(v._id)}
                        className="w-full flex items-center justify-between text-xs font-bold text-slate-650 py-2.5 pl-0.5 hover:text-[#FF6B00]"
                      >
                        <span className="flex items-center gap-1.5"><Wrench className="w-4 h-4 text-slate-400" /> Service History Ledger</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${hasHistory ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {hasHistory && (
                        <div className="mt-2.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3.5 text-[11px] font-bold text-slate-600 animate-fadeIn">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-slate-800 leading-tight">General Maintenance Puncture</p>
                              <span className="text-[9px] text-slate-400 mt-0.5 block">12th May 2026 · Rajesh Kumar</span>
                            </div>
                            <span className="text-slate-900 font-extrabold">₹399</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card actions bottom bar */}
                  <div className="mt-6 pt-4 border-t border-slate-100/60 flex items-center gap-3">
                    <Link
                      href={`/dashboard/user/request?type=breakdown`}
                      className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-extrabold h-11 px-4 rounded-xl flex items-center justify-center gap-1 shadow-sm transition"
                    >
                      Request Assist
                    </Link>
                    <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold h-11 px-4 rounded-xl transition">
                      Diagnostic Log
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. AI INSIGHTS BAR */}
        {vehicles.length > 0 && (
          <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-3xl p-6 flex gap-4 max-w-4xl">
            <Info className="w-6 h-6 text-[#FF6B00] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Garage Smart Insights</h4>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-1">
                Your Pollution Certificate (PUC) for City ZX expires in 12 days. Front tire alignment recommended before next highway trip.
              </p>
            </div>
          </div>
        )}

        {/* 6. ADD VEHICLE MULTI-STEP DIALOG MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-white border border-slate-150 rounded-[32px] p-6 sm:p-10 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                {editId ? 'Edit Vehicle Profile' : 'Configure New Vehicle'}
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-6">
                Step {modalStep} of 3: {modalStep === 1 ? 'Details' : modalStep === 2 ? 'Upload Docs' : 'Review'}
              </p>

              {error && (
                <div className="bg-red-55 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-4 animate-fadeIn">
                  {error}
                </div>
              )}

              {/* Form submit handler */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Step 1: Details */}
                {modalStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Make / Brand</label>
                        <input
                          className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-sm text-slate-900 placeholder-slate-400 font-semibold"
                          value={form.make}
                          onChange={(e) => setForm({ ...form, make: e.target.value })}
                          required
                          placeholder="e.g. Honda"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Model Name</label>
                        <input
                          className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-sm text-slate-900 placeholder-slate-400 font-semibold"
                          value={form.model}
                          onChange={(e) => setForm({ ...form, model: e.target.value })}
                          required
                          placeholder="e.g. City"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Model Year</label>
                        <input
                          type="number"
                          className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-sm text-slate-900 placeholder-slate-400 font-semibold"
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">Fuel Type</label>
                        <select
                          className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-sm text-slate-900 font-semibold"
                          value={form.fuelType}
                          onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="cng">CNG</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 pl-1">License Plate Number</label>
                      <input
                        className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] text-sm text-slate-900 placeholder-slate-400 font-semibold"
                        value={form.licensePlate}
                        onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
                        required
                        placeholder="e.g. HR-26-CD-8910"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Upload Documents Mockup */}
                {modalStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                      <Download className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-700 block">Drag & Drop Registration Certificate (RC)</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">PDF or image up to 3MB</p>
                    </div>
                    <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                      <Download className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-700 block">Drag & Drop Insurance policy documents</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">PDF or image up to 3MB</p>
                    </div>
                  </div>
                )}

                {/* Step 3: Review */}
                {modalStep === 3 && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-xs font-bold text-slate-600 animate-fadeIn">
                    <div className="flex justify-between"><span>Brand Manufacturer</span><span className="text-slate-900">{form.make}</span></div>
                    <div className="flex justify-between"><span>Model Line</span><span className="text-slate-900">{form.model}</span></div>
                    <div className="flex justify-between"><span>Model Year</span><span className="text-slate-900">{form.year}</span></div>
                    <div className="flex justify-between"><span>Fuel Specification</span><span className="text-slate-900 capitalize">{form.fuelType}</span></div>
                    <div className="flex justify-between"><span>Plate Number</span><span className="text-slate-900">{form.licensePlate}</span></div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                  {modalStep > 1 && (
                    <button
                      type="button"
                      onClick={() => { setModalStep((prev) => prev - 1); setError(''); }}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold h-12 rounded-xl transition"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs font-extrabold h-12 rounded-xl transition"
                  >
                    {modalStep === 3 ? (editId ? 'Save Changes' : 'Register Vehicle') : 'Next step'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold h-12 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// Mini helper components
function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
