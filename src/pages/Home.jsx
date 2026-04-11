import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays, Users, BarChart2, ClipboardList, Calendar, Zap } from 'lucide-react';
import { TEAMS } from '../data/constants';
import { LEADERBOARD, FIXTURES } from '../data/leagueData';

const getTeam = (id) => TEAMS.find((t) => t.id === id);
const getTotal = (pts) => Object.values(pts).reduce((s, v) => s + (v || 0), 0);

const NAV_CARDS = [
  { to: '/leaderboard', icon: Trophy,      label: 'Leaderboard',    desc: 'Full standings by sport & overall total' },
  { to: '/standings',   icon: BarChart2,   label: 'Pool Standings', desc: 'Pool A / Pool B tables per sport' },
  { to: '/schedule',    icon: ClipboardList,label: 'Schedule',      desc: 'Day-by-day match calendar' },
  { to: '/teams',       icon: Users,       label: 'Teams',          desc: 'All 8 house rosters & captains' },
  { to: '/fixtures',    icon: Calendar,    label: 'Fixtures',       desc: 'Match results & upcoming games' },
];

const Home = () => {
  const today = useMemo(() => new Date(), []);
  const todayStr = today.toISOString().slice(0, 10);

  /* Top 3 overall ─────────────────────────────── */
  const ranked = useMemo(() =>
    [...LEADERBOARD]
      .map((r) => ({ ...r, total: getTotal(r.points) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3),
    []
  );

  /* Today's / next-up matches ─────────────────── */
  const todayMatches = useMemo(() => {
    const todays = FIXTURES.filter((f) => f.date.slice(0, 10) === todayStr);
    if (todays.length > 0) return { matches: todays, label: "Today's Matches", isToday: true };
    // find next upcoming date
    const upcoming = FIXTURES
      .filter((f) => f.status === 'upcoming')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    if (upcoming.length === 0) return { matches: [], label: 'No upcoming matches', isToday: false };
    const nextDate = upcoming[0].date.slice(0, 10);
    return {
      matches: upcoming.filter((f) => f.date.slice(0, 10) === nextDate),
      label: `Next Up · ${new Date(nextDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      isToday: false,
    };
  }, [todayStr]);

  const isLive = (dateStr) => {
    const start = new Date(dateStr);
    const diff = (today - start) / 60000; // minutes
    return diff >= 0 && diff < 150;
  };

  const podiumOrder = [ranked[1], ranked[0], ranked[2]]; // 2nd, 1st, 3rd
  const podiumHeights = ['80px', '120px', '60px'];
  const medals = ['🥈', '🥇', '🥉'];

  return (
    <div className="page" style={{ maxWidth: '860px', margin: '0 auto' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="fade-up" style={{ textAlign: 'center', padding: '48px 20px 40px' }}>
        <div style={{
          width: '88px', height: '88px', borderRadius: '26px', margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #FFE566 0%, #FBD316 50%, #C9A800 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 12px var(--yellow-glow), 0 12px 40px rgba(251,211,22,0.35)',
          fontSize: '40px',
        }}>🏆</div>

        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.4rem)', marginBottom: '12px' }}>
          IDfy <span className="gold-text">Sports League</span> 3.0
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '17px', maxWidth: '440px', margin: '0 auto 20px' }}>
          The ultimate corporate showdown. Live standings, results & schedules.
        </p>
        <div className="chip chip-yellow" style={{ fontSize: '13px', padding: '6px 16px' }}>
          <Zap size={14} /> Powered by Yellow House
        </div>
      </div>

      {/* ── Mini Podium ────────────────────────────────────── */}
      <div className="glass" style={{ padding: '24px 20px', marginBottom: '24px', borderRadius: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px', textAlign: 'center' }}>
          Overall Standings
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '8px' }}>
          {podiumOrder.map((row, i) => {
            if (!row) return null;
            const team = getTeam(row.teamId);
            return (
              <div key={row.teamId} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '180px' }}>
                <span style={{ fontSize: '20px' }}>{medals[i]}</span>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: team?.color,
                  boxShadow: `0 0 0 3px rgba(0,0,0,0.5), 0 0 20px ${team?.color}55`,
                  border: i === 1 ? '2px solid var(--yellow)' : 'none',
                }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{team?.name}</div>
                  <div className="gold-text" style={{ fontWeight: 900, fontSize: '22px' }}>{row.total}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>pts</div>
                </div>
                <div style={{
                  width: '100%', borderRadius: '10px 10px 0 0',
                  height: podiumHeights[i],
                  background: i === 1
                    ? 'linear-gradient(170deg, rgba(251,211,22,0.25) 0%, rgba(251,211,22,0.08) 100%)'
                    : 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderBottom: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '24px', color: 'var(--text-3)',
                }}>
                  {i === 0 ? '2' : i === 1 ? '1' : '3'}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/leaderboard" className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 20px' }}>
            Full Leaderboard →
          </Link>
        </div>
      </div>

      {/* ── Today's / Next Matches ─────────────────────────── */}
      {todayMatches.matches.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{todayMatches.label}</h2>
            {todayMatches.isToday && <div className="live-badge"><div className="live-dot" />Live</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayMatches.matches.slice(0, 4).map((match) => {
              const live = isLive(match.date);
              const t1Ids = Array.isArray(match.team1Id) ? match.team1Id : [match.team1Id];
              const t2Ids = Array.isArray(match.team2Id) ? match.team2Id : [match.team2Id];
              const t1s = t1Ids.map(getTeam).filter(Boolean);
              const t2s = t2Ids.map(getTeam).filter(Boolean);
              const sportLabel = match.sportId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={match.id} className="match-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderColor: live ? 'var(--red-status)' : undefined }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t1s.map((t) => <div key={t.id} className="team-dot" style={{ background: t.color, width: '16px', height: '16px' }} />)}
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{t1s.map((t) => t.name).join(' + ')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {live ? <div className="live-badge"><div className="live-dot" />Live</div>
                      : <span className="chip chip-neutral">vs</span>}
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>{sportLabel}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', textAlign: 'right' }}>{t2s.map((t) => t.name).join(' + ')}</span>
                    {t2s.map((t) => <div key={t.id} className="team-dot" style={{ background: t.color, width: '16px', height: '16px' }} />)}
                  </div>
                </div>
              );
            })}
            {todayMatches.matches.length > 4 && (
              <Link to="/fixtures" style={{ textAlign: 'center', color: 'var(--yellow)', fontSize: '13px', fontWeight: 700, textDecoration: 'none', padding: '8px' }}>
                +{todayMatches.matches.length - 4} more matches →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── Nav Cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {NAV_CARDS.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div className="glass" style={{ padding: '20px', borderRadius: '20px', transition: 'all 0.2s ease', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--yellow-subtle)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Icon size={20} color="var(--yellow)" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>{label}</div>
              <div style={{ color: 'var(--text-3)', fontSize: '13px', lineHeight: '1.5' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
