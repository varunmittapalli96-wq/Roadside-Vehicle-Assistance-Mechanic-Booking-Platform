'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Wrench,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  MapPin,
  HelpCircle,
  PhoneCall,
  User,
  Settings,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Car,
  History,
  CreditCard,
  MessageSquare,
  Moon,
  Sun,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
}

export default function DashboardLayout({
  children,
  navItems,
  title,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Map label to matching Lucide Icon for a richer sidebar
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'overview':
      case 'dashboard':
        return LayoutDashboard;
      case 'request help':
      case 'request assistance':
        return PlusCircle;
      case 'my vehicles':
      case 'vehicles':
        return Car;
      case 'service history':
      case 'history':
        return History;
      case 'payments':
      case 'saved locations':
        return CreditCard;
      default:
        return Compass;
    }
  };

  return (
    <div className={`min-h-screen flex bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#FF6B00]/10 selection:text-[#FF6B00] ${darkMode ? 'dark bg-slate-950 text-slate-100' : ''}`}>
      
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* COLLAPSIBLE SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div>
          {/* Sidebar Header: Brand logo */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8A00] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
                <Wrench className="w-5.5 h-5.5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <span className="text-base font-black text-slate-900 tracking-tight block">
                    RVA <span className="text-[#FF6B00]">Pro</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block -mt-0.5">Enterprise Portal</span>
                </div>
              )}
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          {/* User profile capsule in sidebar */}
          {!collapsed && (
            <div className="p-4 mx-4 my-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] font-bold text-sm">
                {user?.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs text-slate-900 truncate leading-none mb-1">{user?.name}</p>
                <span className="inline-block text-[9px] bg-slate-200 text-slate-650 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {user?.role} Account
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = getIcon(item.label);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[#FF6B00] transition-all group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#FF6B00] transition-colors" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower section: Collapse toggle, support, and logout */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          {/* Mini 24/7 Chat Card */}
          {!collapsed && (
            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl mb-3 text-center">
              <span className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider block mb-1">24/7 Hotline</span>
              <p className="text-[11px] text-slate-500 font-semibold mb-2">Stuck in traffic? Connect to live support.</p>
              <a
                href="tel:18005550199"
                className="inline-flex items-center gap-1.5 bg-[#FF6B00] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-orange-500/10 hover:bg-[#e05e00]"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Dispatch
              </a>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-405 hover:bg-slate-50 transition-colors"
          >
            <Compass className="w-5 h-5 text-slate-400 rotate-90" />
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* STICKY TOP NAVIGATION */}
        <header className="h-20 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 gap-4 shadow-sm">
          
          {/* Left search bar / mobile menu */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="relative w-full hidden sm:block">
              <input
                type="text"
                placeholder="Search resources, requests, mechanics..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] transition"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Right actions list */}
          <div className="flex items-center gap-4">
            
            {/* Live Location Marker */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-4 py-2 text-xs font-bold text-slate-600 max-w-[200px]">
              <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
              <span className="truncate">{user?.location?.address || 'India'}</span>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-[#FF6B00] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications panel with simulated unread badge */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl border border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:text-[#FF6B00] relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {!user?.isVerified && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00]" />
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-3 w-85 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 space-y-3 z-50">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-[#0B132B] uppercase">System Alerts</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {!user?.isVerified ? (
                      <div className="p-2.5 bg-amber-50/50 border border-amber-100/50 rounded-xl">
                        <p className="font-bold text-amber-800">Profile Incomplete</p>
                        <p className="text-[10px] text-amber-600 mt-0.5">Please update location coordinates to receive emergency dispatches.</p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-bold text-center py-4">No active system alerts.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile dropdown menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition border border-transparent hover:border-slate-100"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center text-xs font-black">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-1 z-50 text-xs font-semibold text-slate-600">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-black text-slate-900">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
                  </div>
                  <Link href="/dashboard/user/profile" className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 hover:text-[#FF6B00] transition">
                    <User className="w-4 h-4" /> Account Details
                  </Link>
                  <Link href="/dashboard/user/settings" className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 hover:text-[#FF6B00] transition">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-red-50 text-red-600 w-full text-left transition pt-2 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-auto">{children}</main>

      </div>
    </div>
  );
}
