import React, { useState, useMemo, useCallback } from 'react';
import { BarChart2, GitBranch } from 'lucide-react';
import { TEAMS } from '../data/constants';
import { useLeagueData } from '../context/DataContext';
import DataStatus from '../components/DataStatus';
import TournamentBracket from '../components/TournamentBracket';
import QualificationStrip from '../components/QualificationStrip';

const getTeam = (id) => TEAMS.find((t) => t.id === id);
const MEDALS = ['🥇', '🥈', '🥉'];

const Standings = () => {
  const { sportStandings, fixtures, bracket } = useLeagueData();
  const [activeSport, setActiveSport] = useState('');
  const [showBracket, setShowBracket] = useState(true);

  // Set initial active sport once data loads
  const firstSportId = sportStandings[0]?.sportId || '';
  const resolvedActive = activeSport || firstSportId;

  // Derive completed set from live fixtures
  const completedSet = useMemo(() => new Set(
    fixtures.filter((f) => f.status === 'completed').map((f) => {
      const t1 = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
      const t2 = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
      const name = (ids) => ids.map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' + ');
      return `${f.sportId}::${name(t1)}::${name(t2)}`;
    })
  ), [fixtures]);

  const isFixtureCompleted = (sportId, label) => {
    const [a, b] = label.split(' vs ');
    return completedSet.has(`${sportId}::${a}::${b}`) || completedSet.has(`${sportId}::${b}::${a}`);
  };

  const sport = useMemo(() => sportStandings.find((s) => s.sportId === resolvedActive), [resolvedActive, sportStandings]);

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
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', background: done ? 'var(--green-bg)' : 'var(--surface)', border: `1px solid ${done ? 'rgba(50,215,75,0.2)' : 'var(--border)'}`, fontSize: '13px' }}>
                <span style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>#{i + 1}</span>
                <span style={{ flex: 1, fontWeight: done ? 700 : 500, color: done ? 'var(--green)' : 'var(--text-2)' }}>{label_}</span>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{done ? '✅' : '🕐'}</span>
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
                <span style={{ width: '20px', fontSize: '14px', textAlign: 'center', flexShrink: 0 }}>{idx < 3 ? MEDALS[idx] : idx + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{team.name}</div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: team.color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: '18px', color: entry.points > 0 ? 'var(--yellow)' : 'var(--text-3)', minWidth: '32px', textAlign: 'right' }}>{entry.points}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="page" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <DataStatus />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart2 size=
            {28} color="var(--yellow)" />
          <h1 style={{ fontSize: '28px' }}>Pool Standings</h1>
        </div>
        {/* Bracket toggle */}
        <button
          onClick={() => setShowBracket((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '999px',
            background: showBracket ? 'var(--yellow-subtle)' : 'var(--surface-2)',
            border: `1px solid ${showBracket ? 'var(--border-strong)' : 'var(--border)'}`,
            color: showBracket ? 'var(--yellow)' : 'var(--text-2)',
            fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.18s ease',
          }}
        >
          <GitBranch size={15} />
          {showBracket ? 'Hide Bracket' : 'Show Bracket'}
        </button>
      </div>

      {/* Sport Tab Strip */}
      <div className="tab-strip" style={{ marginBottom: '28px' }}>
        {sportStandings.map(({ sportId, name }) => (
          <button key={sportId} className={`tab-pill ${resolvedActive === sportId ? 'active' : ''}`} onClick={() => setActiveSport(sportId)}>
            {name}
          </button>
        ))}
      </div>

      {sport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* ── Tournament Bracket (above pools) ── */}
          {showBracket && !sport.isCombined && bracket[sport.sportId] && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <GitBranch size={18} color="var(--yellow)" />
                <span style={{ fontWeight: 800, fontSize: '16px' }}>Tournament Bracket</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>
                  SF: {bracket[sport.sportId].sfDate} · Final: {bracket[sport.sportId].finalDate}
                </span>
              </div>
              <div className="glass" style={{ padding: '20px', borderRadius: '16px', overflowX: 'auto' }}>
                <TournamentBracket
                  sportId={sport.sportId}
                  poolA={sport.poolA}
                  poolB={sport.poolB}
                  bracket={bracket[sport.sportId]}
                  isCombined={sport.isCombined}
                  fixtures={fixtures}
                />
              </div>
            </div>
          )}

          {/* ── Pool Tables ── */}
          {sport.isCombined ? (
            renderCombined(sport)
          ) : (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {sport.poolA.length > 0 && renderPool(sport.poolA, 'Pool A')}
              {sport.poolB.length > 0 && renderPool(sport.poolB, 'Pool B')}
            </div>
          )}

          {/* ── Qualification Strips ── */}
          {!sport.isCombined && (
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <QualificationStrip pool={sport.poolA} sportId={sport.sportId} label="Pool A" fixtures={fixtures} />
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <QualificationStrip pool={sport.poolB} sportId={sport.sportId} label="Pool B" fixtures={fixtures} />
              </div>
            </div>
          )}

          {/* ── Fixture Lists ── */}
          {sport.isCombined ? (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Fixtures</div>
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
