import React, { useState, useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import { TEAMS } from '../data/constants';
import { SPORT_STANDINGS, FIXTURES } from '../data/leagueData';

const getTeam = (id) => TEAMS.find((t) => t.id === id);
const MEDALS = ['🥇', '🥈', '🥉'];

/* Derive completed fixture labels from the FIXTURES array */
const completedSet = new Set(
  FIXTURES.filter((f) => f.status === 'completed').map((f) => {
    const t1 = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
    const t2 = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
    const name = (ids) => ids.map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' + ');
    return `${f.sportId}::${name(t1)}::${name(t2)}`;
  })
);

const isFixtureCompleted = (sportId, label) => {
  const [a, b] = label.split(' vs ');
  return completedSet.has(`${sportId}::${a}::${b}`) || completedSet.has(`${sportId}::${b}::${a}`);
};

const Standings = () => {
  const [activeSport, setActiveSport] = useState(SPORT_STANDINGS[0]?.sportId || '');

  const sport = useMemo(() => SPORT_STANDINGS.find((s) => s.sportId === activeSport), [activeSport]);

  const poolSorted = (pool) => [...pool].sort((a, b) => b.points - a.points);

  const renderPool = (pool, label) => {
    const sorted = poolSorted(pool);
    const maxPts = sorted[0]?.points || 1;
    return (
      <div className="pool-card" style={{ flex: 1, minWidth: '240px' }}>
        <div className="pool-header">{label}</div>
        <div style={{ padding: '8px 0' }}>
          {sorted.map((entry, idx) => {
            const team = getTeam(entry.teamId);
            if (!team) return null;
            const pct = maxPts > 0 ? (entry.points / maxPts) * 100 : 0;
            return (
              <div key={entry.teamId} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < sorted.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ width: '20px', fontSize: '14px', textAlign: 'center', flexShrink: 0 }}>
                  {idx < 3 ? MEDALS[idx] : idx + 1}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: team.color, flexShrink: 0, boxShadow: `0 2px 8px ${team.color}44` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{team.name}</div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: team.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: '18px', color: entry.points > 0 ? 'var(--yellow)' : 'var(--text-3)', minWidth: '32px', textAlign: 'right' }}>
                  {entry.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFixtures = (fixtures, label, sportId) => {
    if (!fixtures || fixtures.length === 0) return null;
    return (
      <div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          {label} Fixtures
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {fixtures.map((label_, i) => {
            const done = isFixtureCompleted(sportId, label_);
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px', borderRadius: '10px',
                  background: done ? 'var(--green-bg)' : 'var(--surface)',
                  border: `1px solid ${done ? 'rgba(50,215,75,0.2)' : 'var(--border)'}`,
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                  #{i + 1}
                </span>
                <span style={{ flex: 1, fontWeight: done ? 700 : 500, color: done ? 'var(--green)' : 'var(--text-2)' }}>
                  {label_}
                </span>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>
                  {done ? '✅' : '🕐'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCombined = (sport_) => {
    const sorted = poolSorted(sport_.poolA);
    const maxPts = sorted[0]?.points || 1;
    return (
      <div className="pool-card" style={{ width: '100%' }}>
        <div className="pool-header">Combined Team Standings</div>
        <div style={{ padding: '8px 0' }}>
          {sorted.map((entry, idx) => {
            const team = getTeam(entry.teamId);
            if (!team) return null;
            const pct = maxPts > 0 ? (entry.points / maxPts) * 100 : 0;
            return (
              <div key={entry.teamId} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: idx < sorted.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ width: '20px', fontSize: '14px', textAlign: 'center', flexShrink: 0 }}>
                  {idx < 3 ? MEDALS[idx] : idx + 1}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{team.name}</div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: team.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: '18px', color: entry.points > 0 ? 'var(--yellow)' : 'var(--text-3)', minWidth: '32px', textAlign: 'right' }}>
                  {entry.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <BarChart2 size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Pool Standings</h1>
      </div>

      {/* Sport Tab Strip */}
      <div className="tab-strip" style={{ marginBottom: '28px' }}>
        {SPORT_STANDINGS.map(({ sportId, name }) => (
          <button
            key={sportId}
            className={`tab-pill ${activeSport === sportId ? 'active' : ''}`}
            onClick={() => setActiveSport(sportId)}
          >
            {name}
          </button>
        ))}
      </div>

      {sport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Pool Tables */}
          {sport.isCombined ? (
            renderCombined(sport)
          ) : (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {sport.poolA.length > 0 && renderPool(sport.poolA, 'Pool A')}
              {sport.poolB.length > 0 && renderPool(sport.poolB, 'Pool B')}
            </div>
          )}

          {/* Fixtures */}
          {sport.isCombined ? (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Fixtures
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sport.combinedFixtures?.map((f, i) => {
                  const checkKey1 = `${sport.sportId}::${f.team1.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}::${f.team2.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}`;
                  const checkKey2 = `${sport.sportId}::${f.team2.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}::${f.team1.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}`;
                  const done = completedSet.has(checkKey1) || completedSet.has(checkKey2);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '12px', background: done ? 'var(--green-bg)' : 'var(--surface)', border: `1px solid ${done ? 'rgba(50,215,75,0.2)' : 'var(--border)'}`, fontSize: '13px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        {f.team1.map((id) => { const t = getTeam(id); return <div key={id} style={{ width: '18px', height: '18px', borderRadius: '50%', background: t?.color }} />; })}
                      </div>
                      <span style={{ fontWeight: 700, flex: 1, color: done ? 'var(--green)' : 'var(--text)' }}>{f.label}</span>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        {f.team2.map((id) => { const t = getTeam(id); return <div key={id} style={{ width: '18px', height: '18px', borderRadius: '50%', background: t?.color }} />; })}
                      </div>
                      <span style={{ flexShrink: 0 }}>{done ? '✅' : '🕐'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '260px' }}>{renderFixtures(sport.fixturesA, 'Pool A', sport.sportId)}</div>
              <div style={{ flex: 1, minWidth: '260px' }}>{renderFixtures(sport.fixturesB, 'Pool B', sport.sportId)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Standings;
