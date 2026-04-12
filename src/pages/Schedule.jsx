import React, { useMemo, useState } from 'react';
import { ClipboardList, MapPin, Clock } from 'lucide-react';
import { ALL_SPORTS } from '../data/constants';
import { useLeagueData } from '../context/DataContext';
import DataStatus from '../components/DataStatus';

const todayStr = () => new Date().toISOString().slice(0, 10);

const TYPE_COLOURS = {
  outdoor: { bg: 'rgba(50,215,75,0.10)', color: '#32D74B' },
  indoor:  { bg: 'rgba(10,132,255,0.10)', color: '#0A84FF' },
  holiday: { bg: 'rgba(255,159,10,0.10)', color: '#FF9F0A' },
};

const getSportName = (id) => ALL_SPORTS.find((s) => s.id === id)?.name || id;

const Schedule = () => {
  const { schedule, fixtures } = useLeagueData();
  const today = todayStr();
  const [expandedDates, setExpandedDates] = useState(() => {
    // auto-expand today or next upcoming day (uses seed data on first render)
    const upcoming = schedule.filter((d) => d.date >= today && d.type !== 'holiday');
    return upcoming.length > 0 ? new Set([upcoming[0].date]) : new Set();
  });

  const fixturesByDate = useMemo(() => {
    const map = {};
    fixtures.forEach((f) => {
      const d = f.date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(f);
    });
    return map;
  }, [fixtures]);

  const toggle = (date) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  const isDone    = (date) => date < today;
  const isToday   = (date) => date === today;
  const isUpcoming= (date) => date > today;

  return (
    <div className="page page-narrow" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <DataStatus />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <ClipboardList size={28} color="var(--yellow)" />
        <h1 style={{ fontSize: '28px' }}>Schedule</h1>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {[
          { label: 'Outdoor', ...TYPE_COLOURS.outdoor },
          { label: 'Indoor',  ...TYPE_COLOURS.indoor },
          { label: 'Holiday', ...TYPE_COLOURS.holiday },
          { label: 'Today',   bg: 'var(--yellow-subtle)', color: 'var(--yellow)' },
          { label: 'Finals',  bg: 'rgba(255,69,58,0.1)', color: '#FF453A' },
        ].map(({ label, bg, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: bg, border: `1px solid ${color}44` }} />
            <span style={{ color: 'var(--text-2)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '0' }}>
        {schedule.map((day, idx) => {
          const done     = isDone(day.date);
          const today_   = isToday(day.date);
          const typeCol  = TYPE_COLOURS[day.type] || TYPE_COLOURS.outdoor;
          const expanded = expandedDates.has(day.date);
          const dayFixtures = fixturesByDate[day.date] || [];
          const dotColor = today_ ? 'var(--yellow)' : done ? 'var(--text-3)' : typeCol.color;

          return (
            <div key={day.date} style={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'flex-start' }}>

              {/* Timeline spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '20px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: dotColor, border: '2px solid var(--bg)', marginTop: '18px', zIndex: 1, boxShadow: today_ ? `0 0 0 4px var(--yellow-glow)` : 'none', flexShrink: 0 }} />
                {idx < schedule.length - 1 && (
                  <div style={{ width: '2px', flex: 1, minHeight: '20px', background: 'var(--border)', marginTop: '4px' }} />
                )}
              </div>

              {/* Date label (small screen: inline, wide: separate column) */}
              <div style={{ flex: 1, paddingBottom: '4px' }}>
                <div
                  className={`timeline-card ${done ? 'done' : ''} ${today_ ? 'today' : ''}`}
                  style={{
                    cursor: day.type !== 'holiday' ? 'pointer' : 'default',
                    borderColor: today_ ? 'var(--yellow)' : day.isFinal ? '#FF453A44' : undefined,
                    background: today_ ? 'var(--yellow-subtle)' : undefined,
                  }}
                  onClick={() => day.type !== 'holiday' && toggle(day.date)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      {/* Date row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: today_ ? 'var(--yellow)' : 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {day.dayLabel}
                        </span>
                        {today_ && <div className="live-badge" style={{ padding: '2px 8px', fontSize: '10px' }}><div className="live-dot" />Today</div>}
                        {day.isFinal && <span className="chip chip-red" style={{ fontSize: '10px', padding: '2px 8px' }}>Final</span>}
                        {day.isSemiFinal && <span className="chip chip-yellow" style={{ fontSize: '10px', padding: '2px 8px' }}>Semi</span>}
                      </div>

                      {/* Title */}
                      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', color: day.isSpecial ? 'var(--yellow)' : undefined }}>
                        {day.title}
                      </div>

                      {/* Meta row */}
                      {day.type !== 'holiday' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-2)' }}>
                            <Clock size={12} />
                            {day.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-2)' }}>
                            <MapPin size={12} />
                            {day.location}
                          </div>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {(day.sports || []).map((s) => (
                              <span key={s} style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: typeCol.bg, color: typeCol.color }}>
                                {getSportName(s)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand toggle */}
                    {dayFixtures.length > 0 && (
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', flexShrink: 0, marginTop: '2px' }}>
                        {dayFixtures.length} {expanded ? '▲' : '▼'}
                      </div>
                    )}
                  </div>

                  {/* Expanded fixtures */}
                  {expanded && dayFixtures.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {dayFixtures.map((f) => {
                        const t1Ids = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
                        const t2Ids = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
                        const t1Name = t1Ids.map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' + ');
                        const t2Name = t2Ids.map((id) => id.charAt(0).toUpperCase() + id.slice(1)).join(' + ');
                        const isWin  = (winnerField, teamIds) => winnerField && (Array.isArray(winnerField) ? winnerField.some((w) => teamIds.includes(w)) : teamIds.includes(winnerField));
                        const t1Won  = f.status === 'completed' && isWin(f.winner, t1Ids);
                        const t2Won  = f.status === 'completed' && isWin(f.winner, t2Ids);
                        const sportName = getSportName(f.sportId);
                        return (
                          <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 0' }}>
                            <span style={{ color: 'var(--text-3)', fontSize: '11px', width: '70px', flexShrink: 0 }}>{sportName}</span>
                            <span style={{ fontWeight: t1Won ? 800 : 500, color: t1Won ? 'var(--yellow)' : 'var(--text)', flex: 1 }}>{t1Name} {t1Won && '🏆'}</span>
                            <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>vs</span>
                            <span style={{ fontWeight: t2Won ? 800 : 500, color: t2Won ? 'var(--yellow)' : 'var(--text)', flex: 1, textAlign: 'right' }}>{t2Won && '🏆'} {t2Name}</span>
                            <span style={{ fontSize: '10px', flexShrink: 0 }}>
                              {f.status === 'completed'
                                ? <span style={{ color: 'var(--green)' }}>✓</span>
                                : <span style={{ color: 'var(--text-3)' }}>🕐</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
