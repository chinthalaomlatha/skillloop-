import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Repeat, ArrowRight, AlertCircle, Sparkles, CheckCircle2, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const state = store.getState();

  const [email, setEmail] = useState('maya.lin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsLoading(true);
    const res = await login(demoEmail, 'password123');
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-lg mx-auto pt-6 pb-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
          <Repeat className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to SkillLoop AI
        </h1>
        <p className="text-xs text-slate-600">
          The peer-to-peer knowledge exchange network
        </p>
      </div>

      {/* If already signed in, show status banner */}
      {user && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">
                You are currently signed in as <span className="text-emerald-800">{user.full_name}</span>
              </p>
              <p className="text-slate-500 text-[11px]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-emerald-200/60">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Continue to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Quick 1-Click Demo Accounts */}
      <Card className="p-4 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border-indigo-100">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> One-Click Demo Personas
          </span>
          <span className="text-[10px] text-slate-500">Click to sign in instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {state.profiles.slice(0, 4).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuickLogin(p.email)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 hover:shadow-xs cursor-pointer ${
                user?.id === p.id
                  ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <img
                src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={p.full_name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{p.full_name}</div>
                <div className="text-[10px] text-slate-500 truncate">{p.headline}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Standard Email / Password Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. maya.lin@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Password
              </label>
              <Link to="/reset-password" className="text-xs text-emerald-700 hover:text-emerald-800">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" type="submit" isLoading={isLoading} className="w-full">
              Sign In to SkillLoop <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Create account free
          </Link>
        </div>
      </Card>
    </div>
  );
};
