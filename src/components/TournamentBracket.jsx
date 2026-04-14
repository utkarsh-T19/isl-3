import React from 'react';
import { TEAMS, SPORT_WIN_POINTS } from '../data/constants';

const getTeam = (id) => {
  if (!id) return null;
  if (Array.isArray(id)) {
    return id.map((i) => TEAMS.find((t) => t.id === i)).filter(Boolean);
  }
  return TEAMS.find((t) => t.id === id) || null;
};

const countRemaining = (teamId, sportId, fixtures) =>
  fixtures.filter((f) => {
    if (f.sportId !== sportId || f.status !== 'upcoming') return false;
    const t1 = Array.isArray(f.team1Id) ? f.team1Id : [f.team1Id];
    const t2 = Array.isArray(f.team2Id) ? f.team2Id : [f.team2Id];
    return t1.includes(teamId) || t2.includes(teamId);
  }).length;

const getQualStatus = (entry, pool, sportId, fixtures) => {
  const pts = SPORT_WIN_POINTS[sportId] || 5;
  const myMax = entry.points + countRemaining(entry.teamId, sportId, fixtures) * pts;

  const othersAboveMyMax = pool.filter(
    (e) => e.teamId !== entry.teamId && e.points > myMax
  ).length;

  if (othersAboveMyMax >= 2) return 'eliminated';

  const canBeatMe = pool.filter((e) => {
    if (e.teamId === entry.teamId) return false;
    const eMax = e.points + countRemaining(e.teamId, sportId, fixtures) * pts;
    return eMax > entry.points;
  }).length;

  if (canBeatMe <= 1) return 'qualified';
  return 'contending';
};

const STATUS_CONFIG = {
  qualified:  { label: 'Qualified', bg: 'var(--green-bg)',  color: 'var(--green)',      icon: '✅' },
  contending: { label: 'In the race',bg: 'var(--yellow-subtle)', color: 'var(--yellow)', icon: '🔥' },
  eliminated: { label: 'Eliminated', bg: 'var(--red-bg)',   color: 'var(--red-status)', icon: '❌' },
};

// ─── Single slot in the bracket ───────────────────────────────────────────────
const BracketSlot = ({ teamId, label, sublabel, isDerived, isTbd, isWinner, qualStatus }) => {
  const isArray = Array.isArray(teamId);
  const teams = teamId
    ? (isArray ? teamId.map((id) => TEAMS.find((t) => t.id === id)).filter(Boolean) : [TEAMS.find((t) => t.id === teamId)].filter(Boolean))
    : [];

  const statusCfg = qualStatus && !isWinner ? STATUS_CONFIG[qualStatus] : null;

  return (
    <div style={{
      padding: '8px 12px',
      background: isWinner ? 'rgba(251,211,22,0.12)' : statusCfg ? statusCfg.bg : 'var(--surface-2)',
      border: `1px solid ${isWinner ? 'var(--yellow)' : statusCfg ? statusCfg.color + '66' : teams[0] ? `${teams[0].color}44` : 'var(--border)'}`,
      borderRadius: '10px',
      minWidth: '110px',
      maxWidth: '140px',
      opacity: isTbd ? 0.55 : 1,
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
        {sublabel}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {teams.length > 0 ? (
          <>
            <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
              {teams.map((t) => (
                <div key={t.id} style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.color, boxShadow: `0 1px 4px ${t.color}55` }} />
              ))}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: isWinner ? 'var(--yellow)' : 'var(--text)' }}>
              {teams.map((t) => t.name).join('+')}
            </span>
            {isDerived && (
              <span style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 600 }}>*</span>
            )}
          </>
        ) : (
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)' }}>TBD</span>
        )}
      </div>
      {statusCfg && (
        <div style={{ fontSize: '9px', fontWeight: 800, color: statusCfg.color, marginTop: '3px' }}>
          {statusCfg.icon} {statusCfg.label}
        </div>
      )}
      {label && !statusCfg && (
        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>{label}</div>
      )}
    </div>
  );
};

// ─── Connector lines ───────────────────────────────────────────────────────────
const Elbow = ({ direction }) => (
  <div style={{
    width: '20px',
    flex: 1,
    borderRight: '2px solid var(--border)',
    ...(direction === 'top'
      ? { borderBottom: '2px solid var(--border)', borderRadius: '0 0 6px 0' }
      : { borderTop: '2px solid var(--border)', borderRadius: '0 6px 0 0' }),
  }} />
);

const HLine = ({ length = 20 }) => (
  <div style={{ width: `${length}px`, height: '2px', background: 'var(--border)', flexShrink: 0 }} />
);

// ─── Full bracket for a sport ─────────────────────────────────────────────────
const TournamentBracket = ({ sportId, poolA, poolB, bracket, isCombined, fixtures = [] }) => {
  if (!bracket) return null;

  const sortedA = [...poolA].sort((a, b) => b.points - a.points);
  const sortedB = [...poolB].sort((a, b) => b.points - a.points);

  // Compute qualification status for pool seed slots
  const a1Status = sortedA[0] ? getQualStatus(sortedA[0], poolA, sportId, fixtures) : null;
  const a2Status = sortedA[1] ? getQualStatus(sortedA[1], poolA, sportId, fixtures) : null;
  const b1Status = sortedB[0] ? getQualStatus(sortedB[0], poolB, sportId, fixtures) : null;
  const b2Status = sortedB[1] ? getQualStatus(sortedB[1], poolB, sportId, fixtures) : null;

  // SF matchups: A1 vs B2, A2 vs B1
  const a1 = sortedA[0]?.teamId || null;
  const b2 = sortedB[1]?.teamId || null;
  const a2 = sortedA[1]?.teamId || null;
  const b1 = sortedB[0]?.teamId || null;

  const sf1t1 = bracket.sf1.team1 ?? a1;
  const sf1t2 = bracket.sf1.team2 ?? b2;
  const sf2t1 = bracket.sf2.team1 ?? a2;
  const sf2t2 = bracket.sf2.team2 ?? b1;

  const sf1Winner = bracket.sf1.winner;
  const sf2Winner = bracket.sf2.winner;
  const finalT1   = bracket.final.team1 ?? sf1Winner;
  const finalT2   = bracket.final.team2 ?? sf2Winner;
  const champion  = bracket.final.winner;

  const sf1IsDerived = !bracket.sf1.team1;
  const sf2IsDerived = !bracket.sf2.team1;

  const SLOT_H = 60;
  const GAP    = 16;

  return (
    <div>
      <div style={{ display: 'flex', gap: '0px', alignItems: 'center', overflowX: 'auto', paddingBottom: '8px' }}>

        {/* ── Column 1: Pool Seeds ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px`, flexShrink: 0 }}>
          <BracketSlot teamId={sf1t1} sublabel="Pool A #1" isDerived={sf1IsDerived} qualStatus={sf1IsDerived ? a1Status : null} />
          <div style={{ height: `${GAP}px` }} />
          <BracketSlot teamId={sf1t2} sublabel="Pool B #2" isDerived={sf1IsDerived} qualStatus={sf1IsDerived ? b2Status : null} />

          <div style={{ height: `${GAP * 2}px` }} />

          <BracketSlot teamId={sf2t1} sublabel="Pool A #2" isDerived={sf2IsDerived} qualStatus={sf2IsDerived ? a2Status : null} />
          <div style={{ height: `${GAP}px` }} />
          <BracketSlot teamId={sf2t2} sublabel="Pool B #1" isDerived={sf2IsDerived} qualStatus={sf2IsDerived ? b1Status : null} />
        </div>

        {/* ── Connector: Pool → SF ── */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Top SF elbow */}
          <div style={{ display: 'flex', flexDirection: 'column', height: `${SLOT_H * 2 + GAP}px` }}>
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderBottom: '2px solid var(--border)', borderRadius: '0 0 6px 0' }} />
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderTop: '2px solid var(--border)', borderRadius: '0 6px 0 0' }} />
          </div>
          {/* Gap between SF pairs */}
          <div style={{ height: `${GAP * 2}px` }} />
          {/* Bottom SF elbow */}
          <div style={{ display: 'flex', flexDirection: 'column', height: `${SLOT_H * 2 + GAP}px` }}>
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderBottom: '2px solid var(--border)', borderRadius: '0 0 6px 0' }} />
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderTop: '2px solid var(--border)', borderRadius: '0 6px 0 0' }} />
          </div>
        </div>

        {/* ── Column 2: Semi Finals ── */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ height: `${SLOT_H / 2 + GAP / 2}px` }} />
          <BracketSlot
            teamId={sf1Winner}
            sublabel={`SF 1 · ${bracket.sfDate}`}
            label={sf1Winner ? undefined : `${sf1t1 ? TEAMS.find((t) => t.id === sf1t1)?.name ?? '?' : '?'} vs ${sf1t2 ? TEAMS.find((t) => t.id === sf1t2)?.name ?? '?' : '?'}`}
            isTbd={!sf1Winner}
            isWinner={false}
          />
          <div style={{ flex: 1, minHeight: `${GAP * 3 + SLOT_H}px` }} />
          <BracketSlot
            teamId={sf2Winner}
            sublabel={`SF 2 · ${bracket.sfDate}`}
            label={sf2Winner ? undefined : `${sf2t1 ? TEAMS.find((t) => t.id === sf2t1)?.name ?? '?' : '?'} vs ${sf2t2 ? TEAMS.find((t) => t.id === sf2t2)?.name ?? '?' : '?'}`}
            isTbd={!sf2Winner}
            isWinner={false}
          />
          <div style={{ height: `${SLOT_H / 2 + GAP / 2}px` }} />
        </div>

        {/* ── Connector: SF → Final ── */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'column', height: `${SLOT_H * 2 + GAP * 3 + SLOT_H}px` }}>
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderBottom: '2px solid var(--border)', borderRadius: '0 0 6px 0' }} />
            <div style={{ flex: 1, width: '20px', borderRight: '2px solid var(--border)', borderTop: '2px solid var(--border)', borderRadius: '0 6px 0 0' }} />
          </div>
          <div style={{ flex: 1 }} />
        </div>

        {/* ── Column 3: Final ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
          <BracketSlot
            teamId={champion}
            sublabel={`Final · ${bracket.finalDate}`}
            label={champion ? undefined : `${finalT1 ? TEAMS.find((t) => t.id === finalT1)?.name ?? 'SF1 Winner' : 'SF1 Winner'} vs ${finalT2 ? TEAMS.find((t) => t.id === finalT2)?.name ?? 'SF2 Winner' : 'SF2 Winner'}`}
            isTbd={!champion}
          />
        </div>

        {/* ── Connector: Final → Champion ── */}
        {champion ? (
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: 'var(--yellow)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: 'var(--border)' }} />
          </div>
        )}

        {/* ── Champion slot ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
          {champion ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 16px', background: 'rgba(251,211,22,0.12)', border: '1px solid var(--yellow)', borderRadius: '12px' }}>
              <span style={{ fontSize: '28px' }}>🏆</span>
              {(() => { const t = getTeam(champion); const teams = Array.isArray(t) ? t : [t]; return (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {teams.filter(Boolean).map((tm) => <div key={tm.id} style={{ width: '20px', height: '20px', borderRadius: '50%', background: tm.color }} />)}
                </div>
              ); })()}
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--yellow)' }}>
                {(() => { const t = getTeam(champion); const teams = Array.isArray(t) ? t : [t]; return teams.filter(Boolean).map((tm) => tm.name).join('+'); })()}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 16px', background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '12px', opacity: 0.5 }}>
              <span style={{ fontSize: '28px' }}>🏆</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-3)' }}>Champion</span>
            </div>
          )}
        </div>

      </div>

      {/* Derived positions note */}
      <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px' }}>
        * Position derived from current pool standings — not yet confirmed
      </p>
    </div>
  );
};

export default TournamentBracket;
