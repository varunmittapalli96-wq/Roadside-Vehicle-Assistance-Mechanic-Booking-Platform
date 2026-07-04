'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Wrench,
  Truck,
  Battery,
  CircleDot,
  Fuel,
  Shield,
  MapPin,
  Clock,
  Star,
  Phone,
} from 'lucide-react';

const services = [
  { icon: Wrench, label: 'Breakdown Repair', desc: 'On-site diagnostics and repairs' },
  { icon: Truck, label: 'Towing', desc: 'Safe vehicle towing to nearest garage' },
  { icon: Battery, label: 'Battery Jump-Start', desc: 'Quick battery boost service' },
  { icon: CircleDot, label: 'Flat Tire Repair', desc: 'Tire change and puncture fix' },
  { icon: Fuel, label: 'Fuel Delivery', desc: 'Emergency fuel delivery to your location' },
];

const features = [
  { icon: MapPin, title: 'Nearby Mechanics', desc: 'Find verified mechanics with distance, ratings, and ETA' },
  { icon: Clock, title: 'Live Tracking', desc: 'Track your mechanic in real-time until arrival' },
  { icon: Star, title: 'Transparent Pricing', desc: 'See service costs upfront before booking' },
  { icon: Shield, title: 'Verified Partners', desc: 'All mechanics and towing partners are verified' },
];

export default function HomePage() {
  const { user } = useAuth();

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'mechanic'
        ? '/dashboard/mechanic'
        : '/dashboard/user';

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Roadside <span className="text-orange-600">AAA</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href={dashboardLink} className="btn-primary text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm hidden sm:inline-flex">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Get Help Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 rounded-full px-4 py-1.5 text-sm text-orange-200 mb-6">
              <Phone className="w-4 h-4" />
              24/7 Emergency Roadside Assistance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Stranded? Get Help in{' '}
              <span className="text-orange-400">Minutes</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with verified nearby mechanics for breakdown repairs, towing,
              battery jump-starts, and more. Transparent pricing and live tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="btn-primary text-center text-lg px-8 py-3">
                Request Assistance
              </Link>
              <Link
                href="/register?role=mechanic"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg text-center transition-colors border border-white/20"
              >
                Join as Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive roadside assistance for every emergency situation
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Roadside AAA?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Right Now?</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Register in seconds and request roadside assistance from verified mechanics near you.
          </p>
          <Link href="/register" className="inline-block bg-white text-orange-600 font-bold py-3 px-10 rounded-lg hover:bg-orange-50 transition-colors">
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 Roadside AAA. Unified Mentor Project.</p>
        </div>
      </footer>
    </div>
  );
}
