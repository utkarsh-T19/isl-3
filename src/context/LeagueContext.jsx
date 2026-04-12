import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { FIXTURES, LEADERBOARD } from '../data/leagueData';
import { SPORT_WIN_POINTS } from '../data/constants';

const LeagueContext = createContext(null);

const UPDATE_MATCH_WINNER = 'UPDATE_MATCH_WINNER';

function adjustPoints(leaderboard, winner, sportId, delta) {
  if (!winner || winner === 'draw') return;
  const teams = Array.isArray(winner) ? winner : [winner];
  const pts = SPORT_WIN_POINTS[sportId] ?? 0;
  for (const teamId of teams) {
    const entry = leaderboard.find((e) => e.teamId === teamId);
    if (entry && entry.points[sportId] !== undefined) {
      entry.points[sportId] += pts * delta;
    }
  }
}

function leagueReducer(state, action) {
  switch (action.type) {
    case UPDATE_MATCH_WINNER: {
      const { fixtureId, winner } = action.payload;
      const newState = structuredClone(state);
      const fixture = newState.fixtures.find((f) => f.id === fixtureId);
      if (!fixture) return state;

      // Subtract points from previous winner if any
      if (fixture.winner) {
        adjustPoints(newState.leaderboard, fixture.winner, fixture.sportId, -1);
      }

      // Set new winner and status
      fixture.winner = winner;
      fixture.status = 'completed';

      // Add points for new winner (skip for draw)
      if (winner !== 'draw') {
        adjustPoints(newState.leaderboard, winner, fixture.sportId, 1);
      }

      return newState;
    }
    default:
      return state;
  }
}

function getInitialState() {
  return {
    fixtures: structuredClone(FIXTURES),
    leaderboard: structuredClone(LEADERBOARD),
  };
}

export function LeagueProvider({ children }) {
  const [state, dispatch] = useReducer(leagueReducer, null, getInitialState);

  const updateMatchWinner = useCallback(
    (fixtureId, winner) => {
      dispatch({ type: UPDATE_MATCH_WINNER, payload: { fixtureId, winner } });
    },
    [],
  );

  const value = {
    fixtures: state.fixtures,
    leaderboard: state.leaderboard,
    updateMatchWinner,
  };

  return (
    <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>
  );
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return ctx;
}
