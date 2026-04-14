import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLeague } from '../context/LeagueContext';
import { hashString, ADMIN_PASSPHRASE_HASH } from '../utils/hashPassphrase';
import { TEAMS, ALL_SPORTS } from '../data/constants';
import { fetchLeagueFile, commitLeagueFile } from '../services/githubCommitter';

/* ── helpers ─────────────────────────────────────────────── */

const teamMap = Object.fromEntries(TEAMS.map((t) => [t.id, t]));
const sportMap = Object.fromEntries(ALL_SPORTS.map((s) => [s.id, s]));

/** Resolve a teamId (string or string[]) to a display label */
function teamLabel(teamId) {
  if (Array.isArray(teamId)) {
    return teamId.map((id) => teamMap[id]?.name ?? id).join(' + ');
  }
  return teamMap[teamId]?.name ?? teamId;
}

/** Get today as YYYY-MM-DD in local time */
function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── shared inline styles ────────────────────────────────── */

const styles = {
  page: {
    padding: '20px 16px 40px',
    maxWidth: 800,
    margin: '0 auto',
  },
  glass: {
    background: 'rgba(255,255,255,0.045)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(251,211,22,0.12)',
    borderRadius: 24,
    padding: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: 8,
  },
  subtext: {
    color: 'rgba(250,250,245,0.65)',
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 9999,
    border: '1px solid rgba(251,211,22,0.12)',
    background: 'rgba(255,255,255,0.08)',
    color: '#FAFAF5',
    fontSize: 15,
    fontFamily: 'inherit',
    fontWeight: 600,
    outline: 'none',
    marginBottom: 16,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 9999,
    fontWeight: 700,
    fontSize: 15,
    fontFamily: 'inherit',
    cursor: 'pointer',
    border: 'none',
    background: '#FBD316',
    color: '#0E0C00',
    boxShadow: '0 4px 20px rgba(251,211,22,0.35)',
    width: '100%',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 20px',
    borderRadius: 9999,
    fontWeight: 700,
    fontSize: 14,
    fontFamily: 'inherit',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.08)',
    color: '#FAFAF5',
    border: '1px solid rgba(251,211,22,0.12)',
    textDecoration: 'none',
  },
  error: {
    color: '#FF453A',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },
  success: {
    color: '#32D74B',
    fontSize: 13,
    fontWeight: 600,
    marginTop: 8,
  },
};

/* ── PassphraseGate ──────────────────────────────────────── */

function PassphraseGate({ onAuth }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setError('');
    try {
      const hash = await hashString(value);
      if (hash === ADMIN_PASSPHRASE_HASH) {
        sessionStorage.setItem('isl_admin_auth', 'true');
        onAuth();
      } else {
        setError('Incorrect passphrase');
      }
    } catch {
      setError('Hashing failed — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.glass, maxWidth: 420, margin: '60px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
          <h1 style={styles.heading}>Admin Access</h1>
          <p style={styles.subtext}>Enter the passphrase to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Passphrase"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? 'Verifying…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── TokenGate ───────────────────────────────────────────── */

function TokenGate({ onToken }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    sessionStorage.setItem('isl_github_pat', value.trim());
    onToken();
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.glass, maxWidth: 420, margin: '60px auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
          <h1 style={styles.heading}>GitHub Token</h1>
          <p style={styles.subtext}>Enter a Personal Access Token with repo scope</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.btnPrimary}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── FixtureCard ─────────────────────────────────────────── */

function FixtureCard({ fixture, updateMatchWinner }) {
  const [confirmed, setConfirmed] = useState(null);

  const sport = sportMap[fixture.sportId];
  const t1Label = teamLabel(fixture.team1Id);
  const t2Label = teamLabel(fixture.team2Id);
  const isCompleted = fixture.status === 'completed';

  const handleWinner = (winner) => {
    updateMatchWinner(fixture.id, winner);
    setConfirmed(winner === 'draw' ? 'Draw' : teamLabel(winner));
    // auto-clear confirmation after 3s
    setTimeout(() => setConfirmed(null), 3000);
  };

  const cardBorder = isCompleted
    ? '1px solid rgba(50,215,75,0.45)'
    : '1px solid rgba(251,211,22,0.12)';

  const winnerBtnStyle = (val) => {
    const isActive =
      fixture.winner != null &&
      JSON.stringify(fixture.winner) === JSON.stringify(val);
    return {
      padding: '8px 14px',
      borderRadius: 9999,
      fontWeight: 700,
      fontSize: 13,
      fontFamily: 'inherit',
      cursor: 'pointer',
      border: isActive
        ? '1px solid #FBD316'
        : '1px solid rgba(251,211,22,0.12)',
      background: isActive
        ? 'rgba(251,211,22,0.18)'
        : 'rgba(255,255,255,0.06)',
      color: isActive ? '#FBD316' : '#FAFAF5',
      flex: 1,
      textAlign: 'center',
    };
  };

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.045)',
        border: cardBorder,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
      }}
    >
      {/* header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'rgba(250,250,245,0.65)',
          }}
        >
          {sport?.name ?? fixture.sportId}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: 9999,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            background: isCompleted
              ? 'rgba(50,215,75,0.12)'
              : 'rgba(255,255,255,0.08)',
            color: isCompleted ? '#32D74B' : 'rgba(250,250,245,0.65)',
          }}
        >
          {isCompleted ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      {/* teams */}
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          marginBottom: 12,
          lineHeight: 1.4,
        }}
      >
        {t1Label}{' '}
        <span style={{ color: 'rgba(250,250,245,0.35)', fontWeight: 600 }}>
          vs
        </span>{' '}
        {t2Label}
      </div>

      {/* current winner display for completed matches */}
      {isCompleted && fixture.winner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 12,
            background: 'rgba(50,215,75,0.08)',
            border: '1px solid rgba(50,215,75,0.2)',
            marginBottom: 12,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <span>🏆</span>
          <span style={{ color: '#32D74B' }}>
            Current winner: {fixture.winner === 'draw' ? 'Draw' : teamLabel(fixture.winner)}
          </span>
          <span style={{ color: 'rgba(250,250,245,0.45)', fontSize: 11, marginLeft: 'auto' }}>
            Click below to overwrite
          </span>
        </div>
      )}

      {/* winner selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          style={winnerBtnStyle(fixture.team1Id)}
          onClick={() => handleWinner(fixture.team1Id)}
        >
          {t1Label}
        </button>
        <button
          style={winnerBtnStyle(fixture.team2Id)}
          onClick={() => handleWinner(fixture.team2Id)}
        >
          {t2Label}
        </button>
        <button
          style={winnerBtnStyle('draw')}
          onClick={() => handleWinner('draw')}
        >
          Draw
        </button>
      </div>

      {confirmed && (
        <p style={styles.success}>✓ Winner set to {confirmed}</p>
      )}
    </div>
  );
}

/* ── AdminDashboard ──────────────────────────────────────── */

function DeployStatus({ status, error, onRetry }) {
  if (status === 'success') {
    return (
      <div
        style={{
          background: 'rgba(50,215,75,0.1)',
          border: '1px solid rgba(50,215,75,0.35)',
          borderRadius: 12,
          padding: '14px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>🚀</span>
        <span style={{ color: '#32D74B', fontSize: 14, fontWeight: 600 }}>
          GitHub Pages deployment pending — scores visible to others in 1–3 minutes
        </span>
      </div>
    );
  }

  if (status === 'error' && error) {
    return (
      <div
        style={{
          background: 'rgba(255,69,58,0.1)',
          border: '1px solid rgba(255,69,58,0.35)',
          borderRadius: 12,
          padding: '14px 20px',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: onRetry ? 10 : 0 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ color: '#FF453A', fontSize: 14, fontWeight: 600 }}>{error}</span>
        </div>
        {onRetry && (
          <button onClick={onRetry} style={{ ...styles.btnGhost, fontSize: 13, padding: '8px 16px' }}>
            Retry Commit
          </button>
        )}
      </div>
    );
  }

  return null;
}

function AdminDashboard({ onLogout, onTokenInvalid }) {
  const { fixtures, leaderboard, updateMatchWinner } = useLeague();

  const [commitLoading, setCommitLoading] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null); // null | 'success' | 'error'
  const [commitError, setCommitError] = useState('');
  const [showRetry, setShowRetry] = useState(false);

  // Derive all unique fixture dates sorted chronologically
  const fixtureDates = [...new Set(fixtures.map((f) => f.date.slice(0, 10)))].sort();

  // Default to today if it has fixtures, otherwise first available date
  const today = todayDate();
  const [selectedDate, setSelectedDate] = useState(
    () => fixtureDates.includes(today) ? today : fixtureDates[0] || today,
  );

  const selectedFixtures = selectedDate
    ? fixtures.filter((f) => f.date.slice(0, 10) === selectedDate)
    : fixtures;

  const handleDateClick = (d) => {
    setSelectedDate((prev) => (prev === d ? null : d));
  };

  const formatDateLabel = (d) => {
    const date = new Date(d + 'T12:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleCommit = useCallback(async () => {
    setCommitLoading(true);
    setDeployStatus(null);
    setCommitError('');
    setShowRetry(false);

    const pat = sessionStorage.getItem('isl_github_pat');

    // Step 1: fetch current SHA
    const fetchResult = await fetchLeagueFile(pat);
    if (!fetchResult.success) {
      if (fetchResult.message && fetchResult.message.includes('Invalid token')) {
        sessionStorage.removeItem('isl_github_pat');
        onTokenInvalid();
        setCommitLoading(false);
        return;
      }
      setDeployStatus('error');
      setCommitError(fetchResult.message);
      setShowRetry(true);
      setCommitLoading(false);
      return;
    }

    // Step 2: commit
    const commitResult = await commitLeagueFile(pat, fetchResult.sha, fixtures, leaderboard);
    if (commitResult.success) {
      setDeployStatus('success');
      setCommitLoading(false);
      return;
    }

    // Handle 401
    if (commitResult.message && commitResult.message.includes('Invalid token')) {
      sessionStorage.removeItem('isl_github_pat');
      onTokenInvalid();
      setCommitLoading(false);
      return;
    }

    // Handle 409 — auto-retry once
    if (commitResult.message && commitResult.message.includes('Conflict')) {
      const retryFetch = await fetchLeagueFile(pat);
      if (!retryFetch.success) {
        setDeployStatus('error');
        setCommitError(retryFetch.message);
        setShowRetry(true);
        setCommitLoading(false);
        return;
      }
      const retryCommit = await commitLeagueFile(pat, retryFetch.sha, fixtures, leaderboard);
      if (retryCommit.success) {
        setDeployStatus('success');
        setCommitLoading(false);
        return;
      }
      // Retry also failed
      setDeployStatus('error');
      setCommitError(retryCommit.message);
      setShowRetry(true);
      setCommitLoading(false);
      return;
    }

    // Handle other errors (422, 5xx, network)
    setDeployStatus('error');
    setCommitError(commitResult.message);
    setShowRetry(true);
    setCommitLoading(false);
  }, [fixtures, leaderboard, onTokenInvalid]);

  return (
    <div style={styles.page}>
      {/* header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ ...styles.heading, marginBottom: 4 }}>
            ⚡ Admin Panel
          </h1>
          <p style={{ color: 'rgba(250,250,245,0.65)', fontSize: 14 }}>
            Select a date to manage fixtures
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/" style={styles.btnGhost}>
            ← Home
          </Link>
          <button onClick={onLogout} style={styles.btnGhost}>
            Logout
          </button>
        </div>
      </div>

      {/* date selector */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="date"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value || null)}
          min={fixtureDates[0]}
          max={fixtureDates[fixtureDates.length - 1]}
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            border: '1px solid rgba(251,211,22,0.12)',
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'inherit',
            fontWeight: 600,
            outline: 'none',
            colorScheme: 'dark',
          }}
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            style={{
              ...styles.btnGhost,
              fontSize: 12,
              padding: '8px 14px',
            }}
          >
            Show All
          </button>
        )}
        {!selectedDate && (
          <span style={{ fontSize: 13, color: 'rgba(250,250,245,0.5)', fontWeight: 600 }}>
            Showing all {selectedFixtures.length} fixtures
          </span>
        )}
      </div>

      {/* deploy status / error banner */}
      <DeployStatus
        status={deployStatus}
        error={commitError}
        onRetry={showRetry ? handleCommit : null}
      />

      {/* fixture list */}
      {selectedFixtures.length === 0 ? (
        <div
          style={{
            ...styles.glass,
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'rgba(250,250,245,0.65)',
            }}
          >
            No matches scheduled{selectedDate ? ` for ${formatDateLabel(selectedDate)}` : ''}
          </p>
        </div>
      ) : (
        <>
          {selectedFixtures.map((f) => (
            <FixtureCard
              key={f.id}
              fixture={f}
              updateMatchWinner={updateMatchWinner}
            />
          ))}

          {/* Commit to GitHub button */}
          <button
            onClick={handleCommit}
            disabled={commitLoading}
            style={{
              ...styles.btnPrimary,
              marginTop: 16,
              opacity: commitLoading ? 0.7 : 1,
            }}
          >
            {commitLoading ? '⏳ Committing…' : '🚀 Commit to GitHub'}
          </button>
        </>
      )}
    </div>
  );
}

/* ── Main AdminPanel (phase router) ──────────────────────── */

export default function AdminPanel() {
  const [phase, setPhase] = useState(() => {
    if (sessionStorage.getItem('isl_admin_auth') !== 'true') return 'passphrase';
    if (!sessionStorage.getItem('isl_github_pat')) return 'token';
    return 'dashboard';
  });

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('isl_admin_auth');
    sessionStorage.removeItem('isl_github_pat');
    setPhase('passphrase');
  }, []);

  const handleTokenInvalid = useCallback(() => {
    setPhase('token');
  }, []);

  if (phase === 'passphrase') {
    return <PassphraseGate onAuth={() => setPhase('token')} />;
  }
  if (phase === 'token') {
    return <TokenGate onToken={() => setPhase('dashboard')} />;
  }
  return <AdminDashboard onLogout={handleLogout} onTokenInvalid={handleTokenInvalid} />;
}
