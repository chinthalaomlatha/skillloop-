import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Repeat, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="max-w-md mx-auto pt-8 pb-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
          <Repeat className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to SkillLoop AI
        </h1>
        <p className="text-xs text-slate-600">
          Sign in to your peer skill exchange account
        </p>
      </div>

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
