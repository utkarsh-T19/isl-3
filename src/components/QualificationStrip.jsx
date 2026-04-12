import React from 'react';
import { TEAMS } from '../data/constants';
import { FIXTURES } from '../data/leagueData';
import { SPORT_WIN_POINTS } from '../data/constants';

const getTeam = (id) => TEAMS.find((t) => t.id === id);

const countRemaining = (teamId, sportId) =>
  FIXTURES.filter((f) => {
    if (f.sportId !== sportId || f.status !== 'upcoming') return false;
    const t1 = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
    const t2 = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
    return t1.includes(teamId) || t2.includes(teamId);
  }).length;

const getQualStatus = (entry, pool, sportId) => {
  const ptsPerWin = SPORT_WIN_POINTS[sportId] || 5;
  const rem = countRemaining(entry.teamId, sportId);
  const myMax = entry.points + rem * ptsPerWin;

  const othersAboveMyMax = pool.filter(
    (e) => e.teamId !== entry.teamId && e.points > myMax
  ).length;
  if (othersAboveMyMax >= 2) return 'eliminated';

  const canBeatMe = pool.filter((e) => {
    if (e.teamId === entry.teamId) return false;
    const eMax = e.points + countRemaining(e.teamId, sportId) * ptsPerWin;
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

const QualificationStrip = ({ pool, sportId, label }) => {
  if (!pool || pool.length === 0) return null;
  const ptsPerWin = SPORT_WIN_POINTS[sportId] || 5;
  const sorted = [...pool].sort((a, b) => b.points - a.points);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
        {label} — Qualification Outlook
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {sorted.map((entry) => {
          const team = getTeam(entry.teamId);
          if (!team) return null;
          const rem = countRemaining(entry.teamId, sportId);
          const maxPts = entry.points + rem * ptsPerWin;
          const status = getQualStatus(entry, pool, sportId);
          const cfg = STATUS[status];
          const pct = maxPts > 0 ? Math.round((entry.points / maxPts) * 100) : 0;

          return (
            <div
              key={entry.teamId}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '12px',
                background: cfg.bg,
                border: `1px solid ${cfg.color}33`,
              }}
            >
              {/* Team */}
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: team.color, flexShrink: 0, boxShadow: `0 2px 6px ${team.color}44` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{team.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: cfg.color, flexShrink: 0, marginLeft: '8px' }}>
                    {cfg.label}
                  </span>
                </div>
                {/* Progress: current vs max */}
                <div style={{ height: '4px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                  {/* Max potential bar (faded) */}
                  <div style={{ position: 'absolute', inset: 0, background: `${team.color}22`, width: '100%' }} />
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
