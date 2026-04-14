import React from 'react';
import { TEAMS, SPORT_WIN_POINTS } from '../data/constants';

const getTeam = (id) => TEAMS.find((t) => t.id === id);

const countRemaining = (teamId, sportId, fixtures) =>
  fixtures.filter((f) => {
    if (f.sportId !== sportId || f.status !== 'upcoming') return false;
    const t1 = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
    const t2 = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
    return t1.includes(teamId) || t2.includes(teamId);
  }).length;

const getQualStatus = (entry, pool, sportId, fixtures) => {
  const ptsPerWin = SPORT_WIN_POINTS[sportId] || 5;
  const rem = countRemaining(entry.teamId, sportId, fixtures);
  const myMax = entry.points + rem * ptsPerWin;

  const totalPoolMax = pool.reduce((acc, e) => acc + e.points + countRemaining(e.teamId, sportId, fixtures) * ptsPerWin, 0);
  if (totalPoolMax === 0) return 'contending';

  const othersAboveMyMax = pool.filter(
    (e) => e.teamId !== entry.teamId && e.points > myMax
  ).length;
  if (othersAboveMyMax >= 2) return 'eliminated';

  const canBeatMe = pool.filter((e) => {
    if (e.teamId === entry.teamId) return false;
    const eMax = e.points + countRemaining(e.teamId, sportId, fixtures) * ptsPerWin;
    return eMax > entry.points;
  }).length;
  if (canBeatMe <= 1) return 'qualified';
  return 'contending';
};

const STATUS = {
  qualified:  { label: '✅ Qualified',   bg: 'var(--green-bg)',      color: 'var(--green)' },
  contending: { label: '🔥 In the race', bg: 'var(--yellow-subtle)', color: 'var(--yellow)' },
  eliminated: { label: '❌ Eliminated',  bg: 'var(--red-bg)',        color: 'var(--red-status)' },
};

const QualificationStrip = ({ pool, sportId, label, fixtures = [] }) => {
  if (!pool || pool.length === 0) return null;
  const ptsPerWin = SPORT_WIN_POINTS[sportId] || 5;
  const sorted = [...pool].sort((a, b) => b.points - a.points);

  // Compute the highest max pts across the pool for comparable bar widths
  const poolMaxPts = Math.max(
    ...sorted.map((e) => e.points + countRemaining(e.teamId, sportId, fixtures) * ptsPerWin),
    1
  );

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
        {label} — Qualification Outlook
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {sorted.map((entry) => {
          const team = getTeam(entry.teamId);
          if (!team) return null;
          const rem = countRemaining(entry.teamId, sportId, fixtures);
          const maxPts = entry.points + rem * ptsPerWin;
          const status = getQualStatus(entry, pool, sportId, fixtures);
          const cfg = STATUS[status];
          const pct = poolMaxPts > 0 ? Math.round((entry.points / poolMaxPts) * 100) : 0;
          const maxPct = poolMaxPts > 0 ? Math.round((maxPts / poolMaxPts) * 100) : 0;

          return (
            <div
              key={entry.teamId}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '12px',
                background: cfg.bg,
                border: `1px solid color-mix(in srgb, ${cfg.color} 20%, transparent)`,
              }}
            >
              {/* Team */}
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: team.color, flexShrink: 0, boxShadow: `0 2px 6px color-mix(in srgb, ${team.color} 27%, transparent)` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{team.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: cfg.color, flexShrink: 0, marginLeft: '8px' }}>
                    {cfg.label}
                  </span>
                </div>
                {/* Progress: current vs max, relative to pool's highest max */}
                <div style={{ height: '4px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                  {/* Max potential bar (faded) */}
                  <div style={{ position: 'absolute', inset: 0, background: `color-mix(in srgb, ${team.color} 20%, transparent)`, width: `${maxPct}%`, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                  {/* Current pts bar (solid) */}
                  <div style={{ position: 'absolute', inset: 0, background: team.color, width: `${pct}%`, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              {/* Points */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '15px', color: entry.points > 0 ? team.color : 'var(--text-3)' }}>
                  {entry.points}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>
                  {rem > 0 ? `max ${maxPts}` : 'Final'}
                </div>
                {rem > 0 && (
                  <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                    {rem} match{rem !== 1 ? 'es' : ''} left
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px' }}>
        "max" = current points + all remaining matches won. Top 2 advance.
      </p>
    </div>
  );
};

export default QualificationStrip;
