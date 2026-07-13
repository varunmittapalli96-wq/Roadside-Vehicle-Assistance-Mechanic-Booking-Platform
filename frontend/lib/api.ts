const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'mechanic' | 'admin';
  isVerified: boolean;
  profile?: {
    businessName?: string;
    licenseNumber?: string;
    experience?: number;
    bio?: string;
    services?: string[];
    pricing?: Record<string, number>;
    rating?: number;
    totalRatings?: number;
    totalJobs?: number;
    earnings?: number;
  };
  location?: {
    coordinates: [number, number];
    address?: string;
  };
  isAvailable?: boolean;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  fuelType: string;
}

export interface ServiceRequest {
  _id: string;
  userId: User | string;
  vehicleId: Vehicle | string;
  mechanicId?: User | string;
  serviceType: string;
  description: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  mechanicLocation?: {
    coordinates: [number, number];
  };
  status: string;
  estimatedPrice: number;
  finalPrice?: number;
  estimatedArrivalMinutes?: number;
  rating?: number;
  feedback?: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
}

export interface NearbyMechanic {
  _id: string;
  name: string;
  businessName?: string;
  rating: number;
  totalRatings: number;
  totalJobs: number;
  distance: number;
  estimatedArrivalMinutes: number;
  pricing: number | null;
  services: string[];
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  register: (body: Record<string, string>) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<User>('/auth/me'),
  updateProfile: (body: Partial<User>) =>
    request<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  getVehicles: () => request<Vehicle[]>('/vehicles'),
  addVehicle: (body: Partial<Vehicle>) =>
    request<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(body) }),
  updateVehicle: (id: string, body: Partial<Vehicle>) =>
    request<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVehicle: (id: string) =>
    request<{ message: string }>(`/vehicles/${id}`, { method: 'DELETE' }),

  getServiceTypes: () => request<string[]>('/requests/types'),
  getNearbyMechanics: (lng: number, lat: number, serviceType?: string) => {
    const params = new URLSearchParams({ lng: String(lng), lat: String(lat) });
    if (serviceType) params.set('serviceType', serviceType);
    return request<NearbyMechanic[]>(`/mechanics/nearby?${params}`);
  },
  createRequest: (body: Record<string, unknown>) =>
    request<ServiceRequest>('/requests', { method: 'POST', body: JSON.stringify(body) }),
  getRequests: () => request<ServiceRequest[]>('/requests'),
  getRequest: (id: string) => request<ServiceRequest>(`/requests/${id}`),
  acceptRequest: (id: string) =>
    request<ServiceRequest>(`/requests/${id}/accept`, { method: 'PUT' }),
  updateStatus: (id: string, body: Record<string, unknown>) =>
    request<ServiceRequest>(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  rateRequest: (id: string, rating: number, feedback: string) =>
    request<ServiceRequest>(`/requests/${id}/rate`, {
      method: 'PUT',
      body: JSON.stringify({ rating, feedback }),
    }),

  getPendingRequests: () => request<ServiceRequest[]>('/mechanics/requests'),
  getMechanicJobs: () => request<ServiceRequest[]>('/mechanics/jobs'),
  updateMechanicProfile: (body: Record<string, unknown>) =>
    request<User>('/mechanics/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updateMechanicLocation: (coordinates: [number, number], address?: string) =>
    request<User>('/mechanics/location', {
      method: 'PUT',
      body: JSON.stringify({ coordinates, address }),
    }),
  getEarnings: () =>
    request<{ totalEarnings: number; totalJobs: number; recentJobs: ServiceRequest[] }>(
      '/mechanics/earnings'
    ),

  getAdminDashboard: () =>
    request<{
      stats: Record<string, number>;
      recentRequests: ServiceRequest[];
    }>('/admin/dashboard'),
  getPendingMechanics: () => request<User[]>('/admin/mechanics/pending'),
  verifyMechanic: (id: string) =>
    request<User>(`/admin/mechanics/${id}/verify`, { method: 'PUT' }),
  rejectMechanic: (id: string) =>
    request<{ message: string }>(`/admin/mechanics/${id}/reject`, { method: 'PUT' }),
  getAllUsers: () => request<User[]>('/admin/users'),
  getAllRequests: () => request<ServiceRequest[]>('/admin/requests'),
  resolveRequest: (id: string, status: string, note: string) =>
    request<ServiceRequest>(`/admin/requests/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),
};

export const SERVICE_LABELS: Record<string, string> = {
  breakdown_repair: 'Breakdown Repair',
  towing: 'Towing',
  battery_jump_start: 'Battery Jump-Start',
  flat_tire_repair: 'Flat Tire Repair',
  fuel_delivery: 'Fuel Delivery',
  lockout: 'Lockout Assist',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  en_route: 'En Route',
  arrived: 'Arrived',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  en_route: 'bg-indigo-100 text-indigo-800',
  arrived: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
