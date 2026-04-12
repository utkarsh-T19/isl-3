// ─── GitHub API Configuration ─────────────────────────────────────────────────
// Set these to your GitHub repository details before using the admin panel.
const REPO_OWNER = 'utkarsh-T19';
const REPO_NAME = 'isl-3';
const FILE_PATH = 'src/data/leagueData.js';
const BRANCH = 'main';
const API_BASE = 'https://api.github.com';

/**
 * Fetches the current leagueData.js content + SHA from GitHub.
 * @param {string} pat - GitHub Personal Access Token
 * @returns {Promise<{ content: string, sha: string }>}
 */
export async function fetchLeagueFile(pat) {
  try {
    const res = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${pat}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    if (res.status === 401) {
      return { success: false, message: 'Invalid token — please re-enter your GitHub PAT.' };
    }
    if (res.status >= 500) {
      return { success: false, message: `GitHub server error (${res.status}). Try again later.` };
    }
    if (!res.ok) {
      return { success: false, message: `Failed to fetch file (HTTP ${res.status}).` };
    }

    const data = await res.json();
    const content = atob(data.content.replace(/\n/g, ''));
    return { success: true, content, sha: data.sha };
  } catch (err) {
    return { success: false, message: `Network error — check your connection. (${err.message})` };
  }
}

/**
 * Serializes a JavaScript value into a formatted string that matches
 * the code style used in leagueData.js.
 */
function serializeValue(value, indent = 2) {
  const pad = ' '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    // Array of primitives (e.g. team ID arrays like ['green', 'teal'])
    if (value.every((v) => typeof v === 'string')) {
      return `[${value.map((v) => `'${v}'`).join(', ')}]`;
    }
    // Array of objects
    const items = value.map((item) => `${pad}${serializeObject(item, indent)}`);
    return `[\n${items.join(',\n')},\n${' '.repeat(indent - 2)}]`;
  }

  return serializeObject(value, indent);
}

/**
 * Serializes a plain object into a single-line or multi-line JS object literal.
 */
function serializeObject(obj, indent = 2) {
  const entries = Object.entries(obj);
  const parts = entries.map(([key, val]) => `${key}: ${serializeValue(val, indent + 2)}`);
  // Keep fixture objects on a single line for readability (matches existing style)
  const oneLine = `{ ${parts.join(', ')} }`;
  if (oneLine.length <= 200) return oneLine;
  const pad = ' '.repeat(indent);
  return `{\n${parts.map((p) => `${pad}  ${p}`).join(',\n')},\n${pad}}`;
}

/**
 * Serializes the LEADERBOARD array into a JS source string matching the
 * existing code style in leagueData.js.
 */
function serializeLeaderboard(leaderboard) {
  const entries = leaderboard.map((entry) => {
    const pointEntries = Object.entries(entry.points)
      .map(([sport, pts]) => `${sport}: ${pts}`)
      .join(', ');
    return [
      '  {',
      `    teamId: '${entry.teamId}',`,
      '    points: {',
      `      ${pointEntries},`,
      '    },',
      '  }',
    ].join('\n');
  });
  return `[\n${entries.join(',\n')},\n]`;
}

/**
 * Serializes the FIXTURES array into a JS source string matching the
 * existing code style in leagueData.js.
 */
function serializeFixtures(fixtures) {
  const lines = fixtures.map((f) => {
    const parts = [
      `id: '${f.id}'`,
      `sportId: '${f.sportId}'`,
      `team1Id: ${serializeValue(f.team1Id)}`,
      `team2Id: ${serializeValue(f.team2Id)}`,
      `date: '${f.date}'`,
      `status: '${f.status}'`,
      `winner: ${serializeValue(f.winner)}`,
    ];
    return `  { ${parts.join(', ')} }`;
  });
  return `[\n${lines.join(',\n')},\n]`;
}

/**
 * Replaces the LEADERBOARD and FIXTURES export blocks in the file content
 * with freshly serialized versions, preserving all other exports unchanged.
 */
function replaceExportBlocks(fileContent, fixtures, leaderboard) {
  // Replace LEADERBOARD block:
  // Matches from "export const LEADERBOARD = [" to the closing "];"
  let updated = fileContent.replace(
    /export const LEADERBOARD = \[[\s\S]*?\n\];/,
    `export const LEADERBOARD = ${serializeLeaderboard(leaderboard)};`,
  );

  // Replace FIXTURES block:
  // Matches from "export const FIXTURES = [" to the closing "];"
  updated = updated.replace(
    /export const FIXTURES = \[[\s\S]*?\n\];/,
    `export const FIXTURES = ${serializeFixtures(fixtures)};`,
  );

  return updated;
}

/**
 * Commits updated FIXTURES and LEADERBOARD to leagueData.js.
 * Preserves SCHEDULE, TEAMS_ROSTER, SPORT_STANDINGS, BRACKET unchanged.
 * @param {string} pat - GitHub Personal Access Token
 * @param {string} sha - current file SHA (from fetchLeagueFile)
 * @param {Array} fixtures - updated fixtures array
 * @param {Array} leaderboard - updated leaderboard array
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function commitLeagueFile(pat, sha, fixtures, leaderboard) {
  try {
    // First fetch the current file content so we can do a targeted replacement
    const fetchResult = await fetchLeagueFile(pat);
    if (!fetchResult.success) return fetchResult;

    const updatedContent = replaceExportBlocks(fetchResult.content, fixtures, leaderboard);
    const encodedContent = btoa(unescape(encodeURIComponent(updatedContent)));

    const res = await fetch(
      `${API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${pat}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update scores via Admin Panel',
          content: encodedContent,
          sha,
          branch: BRANCH,
        }),
      },
    );

    if (res.status === 401) {
      return { success: false, message: 'Invalid token — please re-enter your GitHub PAT.' };
    }
    if (res.status === 409) {
      return { success: false, message: 'Conflict — the file was modified since you last fetched it. Please retry.' };
    }
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      return { success: false, message: `Validation error: ${body.message || 'unprocessable entity'}.` };
    }
    if (res.status >= 500) {
      return { success: false, message: `GitHub server error (${res.status}). Try again later.` };
    }
    if (!res.ok) {
      return { success: false, message: `Commit failed (HTTP ${res.status}).` };
    }

    return { success: true, message: 'Commit successful — GitHub Pages deployment pending.' };
  } catch (err) {
    return { success: false, message: `Network error — check your connection. (${err.message})` };
  }
}
