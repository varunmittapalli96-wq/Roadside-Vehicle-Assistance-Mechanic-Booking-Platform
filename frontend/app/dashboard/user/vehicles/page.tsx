'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner, EmptyState } from '@/components/ui';
import { api, Vehicle } from '@/lib/api';
import { Car, Plus, Trash2, Edit2 } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard/user' },
  { label: 'Request Help', href: '/dashboard/user/request' },
  { label: 'My Vehicles', href: '/dashboard/user/vehicles' },
  { label: 'Service History', href: '/dashboard/user/history' },
];

const emptyForm = { make: '', model: '', year: new Date().getFullYear(), licensePlate: '', color: '', fuelType: 'petrol' };

export default function VehiclesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) router.replace('/login');
  }, [user, authLoading, router]);

  const load = () => api.getVehicles().then(setVehicles).finally(() => setLoading(false));

  useEffect(() => {
    if (user?.role === 'user') load();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await api.updateVehicle(editId, form);
    } else {
      await api.addVehicle(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this vehicle?')) {
      await api.deleteVehicle(id);
      load();
    }
  };

  const startEdit = (v: Vehicle) => {
    setForm({ make: v.make, model: v.model, year: v.year, licensePlate: v.licensePlate, color: v.color || '', fuelType: v.fuelType });
    setEditId(v._id);
    setShowForm(true);
  };

  if (authLoading || !user) return <LoadingSpinner />;

  return (
    <DashboardLayout navItems={navItems} title="My Vehicles">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Manage your registered vehicles</p>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <h3 className="font-semibold">{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Make</label>
              <input className="input-field" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <input className="input-field" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input type="number" className="input-field" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">License Plate</label>
              <input className="input-field" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input className="input-field" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fuel Type</label>
              <select className="input-field" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="cng">CNG</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editId ? 'Update' : 'Add'} Vehicle</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : vehicles.length === 0 ? (
        <EmptyState message="No vehicles added yet. Add your first vehicle to request assistance." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div key={v._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{v.make} {v.model}</p>
                    <p className="text-sm text-gray-500">{v.year} · {v.licensePlate}</p>
                    <p className="text-xs text-gray-400 capitalize">{v.fuelType}{v.color ? ` · ${v.color}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(v)} className="p-2 text-gray-400 hover:text-orange-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v._id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
