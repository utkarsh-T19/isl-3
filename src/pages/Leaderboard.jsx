import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS, ALL_SPORTS } from '../data/constants';
import { useLeagueData } from '../context/DataContext';
import DataStatus from '../components/DataStatus';
import { ArrowUpDown, Trophy } from 'lucide-react';

const sumPoints = (pts) => Object.values(pts).reduce((s, v) => s + (v || 0), 0);
const getTotal  = (row) => sumPoints(row.points) - (row.negative || 0);
const getTeam   = (id) => TEAMS.find((t) => t.id === id);

const SPORT_CATEGORIES = [
  { id: 'overall',              label: 'Overall' },
  { id: 'football',            label: 'Football' },
  { id: 'mens_cricket',        label: "Men's Cricket" },
  { id: 'womens_cricket',      label: "Women's Cricket" },
  { id: 'table_tennis',        label: 'Table Tennis' },
  { id: 'chess',               label: 'Chess' },
  { id: 'carrom',              label: 'Carrom' },
  { id: 'mens_pickleball',     label: "Men's PB" },
  { id: 'womens_pickleball',  label: "Women's PB" },
  { id: 'foosball',            label: 'Foosball' },
  { id: 'dance',               label: 'Dance' },
  { id: 'house_branding',      label: 'Branding' },
  { id: 'cringe_recreation',   label: 'Cringe Rec.' },
  { id: 'shades_of_glory',     label: 'Shades' },
  { id: 'trivia',              label: 'Trivia' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const navigate = useNavigate();
  const { leaderboard } = useLeagueData();
  const [activeSport, setActiveSport] = useState('overall');
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedData = useMemo(() => {
    return [...leaderboard]
      .map((r) => ({ ...r, total: getTotal(r) }))
      .sort((a, b) => {
        const av = sortConfig.key === 'total' ? a.total : (a.points[sortConfig.key] || 0);
        const bv = sortConfig.key === 'total' ? b.total : (b.points[sortConfig.key] || 0);
        return sortConfig.direction === 'asc' ? av - bv : bv - av;
      });
  }, [sortConfig, leaderboard]);

  const sportRanked = useMemo(() => {
    if (activeSport === 'overall') return sortedData;
    return [...leaderboard]
      .map((r) => ({ ...r, sportPts: r.points[activeSport] || 0 }))
      .sort((a, b) => b.sportPts - a.sportPts);
  }, [activeSport, sortedData, leaderboard]);

  /* ── Sport-focused view ───────────────────────── */
  const SportView = () => (
    <div>
      {/* Podium top 3 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '28px', padding: '24px 20px' }}>
        {[sportRanked[1], sportRanked[0], sportRanked[2]].map((row, i) => {
          if (!row) return null;
          const team = getTeam(row.teamId);
          const pts = row.sportPts;
          const podiumH = ['80px', '110px', '56px'];
          return (
            <div key={row.teamId} style={{ flex: 1, maxWidth: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{[MEDALS[1], MEDALS[0], MEDALS[2]][i]}</span>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: team?.color, boxShadow: `0 0 0 3px rgba(0,0,0,0.5), 0 4px 20px color-mix(in srgb, ${team?.color} 33%, transparent)` }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{team?.name}</div>
                <div className="gold-text" style={{ fontWeight: 900, fontSize: '28px' }}>{pts}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>pts</div>
              </div>
              <div style={{ width: '100%', height: podiumH[i], borderRadius: '10px 10px 0 0', background: i === 1 ? 'linear-gradient(170deg, rgba(251,211,22,0.20) 0%, rgba(251,211,22,0.05) 100%)' : 'var(--surface-2)', border: '1px solid var(--border)', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '22px', color: 'var(--text-3)' }}>
                {i === 0 ? '2' : i === 1 ? '1' : '3'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full ranking list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sportRanked.map((row, idx) => {
          const team = getTeam(row.teamId);
          const pts = row.sportPts;
          const pct = sportRanked[0]?.sportPts > 0 ? (pts / sportRanked[0].sportPts) * 100 : 0;
          return (
            <div key={row.teamId} className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '16px' }}>
              <span style={{ width: '24px', fontWeight: 800, fontSize: '15px', color: 'var(--text-3)', textAlign: 'center' }}>
                {idx < 3 ? MEDALS[idx] : idx + 1}
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: team?.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{team?.name}</div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: team?.color, borderRadius: '2px', transition: 'width 0.7s ease' }} />
                </div>
              </div>
              <div style={{ fontWeight: 900, fontSize: '20px', color: pts > 0 ? 'var(--yellow)' : 'var(--text-3)', minWidth: '36px', textAlign: 'right' }}>{pts}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DataStatus />

      {/* ── Page Title ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Trophy size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Leaderboard</h1>
      </div>

      {/* ── Sport Tab Strip ─────────────────────────────────── */}
      <div className="tab-strip" style={{ marginBottom: '24px' }}>
        {SPORT_CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-pill ${activeSport === id ? 'active' : ''}`}
            onClick={() => setActiveSport(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Sport-focused view ─── */}
      {activeSport !== 'overall' ? (
        <SportView />
      ) : (
        /* ── Overall Table ───────────────────────────── */
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: '100px' }}>House</th>
                <th className="clickable" onClick={() => handleSort('total')} style={{ minWidth: '100px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Total <ArrowUpDown size={13} opacity={sortConfig.key === 'total' ? 1 : 0.3} />
                  </div>
                </th>
                <th style={{ minWidth: '70px' }}>Negative</th>
                {ALL_SPORTS.map((sport) => (
                  <th
                    key={sport.id}
                    className="clickable"
                    onClick={() => handleSort(sport.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span
                        onClick={(e) => { e.stopPropagation(); navigate(`/fixtures?sport=${sport.id}`); }}
                        style={{ textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'var(--border-strong)' }}
                      >
                        {sport.name}
                      </span>
                      <ArrowUpDown size={12} opacity={sortConfig.key === sport.id ? 1 : 0.25} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => {
                const team = getTeam(row.teamId);
                return (
                  <tr key={row.teamId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/fixtures?team=${team.id}`)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: team?.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 700 }}>{team?.name}</span>
                        {idx < 3 && <span style={{ fontSize: '14px' }}>{MEDALS[idx]}</span>}
                      </div>
                    </td>
                    <td style={{ fontWeight: 900, fontSize: '17px', color: 'var(--yellow)' }}>{row.total}</td>
                    <td style={{ fontWeight: 800, fontSize: '14px', color: (row.negative || 0) > 0 ? 'var(--red-status)' : 'var(--text-3)' }}>
                      {(row.negative || 0) > 0 ? `−${row.negative}` : '—'}
                    </td>
                    {ALL_SPORTS.map((sport) => {
                      const pts = row.points[sport.id] || 0;
                      return (
                        <td key={sport.id}>
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
                            fontWeight: pts > 0 ? 700 : 400,
                            color: pts > 0 ? team?.color : 'var(--text-3)',
                            background: pts > 0 ? `color-mix(in srgb, ${team?.color} 9%, transparent)` : 'transparent',
                          }}>
                            {pts || '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
