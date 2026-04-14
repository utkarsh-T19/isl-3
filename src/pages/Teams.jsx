import React, { useState, useMemo } from 'react';
import { Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { TEAMS } from '../data/constants';
import { useLeagueData } from '../context/DataContext';
import DataStatus from '../components/DataStatus';

const getTotal = (pts) => Object.values(pts).reduce((s, v) => s + (v || 0), 0);
const MEDALS = ['🥇', '🥈', '🥉'];

const Teams = () => {
  const { leaderboard, teamsRoster } = useLeagueData();
  const [expanded, setExpanded] = useState(null);

  // Compute rank dynamically from live leaderboard data
  const RANK_OF = useMemo(() => {
    const ranked = [...leaderboard]
      .map((r) => ({ teamId: r.teamId, total: getTotal(r.points) }))
      .sort((a, b) => b.total - a.total);
    const map = {};
    ranked.forEach((r, i) => { map[r.teamId] = { rank: i + 1, total: r.total }; });
    return map;
  }, [leaderboard]);

  const totalParticipants = Object.values(teamsRoster).reduce(
    (s, r) => s + (r.members?.length || 0) + (r.captains?.length || 0), 0
  );

  return (
    <div className="page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <DataStatus />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <Users size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Teams</h1>
      </div>
      <p style={{ color: 'var(--text-2)', marginBottom: '28px', fontSize: '15px' }}>
        8 houses · {totalParticipants}+ participants · Click any card to see the full roster
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {TEAMS.map((team) => {
          const roster = teamsRoster[team.id];
          if (!roster) return null;
          const rankInfo = RANK_OF[team.id];
          const isExpanded = expanded === team.id;
          const allMembers = roster.members;

          return (
            <div
              key={team.id}
              className="roster-card"
              onClick={() => setExpanded(isExpanded ? null : team.id)}
              style={{ border: `1px solid ${team.color}33` }}
            >
              {/* Coloured Header */}
              <div
                className="roster-header"
                style={{
                  background: `linear-gradient(140deg, ${team.color}30 0%, ${team.color}10 100%)`,
                  borderBottom: `1px solid ${team.color}33`,
                }}
              >
                {/* Rank badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: team.color, flexShrink: 0, boxShadow: `0 4px 16px ${team.color}55` }} />
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '20px' }}>{team.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={11} />
                        {roster.size} members
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', lineHeight: 1 }}>{rankInfo?.rank <= 3 ? MEDALS[rankInfo.rank - 1] : `#${rankInfo?.rank}`}</div>
                    <div style={{ fontWeight: 900, fontSize: '18px', color: team.color }}>{rankInfo?.total}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>PTS</div>
                  </div>
                </div>

                {/* Captains */}
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                    Captains
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {roster.captains.map((cap) => (
                      <span key={cap} className="member-pill captain">
                        <Star size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="roster-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isExpanded ? '12px' : 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)' }}>
                    {isExpanded ? 'All members' : `${allMembers.length} squad members`}
                  </span>
                  <div style={{ color: 'var(--text-3)' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Collapsed preview — show 6 */}
                {!isExpanded && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
                    {allMembers.slice(0, 6).map((m) => (
                      <span key={m} className="member-pill">{m}</span>
                    ))}
                    {allMembers.length > 6 && (
                      <span className="member-pill" style={{ color: 'var(--yellow)', fontWeight: 700, borderColor: 'var(--border-strong)' }}>
                        +{allMembers.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                {/* Expanded — show all */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                    {allMembers.map((m) => (
                      <span key={m} className="member-pill">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Teams;
