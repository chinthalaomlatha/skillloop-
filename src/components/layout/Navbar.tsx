import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Repeat,
  Compass,
  Users,
  Bot,
  BookOpen,
  Calendar,
  Award,
  Menu,
  X,
  Bell,
  ChevronDown,
  ShieldCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../lib/store';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout, switchActiveUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const state = store.getState();
  const unreadCount = state.notifications.filter((n) => !n.is_read && n.user_id === user?.id).length;

  const navLinks = [
    { label: 'Matches', path: '/matches', icon: Users },
    { label: 'AI Circles', path: '/circles', icon: Repeat },
    { label: 'AI Mentor', path: '/mentor', icon: Bot },
    { label: 'Catalogue', path: '/catalogue', icon: Compass },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'Library', path: '/library', icon: BookOpen },
    { label: 'Sessions', path: '/sessions', icon: Calendar },
    { label: 'Progress', path: '/progress', icon: Award },
  ];

  const handleSwitchUser = (userId: string) => {
    switchActiveUser(userId);
    setSwitcherOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Repeat className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-700 to-indigo-800 bg-clip-text text-transparent">
                SkillLoop<span className="text-emerald-500 font-mono text-sm ml-0.5">AI</span>
              </span>
              <p className="text-[10px] text-slate-600 hidden sm:block font-medium -mt-1">
                Teach &middot; Learn &middot; Exchange
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Controls & Demo Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Persona Switcher for Demonstrating Multi-User Exchange Loops */}
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200/80 transition-colors"
                title="Switch persona to test matching and circles from different perspectives"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                <span className="hidden md:inline">Persona:</span>
                <span className="font-semibold text-slate-900">{user?.full_name?.split(' ')[0] || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {state.profiles.slice(0, 6).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSwitchUser(p.id)}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          user?.id === p.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-medium text-slate-900">{p.full_name}</div>
                          <div className="text-[10px] text-slate-600 truncate">{p.headline}</div>
                        </div>
                        {user?.id === p.id && <span className="text-[10px] text-emerald-800 font-bold">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {user && (
              <Link
                to="/requests"
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="View notifications and requests"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                )}
              </Link>
            )}

            {/* Profile Avatar / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-600 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Profile & Skills
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Learning Dashboard
                    </Link>
                    <Link
                      to="/safety"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Safety & Blocked Users
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (strict 375px mobile responsiveness per §3 & §19) */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.full_name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900">{user.full_name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user.headline || user.email}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-700 py-1.5"
                >
                  Edit Profile & Skills
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-semibold text-rose-600 py-1.5 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get Started Free</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
