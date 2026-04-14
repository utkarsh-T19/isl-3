/**
 * DataContext.jsx — Fetches the 5 CSVs from /data/*.csv, parses them,
 * and provides the results to the entire app.
 *
 * Fallback strategy (never breaks the UI):
 *   1. Try to fetch fresh CSV from /data/<file>.csv
 *   2. If fetch fails OR parsing returns null → use seed data from leagueData.js
 *   3. Each dataset is independent — one failure doesn't affect others
 *
 * Usage:
 *   const { leaderboard, fixtures, sportStandings, schedule, teamsRoster, loading, error } = useLeagueData();
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SPORT_WIN_POINTS } from '../data/constants';

// Static seed data (always available — used as fallback)
import {
  LEADERBOARD as SEED_LEADERBOARD,
  FIXTURES    as SEED_FIXTURES,
  SPORT_STANDINGS as SEED_SPORT_STANDINGS,
  SCHEDULE    as SEED_SCHEDULE,
  TEAMS_ROSTER as SEED_TEAMS_ROSTER,
  BRACKET,
} from '../data/leagueData';

import {
  parseLeaderboard,
  parseWinnersList,
  parseSportStandings,
  parseSchedule,
  parseTeamsRoster,
  mergeFixtures,
} from '../data/csvParser';

// ── CSV file manifest ──────────────────────────────────────────────────────────
const CSV_FILES = {
  leaderboard:    '/data/leaderboard.csv',
  winnersList:    '/data/winners_list.csv',
  sportStandings: '/data/sports_wise_scores.csv',
  schedule:       '/data/schedule_tentative.csv',
  teamsRoster:    '/data/sl_3.0_teams.csv',
};

// ── Context ────────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function DataProvider({ children }) {
  const [state, setState] = useState({
    leaderboard:    SEED_LEADERBOARD,
    fixtures:       SEED_FIXTURES,
    sportStandings: SEED_SPORT_STANDINGS,
    schedule:       SEED_SCHEDULE,
    teamsRoster:    SEED_TEAMS_ROSTER,
    bracket:        BRACKET,
    loading:        true,
    error:          null,
    lastUpdated:    null,
    dataSource:     'seed', // 'seed' | 'csv' | 'partial'
  });

  const fetchCSV = useCallback(async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'no-cache', // always get latest
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') throw new Error('Timeout after 10s');
      throw err;
    }
  }, []);

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const errors = [];
    const updates = {};
    let csvCount = 0;

    // ── 1. Leaderboard ───────────────────────────────────────────────────
    try {
      const text = await fetchCSV(CSV_FILES.leaderboard);
      const parsed = parseLeaderboard(text);
      if (parsed) { updates.leaderboard = parsed; csvCount++; }
      else errors.push('leaderboard.csv parsed as empty');
    } catch (e) {
      errors.push(`leaderboard.csv: ${e.message}`);
      console.warn('[DataContext] leaderboard fetch failed, using seed:', e.message);
    }

    // ── 2. Winners list → completed fixtures ─────────────────────────────
    try {
      const text = await fetchCSV(CSV_FILES.winnersList);
      const csvCompleted = parseWinnersList(text);
      // Always merge against the full static fixture list (which has upcoming matches)
      const merged = mergeFixtures(SEED_FIXTURES, csvCompleted);
      updates.fixtures = merged;
      if (csvCompleted) csvCount++;
    } catch (e) {
      errors.push(`winners_list.csv: ${e.message}`);
      console.warn('[DataContext] winners_list fetch failed, using seed:', e.message);
    }

    // ── 3. Sport standings ───────────────────────────────────────────────
    try {
      const text = await fetchCSV(CSV_FILES.sportStandings);
      const parsed = parseSportStandings(text);
      if (parsed) { updates.sportStandings = parsed; csvCount++; }
      else errors.push('sports_wise_scores.csv parsed as empty');
    } catch (e) {
      errors.push(`sports_wise_scores.csv: ${e.message}`);
      console.warn('[DataContext] sport_standings fetch failed, using seed:', e.message);
    }

    // ── 4. Schedule ──────────────────────────────────────────────────────
    try {
      const text = await fetchCSV(CSV_FILES.schedule);
      const parsed = parseSchedule(text);
      if (parsed) { updates.schedule = parsed; csvCount++; }
      else errors.push('schedule_tentative.csv parsed as empty');
    } catch (e) {
      errors.push(`schedule_tentative.csv: ${e.message}`);
      console.warn('[DataContext] schedule fetch failed, using seed:', e.message);
    }

    // ── 5. Teams roster ──────────────────────────────────────────────────
    try {
      const text = await fetchCSV(CSV_FILES.teamsRoster);
      const parsed = parseTeamsRoster(text);
      if (parsed) { updates.teamsRoster = parsed; csvCount++; }
      else errors.push('sl_3.0_teams.csv parsed as empty');
    } catch (e) {
      errors.push(`sl_3.0_teams.csv: ${e.message}`);
      console.warn('[DataContext] teams_roster fetch failed, using seed:', e.message);
    }

    const dataSource =
      csvCount === 5 ? 'csv' :
      csvCount === 0 ? 'seed' : 'partial';

    setState((prev) => ({
      ...prev,
      ...updates,
      loading:     false,
      error:       errors.length > 0 ? errors : null,
      lastUpdated: new Date().toISOString(),
      dataSource,
    }));
  }, [fetchCSV]);

  useEffect(() => { loadData(); }, [loadData]);

  /**
   * Optimistic in-memory update used by the Admin Panel.
   * Adjusts both fixtures and leaderboard so the UI reflects the change
   * immediately. Call reload() after a successful GitHub commit to sync
   * the UI from the freshly written CSVs.
   */
  const updateMatchWinner = useCallback((fixtureId, winner) => {
    setState((prev) => {
      const fixtureIdx = prev.fixtures.findIndex((f) => f.id === fixtureId);
      if (fixtureIdx === -1) return prev;

      const fixture = prev.fixtures[fixtureIdx];
      const oldWinner = fixture.winner;
      const { sportId } = fixture;
      const pts = SPORT_WIN_POINTS[sportId] ?? 0;

      // Clone fixtures — replace just the one entry
      const fixtures = prev.fixtures.map((f, i) =>
        i === fixtureIdx
          ? { ...f, winner, status: winner ? 'completed' : 'upcoming' }
          : f,
      );

      // Deep-clone leaderboard points so we can safely mutate
      const leaderboard = prev.leaderboard.map((e) => ({
        ...e,
        points: { ...e.points },
      }));

      const adjustPts = (winnerVal, delta) => {
        if (!winnerVal || winnerVal === 'draw') return;
        const teams = Array.isArray(winnerVal) ? winnerVal : [winnerVal];
        teams.forEach((teamId) => {
          const entry = leaderboard.find((e) => e.teamId === teamId);
          if (entry && entry.points[sportId] !== undefined) {
            entry.points[sportId] = Math.max(0, entry.points[sportId] + pts * delta);
          }
        });
      };

      adjustPts(oldWinner, -1); // subtract old
      adjustPts(winner, +1);    // add new

      return { ...prev, fixtures, leaderboard };
    });
  }, []);

  const contextValue = {
    ...state,
    reload: loadData,
    updateMatchWinner,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useLeagueData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useLeagueData must be used inside <DataProvider>');
  return ctx;
}

export { BRACKET }; // re-export for convenience
