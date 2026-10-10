import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, UserCheck, ShieldAlert, FileText } from 'lucide-react';
import { store } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AdminPage: React.FC = () => {
  const state = store.getState();
  const [reports, setReports] = useState(state.reports);

  const handleUpdateReport = (reportId: string, status: any) => {
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status } : r));
    setReports(updated);
    state.reports = updated;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Admin & Moderation Console (§12)
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Community Safety, Reports & Moderation Actions
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Review community flagged items, moderation verdicts, and enforce peer-to-peer trust standards.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">Pending Reports</div>
          <div className="text-2xl font-black text-rose-600">
            {reports.filter((r) => r.status === 'pending').length}
          </div>
          <p className="text-[11px] text-slate-500">Require moderation review</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active Users</div>
          <div className="text-2xl font-black text-slate-900">{state.profiles.length}</div>
          <p className="text-[11px] text-slate-500">Verified community members</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">Blocked Profiles</div>
          <div className="text-2xl font-black text-slate-900">{state.blockedUserIds.length}</div>
          <p className="text-[11px] text-slate-500">Peer-isolated user accounts</p>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Community Incident Reports ({reports.length})
        </h3>

        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => {
              const reporter = state.profiles.find((p) => p.id === report.reporter_id);
              const target = state.profiles.find((p) => p.id === report.reported_user_id);

              return (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="rose" size="sm" className="capitalize font-bold">
                        {report.reason.replace('_', ' ')}
                      </Badge>
                      <span className="font-mono text-slate-400 text-[10px]">
                        ID: {report.id}
                      </span>
                    </div>

                    <Badge
                      variant={report.status === 'resolved' ? 'emerald' : report.status === 'dismissed' ? 'slate' : 'amber'}
                      size="sm"
                      className="capitalize"
                    >
                      {report.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400">Reporter:</span>{' '}
                      <strong>{reporter?.full_name || report.reporter_id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Reported User:</span>{' '}
                      <strong className="text-rose-700">{target?.full_name || report.reported_user_id}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                    <strong>Report Details:</strong> "{report.details}"
                  </div>

                  {report.status === 'pending' && (
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateReport(report.id, 'dismissed')}
                        className="text-xs text-slate-500"
                      >
                        Dismiss Report
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateReport(report.id, 'resolved')}
                        className="text-xs"
                      >
                        Take Action & Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl">
            No community reports submitted. Community standards are healthy!
          </div>
        )}
      </Card>
    </div>
  );
};
