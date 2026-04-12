// ─── LEADERBOARD ────────────────────────────────────────────────────────────
// Source: leaderboard.csv (manually maintained; totals auto-computed by the app)
export const LEADERBOARD = [
  {
    teamId: 'yellow',
    points: {
      football: 0, mens_cricket: 0, womens_cricket: 5,
      table_tennis: 5, chess: 10, pickleball: 0, carrom: 5, foosball: 0,
      dance: 0, house_branding: 0, cringe_recreation: 5, shades_of_glory: 1, trivia: 4,
    },
  },
  {
    teamId: 'red',
    points: {
      football: 10, mens_cricket: 20, womens_cricket: 5,
      table_tennis: 15, chess: 5, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 0, cringe_recreation: 0, shades_of_glory: 0, trivia: 4,
    },
  },
  {
    teamId: 'green',
    points: {
      football: 20, mens_cricket: 10, womens_cricket: 0,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 7, shades_of_glory: 0, trivia: 4,
    },
  },
  {
    teamId: 'blue',
    points: {
      football: 0, mens_cricket: 10, womens_cricket: 5,
      table_tennis: 5, chess: 0, pickleball: 0, carrom: 10, foosball: 0,
      dance: 2, house_branding: 4, cringe_recreation: 9, shades_of_glory: 0, trivia: 7,
    },
  },
  {
    teamId: 'pink',
    points: {
      football: 10, mens_cricket: 10, womens_cricket: 10,
      table_tennis: 5, chess: 5, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 4, shades_of_glory: 5, trivia: 11,
    },
  },
  {
    teamId: 'teal',
    points: {
      football: 20, mens_cricket: 0, womens_cricket: 0,
      table_tennis: 10, chess: 10, pickleball: 0, carrom: 5, foosball: 0,
      dance: 0, house_branding: 5, cringe_recreation: 6, shades_of_glory: 0, trivia: 8,
    },
  },
  {
    teamId: 'brown',
    points: {
      football: 10, mens_cricket: 0, womens_cricket: 10,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 5, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 8, shades_of_glory: 3, trivia: 11,
    },
  },
  {
    teamId: 'purple',
    points: {
      football: 10, mens_cricket: 10, womens_cricket: 5,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 5, foosball: 0,
      dance: 2, house_branding: 0, cringe_recreation: 8, shades_of_glory: 0, trivia: 1,
    },
  },
];

// ─── FIXTURES ────────────────────────────────────────────────────────────────
// Source: winners_list.csv (completed) + schedule_tentative.csv (upcoming)
export const FIXTURES = [
  // ── Mar 30 ──────────────────────────────────────────────
  { id: 'mens_cricket-1', sportId: 'mens_cricket', team1Id: 'red', team2Id: 'pink', date: '2026-03-30T13:30:00Z', status: 'completed', winner: 'red' },
  { id: 'mens_cricket-2', sportId: 'mens_cricket', team1Id: 'blue', team2Id: 'teal', date: '2026-03-30T14:00:00Z', status: 'completed', winner: 'blue' },
  { id: 'womens_cricket-1', sportId: 'womens_cricket', team1Id: ['green', 'teal'], team2Id: ['yellow', 'purple'], date: '2026-03-30T14:30:00Z', status: 'completed', winner: ['yellow', 'purple'] },

  // ── Apr 1 ───────────────────────────────────────────────
  { id: 'womens_cricket-2', sportId: 'womens_cricket', team1Id: ['green', 'teal'], team2Id: ['blue', 'red'], date: '2026-04-01T13:30:00Z', status: 'completed', winner: ['blue', 'red'] },
  { id: 'football-1', sportId: 'football', team1Id: 'red', team2Id: 'yellow', date: '2026-04-01T14:00:00Z', status: 'completed', winner: 'red' },
  { id: 'football-2', sportId: 'football', team1Id: 'green', team2Id: 'purple', date: '2026-04-01T14:30:00Z', status: 'completed', winner: 'green' },
  { id: 'football-3', sportId: 'football', team1Id: 'blue', team2Id: 'pink', date: '2026-04-01T15:00:00Z', status: 'completed', winner: 'pink' },
  { id: 'football-4', sportId: 'football', team1Id: 'teal', team2Id: 'brown', date: '2026-04-01T15:30:00Z', status: 'completed', winner: 'teal' },

  // ── Apr 6 ───────────────────────────────────────────────
  { id: 'carrom-1', sportId: 'carrom', team1Id: 'teal', team2Id: 'pink', date: '2026-04-06T12:00:00Z', status: 'completed', winner: 'teal' },
  { id: 'carrom-2', sportId: 'carrom', team1Id: 'red', team2Id: 'brown', date: '2026-04-06T12:10:00Z', status: 'completed', winner: 'brown' },
  { id: 'carrom-3', sportId: 'carrom', team1Id: 'blue', team2Id: 'brown', date: '2026-04-06T12:20:00Z', status: 'completed', winner: 'blue' },
  { id: 'carrom-4', sportId: 'carrom', team1Id: 'blue', team2Id: 'green', date: '2026-04-06T12:30:00Z', status: 'completed', winner: 'blue' },
  { id: 'carrom-5', sportId: 'carrom', team1Id: 'purple', team2Id: 'yellow', date: '2026-04-06T12:40:00Z', status: 'completed', winner: 'yellow' },
  { id: 'carrom-6', sportId: 'carrom', team1Id: 'purple', team2Id: 'pink', date: '2026-04-06T12:50:00Z', status: 'completed', winner: 'purple' },

  // ── Apr 7 ───────────────────────────────────────────────
  { id: 'womens_cricket-3', sportId: 'womens_cricket', team1Id: ['green', 'teal'], team2Id: ['brown', 'pink'], date: '2026-04-07T13:30:00Z', status: 'completed', winner: ['brown', 'pink'] },
  { id: 'mens_cricket-3', sportId: 'mens_cricket', team1Id: 'blue', team2Id: 'pink', date: '2026-04-07T14:00:00Z', status: 'completed', winner: 'pink' },
  { id: 'womens_cricket-4', sportId: 'womens_cricket', team1Id: ['blue', 'red'], team2Id: ['brown', 'pink'], date: '2026-04-07T14:30:00Z', status: 'completed', winner: ['brown', 'pink'] },
  { id: 'mens_cricket-4', sportId: 'mens_cricket', team1Id: 'red', team2Id: 'teal', date: '2026-04-07T15:00:00Z', status: 'completed', winner: 'red' },
  { id: 'mens_cricket-5', sportId: 'mens_cricket', team1Id: 'purple', team2Id: 'brown', date: '2026-04-07T15:30:00Z', status: 'completed', winner: 'purple' },

  // ── Apr 8 ───────────────────────────────────────────────
  { id: 'chess-1', sportId: 'chess', team1Id: 'pink', team2Id: 'red', date: '2026-04-08T12:00:00Z', status: 'completed', winner: 'pink' },
  { id: 'chess-2', sportId: 'chess', team1Id: 'yellow', team2Id: 'brown', date: '2026-04-08T12:10:00Z', status: 'completed', winner: 'yellow' },
  { id: 'chess-3', sportId: 'chess', team1Id: 'yellow', team2Id: 'red', date: '2026-04-08T12:20:00Z', status: 'completed', winner: 'yellow' },
  { id: 'chess-4', sportId: 'chess', team1Id: 'teal', team2Id: 'purple', date: '2026-04-08T12:30:00Z', status: 'completed', winner: 'teal' },
  { id: 'chess-5', sportId: 'chess', team1Id: 'brown', team2Id: 'red', date: '2026-04-08T12:40:00Z', status: 'completed', winner: 'red' },
  { id: 'chess-6', sportId: 'chess', team1Id: 'green', team2Id: 'teal', date: '2026-04-08T12:50:00Z', status: 'completed', winner: 'teal' },

  // ── Apr 9 ───────────────────────────────────────────────
  { id: 'mens_cricket-6', sportId: 'mens_cricket', team1Id: 'yellow', team2Id: 'green', date: '2026-04-09T13:30:00Z', status: 'completed', winner: 'green' },
  { id: 'football-5', sportId: 'football', team1Id: 'red', team2Id: 'green', date: '2026-04-09T14:00:00Z', status: 'completed', winner: 'green' },
  { id: 'football-6', sportId: 'football', team1Id: 'yellow', team2Id: 'purple', date: '2026-04-09T14:30:00Z', status: 'completed', winner: 'purple' },
  { id: 'football-7', sportId: 'football', team1Id: 'blue', team2Id: 'teal', date: '2026-04-09T15:00:00Z', status: 'completed', winner: 'teal' },
  { id: 'football-8', sportId: 'football', team1Id: 'pink', team2Id: 'brown', date: '2026-04-09T15:30:00Z', status: 'completed', winner: 'brown' },

  // ── Apr 10 ──────────────────────────────────────────────
  { id: 'table_tennis-1', sportId: 'table_tennis', team1Id: 'yellow', team2Id: 'teal', date: '2026-04-10T12:00:00Z', status: 'completed', winner: 'teal' },
  { id: 'table_tennis-2', sportId: 'table_tennis', team1Id: 'pink', team2Id: 'brown', date: '2026-04-10T12:10:00Z', status: 'completed', winner: 'pink' },
  { id: 'table_tennis-3', sportId: 'table_tennis', team1Id: 'green', team2Id: 'red', date: '2026-04-10T12:20:00Z', status: 'completed', winner: 'red' },
  { id: 'table_tennis-4', sportId: 'table_tennis', team1Id: 'blue', team2Id: 'purple', date: '2026-04-10T12:30:00Z', status: 'completed', winner: 'blue' },
  { id: 'table_tennis-5', sportId: 'table_tennis', team1Id: 'yellow', team2Id: 'brown', date: '2026-04-10T12:40:00Z', status: 'completed', winner: 'yellow' },
  { id: 'table_tennis-6', sportId: 'table_tennis', team1Id: 'purple', team2Id: 'red', date: '2026-04-10T12:50:00Z', status: 'completed', winner: 'red' },
  { id: 'table_tennis-7', sportId: 'table_tennis', team1Id: 'pink', team2Id: 'teal', date: '2026-04-10T13:00:00Z', status: 'completed', winner: 'teal' },
  { id: 'table_tennis-8', sportId: 'table_tennis', team1Id: 'blue', team2Id: 'red', date: '2026-04-10T13:10:00Z', status: 'completed', winner: 'red' },

  // ── Apr 13 (Upcoming) ────────────────────────────────────
  { id: 'mens_cricket-7', sportId: 'mens_cricket', team1Id: 'brown', team2Id: 'green', date: '2026-04-13T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'mens_cricket-8', sportId: 'mens_cricket', team1Id: 'pink', team2Id: 'teal', date: '2026-04-13T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'mens_cricket-9', sportId: 'mens_cricket', team1Id: 'red', team2Id: 'blue', date: '2026-04-13T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'mens_cricket-10', sportId: 'mens_cricket', team1Id: 'yellow', team2Id: 'purple', date: '2026-04-13T15:00:00Z', status: 'upcoming', winner: null },
  { id: 'womens_cricket-5', sportId: 'womens_cricket', team1Id: ['yellow', 'purple'], team2Id: ['brown', 'pink'], date: '2026-04-13T15:30:00Z', status: 'upcoming', winner: null },

  // ── Apr 14 (Upcoming) ────────────────────────────────────
  { id: 'table_tennis-9', sportId: 'table_tennis', team1Id: 'green', team2Id: 'blue', date: '2026-04-14T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'table_tennis-10', sportId: 'table_tennis', team1Id: 'pink', team2Id: 'yellow', date: '2026-04-14T12:30:00Z', status: 'upcoming', winner: null },
  { id: 'table_tennis-11', sportId: 'table_tennis', team1Id: 'teal', team2Id: 'brown', date: '2026-04-14T13:00:00Z', status: 'upcoming', winner: null },
  { id: 'table_tennis-12', sportId: 'table_tennis', team1Id: 'green', team2Id: 'purple', date: '2026-04-14T13:30:00Z', status: 'upcoming', winner: null },

  // ── Apr 15 (Upcoming) ────────────────────────────────────
  { id: 'pickleball-1', sportId: 'pickleball', team1Id: 'brown', team2Id: 'teal', date: '2026-04-15T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-2', sportId: 'pickleball', team1Id: 'blue', team2Id: 'yellow', date: '2026-04-15T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-3', sportId: 'pickleball', team1Id: 'red', team2Id: 'pink', date: '2026-04-15T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-4', sportId: 'pickleball', team1Id: 'green', team2Id: 'purple', date: '2026-04-15T15:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-5', sportId: 'pickleball', team1Id: 'blue', team2Id: 'teal', date: '2026-04-15T15:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-6', sportId: 'pickleball', team1Id: 'red', team2Id: 'purple', date: '2026-04-15T16:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-7', sportId: 'pickleball', team1Id: 'yellow', team2Id: 'brown', date: '2026-04-15T16:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-8', sportId: 'pickleball', team1Id: 'pink', team2Id: 'green', date: '2026-04-15T17:00:00Z', status: 'upcoming', winner: null },

  // ── Apr 16 (Upcoming) ────────────────────────────────────
  { id: 'chess-7', sportId: 'chess', team1Id: 'pink', team2Id: 'yellow', date: '2026-04-16T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'chess-8', sportId: 'chess', team1Id: 'blue', team2Id: 'green', date: '2026-04-16T12:20:00Z', status: 'upcoming', winner: null },
  { id: 'chess-9', sportId: 'chess', team1Id: 'blue', team2Id: 'purple', date: '2026-04-16T12:40:00Z', status: 'upcoming', winner: null },
  { id: 'chess-10', sportId: 'chess', team1Id: 'pink', team2Id: 'brown', date: '2026-04-16T13:00:00Z', status: 'upcoming', winner: null },
  { id: 'chess-11', sportId: 'chess', team1Id: 'blue', team2Id: 'teal', date: '2026-04-16T13:20:00Z', status: 'upcoming', winner: null },
  { id: 'chess-12', sportId: 'chess', team1Id: 'green', team2Id: 'purple', date: '2026-04-16T13:40:00Z', status: 'upcoming', winner: null },

  // ── Apr 17 (Upcoming) ────────────────────────────────────
  { id: 'pickleball-9', sportId: 'pickleball', team1Id: 'blue', team2Id: 'teal', date: '2026-04-17T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-10', sportId: 'pickleball', team1Id: 'red', team2Id: 'purple', date: '2026-04-17T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-11', sportId: 'pickleball', team1Id: 'yellow', team2Id: 'brown', date: '2026-04-17T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-12', sportId: 'pickleball', team1Id: 'pink', team2Id: 'green', date: '2026-04-17T15:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-13', sportId: 'pickleball', team1Id: 'blue', team2Id: 'brown', date: '2026-04-17T15:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-14', sportId: 'pickleball', team1Id: 'yellow', team2Id: 'teal', date: '2026-04-17T16:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-15', sportId: 'pickleball', team1Id: 'red', team2Id: 'green', date: '2026-04-17T16:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-16', sportId: 'pickleball', team1Id: 'pink', team2Id: 'purple', date: '2026-04-17T17:00:00Z', status: 'upcoming', winner: null },

  // ── Apr 20 (Upcoming) ────────────────────────────────────
  { id: 'mens_cricket-11', sportId: 'mens_cricket', team1Id: 'yellow', team2Id: 'brown', date: '2026-04-20T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'mens_cricket-12', sportId: 'mens_cricket', team1Id: 'purple', team2Id: 'green', date: '2026-04-20T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'womens_cricket-6', sportId: 'womens_cricket', team1Id: ['yellow', 'purple'], team2Id: ['blue', 'red'], date: '2026-04-20T14:30:00Z', status: 'upcoming', winner: null },

  // ── Apr 21 (Upcoming) ────────────────────────────────────
  { id: 'carrom-7', sportId: 'carrom', team1Id: 'teal', team2Id: 'purple', date: '2026-04-21T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-8', sportId: 'carrom', team1Id: 'yellow', team2Id: 'pink', date: '2026-04-21T12:15:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-9', sportId: 'carrom', team1Id: 'teal', team2Id: 'yellow', date: '2026-04-21T12:30:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-10', sportId: 'carrom', team1Id: 'red', team2Id: 'blue', date: '2026-04-21T12:45:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-11', sportId: 'carrom', team1Id: 'green', team2Id: 'brown', date: '2026-04-21T13:00:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-12', sportId: 'carrom', team1Id: 'red', team2Id: 'green', date: '2026-04-21T13:15:00Z', status: 'upcoming', winner: null },

  // ── Apr 22 (Upcoming) ────────────────────────────────────
  { id: 'pickleball-17', sportId: 'pickleball', team1Id: 'blue', team2Id: 'brown', date: '2026-04-22T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-18', sportId: 'pickleball', team1Id: 'yellow', team2Id: 'teal', date: '2026-04-22T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-19', sportId: 'pickleball', team1Id: 'red', team2Id: 'green', date: '2026-04-22T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-20', sportId: 'pickleball', team1Id: 'pink', team2Id: 'purple', date: '2026-04-22T15:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-21', sportId: 'pickleball', team1Id: 'blue', team2Id: 'yellow', date: '2026-04-22T15:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-22', sportId: 'pickleball', team1Id: 'brown', team2Id: 'teal', date: '2026-04-22T16:00:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-23', sportId: 'pickleball', team1Id: 'red', team2Id: 'pink', date: '2026-04-22T16:30:00Z', status: 'upcoming', winner: null },
  { id: 'pickleball-24', sportId: 'pickleball', team1Id: 'green', team2Id: 'purple', date: '2026-04-22T17:00:00Z', status: 'upcoming', winner: null },

  // ── Apr 23 (Upcoming) ────────────────────────────────────
  { id: 'foosball-1', sportId: 'foosball', team1Id: 'brown', team2Id: 'red', date: '2026-04-23T11:30:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-2', sportId: 'foosball', team1Id: 'brown', team2Id: 'yellow', date: '2026-04-23T11:45:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-3', sportId: 'foosball', team1Id: 'blue', team2Id: 'purple', date: '2026-04-23T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-4', sportId: 'foosball', team1Id: 'pink', team2Id: 'green', date: '2026-04-23T12:15:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-5', sportId: 'foosball', team1Id: 'pink', team2Id: 'purple', date: '2026-04-23T12:30:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-6', sportId: 'foosball', team1Id: 'green', team2Id: 'purple', date: '2026-04-23T12:45:00Z', status: 'upcoming', winner: null },

  // ── Apr 24 (Upcoming) ────────────────────────────────────
  { id: 'football-9', sportId: 'football', team1Id: 'blue', team2Id: 'brown', date: '2026-04-24T13:30:00Z', status: 'upcoming', winner: null },
  { id: 'football-10', sportId: 'football', team1Id: 'red', team2Id: 'purple', date: '2026-04-24T14:00:00Z', status: 'upcoming', winner: null },
  { id: 'football-11', sportId: 'football', team1Id: 'yellow', team2Id: 'green', date: '2026-04-24T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'football-12', sportId: 'football', team1Id: 'pink', team2Id: 'teal', date: '2026-04-24T15:00:00Z', status: 'upcoming', winner: null },

  // ── Apr 28 (Upcoming) ────────────────────────────────────
  { id: 'foosball-7', sportId: 'foosball', team1Id: 'brown', team2Id: 'teal', date: '2026-04-28T11:30:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-8', sportId: 'foosball', team1Id: 'red', team2Id: 'yellow', date: '2026-04-28T11:45:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-9', sportId: 'foosball', team1Id: 'red', team2Id: 'teal', date: '2026-04-28T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-10', sportId: 'foosball', team1Id: 'yellow', team2Id: 'teal', date: '2026-04-28T12:15:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-11', sportId: 'foosball', team1Id: 'blue', team2Id: 'pink', date: '2026-04-28T12:30:00Z', status: 'upcoming', winner: null },
  { id: 'foosball-12', sportId: 'foosball', team1Id: 'blue', team2Id: 'green', date: '2026-04-28T12:45:00Z', status: 'upcoming', winner: null },
];

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
// Source: schedule_tentative.csv — day-by-day calendar for the Schedule page
export const SCHEDULE = [
  { date: '2026-03-30', dayLabel: 'Mon, Mar 30', time: '6 – 9 PM', title: "Opening Ceremony + Men's Cricket + Women's Cricket", location: 'Turf', type: 'outdoor', sports: ['mens_cricket', 'womens_cricket'], isSpecial: true },
  { date: '2026-04-01', dayLabel: 'Wed, Apr 1',  time: '7 – 9:30 PM', title: "Women's Cricket + Football Qualifiers", location: 'Turf', type: 'outdoor', sports: ['womens_cricket', 'football'] },
  { date: '2026-04-02', dayLabel: 'Thu, Apr 2',  time: '—', title: 'Maundy Thursday', location: '—', type: 'holiday', sports: [] },
  { date: '2026-04-03', dayLabel: 'Fri, Apr 3',  time: '—', title: 'Floater', location: '—', type: 'holiday', sports: [] },
  { date: '2026-04-06', dayLabel: 'Mon, Apr 6',  time: '5:30 – 7:30 PM', title: 'Carrom Qualifiers', location: 'Training Room', type: 'indoor', sports: ['carrom'] },
  { date: '2026-04-07', dayLabel: 'Tue, Apr 7',  time: '7 – 9:30 PM', title: "Men's Cricket + Women's Cricket Qualifiers", location: 'Turf', type: 'outdoor', sports: ['mens_cricket', 'womens_cricket'] },
  { date: '2026-04-08', dayLabel: 'Wed, Apr 8',  time: '5:30 – 7:30 PM', title: 'Chess Qualifiers', location: 'Office', type: 'indoor', sports: ['chess'] },
  { date: '2026-04-09', dayLabel: 'Thu, Apr 9',  time: '6:45 – 10 PM', title: "Men's Cricket + Football Qualifiers", location: 'Turf', type: 'outdoor', sports: ['mens_cricket', 'football'] },
  { date: '2026-04-10', dayLabel: 'Fri, Apr 10', time: '5:30 – 7:30 PM', title: 'Table Tennis Qualifiers', location: 'Office', type: 'indoor', sports: ['table_tennis'] },
  { date: '2026-04-13', dayLabel: 'Mon, Apr 13', time: '7 – 9:30 PM', title: "Men's Cricket + Women's Cricket Qualifiers", location: 'Turf', type: 'outdoor', sports: ['mens_cricket', 'womens_cricket'] },
  { date: '2026-04-14', dayLabel: 'Tue, Apr 14', time: '5:30 – 8:30 PM', title: 'Table Tennis Qualifiers', location: 'Office', type: 'indoor', sports: ['table_tennis'] },
  { date: '2026-04-15', dayLabel: 'Wed, Apr 15', time: '7 – 9:30 PM', title: "Men's + Women's Pickleball Qualifiers", location: 'Court', type: 'outdoor', sports: ['pickleball'] },
  { date: '2026-04-16', dayLabel: 'Thu, Apr 16', time: '5:30 – 8:30 PM', title: 'Chess Qualifiers', location: 'Training Room', type: 'indoor', sports: ['chess'] },
  { date: '2026-04-17', dayLabel: 'Fri, Apr 17', time: '7 – 9:30 PM', title: "Men's + Women's Pickleball Qualifiers", location: 'Court', type: 'outdoor', sports: ['pickleball'] },
  { date: '2026-04-20', dayLabel: 'Mon, Apr 20', time: '7 – 9:30 PM', title: "Men's Cricket + Women's Cricket Qualifiers", location: 'Turf', type: 'outdoor', sports: ['mens_cricket', 'womens_cricket'] },
  { date: '2026-04-21', dayLabel: 'Tue, Apr 21', time: '5:30 – 7:30 PM', title: 'Carrom Qualifiers', location: 'Office', type: 'indoor', sports: ['carrom'] },
  { date: '2026-04-22', dayLabel: 'Wed, Apr 22', time: '7 – 9:30 PM', title: "Men's + Women's Pickleball Qualifiers", location: 'Court', type: 'outdoor', sports: ['pickleball'] },
  { date: '2026-04-23', dayLabel: 'Thu, Apr 23', time: '5 – 8:30 PM', title: 'Foosball Qualifiers', location: 'Office', type: 'indoor', sports: ['foosball'] },
  { date: '2026-04-24', dayLabel: 'Fri, Apr 24', time: '7 – 9:30 PM', title: 'Football Qualifiers', location: 'Turf', type: 'outdoor', sports: ['football'] },
  { date: '2026-04-27', dayLabel: 'Mon, Apr 27', time: '7 – 9:30 PM', title: 'Cricket Semi Finals', location: 'Turf', type: 'outdoor', sports: ['mens_cricket'], isSemiFinal: true },
  { date: '2026-04-28', dayLabel: 'Tue, Apr 28', time: '5 – 8:30 PM', title: 'Foosball Qualifiers', location: 'Office', type: 'indoor', sports: ['foosball'] },
  { date: '2026-04-29', dayLabel: 'Wed, Apr 29', time: '7 – 9:30 PM', title: 'Football Semi Finals', location: 'Turf', type: 'outdoor', sports: ['football'], isSemiFinal: true },
  { date: '2026-04-30', dayLabel: 'Thu, Apr 30', time: '5:30 – 7:30 PM', title: 'Indoor Semi Finals', location: 'Office', type: 'indoor', isSemiFinal: true, sports: [] },
  { date: '2026-05-04', dayLabel: 'Mon, May 4',  time: '7 – 9:30 PM', title: "Pickleball Semis + Finals", location: 'Court', type: 'outdoor', sports: ['pickleball'], isFinal: true },
  { date: '2026-05-05', dayLabel: 'Tue, May 5',  time: '5:30 – 7:30 PM', title: 'Indoor Semi Finals', location: 'Office', type: 'indoor', isSemiFinal: true, sports: [] },
  { date: '2026-05-06', dayLabel: 'Wed, May 6',  time: '5:30 – 7:30 PM', title: 'Indoor Finals', location: 'Office', type: 'indoor', isFinal: true, sports: [] },
  { date: '2026-05-07', dayLabel: 'Thu, May 7',  time: '7 – 9 PM', title: '🏆 SPORTS LEAGUE FINALS — Cricket + Football', location: 'Turf', type: 'outdoor', isFinal: true, isSpecial: true, sports: ['mens_cricket', 'womens_cricket', 'football'] },
];

// ─── TEAMS ROSTER ─────────────────────────────────────────────────────────────
// Source: sl_3.0_teams.csv
export const TEAMS_ROSTER = {
  red: {
    size: 35,
    captains: ['Harsh Salian', 'Manish Waghela'],
    members: ['Thomas Nedumthadathil', 'Nitesh Singh', 'Anmol Singh', 'Naman Kumar', 'Supriya Gupta', 'Yash Patel', 'Isha Yadav', 'Raj Menda', 'Nasim Shaikh', 'Raj Parmar', 'Pratham Shinde', 'Sakshi Dhenge', 'Rachana Mohanty', 'Sachin Balganeshan', 'Puja Deshpande', 'Abhishek Naphade', 'Prakhar Chawla', 'Arfat Kuraye', 'Aaftab Siddiqui', 'Aditi Kulkarni', 'Yash Mahajan', 'Nitin Lalge', 'Aarya Lotke', 'Zephaniah Perumalla', 'Rohit Shetty', 'Moshin Qureshi', 'Ashpak Inamdar', 'Aastha Jha', 'Palash Mahajan', 'Naman Gupta', 'Hrishikesh Bihani', 'Abhishek Naik', 'Saanvi Vinayak Bijgarnikar', 'Shayanne Hill'],
  },
  blue: {
    size: 35,
    captains: ['Fatima Sayyed', 'Surya Ganesh'],
    members: ['Parveen Patel', 'Shruti Patel', 'Priyanka Patil', 'Dheepanshu Sukhija', 'Anas Chaudhary', 'Sharman Mohite', 'Brahma Bhantu', 'Prakarsh Paritosh', 'Rakesh Lakshminarayan', 'Nirav Patel', 'Hukum Solanki', 'Shalin Bhansali', 'Manoj Pasi', 'Tanveerul Ansari', 'Lalita Mandora', 'Yogesh Maheshwari', 'Sneha Bisht', 'Vipul Jain', 'Karthik Gogisetty', 'Jogendrakumar Dhobi', 'Selwyn Dias', 'Mohit Agarwal', 'Shivam Singh', 'Mohammed Ammar Shaikh', 'Sajan Kale', 'Aditi Dulgaj', 'Afzal Juwari', 'Upayan Dutta', 'Shoeb Shaikh', 'Paritosh Desai', 'Abhay Mahto', 'Rishabh Mehra', 'Manish Yadav', 'Sahil Birmole'],
  },
  green: {
    size: 35,
    captains: ['Aarish Makandar', 'Netra Gorre'],
    members: ['Kiran Pawar', 'Hrishikesh Parab', 'Yunus Shaikh', 'Shivam Bangia', 'Udayraj Sawant', 'Sneha Gaikwad', 'Trishka Khanna', 'Tanvi Kalantre', 'Vishal Nishad', 'Arbaz Shaikh', 'Roshan Ram', 'Supriti Patra', 'Zahera Khan', 'Priyanka Singh', 'Akash Kumar', 'Aditya Ranjan', 'Anas Mohiuddin', 'Pavan Gupta', 'Deepak Sahu', 'Rahul Vara', 'Abdulrahim Shaikh', 'Aamir Chouhan', 'Juhi Gupta', 'Max Lobo', 'Pankaj Gaikwad', 'Dhiraj Chandurkar', 'Prithviraj Sathyajit', 'Mikhael Cardoza', 'Shivani More', 'Jay Nanavati', 'Karan Gaikwad', 'Nishant Mohite', 'Digvijay Rao', 'Mananshraj Johal'],
  },
  yellow: {
    size: 34,
    captains: ['Shafi Sayyed', 'Rohit Tawde'],
    members: ['Aayushi Salunkhe', 'Tejas Borgharkar', 'Wajeeha Kazmi', 'Shubham Mene', 'Jayprakash Yadav', 'Aniket Kudtarkar', 'Mithun Yadav', 'Ansar Khan', 'Ganesh Vittalor', 'Isha Sanghi', 'Ezaz Shaikh', 'Nikhita Hiratti', 'Rishabh Vira', 'Shubham Ghadi', 'Huzaifa Ansari', 'Parth Parmar', 'Ankit Singh', 'Dharamraj', 'Arsalaan Shaikh', 'Princeton Dsouza', 'Abdul Shaikh', 'Sushant Thombre', 'Akshat Modi', 'Nikhil Ravariya', 'Utkarsh Tawakley', 'Tanya Jaiswal', 'Likhitha Nalla', 'Priti Singh', 'Sameerali Mukadam', 'Esha Shelar', 'Nitesh Shintre', 'Namrata Vora'],
  },
  purple: {
    size: 35,
    captains: ['Sanskruti Madye', 'Rakesh Dalai'],
    members: ['Vishal Gaikwad', 'Punit Shetty', 'Aniket Gupta', 'Sahil Terse', 'Sthavan Mohite', 'Anish Wayashe', 'Vicky Chettiar', 'Abhiraj More', 'Rumit Arekar', 'Bhanuprasad Ingampally', 'Manali Dhuri', 'Pallavi Gawade', 'Saurabh Hatkar', 'Amrita Virk', 'Akshit Shetty', 'Devendrakumar Malge', 'Harshada Walke', 'Thomas Ramjeetam', 'Aditya Rathod', 'Mohammad Sharif', 'Chandan Sahu', 'Ravikumar Gupta', 'Rugved Palodkar', 'Swapnil Sukhatankar', 'Charchit Sharma', 'Dipti Nayan', 'Chaitali Peridkar', 'Akanksha Kadam', 'Parth Pol', 'Ankit Vishwakarma', 'Likhitha Rai', 'Krunal Khare', 'Abhilash Kanojiya', 'Yashvi Dhar', 'Sibtain Ahmed'],
  },
  brown: {
    size: 33,
    captains: ['Vishakha Savardekar', 'Mohammed Anas Makandar'],
    members: ['Sayali Sawant', 'Faizaan Qureshi', 'Leolynal Carvalho', 'Atharva Wakhare', 'Melvin Chettiar', 'Pritesh Rathod', 'Ammaar Khan', 'Ankita Nimkar', 'Yash Bhatia', 'Hrithik Pawar', 'Pratvi Poojari', 'Sanskruti Karle', 'Zikra Shaikh', 'Rahul Bohora', 'Ayaz Ansari', 'Anish Sharma', 'Mahesh Gurrala', 'Vipin Patel', 'Prathamesh', 'Rajeev Mourya', 'Ashish Khandait', 'Rohit Sapakale', 'Neeraj Gupta', 'Prachi Pawar', 'Om Uskaikar', 'Prashant Mourya', 'Suyash Mayekar', 'Mayuri Mandawakar', 'Lilavati Swamy', 'Dharunlal Prasad', 'Irfan Shaikh'],
  },
  pink: {
    size: 35,
    captains: ['Varun Awasthi', 'Bhuvana Nadar'],
    members: ['Atharva Dhokte', 'Rahul Rawat', 'Ajinkya Joshi', 'Farheen Ansari', 'Siva Kiran', 'Nisar Shaikh', 'Asif Sayyed', 'Vinit Solanki', 'Akshat Jawandhiya', 'Sakshi Raut', 'Madhura Mhatre', 'Gaurav Chinawale', 'Shashank Gupta', 'Aayush Mehta', 'Tanmay Sinkar', 'Greeva Shah', 'Vivek Sasikumar', 'Sadiq Shaikh', 'Yash Jadhav', 'Adil Shaikh', 'Sushan Shetty', 'Arvind Kushwa', 'Anuj Partani', 'Mohsin Sayyad', 'Akhilesh Yadav', 'Anuraag Warawadekar', 'Kaushik Dedhiya', 'Durva Nivale', 'Ali Mulla', 'Kaushal Mistry', 'Mahesh Narala', 'Sonali Shringarpure', 'Roshan Chavan', 'Mirelle Castelino'],
  },
  teal: {
    size: 35,
    captains: ['Arpita Mishra', 'Suhel Khan'],
    members: ['Balram Padhi', 'Prashant Verma', 'Vaishnavi Nazare', 'Birendra Prajapati', 'Harit Sharma', 'Shubham Priyadarshee', 'Yogesh Chalwadi', 'Nitish Kumar', 'Saniya Ahmed', 'Sidhant Malhotra', 'Hiren Karakasia', 'Akshaya Ketkar', 'Saurabh Chaudhari', 'Prasad Gawde', 'Hritika Narvekar', 'Anuj Agrawal', 'Sourav Mandal', 'Avantika Choudhary', 'Sneh Gada', 'Umesh Kumavat', 'Saransh Jain', 'Vedant Mulchandani', 'Anay Nayak', 'Pooja Gauda', 'Rushabh Shah', 'Sorthi Sharma', 'Shubham Agawane', 'Sameer Gupta', 'Juned Shaikh', 'Mayur Chavan', 'Abhishek Prasad', 'Sneha Shinde', 'Ankur Dhuri'],
  },
};

// ─── SPORT STANDINGS ──────────────────────────────────────────────────────────
// Source: sports_wise_scores.csv — Pool A / Pool B standings per sport
export const SPORT_STANDINGS = [
  {
    sportId: 'football',
    name: 'Football',
    poolA: [
      { teamId: 'green', points: 20 },
      { teamId: 'red', points: 10 },
      { teamId: 'purple', points: 10 },
      { teamId: 'yellow', points: 0 },
    ],
    poolB: [
      { teamId: 'teal', points: 20 },
      { teamId: 'pink', points: 10 },
      { teamId: 'brown', points: 10 },
      { teamId: 'blue', points: 0 },
    ],
    fixturesA: ['Red vs Yellow', 'Red vs Green', 'Red vs Purple', 'Yellow vs Green', 'Yellow vs Purple', 'Green vs Purple'],
    fixturesB: ['Blue vs Pink', 'Blue vs Teal', 'Blue vs Brown', 'Pink vs Teal', 'Pink vs Brown', 'Teal vs Brown'],
  },
  {
    sportId: 'mens_cricket',
    name: "Men's Cricket",
    poolA: [
      { teamId: 'red', points: 20 },
      { teamId: 'blue', points: 10 },
      { teamId: 'pink', points: 10 },
      { teamId: 'teal', points: 0 },
    ],
    poolB: [
      { teamId: 'purple', points: 10 },
      { teamId: 'green', points: 10 },
      { teamId: 'yellow', points: 0 },
      { teamId: 'brown', points: 0 },
    ],
    fixturesA: ['Red vs Blue', 'Red vs Pink', 'Red vs Teal', 'Blue vs Pink', 'Blue vs Teal', 'Pink vs Teal'],
    fixturesB: ['Yellow vs Purple', 'Yellow vs Brown', 'Yellow vs Green', 'Purple vs Brown', 'Purple vs Green', 'Brown vs Green'],
  },
  {
    sportId: 'womens_cricket',
    name: "Women's Cricket",
    isCombined: true,
    poolA: [
      { teamId: 'brown', points: 10 },
      { teamId: 'pink', points: 10 },
      { teamId: 'blue', points: 5 },
      { teamId: 'red', points: 5 },
      { teamId: 'yellow', points: 5 },
      { teamId: 'purple', points: 5 },
      { teamId: 'green', points: 0 },
      { teamId: 'teal', points: 0 },
    ],
    poolB: [],
    combinedFixtures: [
      { label: 'Green + Teal vs Yellow + Purple', team1: ['green', 'teal'], team2: ['yellow', 'purple'] },
      { label: 'Green + Teal vs Blue + Red', team1: ['green', 'teal'], team2: ['blue', 'red'] },
      { label: 'Green + Teal vs Brown + Pink', team1: ['green', 'teal'], team2: ['brown', 'pink'] },
      { label: 'Yellow + Purple vs Blue + Red', team1: ['yellow', 'purple'], team2: ['blue', 'red'] },
      { label: 'Yellow + Purple vs Brown + Pink', team1: ['yellow', 'purple'], team2: ['brown', 'pink'] },
      { label: 'Blue + Red vs Brown + Pink', team1: ['blue', 'red'], team2: ['brown', 'pink'] },
    ],
    fixturesA: [],
    fixturesB: [],
  },
  {
    sportId: 'table_tennis',
    name: 'Table Tennis',
    poolA: [
      { teamId: 'red', points: 15 },
      { teamId: 'blue', points: 5 },
      { teamId: 'green', points: 0 },
      { teamId: 'purple', points: 0 },
    ],
    poolB: [
      { teamId: 'teal', points: 10 },
      { teamId: 'pink', points: 5 },
      { teamId: 'yellow', points: 5 },
      { teamId: 'brown', points: 0 },
    ],
    fixturesA: ['Green vs Blue', 'Green vs Purple', 'Green vs Red', 'Blue vs Purple', 'Blue vs Red', 'Purple vs Red'],
    fixturesB: ['Pink vs Yellow', 'Pink vs Teal', 'Pink vs Brown', 'Yellow vs Teal', 'Yellow vs Brown', 'Teal vs Brown'],
  },
  {
    sportId: 'chess',
    name: 'Chess',
    poolA: [
      { teamId: 'yellow', points: 10 },
      { teamId: 'pink', points: 5 },
      { teamId: 'red', points: 5 },
      { teamId: 'brown', points: 0 },
    ],
    poolB: [
      { teamId: 'teal', points: 10 },
      { teamId: 'blue', points: 0 },
      { teamId: 'green', points: 0 },
      { teamId: 'purple', points: 0 },
    ],
    fixturesA: ['Pink vs Yellow', 'Pink vs Brown', 'Pink vs Red', 'Yellow vs Brown', 'Yellow vs Red', 'Brown vs Red'],
    fixturesB: ['Blue vs Green', 'Blue vs Teal', 'Blue vs Purple', 'Green vs Teal', 'Green vs Purple', 'Teal vs Purple'],
  },
  {
    sportId: 'carrom',
    name: 'Carrom',
    poolA: [
      { teamId: 'teal', points: 5 },
      { teamId: 'purple', points: 5 },
      { teamId: 'yellow', points: 5 },
      { teamId: 'pink', points: 0 },
    ],
    poolB: [
      { teamId: 'blue', points: 10 },
      { teamId: 'brown', points: 5 },
      { teamId: 'red', points: 0 },
      { teamId: 'green', points: 0 },
    ],
    fixturesA: ['Teal vs Purple', 'Teal vs Yellow', 'Teal vs Pink', 'Purple vs Yellow', 'Purple vs Pink', 'Yellow vs Pink'],
    fixturesB: ['Red vs Blue', 'Red vs Green', 'Red vs Brown', 'Blue vs Green', 'Blue vs Brown', 'Green vs Brown'],
  },
  {
    sportId: 'pickleball',
    name: 'Pickleball',
    poolA: [
      { teamId: 'blue', points: 0 },
      { teamId: 'yellow', points: 0 },
      { teamId: 'brown', points: 0 },
      { teamId: 'teal', points: 0 },
    ],
    poolB: [
      { teamId: 'red', points: 0 },
      { teamId: 'pink', points: 0 },
      { teamId: 'green', points: 0 },
      { teamId: 'purple', points: 0 },
    ],
    fixturesA: ['Blue vs Yellow', 'Blue vs Brown', 'Blue vs Teal', 'Yellow vs Brown', 'Yellow vs Teal', 'Brown vs Teal'],
    fixturesB: ['Red vs Pink', 'Red vs Green', 'Red vs Purple', 'Pink vs Green', 'Pink vs Purple', 'Green vs Purple'],
  },
  {
    sportId: 'foosball',
    name: 'Foosball',
    poolA: [
      { teamId: 'brown', points: 0 },
      { teamId: 'red', points: 0 },
      { teamId: 'yellow', points: 0 },
      { teamId: 'teal', points: 0 },
    ],
    poolB: [
      { teamId: 'blue', points: 0 },
      { teamId: 'pink', points: 0 },
      { teamId: 'green', points: 0 },
      { teamId: 'purple', points: 0 },
    ],
    fixturesA: ['Brown vs Red', 'Brown vs Yellow', 'Brown vs Teal', 'Red vs Yellow', 'Red vs Teal', 'Yellow vs Teal'],
    fixturesB: ['Blue vs Pink', 'Blue vs Green', 'Blue vs Purple', 'Pink vs Green', 'Pink vs Purple', 'Green vs Purple'],
  },
];

// ─── BRACKET ──────────────────────────────────────────────────────────────────
// SF matchup: Pool A #1 vs Pool B #2 (sf1), Pool A #2 vs Pool B #1 (sf2)
// To record results: set team1, team2 and winner in the relevant sf/final slot.
// winner === null means the match hasn't happened yet.
export const BRACKET = {
  football: {
    sfDate: 'Apr 29', finalDate: 'May 7',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  mens_cricket: {
    sfDate: 'Apr 27', finalDate: 'May 7',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  womens_cricket: {
    sfDate: 'Apr 27', finalDate: 'May 7',
    // Combined teams advance as pairs: stored as arrays e.g. ['brown','pink']
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  table_tennis: {
    sfDate: 'Apr 30', finalDate: 'May 6',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  chess: {
    sfDate: 'Apr 30', finalDate: 'May 6',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  carrom: {
    sfDate: 'Apr 30', finalDate: 'May 6',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  pickleball: {
    sfDate: 'May 4', finalDate: 'May 4',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
  foosball: {
    sfDate: 'May 5', finalDate: 'May 6',
    sf1:   { team1: null, team2: null, winner: null },
    sf2:   { team1: null, team2: null, winner: null },
    final: { team1: null, team2: null, winner: null },
  },
};

