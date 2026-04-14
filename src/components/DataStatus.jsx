/**
 * DataStatus.jsx — Small banner shown while data is loading or stale.
 * Sits inside each page; completely non-blocking (page renders with seed data meanwhile).
 */
import React, { useState } from 'react';
import { RefreshCw, Wifi, WifiOff, AlertCircle, X } from 'lucide-react';
import { useLeagueData } from '../context/DataContext';

export default function DataStatus() {
  const { loading, error, dataSource, lastUpdated, reload } = useLeagueData();
  const [dismissed, setDismissed] = useState(false);
  const [reloading, setReloading] = useState(false);

  const handleReload = async () => {
    setReloading(true);
    setDismissed(false);
    await reload();
    setReloading(false);
  };

  // Nothing to show when live CSV data loaded cleanly
  if (!loading && !error && dataSource === 'csv') return null;
  if (dismissed && !loading) return null;

  const ts = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : null;

  if (loading || reloading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 14px', marginBottom: '16px',
        background: 'var(--yellow-subtle)', border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600, color: 'var(--yellow)',
      }}>
        <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
        Fetching latest data…
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (dataSource === 'seed') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
        padding: '8px 14px', marginBottom: '16px',
        background: 'var(--red-bg)', border: '1px solid rgba(255,69,58,0.25)',
        borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 600, color: 'var(--red-status)',
      }}>
        <WifiOff size={13} />
        <span style={{ flex: 1 }}>Showing cached data — couldn't reach live CSVs.</span>
        <button onClick={handleReload} style={{ background: 'none', border: 'none', color: 'var(--red-status)', cursor: 'pointer', fontWeight: 700, fontSize: '12px', fontFamily: 'inherit', padding: '2px 6px', borderRadius: '6px' }}>
          Retry
        </button>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: 'var(--red-status)', cursor: 'pointer', padding: '2px' }}>
          <X size={12} />
        </button>
      </div>
    );
  }

  if (dataSource === 'partial' && error) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
        padding: '8px 14px', marginBottom: '16px',
        background: 'rgba(251,211,22,0.06)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)',
      }}>
        <AlertCircle size={13} />
        <span style={{ flex: 1 }}>Some data sources unavailable — partial live data{ts ? ` (${ts})` : ''}.</span>
        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '2px' }}>
          <X size={12} />
        </button>
      </div>
    );
  }

  return null;
}
