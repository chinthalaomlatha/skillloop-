import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-24 space-y-4 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        <Compass className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-600">
        The destination you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
