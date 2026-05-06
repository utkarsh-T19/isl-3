/**
 * csvParser.js — Parses all 5 ISL-3 CSV files into structured JS objects.
 *
 * Every parser is defensive:
 *  - Skips blank or all-empty rows
 *  - Never throws; returns empty arrays/objects on bad input
 *  - Maps team names (string) → team IDs (lowercase slug)
 *  - Maps sport names (string) → sport IDs
 */

import { TEAMS, ALL_SPORTS, SPORT_WIN_POINTS } from './constants';
import { BRACKET } from './leagueData'; // bracket is static — not in a CSV

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse a raw CSV text string into a 2-D array of strings. Handles quoted fields. */
export function parseCSV(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  return lines.map((line) => {
    const cells = [];
    let inQuote = false;
    let cell = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { cell += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += ch;
      }
    }
    cells.push(cell.trim());
    return cells;
  });
}

/** Case-insensitive team name → team ID */
const TEAM_NAME_MAP = {};
TEAMS.forEach((t) => {
  TEAM_NAME_MAP[t.name.toLowerCase()] = t.id;
  TEAM_NAME_MAP[t.id.toLowerCase()] = t.id;
});
export function teamNameToId(name) {
  if (!name) return null;
  return TEAM_NAME_MAP[name.trim().toLowerCase()] || null;
}

/** Sport label → sport ID, handles partial matches */
const SPORT_LABEL_MAP = {
  'mens cricket': 'mens_cricket', "men's cricket": 'mens_cricket', 'men cricket': 'mens_cricket',
  'mc': 'mens_cricket', 'cricket men': 'mens_cricket', 'cricket mens': 'mens_cricket',
  'cm': 'mens_cricket',
  'womens cricket': 'womens_cricket', "women's cricket": 'womens_cricket', 'women cricket': 'womens_cricket',
  'cricket womens': 'womens_cricket', 'cricket women': 'womens_cricket',
  'wc': 'womens_cricket', 'cw': 'womens_cricket',
  'football': 'football', 'mens football': 'football', "men's football": 'football', 'f': 'football',
  'table tennis': 'table_tennis', 'tt': 'table_tennis',
  'chess': 'chess',
  'carrom': 'carrom',
  'pickleball men': 'mens_pickleball', "men's pickleball": 'mens_pickleball',
  'mp': 'mens_pickleball', 'mens pickleball': 'mens_pickleball',
  'pickleball women': 'womens_pickleball', "women's pickleball": 'womens_pickleball',
  'wp': 'womens_pickleball', 'womens pickleball': 'womens_pickleball',
  'foosball': 'foosball',
};
export function sportLabelToId(label) {
  if (!label) return null;
  const key = label.trim().toLowerCase();
  if (SPORT_LABEL_MAP[key]) return SPORT_LABEL_MAP[key];
  // partial match fallback
  for (const [k, v] of Object.entries(SPORT_LABEL_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

/** Parse a date string like "30th March", "30-03-2026", "30-03-26" → ISO yyyy-MM-dd
 *  Optional dayOfWeek ("Monday", "Tuesday" …) disambiguates DD-MM vs MM-DD when both ≤ 12.
 */
export function parseDate(raw, dayOfWeek) {
  if (!raw) return null;
  const s = raw.trim();
  // Dash-separated: could be DD-MM-YYYY or MM-DD-YYYY
  const dashMatch = s.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (dashMatch) {
    let [, p1, p2, y] = dashMatch;
    if (y.length === 2) y = '20' + y;
    const n1 = parseInt(p1, 10);
    const n2 = parseInt(p2, 10);

    const toISO = (dd, mm) => `${y}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

    // Unambiguous: first part > 12 → must be DD-MM
    if (n1 > 12) return toISO(n1, n2);
    // Unambiguous: second part > 12 → must be MM-DD (day > 12)
    if (n2 > 12) return toISO(n2, n1);

    // Ambiguous: both ≤ 12 — use dayOfWeek hint to disambiguate
    if (dayOfWeek) {
      const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const hint = dayOfWeek.trim().toLowerCase().slice(0, 3);
      const matchesDay = (iso) => {
        const d = new Date(iso + 'T12:00:00Z');
        return !isNaN(d) && DAYS[d.getUTCDay()].startsWith(hint);
      };
      const ddmm = toISO(n1, n2);
      const mmdd = toISO(n2, n1);
      if (matchesDay(mmdd) && !matchesDay(ddmm)) return mmdd;
      if (matchesDay(ddmm)) return ddmm;
    }
    // Default: DD-MM-YYYY
    return toISO(n1, n2);
  }
  // "30th March" / "1st April" etc.
  const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  const wordMatch = s.match(/^(\d+)(?:st|nd|rd|th)?\s+([A-Za-z]+)/i);
  if (wordMatch) {
    const day = wordMatch[1].padStart(2, '0');
    const mon = MONTHS[wordMatch[2].toLowerCase().slice(0, 3)];
    if (mon) return `2026-${mon}-${day}`;
  }
  // Fallback — try native Date
  try {
    const d = new Date(s);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
  } catch (_) {}
  return null;
}

/** TRUE if every cell in a row is blank */
function isBlankRow(row) {
  return row.every((c) => c === '' || c === undefined || c === null);
}

// ─── 1. LEADERBOARD ───────────────────────────────────────────────────────────
/**
 * leaderboard.csv structure:
 *   Row 0 (header): HOUSES, CRICKET, FOOTBALL, CHESS, CARROM, FOOSBALL, PICKLEBALL, TT,
 *                   DANCE, HOUSE BRANDING, Cringe Recreation, Shades of Glory, Trivia + games, TOTAL
 *   Rows 1–8: team name, then one number per column (empty = 0)
 *
 * Returns: same shape as LEADERBOARD in leagueData.js
 */
export function parseLeaderboard(text) {
  try {
    const rows = parseCSV(text);
    if (rows.length < 2) return null;

    const COLUMN_TO_KEY = {
      'cricket': 'mens_cricket',         // may encompass both in the sheet
      'mens cricket': 'mens_cricket',
      'womens cricket': 'womens_cricket',
      "women's cricket": 'womens_cricket',
      'football': 'football',
      'chess': 'chess',
      'carrom': 'carrom',
      'foosball': 'foosball',
      'pickleball': 'mens_pickleball',
      'tt': 'table_tennis',
      'table tennis': 'table_tennis',
      'dance': 'dance',
      'house branding': 'house_branding',
      'cringe recreation': 'cringe_recreation',
      'shades of glory': 'shades_of_glory',
      'trivia + games': 'trivia',
      'trivia': 'trivia',
    };

    const header = rows[0].map((h) => h.trim().toLowerCase());
    const negativeIdx = header.findIndex((h) => h === 'negative' || h === 'negatives');
    const result = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (isBlankRow(row)) continue;
      const teamName = row[0];
      const teamId = teamNameToId(teamName);
      if (!teamId) continue; // skip unknown teams

      const points = {};
      for (let c = 1; c < header.length; c++) {
        if (c === negativeIdx) continue; // negative is tracked separately
        const colLabel = header[c];
        const key = COLUMN_TO_KEY[colLabel];
        if (!key) continue;
        const val = parseInt(row[c], 10);
        points[key] = isNaN(val) ? 0 : val;
      }

      // Fill any missing sport keys with 0
      const ALL_KEYS = ['football', 'mens_cricket', 'womens_cricket', 'table_tennis', 'chess',
        'mens_pickleball', 'womens_pickleball', 'carrom', 'foosball', 'dance', 'house_branding',
        'cringe_recreation', 'shades_of_glory', 'trivia'];
      ALL_KEYS.forEach((k) => { if (points[k] === undefined) points[k] = 0; });

      const negative = negativeIdx >= 0 ? (parseInt(row[negativeIdx], 10) || 0) : 0;

      result.push({ teamId, points, negative });
    }

    return result.length > 0 ? result : null;
  } catch (e) {
    console.error('[parseLeaderboard] Error:', e);
    return null;
  }
}

// ─── 2. WINNERS LIST → FIXTURES ───────────────────────────────────────────────
/**
 * winners_list.csv structure:
 *   Header: Date, Sport/Category, Teams, Winners, Points
 *   Data rows: "30th March", "Men Cricket", "Red vs Pink", "Red", "10"
 *   Blank rows separate date groups (skip them)
 *
 * Returns: same shape as FIXTURES in leagueData.js (completed matches only)
 * We MERGE these completed results with upcoming fixtures from leagueData.js
 * so the Fixtures page always shows all scheduled matches.
 */
export function parseWinnersList(text) {
  try {
    const rows = parseCSV(text);
    if (rows.length < 2) return null;

    const results = [];
    const sportCounters = {};
    let currentDate = null;
    let timeOffset = 0; // sub-second ordering within a day

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (isBlankRow(row)) { timeOffset = 0; continue; }

      const [rawDate, rawSport, rawTeams, rawWinner, rawPoints] = row;

      // Date carries forward if current row's date cell is empty
      const parsedDate = parseDate(rawDate);
      if (parsedDate) { currentDate = parsedDate; timeOffset = 0; }
      if (!currentDate) { timeOffset++; continue; }

      const sportId = sportLabelToId(rawSport);
      if (!sportId) { timeOffset++; continue; } // non-sport rows

      // Parse "Red vs Pink" or "Green + Teal vs Yellow + Purple"
      if (!rawTeams || !rawTeams.includes(' vs ')) { timeOffset++; continue; }
      const [leftStr, rightStr] = rawTeams.split(' vs ');

      const parseTeamGroup = (str) => {
        const parts = str.split('+').map((p) => teamNameToId(p.trim())).filter(Boolean);
        return parts.length === 1 ? parts[0] : parts;
      };
      const t1 = parseTeamGroup(leftStr);
      const t2 = parseTeamGroup(rightStr);
      if (!t1 || !t2) { timeOffset++; continue; }

      // Parse winner — can be "Red" or "Yellow+Purple" or "Brown + Pink"
      const parseWinner = (str) => {
        if (!str) return null;
        const parts = str.split('+').map((p) => teamNameToId(p.trim())).filter(Boolean);
        if (parts.length === 0) return null;
        return parts.length === 1 ? parts[0] : parts;
      };
      const winner = parseWinner(rawWinner);

      const sportKey = sportId;
      sportCounters[sportKey] = (sportCounters[sportKey] || 0) + 1;
      const id = `${sportKey}-${sportCounters[sportKey]}`;

      // Parse Points column → winnerPts (each member of `winner` array gets this) + loserPts (each non-winner side gets this)
      // Forms: "10" → {10, 0}; "5+5" / "25+25" → {5/25, 0}; "50/35" → {50, 35}; "" → fallback to SPORT_WIN_POINTS
      let winnerPts = SPORT_WIN_POINTS[sportId] ?? 5;
      let loserPts = 0;
      const rawP = (rawPoints || '').trim();
      if (rawP) {
        if (rawP.includes('/')) {
          const [w, l] = rawP.split('/').map((s) => parseInt(s.trim(), 10));
          winnerPts = isNaN(w) ? 0 : w;
          loserPts  = isNaN(l) ? 0 : l;
        } else if (rawP.includes('+')) {
          const v = parseInt(rawP.split('+')[0].trim(), 10);
          winnerPts = isNaN(v) ? 0 : v;
        } else {
          const v = parseInt(rawP, 10);
          if (!isNaN(v)) winnerPts = v;
        }
      }

      results.push({
        id,
        sportId,
        team1Id: t1,
        team2Id: t2,
        date: `${currentDate}T${String(12 + Math.floor(timeOffset / 2)).padStart(2, '0')}:${String((timeOffset % 2) * 30).padStart(2, '0')}:00Z`,
        status: 'completed',
        winner,
        pointsAwarded: winnerPts,
        runnerUpPoints: loserPts,
      });
      timeOffset++;
    }

    return results.length > 0 ? results : null;
  } catch (e) {
    console.error('[parseWinnersList] Error:', e);
    return null;
  }
}

// ─── 3. SPORTS-WISE SCORES → SPORT_STANDINGS ─────────────────────────────────
/**
 * sports_wise_scores.csv — multi-section file.
 * Each sport section starts with a header row: "SportName, Pool A, Current Score, Pool B, Current Score, ..."
 * Then 4 data rows with team + score for each pool.
 * Sections are separated by blank rows.
 * Women's cricket section has a different layout (combined, no Pool A/B split).
 *
 * Returns: same shape as SPORT_STANDINGS in leagueData.js
 */
export function parseSportStandings(text) {
  try {
    const rows = parseCSV(text);
    const result = [];

    // Split into sections at blank rows
    const sections = [];
    let current = [];
    for (const row of rows) {
      if (isBlankRow(row)) {
        if (current.length > 0) sections.push(current);
        current = [];
      } else {
        current.push(row);
      }
    }
    if (current.length > 0) sections.push(current);

    for (const section of sections) {
      if (section.length < 2) continue;
      const header = section[0];
      const sportLabel = header[0]?.trim();
      if (!sportLabel) continue;

      const sportId = sportLabelToId(sportLabel);
      if (!sportId) continue;

      // Detect women's cricket (combined format: has "Clubbed teams" or no "Pool A")
      const isWomensCricket = sportId === 'womens_cricket';

      if (isWomensCricket) {
        // Layout: team names in col 1, scores in col 2 (some in col 4)
        // Combined — single unified standings
        const standings = [];
        const fixtureLabels = [];

        for (let r = 1; r < section.length; r++) {
          const row = section[r];
          // Score rows: col 1 has team name, col 2 has their score
          const t1Name = row[1]?.trim();
          const score1Raw = row[2]?.trim();
          if (t1Name) {
            const tid = teamNameToId(t1Name);
            if (tid) {
              const pts = parseInt(score1Raw, 10);
              standings.push({ teamId: tid, points: isNaN(pts) ? 0 : pts });
            }
          }
          const t2Name = row[3]?.trim();
          const score2Raw = row[4]?.trim();
          if (t2Name) {
            const tid = teamNameToId(t2Name);
            if (tid) {
              const pts = parseInt(score2Raw, 10);
              standings.push({ teamId: tid, points: isNaN(pts) ? 0 : pts });
            }
          }
          // Fixture labels: col 7
          const fixture = row[7]?.trim();
          if (fixture && fixture.includes(' vs ')) {
            fixtureLabels.push(fixture);
          }
        }

        // Build combinedFixtures from label strings
        const combinedFixtures = fixtureLabels.map((label) => {
          const [leftStr, rightStr] = label.split(' vs ');
          const parseGroup = (str) =>
            str.split('+').map((p) => teamNameToId(p.trim())).filter(Boolean);
          return { label, team1: parseGroup(leftStr || ''), team2: parseGroup(rightStr || '') };
        }).filter((f) => f.team1.length > 0 && f.team2.length > 0);

        // Deduplicate standings (a team can appear in both col1 and col3)
        const seen = new Set();
        const deduped = standings.filter(({ teamId }) => {
          if (seen.has(teamId)) return false;
          seen.add(teamId);
          return true;
        });

        result.push({
          sportId,
          name: "Women's Cricket",
          isCombined: true,
          poolA: deduped.sort((a, b) => b.points - a.points),
          poolB: [],
          combinedFixtures,
          fixturesA: [],
          fixturesB: [],
        });
        continue;
      }

      // Standard Pool A / Pool B format
      // Header: sportName, "Pool A", "Current Score", "Pool B", "Current Score", ..., fixtures cols
      const poolATeams = [], poolBTeams = [];
      const fixturesA = [], fixturesB = [];

      for (let r = 1; r < section.length; r++) {
        const row = section[r];

        // Pool A: cols 1-2 → team, score
        const aName = row[1]?.trim();
        if (aName) {
          const tid = teamNameToId(aName);
          const pts = parseInt(row[2], 10);
          if (tid) poolATeams.push({ teamId: tid, points: isNaN(pts) ? 0 : pts });
        }
        // Pool B: cols 3-4 → team, score
        const bName = row[3]?.trim();
        if (bName) {
          const tid = teamNameToId(bName);
          const pts = parseInt(row[4], 10);
          if (tid) poolBTeams.push({ teamId: tid, points: isNaN(pts) ? 0 : pts });
        }
        // Fixtures: col 7 → Pool A fixture label, col 9 → Pool B fixture label
        const fa = row[7]?.trim();
        const fb = row[9]?.trim();
        if (fa && fa.includes(' vs ')) fixturesA.push(fa);
        if (fb && fb.includes(' vs ')) fixturesB.push(fb);
      }

      if (poolATeams.length === 0 && poolBTeams.length === 0) continue;

      const ALL_SPORT_NAMES = {
        football: 'Football', mens_cricket: "Men's Cricket",
        table_tennis: 'Table Tennis', chess: 'Chess',
        carrom: 'Carrom', mens_pickleball: "Men's Pickleball",
        womens_pickleball: "Women's Pickleball", foosball: 'Foosball',
      };

      result.push({
        sportId,
        name: ALL_SPORT_NAMES[sportId] || sportLabel,
        poolA: poolATeams.sort((a, b) => b.points - a.points),
        poolB: poolBTeams.sort((a, b) => b.points - a.points),
        fixturesA,
        fixturesB,
      });
    }

    return result.length > 0 ? result : null;
  } catch (e) {
    console.error('[parseSportStandings] Error:', e);
    return null;
  }
}

// ─── 4. SCHEDULE ─────────────────────────────────────────────────────────────
/**
 * schedule_tentative.csv structure:
 *   Cols: Date, Day, Activity, Time, Activity(description), No of matches, Location,
 *         Fixtures col 1, Fixtures col 2, Fixtures col 3
 *
 * Returns: same shape as SCHEDULE in leagueData.js
 */
export function parseSchedule(text) {
  try {
    const rows = parseCSV(text);
    if (rows.length < 2) return null;

    const SPORT_KEYWORDS = {
      cricket: ['mens_cricket', 'womens_cricket'],
      football: ['football'],
      carrom: ['carrom'],
      chess: ['chess'],
      pickleball: ['mens_pickleball', 'womens_pickleball'],
      foosball: ['foosball'],
      'table tennis': ['table_tennis'],
      tt: ['table_tennis'],
    };

    const result = [];
    // Col indices: 0=Date, 1=Day, 2=Activity, 3=Time, 4=Description, 5=Matches,
    //              6=Location, 7+8+9=Fixture cols
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (isBlankRow(row)) continue;

      const dateStr = row[0]?.trim();
      if (!dateStr) continue;
      const dayName  = row[1]?.trim() || '';
      const date = parseDate(dateStr, dayName);
      if (!date) continue;
      const activity = (row[2] || row[4] || '').trim();
      const time     = row[3]?.trim() || '—';
      const desc     = row[4]?.trim() || activity;
      const location = row[6]?.trim() || '—';

      // Skip weekends/holidays that have no activity (only "Week-off" rows)
      const lc = (activity + ' ' + desc).toLowerCase();
      const isWeekOff  = lc.includes('week-off') || lc.includes('week off');
      const isHoliday  = lc.includes('thursday') || lc.includes('friday floater') || lc.includes('maharashtra') || lc.includes('floater');
      const isSpecial  = lc.includes('opening ceremony') || lc.includes('finals') && lc.includes('sports league');
      const isSemiFinal = lc.includes('semi');
      const isFinal   = lc.includes('finals');
      const type      = lc.includes('outdoor') || lc.includes('turf') ? 'outdoor'
                      : lc.includes('indoor') || lc.includes('office') || lc.includes('training') ? 'indoor'
                      : isWeekOff ? 'weekend' : isHoliday ? 'holiday' : 'event';

      // Derive sports from description
      const sports = [];
      const descLc = (desc + ' ' + activity).toLowerCase();
      for (const [kw, ids] of Object.entries(SPORT_KEYWORDS)) {
        if (descLc.includes(kw)) ids.forEach((id) => { if (!sports.includes(id)) sports.push(id); });
      }
      // Women's cricket special
      if (descLc.includes("women") && descLc.includes("cricket") && !sports.includes('womens_cricket')) {
        sports.push('womens_cricket');
      }

      // Friendly day label
      const dayLabel = (() => {
        try {
          const d = new Date(date + 'T12:00:00Z');
          return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
        } catch (_) { return date; }
      })();

      result.push({
        date,
        dayLabel,
        time: time.replace(/\s*-\s*/g, ' – '),
        title: desc || activity || 'Event',
        location,
        type,
        sports,
        isSpecial: isSpecial || undefined,
        isSemiFinal: isSemiFinal || undefined,
        isFinal: isFinal || undefined,
        isWeekOff: isWeekOff || undefined,
      });
    }

    return result.length > 0 ? result : null;
  } catch (e) {
    console.error('[parseSchedule] Error:', e);
    return null;
  }
}

// ─── 5. TEAMS ROSTER ─────────────────────────────────────────────────────────
/**
 * sl_3.0_teams.csv structure:
 *   Row 0: URL (skip), then team names as column headers: Red, Blue, Green...
 *   Row 1: Team Size
 *   Row 2–3: CO-CAPTAINS (2 rows)
 *   Rows 4+: numbered player rows
 *
 * Returns: TEAMS_ROSTER shape { red: { size, captains, members }, ... }
 */
export function parseTeamsRoster(text) {
  try {
    const rows = parseCSV(text);
    if (rows.length < 4) return null;

    // Row 0: col 0 is some URL/label, cols 1+ are team names
    const teamHeaders = rows[0].slice(1); // e.g. ['Red','Blue','Green',...]
    const teamIds = teamHeaders.map((name) => teamNameToId(name)).filter(Boolean);
    if (teamIds.length === 0) return null;

    const roster = {};
    teamIds.forEach((id) => { roster[id] = { size: 0, captains: [], members: [] }; });

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (isBlankRow(row)) continue;
      const label = row[0]?.trim().toLowerCase();

      for (let c = 0; c < teamIds.length; c++) {
        const teamId = teamIds[c];
        const colIdx = c + 1; // offset by 1 because col 0 is the row label
        const val = row[colIdx]?.trim();
        if (!val) continue;

        if (label === 'team size') {
          const n = parseInt(val, 10);
          if (!isNaN(n)) roster[teamId].size = n;
        } else if (label === 'co-captains') {
          roster[teamId].captains.push(val);
        } else if (/^\d+$/.test(label) || label === '') {
          // Numbered player rows
          roster[teamId].members.push(val);
        }
      }
    }

    // Filter out truly empty rosters
    const valid = Object.fromEntries(
      Object.entries(roster).filter(([, v]) => v.members.length > 0 || v.captains.length > 0)
    );
    return Object.keys(valid).length > 0 ? valid : null;
  } catch (e) {
    console.error('[parseTeamsRoster] Error:', e);
    return null;
  }
}

// ─── 6. Merge completed results into full fixture list ────────────────────────
/**
 * We always want to show ALL scheduled fixtures (past + upcoming).
 * Source of truth for the schedule is the static FIXTURES from leagueData.js
 * (which was carefully hand-crafted once).
 * The CSV winners_list tells us the *results* for completed matches.
 *
 * Strategy:
 *   1. Start with all static fixtures (they have correct IDs, dates, team combos)
 *   2. For each static upcoming fixture, check if the winners_list has a result
 *      by matching sportId + team1/team2 (order-insensitive).
 *   3. If found → set status='completed', winner from CSV.
 *   4. Any CSV result not matched to a static fixture → append as extra (edge case).
 */
export function mergeFixtures(staticFixtures, csvCompleted) {
  if (!csvCompleted || csvCompleted.length === 0) return staticFixtures;

  // Build a lookup map keyed by "sportId::date::sortedTeamIds".
  // Date is part of the key so that the same matchup at different stages
  // (pool vs SF/Final) doesn't collide.
  const makeKey = (sportId, t1, t2, date) => {
    const normalise = (t) => (Array.isArray(t) ? [...t].sort().join('+') : t);
    const sides = [normalise(t1), normalise(t2)].sort();
    const dateKey = (date || '').slice(0, 10);
    return `${sportId}::${dateKey}::${sides[0]}::${sides[1]}`;
  };

  const csvMap = new Map();
  for (const fix of csvCompleted) {
    csvMap.set(makeKey(fix.sportId, fix.team1Id, fix.team2Id, fix.date), fix);
  }

  const merged = [];
  const matchedCsvKeys = new Set();

  for (const fix of staticFixtures) {
    const key = makeKey(fix.sportId, fix.team1Id, fix.team2Id, fix.date);
    const csvFix = csvMap.get(key);
    if (csvFix) {
      // Override with actual result from CSV — also propagate parsed points so the
      // progression chart can use per-match values.
      matchedCsvKeys.add(key);
      merged.push({
        ...fix,
        status: 'completed',
        winner: csvFix.winner,
        pointsAwarded: csvFix.pointsAwarded,
        runnerUpPoints: csvFix.runnerUpPoints,
      });
    } else {
      merged.push(fix);
    }
  }

  // Append any CSV results that weren't in the static list (safety net for SFs/finals)
  for (const [key, fix] of csvMap.entries()) {
    if (!matchedCsvKeys.has(key)) merged.push(fix);
  }

  return merged.sort((a, b) => new Date(a.date) - new Date(b.date));
}
