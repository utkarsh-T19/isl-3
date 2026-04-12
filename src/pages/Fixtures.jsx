import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TEAMS, ALL_SPORTS, SPORTS } from '../data/constants';
import { FIXTURES } from '../data/leagueData';
import { Calendar, X } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

const FIXTURE_SPORTS = [...SPORTS.outdoor, ...SPORTS.indoor];
const getTeam  = (id) => TEAMS.find((t) => t.id === id);
const getSport = (id) => ALL_SPORTS.find((s) => s.id === id);

// Build options for CustomSelect
const TEAM_OPTIONS = [
  { value: 'all', label: 'All Teams' },
  ...TEAMS.map((t) => ({ value: t.id, label: t.name, dot: t.color })),
];

const SPORT_OPTIONS = [
  { value: 'all', label: 'All Sports' },
  ...FIXTURE_SPORTS.map((s) => ({ value: s.id, label: s.name })),
];

// Derive unique dates that have fixtures
const FIXTURE_DATES = [...new Set(FIXTURES.map((f) => f.date.slice(0, 10)))].sort();
const DATE_OPTIONS = [
  { value: '', label: 'All Dates' },
  ...FIXTURE_DATES.map((d) => {
    const date = new Date(d + 'T12:00:00');
    return {
      value: d,
      label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  }),
];

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

  const hasFilters = teamFilter !== 'all' || sportFilter !== 'all' || dateFilter;

  return (
    <div className="page page-narrow" style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Calendar size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Fixtures</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-3)', fontWeight: 600 }}>
            {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''}
          </span>
          {hasFilters && (
            <button
              onClick={() => setSearchParams({})}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px',
                background: 'var(--red-bg)', border: '1px solid rgba(255,69,58,0.25)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--red-status)', fontSize: '12px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar — 3 custom dropdowns */}
      <div
        className="filter-bar"
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <CustomSelect
          value={teamFilter}
          onChange={(v) => update('team', v)}
          options={TEAM_OPTIONS}
          placeholder="All Teams"
          minWidth="140px"
        />
        <CustomSelect
          value={sportFilter}
          onChange={(v) => update('sport', v)}
          options={SPORT_OPTIONS}
          placeholder="All Sports"
          minWidth="150px"
        />
        <CustomSelect
          value={dateFilter}
          onChange={(v) => update('date', v)}
          options={DATE_OPTIONS}
          placeholder="All Dates"
          minWidth="160px"
        />
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {teamFilter !== 'all' && (() => {
            const team = getTeam(teamFilter);
            return (
              <button onClick={() => update('team', 'all')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: `${team?.color}22`, border: `1px solid ${team?.color}44`, borderRadius: 'var(--radius-full)', color: team?.color, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: team?.color }} />
                {team?.name} <X size={10} />
              </button>
            );
          })()}
          {sportFilter !== 'all' && (
            <button onClick={() => update('sport', 'all')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--yellow-subtle)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-full)', color: 'var(--yellow)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {getSport(sportFilter)?.name} <X size={10} />
            </button>
          )}
          {dateFilter && (
            <button onClick={() => update('date', '')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--text-2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {DATE_OPTIONS.find((d) => d.value === dateFilter)?.label} <X size={10} />
            </button>
          )}
        </div>
      )}

      {/* Matches list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredMatches.length === 0 ? (
          <div className="glass" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
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
              style={{ borderColor: match.status === 'completed' ? 'rgba(50,215,75,0.2)' : undefined }}
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
                    {t2Won && '🏆 '}{t2s.map((t) => t.name).join(' + ')}
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
