import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TEAMS, ALL_SPORTS, SPORTS } from '../data/constants';
import { FIXTURES } from '../data/leagueData';
import { Calendar } from 'lucide-react';

const FIXTURE_SPORTS = [...SPORTS.outdoor, ...SPORTS.indoor];
const getTeam  = (id) => TEAMS.find((t) => t.id === id);
const getSport = (id) => ALL_SPORTS.find((s) => s.id === id);

const Fixtures = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter  = searchParams.get('team')  || 'all';
  const sportFilter = searchParams.get('sport') || 'all';
  const dateFilter  = searchParams.get('date')  || '';
  const scrollTargetRef = useRef(null);

  const filteredMatches = FIXTURES.filter((match) => {
    const inTeam   = (field, target) => Array.isArray(field) ? field.includes(target) : field === target;
    const matchTeam  = teamFilter  === 'all' || inTeam(match.team1Id, teamFilter)  || inTeam(match.team2Id, teamFilter);
    const matchSport = sportFilter === 'all' || match.sportId === sportFilter;
    const matchDate  = !dateFilter  || match.date.slice(0, 10) === dateFilter;
    return matchTeam && matchSport && matchDate;
  });

  useEffect(() => {
    if (scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [teamFilter, sportFilter, dateFilter]);

  const today = new Date();
  const firstUpcomingIdx = (() => {
    const idx = filteredMatches.findIndex((m) => new Date(m.date) >= today);
    return idx === -1 && filteredMatches.length > 0 ? 0 : idx;
  })();

  const update = (type, value) => {
    const params = new URLSearchParams(searchParams);
    value === 'all' || value === '' ? params.delete(type) : params.set(type, value);
    setSearchParams(params);
  };

  return (
    <div className="page page-narrow" style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Calendar size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Fixtures</h1>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select value={teamFilter} onChange={(e) => update('team', e.target.value)} style={{ flex: '1', minWidth: '130px' }}>
          <option value="all">All Teams</option>
          {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <select value={sportFilter} onChange={(e) => update('sport', e.target.value)} style={{ flex: '1', minWidth: '130px' }}>
          <option value="all">All Sports</option>
          {FIXTURE_SPORTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <div style={{ position: 'relative', flex: '1', minWidth: '130px' }}>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => update('date', e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
            onClick={(e) => e.target.showPicker?.()}
            style={{ position: 'absolute', opacity: 0, inset: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
          />
          <div style={{ padding: '10px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: 600, color: dateFilter ? 'var(--text)' : 'var(--text-3)', pointerEvents: 'none' }}>
            {dateFilter || 'All Dates'}
          </div>
        </div>

        {(teamFilter !== 'all' || sportFilter !== 'all' || dateFilter) && (
          <button
            onClick={() => setSearchParams({})}
            style={{ padding: '10px 16px', background: 'var(--red-bg)', border: '1px solid rgba(255,69,58,0.25)', borderRadius: 'var(--radius-full)', color: 'var(--red-status)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Match count */}
      <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '16px', fontWeight: 600 }}>
        {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''}
      </div>

      {/* Matches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredMatches.length === 0 ? (
          <div className="glass" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>
            No matches found for the selected filters.
          </div>
        ) : filteredMatches.map((match, index) => {
          const isScrollTarget = index === firstUpcomingIdx;
          const sport = getSport(match.sportId);
          const date  = new Date(match.date);
          const t1Ids = Array.isArray(match.team1Id) ? match.team1Id : [match.team1Id];
          const t2Ids = Array.isArray(match.team2Id) ? match.team2Id : [match.team2Id];
          const t1s   = t1Ids.map(getTeam).filter(Boolean);
          const t2s   = t2Ids.map(getTeam).filter(Boolean);

          const isWinner = (wf, ids) => Array.isArray(wf) ? wf.some((w) => ids.includes(w)) : ids.includes(wf);
          const t1Won  = match.status === 'completed' && isWinner(match.winner, t1Ids);
          const t2Won  = match.status === 'completed' && isWinner(match.winner, t2Ids);
          const t1Lost = match.status === 'completed' && !t1Won && match.winner !== 'draw';
          const t2Lost = match.status === 'completed' && !t2Won && match.winner !== 'draw';

          return (
            <div
              key={match.id}
              className="match-card"
              ref={isScrollTarget ? scrollTargetRef : null}
              style={{
                borderColor: match.status === 'completed' ? 'rgba(50,215,75,0.2)' : undefined,
              }}
            >
              {/* Sport + Date row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {sport?.name || 'Sport'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              {/* Teams row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>

                {/* Team 1 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: t1Lost ? 0.3 : 1, filter: t1Lost ? 'grayscale(80%)' : 'none', transition: 'all 0.3s' }}>
                  <div style={{ position: 'relative', width: t1s.length > 1 ? 72 : 48, height: 48 }}>
                    {t1s.map((t, i) => (
                      <div key={t.id} style={{ width: 48, height: 48, borderRadius: '50%', background: t.color, border: t1Won ? '2px solid var(--green)' : '2px solid var(--border)', boxShadow: t1Won ? '0 0 12px rgba(50,215,75,0.4)' : `0 4px 12px ${t.color}44`, position: 'absolute', left: i * 24, zIndex: 5 - i }} />
                    ))}
                  </div>
                  <span style={{ fontWeight: t1Won ? 800 : 600, fontSize: '14px', textAlign: 'center', color: t1Won ? 'var(--yellow)' : 'var(--text)' }}>
                    {t1s.map((t) => t.name).join(' + ')} {t1Won && '🏆'}
                  </span>
                </div>

                {/* Centre */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span className="chip chip-neutral" style={{ fontSize: '12px', fontWeight: 900, padding: '3px 12px' }}>VS</span>
                  <span className={`chip ${match.status === 'completed' ? 'chip-green' : 'chip-neutral'}`} style={{ fontSize: '10px', padding: '2px 10px' }}>
                    {match.status === 'completed' ? (match.winner === 'draw' ? 'Draw' : 'Full Time') : 'Upcoming'}
                  </span>
                </div>

                {/* Team 2 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: t2Lost ? 0.3 : 1, filter: t2Lost ? 'grayscale(80%)' : 'none', transition: 'all 0.3s' }}>
                  <div style={{ position: 'relative', width: t2s.length > 1 ? 72 : 48, height: 48 }}>
                    {t2s.map((t, i) => (
                      <div key={t.id} style={{ width: 48, height: 48, borderRadius: '50%', background: t.color, border: t2Won ? '2px solid var(--green)' : '2px solid var(--border)', boxShadow: t2Won ? '0 0 12px rgba(50,215,75,0.4)' : `0 4px 12px ${t.color}44`, position: 'absolute', left: i * 24, zIndex: 5 - i }} />
                    ))}
                  </div>
                  <span style={{ fontWeight: t2Won ? 800 : 600, fontSize: '14px', textAlign: 'center', color: t2Won ? 'var(--yellow)' : 'var(--text)' }}>
                    {t2Won && '🏆'} {t2s.map((t) => t.name).join(' + ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fixtures;
