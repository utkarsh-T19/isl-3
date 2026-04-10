import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TEAMS, ALL_SPORTS, SPORTS } from '../data/constants';
import { FIXTURES } from '../data/leagueData';

const FIXTURE_SPORTS = [...SPORTS.outdoor, ...SPORTS.indoor];

const getTeam = (id) => TEAMS.find(t => t.id === id);
const getSport = (id) => ALL_SPORTS.find(s => s.id === id);

const Fixtures = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team') || 'all';
  const sportFilter = searchParams.get('sport') || 'all';
  const dateFilter = searchParams.get('date') || '';
  
  const matchesContainerRef = useRef(null);
  const scrollTargetRef = useRef(null);

  const filteredMatches = FIXTURES.filter(match => {
    const isTeamMatch = (teamField, target) => Array.isArray(teamField) ? teamField.includes(target) : teamField === target;
    const matchTeam = teamFilter === 'all' || isTeamMatch(match.team1Id, teamFilter) || isTeamMatch(match.team2Id, teamFilter);
    const matchSport = sportFilter === 'all' || match.sportId === sportFilter;
    const matchDateStr = match.date.substring(0, 10);
    const matchDatePass = !dateFilter || matchDateStr === dateFilter;
    return matchTeam && matchSport && matchDatePass;
  });

  useEffect(() => {
    // If we're showing all matches, try to auto-scroll to today/upcoming
    if (scrollTargetRef.current) {
        scrollTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [teamFilter, sportFilter, dateFilter]);

  const updateFilter = (type, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete(type);
    } else {
      params.set(type, value);
    }
    setSearchParams(params);
  };

  // Find the index of the first upcoming/today match for auto-scroll
  const today = new Date();
  let firstUpcomingIndex = filteredMatches.findIndex(m => new Date(m.date) >= today);
  // fallback to the first match if all are past or none found
  if (firstUpcomingIndex === -1 && filteredMatches.length > 0) {
    firstUpcomingIndex = 0;
  }

  return (
    <div className="container" style={{ width: '100%', maxWidth: '800px' }}>
      <div className="flex-col gap-4 glass-panel" style={{ marginBottom: '24px', position: 'sticky', top: '85px', zIndex: 90, padding: '16px' }}>
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <select 
            value={teamFilter} 
            onChange={(e) => updateFilter('team', e.target.value)}
            className="apple-btn"
            style={{ padding: '10px 16px', fontSize: '1rem', flex: '1', minWidth: '150px' }}
          >
            <option value="all">All Teams</option>
            {TEAMS.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          
          <select 
            value={sportFilter} 
            onChange={(e) => updateFilter('sport', e.target.value)}
            className="apple-btn"
            style={{ padding: '10px 16px', fontSize: '1rem', flex: '1', minWidth: '150px' }}
          >
            <option value="all">All Sports</option>
            {FIXTURE_SPORTS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div style={{ position: 'relative', flex: '1', minWidth: '150px', display: 'flex' }}>
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => updateFilter('date', e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              onClick={(e) => { e.target.showPicker && e.target.showPicker() }}
              style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 10 }}
            />
            <div className="apple-btn" style={{ padding: '10px 16px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
              {dateFilter || 'All Dates'}
            </div>
          </div>
        </div>
      </div>

      <div ref={matchesContainerRef} className="flex-col gap-4">
        {filteredMatches.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
            No matches found for the selected filters.
          </div>
        ) : (
          filteredMatches.map((match, index) => {
            const isScrollTarget = index === firstUpcomingIndex;
            const sport = getSport(match.sportId);
            const date = new Date(match.date);
            
            const t1Ids = Array.isArray(match.team1Id) ? match.team1Id : [match.team1Id];
            const t2Ids = Array.isArray(match.team2Id) ? match.team2Id : [match.team2Id];
            const t1s = t1Ids.map(getTeam).filter(Boolean);
            const t2s = t2Ids.map(getTeam).filter(Boolean);

            const isWinner = (winnerField, teamIds) => Array.isArray(winnerField) 
                ? winnerField.some(w => teamIds.includes(w))
                : teamIds.includes(winnerField);
            const t1Won = match.status === 'completed' && isWinner(match.winner, t1Ids);
            const t2Won = match.status === 'completed' && isWinner(match.winner, t2Ids);
            const t1Lost = match.status === 'completed' && !t1Won && match.winner !== 'draw';
            const t2Lost = match.status === 'completed' && !t2Won && match.winner !== 'draw';

            return (
              <div 
                key={match.id} 
                className="glass-panel match-card"
                ref={isScrollTarget ? scrollTargetRef : null}
              >
                <div className="flex justify-between items-center" style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ fontWeight: '600' }}>{sport?.name || 'Sport'}</div>
                  <div>{date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>

                <div className="flex justify-between items-center text-center">
                  {/* Team 1 */}
                  <div className="flex-col items-center" style={{ flex: 1, gap: '8px', opacity: t1Lost ? 0.35 : 1, filter: t1Lost ? 'grayscale(100%)' : 'none', transition: 'all 0.3s' }}>
                    <div className="flex justify-center" style={{ position: 'relative', width: t1s.length > 1 ? '72px' : '48px', height: '48px' }}>
                      {t1s.map((t, i) => (
                        <div key={t.id} style={{ width: '48px', height: '48px', background: t.color, borderRadius: '50%', border: t1Won ? '3px solid #34C759' : '2px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'absolute', left: i * 24, zIndex: 5 - i }}></div>
                      ))}
                    </div>
                    <span style={{ fontWeight: t1Won ? '800' : '600' }}>{t1s.map(t => t.name).join(' + ')} {t1Won && '🏆'}</span>
                  </div>

                  {/* Status Box */}
                  <div className="flex-col items-center justify-center" style={{ width: '100px', flex: 'none', gap: '8px' }}>
                    <span className="status-badge" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>VS</span>
                    <span className="status-badge" style={{ background: match.status === 'completed' ? 'rgba(52,199,89,0.1)' : 'var(--border-color)', color: match.status === 'completed' ? '#34C759' : 'var(--text-secondary)' }}>
                      {match.status === 'completed' ? (match.winner === 'draw' ? 'Draw' : 'Final') : 'Upcoming'}
                    </span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-col items-center" style={{ flex: 1, gap: '8px', opacity: t2Lost ? 0.35 : 1, filter: t2Lost ? 'grayscale(100%)' : 'none', transition: 'all 0.3s' }}>
                    <div className="flex justify-center" style={{ position: 'relative', width: t2s.length > 1 ? '72px' : '48px', height: '48px' }}>
                      {t2s.map((t, i) => (
                        <div key={t.id} style={{ width: '48px', height: '48px', background: t.color, borderRadius: '50%', border: t2Won ? '3px solid #34C759' : '2px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', position: 'absolute', left: i * 24, zIndex: 5 - i }}></div>
                      ))}
                    </div>
                    <span style={{ fontWeight: t2Won ? '800' : '600' }}>{t2s.map(t => t.name).join(' + ')} {t2Won && '🏆'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Fixtures;
