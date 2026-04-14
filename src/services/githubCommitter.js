/**
 * githubCommitter.js
 *
 * Commits the three CSV files that the Admin Panel controls:
 *   public/data/winners_list.csv
 *   public/data/leaderboard.csv
 *   public/data/sports_wise_scores.csv
 *
 * These are the same files the Apps Script writes, making both flows
 * fully interchangeable.
 */

import { SPORT_WIN_POINTS } from '../data/constants';
import { SPORT_STANDINGS as SEED_SPORT_STANDINGS } from '../data/leagueData';

// ── GitHub config ──────────────────────────────────────────────────────────────
const REPO_OWNER = 'utkarsh-T19';
const REPO_NAME  = 'isl-3';
const BRANCH     = 'master';
const API_BASE   = 'https://api.github.com';

const FILE_PATHS = {
  winnersList:    'public/data/winners_list.csv',
  leaderboard:    'public/data/leaderboard.csv',
  sportStandings: 'public/data/sports_wise_scores.csv',
};

// ── GitHub API helpers ─────────────────────────────────────────────────────────

async function fetchGitHubFile(pat, path) {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
      { headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github.v3+json' } },
    );
    if (res.status === 401) return { success: false, message: 'Invalid token — please re-enter your GitHub PAT.' };
    if (res.status >= 500) return { success: false, message: `GitHub server error (${res.status}). Try again later.` };
    if (!res.ok) return { success: false, message: `Failed to fetch ${path} (HTTP ${res.status}).` };
    const data = await res.json();
    return { success: true, sha: data.sha };
  } catch (err) {
    return { success: false, message: `Network error: ${err.message}` };
  }
}

async function putGitHubFile(pat, path, content, sha, message) {
  try {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    const res = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${pat}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, content: encodedContent, sha, branch: BRANCH }),
      },
    );
    if (res.status === 401) return { success: false, message: 'Invalid token — please re-enter your GitHub PAT.' };
    if (res.status === 409) return { success: false, code: 409, message: 'Conflict — file changed since last fetch. Retrying…' };
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      return { success: false, message: `Validation error: ${body.message || 'unprocessable entity'}.` };
    }
    if (res.status >= 500) return { success: false, message: `GitHub server error (${res.status}). Try again later.` };
    if (!res.ok) return { success: false, message: `Commit failed (HTTP ${res.status}).` };
    return { success: true };
  } catch (err) {
    return { success: false, message: `Network error: ${err.message}` };
  }
}

/** Fetch SHA, commit content, retry once on 409 conflict. */
async function commitFileWithRetry(pat, path, content, message) {
  const fetchResult = await fetchGitHubFile(pat, path);
  if (!fetchResult.success) return fetchResult;

  const result = await putGitHubFile(pat, path, content, fetchResult.sha, message);
  if (result.success || result.code !== 409) return result;

  // 409 — re-fetch SHA and retry once
  const retryFetch = await fetchGitHubFile(pat, path);
  if (!retryFetch.success) return retryFetch;
  return putGitHubFile(pat, path, content, retryFetch.sha, message);
}

// ── CSV serialisers ────────────────────────────────────────────────────────────

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function escapeCSVField(val) {
  const s = String(val ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

// Sport labels that parseWinnersList / sportLabelToId can read back
const WINNER_LIST_LABELS = {
  football:      'Football',
  mens_cricket:  'Mens Cricket',
  womens_cricket:'Womens Cricket',
  table_tennis:  'Table Tennis',
  chess:         'Chess',
  carrom:        'Carrom',
  pickleball:    'Pickleball',
  foosball:      'Foosball',
};

// Sport header labels for sports_wise_scores.csv sections
const SPORT_SECTION_LABELS = {
  football:      'Football',
  mens_cricket:  'Cricket mens',
  womens_cricket:'Cricket womens',
  table_tennis:  'Table Tennis',
  chess:         'Chess',
  carrom:        'Carrom',
  pickleball:    'Pickleball men and women',
  foosball:      'Foosball',
};

// Column order + headers for leaderboard.csv
const LEADERBOARD_COLS = [
  { key: 'mens_cricket',      header: 'Cricket' },
  { key: 'womens_cricket',    header: 'Womens Cricket' },
  { key: 'football',          header: 'Football' },
  { key: 'chess',             header: 'Chess' },
  { key: 'carrom',            header: 'Carrom' },
  { key: 'foosball',          header: 'Foosball' },
  { key: 'pickleball',        header: 'Pickleball' },
  { key: 'table_tennis',      header: 'TT' },
  { key: 'dance',             header: 'Dance' },
  { key: 'house_branding',    header: 'House Branding' },
  { key: 'cringe_recreation', header: 'Cringe Recreation' },
  { key: 'shades_of_glory',   header: 'Shades of Glory' },
  { key: 'trivia',            header: 'Trivia + games' },
];

/**
 * Build winners_list.csv from completed fixtures.
 * Output is parseable by parseWinnersList in csvParser.js.
 */
export function buildWinnersListCSV(fixtures) {
  const completed = fixtures
    .filter((f) => f.status === 'completed' && f.winner)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const lines = ['Date,Sport/Category,Teams,Winners,Points'];
  let prevDate = null;

  for (const f of completed) {
    const date = f.date.slice(0, 10);
    if (prevDate && date !== prevDate) lines.push(''); // blank row between dates
    prevDate = date;

    const sportLabel = WINNER_LIST_LABELS[f.sportId] || f.sportId;
    const t1 = Array.isArray(f.team1Id) ? f.team1Id.map(cap).join(' + ') : cap(f.team1Id);
    const t2 = Array.isArray(f.team2Id) ? f.team2Id.map(cap).join(' + ') : cap(f.team2Id);
    const winner = Array.isArray(f.winner) ? f.winner.map(cap).join(' + ') : cap(f.winner);
    const pts = SPORT_WIN_POINTS[f.sportId] ?? 0;
    const pointsStr = Array.isArray(f.winner)
      ? f.winner.map(() => String(pts)).join('+')
      : String(pts);

    lines.push(`${date},${sportLabel},${escapeCSVField(`${t1} vs ${t2}`)},${escapeCSVField(winner)},${pointsStr}`);
  }

  return lines.join('\n');
}

/**
 * Build leaderboard.csv from the leaderboard state.
 * Output is parseable by parseLeaderboard in csvParser.js.
 * Includes a Womens Cricket column (the parser was updated to read it).
 */
export function buildLeaderboardCSV(leaderboard) {
  const headers = ['HOUSES', ...LEADERBOARD_COLS.map((c) => c.header), 'TOTAL'];
  const sorted = [...leaderboard].sort((a, b) => {
    const tot = (e) => Object.values(e.points).reduce((s, v) => s + (v || 0), 0);
    return tot(b) - tot(a);
  });

  const lines = [headers.join(',')];
  for (const entry of sorted) {
    const vals = LEADERBOARD_COLS.map((c) => String(entry.points[c.key] || 0));
    const total = LEADERBOARD_COLS.reduce((s, c) => s + (entry.points[c.key] || 0), 0);
    lines.push([cap(entry.teamId), ...vals, String(total)].join(','));
  }

  return lines.join('\n');
}

/**
 * Compute sport-level points per team from the fixture list.
 * Used to rebuild sports_wise_scores.csv.
 */
function computeSportPts(fixtures) {
  const map = {}; // { sportId: { teamId: pts } }
  for (const f of fixtures) {
    if (f.status !== 'completed' || !f.winner || f.winner === 'draw') continue;
    if (!map[f.sportId]) map[f.sportId] = {};
    const pts = SPORT_WIN_POINTS[f.sportId] ?? 0;
    const winners = Array.isArray(f.winner) ? f.winner : [f.winner];
    for (const teamId of winners) {
      map[f.sportId][teamId] = (map[f.sportId][teamId] || 0) + pts;
    }
  }
  return map;
}

function makeRow14(overrides = {}) {
  const row = new Array(14).fill('');
  Object.entries(overrides).forEach(([i, v]) => { row[i] = String(v ?? ''); });
  return row.join(',');
}

function buildStandardSportSection(sport, sportPts) {
  const { poolA, poolB, fixturesA = [], fixturesB = [] } = sport;
  const label = SPORT_SECTION_LABELS[sport.sportId] || sport.name;
  const lines = [
    `${label},Pool A,Current Score,Pool B,Current Score,,,Pool A Fixtures,,Pool B Fixtures,,Semis,,Finals`,
  ];

  // 7 data rows: rows 0-3 hold team data; rows 1-6 hold fixture data
  for (let i = 0; i < 7; i++) {
    const overrides = {};
    if (i < poolA.length) {
      overrides[1] = cap(poolA[i].teamId);
      const p = sportPts[poolA[i].teamId] || 0;
      if (p > 0) overrides[2] = p;
    }
    if (i < poolB.length) {
      overrides[3] = cap(poolB[i].teamId);
      const p = sportPts[poolB[i].teamId] || 0;
      if (p > 0) overrides[4] = p;
    }
    // Fixture data starts from row index 1 (offset -1)
    if (i >= 1) {
      const fi = i - 1; // 0-5
      if (fi < fixturesA.length) { overrides[6] = fi + 1; overrides[7] = fixturesA[fi]; }
      if (fi < fixturesB.length) { overrides[8] = fi + 7; overrides[9] = fixturesB[fi]; }
    }
    lines.push(makeRow14(overrides));
  }
  return lines.join('\n');
}

// Fixed team layout for women's cricket (matches the CSV the parser expects)
const WC_LEFT  = ['green', 'teal', 'yellow', 'purple'];
const WC_RIGHT = ['blue', 'red', 'brown', 'pink'];

function buildWomensCricketSection(sport, sportPts) {
  const fixtures = sport.combinedFixtures || [];
  const lines = ['Cricket womens,Current Score,,,Current Score,,,Clubbed teams,,,,,,'];
  const numRows = Math.max(WC_LEFT.length, fixtures.length); // typically 6

  for (let i = 0; i < numRows; i++) {
    const overrides = {};
    if (i < WC_LEFT.length) {
      overrides[1] = cap(WC_LEFT[i]);
      const lp = sportPts[WC_LEFT[i]] || 0;
      if (lp > 0) overrides[2] = lp;
      overrides[3] = cap(WC_RIGHT[i]);
      const rp = sportPts[WC_RIGHT[i]] || 0;
      if (rp > 0) overrides[4] = rp;
    }
    if (i < fixtures.length) overrides[7] = fixtures[i].label;
    lines.push(makeRow14(overrides));
  }
  return lines.join('\n');
}

const BLANK_SECTION_SEPARATOR = '\n,,,,,,,,,,,,,\n,,,,,,,,,,,,,\n';

/**
 * Build sports_wise_scores.csv from the current fixtures.
 * Uses SEED_SPORT_STANDINGS for the pool structure and fixture labels (static).
 * Points are recomputed from fixtures so they always reflect admin edits.
 */
export function buildSportsWiseScoresCSV(fixtures) {
  const sportPtsMap = computeSportPts(fixtures);
  const sections = SEED_SPORT_STANDINGS.map((sport) => {
    const sportPts = sportPtsMap[sport.sportId] || {};
    return sport.isCombined
      ? buildWomensCricketSection(sport, sportPts)
      : buildStandardSportSection(sport, sportPts);
  });
  return sections.join(BLANK_SECTION_SEPARATOR);
}

// ── Main entry point ───────────────────────────────────────────────────────────

/**
 * Commit all three CSV files to GitHub.
 * Commits are sequential (each needs a fresh SHA).
 * On any failure the function returns immediately with the error.
 *
 * @param {string}  pat        - GitHub Personal Access Token
 * @param {Array}   fixtures   - current fixtures array from DataContext
 * @param {Array}   leaderboard- current leaderboard array from DataContext
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function commitAdminChanges(pat, fixtures, leaderboard) {
  const winnersCSV    = buildWinnersListCSV(fixtures);
  const lbCSV         = buildLeaderboardCSV(leaderboard);
  const standingsCSV  = buildSportsWiseScoresCSV(fixtures);

  const r1 = await commitFileWithRetry(pat, FILE_PATHS.winnersList,    winnersCSV,   'Update winners_list.csv via Admin Panel');
  if (!r1.success) return r1;

  const r2 = await commitFileWithRetry(pat, FILE_PATHS.leaderboard,    lbCSV,        'Update leaderboard.csv via Admin Panel');
  if (!r2.success) return r2;

  const r3 = await commitFileWithRetry(pat, FILE_PATHS.sportStandings, standingsCSV, 'Update sports_wise_scores.csv via Admin Panel');
  return r3;
}
