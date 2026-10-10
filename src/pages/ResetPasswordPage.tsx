import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Repeat, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSupabaseConfigured) {
      try {
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email);
        if (resetErr) {
          setError(resetErr.message);
          return;
        }
      } catch (err: any) {
        setError(err.message || 'Reset request failed.');
        return;
      }
    }

    setIsSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto pt-8 pb-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
          <Repeat className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xs text-slate-600">
          Enter your registered email address and we'll send recovery instructions.
        </p>
      </div>

      <Card className="p-6">
        {isSubmitted ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Recovery Link Sent</h3>
            <p className="text-xs text-slate-600">
              If an account matches <strong>{email}</strong>, check your inbox for password reset instructions.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="outline" size="sm">Back to Sign In</Button>
              </Link>
            </div>
          </div>
        ) : (
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

            <Button variant="primary" size="md" type="submit" className="w-full">
              Send Password Reset Email
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
