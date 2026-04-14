import React, { useState, useMemo, useRef, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { TEAMS, SPORT_WIN_POINTS } from '../data/constants';
import { useLeagueData } from '../context/DataContext';
import DataStatus from '../components/DataStatus';

const getTeam = (id) => TEAMS.find((t) => t.id === id);

// buildProgressionSeries is now a function that takes fixtures as input
// (called inside useMemo in the component)
const buildProgressionSeries = (fixturesData) => {
  const totals = {};
  TEAMS.forEach((t) => { totals[t.id] = 0; });

  const completed = [...fixturesData]
    .filter((f) => f.status === 'completed' && f.winner)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Group by calendar day
  const byDay = {};
  completed.forEach((f) => {
    const d = f.date.slice(0, 10);
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(f);
  });

  const series = [];

  // Starting point — all zeros
  series.push({
    label: 'Start',
    dateStr: '2026-03-25',
    ...Object.fromEntries(TEAMS.map((t) => [t.id, 0])),
  });

  Object.keys(byDay).sort().forEach((dateStr) => {
    byDay[dateStr].forEach((match) => {
      const pts = SPORT_WIN_POINTS[match.sportId] || 5;
      const winners = Array.isArray(match.winner) ? match.winner : [match.winner];
      winners.forEach((w) => { totals[w] = (totals[w] || 0) + pts; });
    });
    const d = new Date(dateStr + 'T12:00:00');
    series.push({
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      dateStr,
      ...Object.fromEntries(TEAMS.map((t) => [t.id, totals[t.id]])),
    });
  });

  return series;
};

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
const CHART_H = 340;
const PAD = { top: 24, right: 24, bottom: 44, left: 44 };

const SvgChart = ({ series, visibleTeams }) => {
  const [hoverX, setHoverX] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const allPts = series.flatMap((pt) =>
    TEAMS.filter((t) => visibleTeams[t.id]).map((t) => pt[t.id] || 0)
  );
  const maxY = Math.max(...allPts, 10);

  const toX = useCallback((i, w) =>
    PAD.left + (i / (series.length - 1)) * (w - PAD.left - PAD.right),
  [series.length]);

  const toY = useCallback((v) =>
    PAD.top + (1 - v / maxY) * (CHART_H - PAD.top - PAD.bottom),
  [maxY]);

  // determine leader at each point
  const leaderAt = series.map((pt) => {
    let best = null, bestV = -1;
    TEAMS.forEach((t) => { if ((pt[t.id] || 0) > bestV) { bestV = pt[t.id]; best = t.id; } });
    return best;
  });

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const w = rect.width;
    const mouseXRel = e.clientX - rect.left;
    const usableW = w - PAD.left - PAD.right;
    const idx = Math.round(((mouseXRel - PAD.left) / usableW) * (series.length - 1));
    const clamped = Math.max(0, Math.min(series.length - 1, idx));
    setHoverX(toX(clamped, w));
    setTooltip({ idx: clamped, x: mouseXRel, y: e.clientY - rect.top });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 800 ${CHART_H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: `${CHART_H}px`, overflow: 'visible', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHoverX(null); setTooltip(null); }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const yv = Math.round(frac * maxY);
          const y = toY(yv);
          return (
            <g key={frac}>
              <line x1={PAD.left} x2={800 - PAD.right} y1={y} y2={y}
                stroke="rgba(251,211,22,0.08)" strokeWidth="1" />
              <text x={PAD.left - 6} y={y + 4} fontSize="10" fill="rgba(250,250,245,0.35)"
                textAnchor="end">{yv}</text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {series.map((pt, i) => {
          const x = toX(i, 800);
          return (
            <text key={i} x={x} y={CHART_H - 8} fontSize="10"
              fill="rgba(250,250,245,0.35)" textAnchor="middle"
              style={{ userSelect: 'none' }}>{pt.label}</text>
          );
        })}

        {/* Lines — dimmed teams rendered first, visible ones on top */}
        {[...TEAMS].reverse().map((team) => {
          if (!visibleTeams[team.id]) return null;
          const isLeader = leaderAt[leaderAt.length - 1] === team.id;
          const pts = series.map((pt, i) => `${toX(i, 800)},${toY(pt[team.id] || 0)}`).join(' ');
          return (
            <g key={team.id}>
              {/* Glow for current leader */}
              {isLeader && (
                <polyline points={pts} fill="none"
                  stroke={team.color} strokeWidth="6" strokeOpacity="0.15"
                  strokeLinejoin="round" strokeLinecap="round" />
              )}
              <polyline points={pts} fill="none"
                stroke={team.color}
                strokeWidth={isLeader ? 3 : 2}
                strokeOpacity={1}
                strokeLinejoin="round" strokeLinecap="round" />
              {/* Data point dots */}
              {series.map((pt, i) => (
                <circle key={i} cx={toX(i, 800)} cy={toY(pt[team.id] || 0)}
                  r={3} fill={team.color} />
              ))}
            </g>
          );
        })}

        {/* Hover vertical line */}
        {hoverX !== null && (
          <line x1={hoverX} x2={hoverX} y1={PAD.top} y2={CHART_H - PAD.bottom}
            stroke="rgba(251,211,22,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'absolute',
          left: Math.min(tooltip.x + 12, 500),
          top: Math.max(tooltip.y - 80, 4),
          background: 'rgba(14,12,0,0.95)',
          border: '1px solid var(--border-strong)',
          borderRadius: '12px',
          padding: '12px 16px',
          pointerEvents: 'none',
          zIndex: 10,
          minWidth: '170px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {series[tooltip.idx]?.label}
          </div>
          {[...TEAMS]
            .filter((t) => visibleTeams[t.id])
            .sort((a, b) => (series[tooltip.idx]?.[b.id] || 0) - (series[tooltip.idx]?.[a.id] || 0))
            .map((team, i) => {
              const pts = series[tooltip.idx]?.[team.id] || 0;
              return (
                <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-3)', width: '14px', textAlign: 'right' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-2)', flex: 1 }}>{team.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: pts > 0 ? team.color : 'var(--text-3)' }}>{pts}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Progression = () => {
  const { fixtures } = useLeagueData();
  const series = useMemo(() => buildProgressionSeries(fixtures), [fixtures]);
  const [visible, setVisible] = useState(
    Object.fromEntries(TEAMS.map((t) => [t.id, true]))
  );

  const toggle = (id) => setVisible((v) => ({ ...v, [id]: !v[id] }));
  const showAll = () => setVisible(Object.fromEntries(TEAMS.map((t) => [t.id, true])));

  // Current leader
  const lastPt = series[series.length - 1];
  const leader = lastPt ? [...TEAMS].sort((a, b) => (lastPt[b.id] || 0) - (lastPt[a.id] || 0))[0] : null;

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DataStatus />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <TrendingUp size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Points Progression</h1>
      </div>
      <p style={{ color: 'var(--text-2)', marginBottom: '24px', fontSize: '14px' }}>
        Cumulative points from tracked sports (football, cricket, chess, carrom, TT, pickleball, foosball) over time.
        Misc. category points (dance, branding, trivia, etc.) are not included as they have no match dates.
      </p>

      {/* Current leader callout */}
      {leader && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', background: `color-mix(in srgb, ${leader.color} 8%, transparent)`, border: `1px solid color-mix(in srgb, ${leader.color} 27%, transparent)`, borderRadius: '16px', marginBottom: '24px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: leader.color, boxShadow: `0 0 16px color-mix(in srgb, ${leader.color} 33%, transparent)` }} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current sports leader</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: leader.color }}>{leader.name} — {lastPt[leader.id]} pts</div>
          </div>
          <div style={{ fontSize: '28px', marginLeft: 'auto' }}>🥇</div>
        </div>
      )}

      {/* Chart */}
      <div className="glass" style={{ padding: '20px', borderRadius: '20px', marginBottom: '20px' }}>
        <SvgChart series={series} visibleTeams={visible} />
      </div>

      {/* Team toggle legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', marginRight: '4px' }}>Toggle:</span>
        {TEAMS.map((team) => {
          const isOn = visible[team.id];
          const lastPts = lastPt?.[team.id] || 0;
          return (
            <button
              key={team.id}
              onClick={() => toggle(team.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '6px 14px', borderRadius: '999px',
                background: isOn ? `color-mix(in srgb, ${team.color} 13%, transparent)` : 'var(--surface)',
                border: `1.5px solid ${isOn ? team.color : 'var(--border)'}`,
                color: isOn ? team.color : 'var(--text-3)',
                fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', fontFamily: 'inherit',
                opacity: isOn ? 1 : 0.5,
                transition: 'all 0.18s ease',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOn ? team.color : 'var(--text-3)' }} />
              {team.name}
              <span style={{ fontSize: '11px', opacity: 0.75 }}>{lastPts}</span>
            </button>
          );
        })}
        <button onClick={showAll} style={{ padding: '6px 14px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Show all
        </button>
      </div>

      {/* Day-by-day breakdown table */}
      <div style={{ marginTop: '32px' }}>
        <div className="section-title" style={{ fontSize: '16px', marginBottom: '16px' }}>Day-by-day breakdown</div>
        <div className="table-wrap">
          <table style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th>Date</th>
                {TEAMS.map((t) => (
                  <th key={t.id} style={{ color: t.color, fontWeight: 800 }}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.map((pt, i) => {
                if (i === 0) return null; // skip start row
                const prev = series[i - 1];
                return (
                  <tr key={pt.dateStr}>
                    <td style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{pt.label}</td>
                    {TEAMS.map((t) => {
                      const cur = pt[t.id] || 0;
                      const delta = cur - (prev[t.id] || 0);
                      return (
                        <td key={t.id}>
                          <span style={{ fontWeight: 700, color: cur > 0 ? t.color : 'var(--text-3)' }}>{cur}</span>
                          {delta > 0 && (
                            <span style={{ fontSize: '10px', color: 'var(--green)', fontWeight: 700, marginLeft: '4px' }}>+{delta}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Progression;
