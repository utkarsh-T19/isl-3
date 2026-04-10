export const LEADERBOARD = [
  {
    teamId: 'yellow',
    points: {
      football: 0, mens_cricket: 0, womens_cricket: 5, //Outdoor Sports
      table_tennis: 5, chess: 10, pickleball: 0, carrom: 5, foosball: 0, //Indoor Sports
      dance: 0, house_branding: 0, cringe_recreation: 5, shades_of_glory: 1, trivia: 4 //Misc
    }
  },
  {
    teamId: 'red',
    points: {
      football: 10, mens_cricket: 20, womens_cricket: 5,
      table_tennis: 15, chess: 5, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 0, cringe_recreation: 0, shades_of_glory: 0, trivia: 4
    }
  },
  {
    teamId: 'green',
    points: {
      football: 20, mens_cricket: 10, womens_cricket: 0,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 7, shades_of_glory: 0, trivia: 4
    }
  },
  {
    teamId: 'blue',
    points: {
      football: 0, mens_cricket: 10, womens_cricket: 5,
      table_tennis: 5, chess: 0, pickleball: 0, carrom: 10, foosball: 0,
      dance: 2, house_branding: 4, cringe_recreation: 9, shades_of_glory: 0, trivia: 7
    }
  },
  {
    teamId: 'pink',
    points: {
      football: 10, mens_cricket: 10, womens_cricket: 10,
      table_tennis: 5, chess: 5, pickleball: 0, carrom: 0, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 4, shades_of_glory: 5, trivia: 11
    }
  },
  {
    teamId: 'teal',
    points: {
      football: 20, mens_cricket: 0, womens_cricket: 0,
      table_tennis: 10, chess: 10, pickleball: 0, carrom: 5, foosball: 0,
      dance: 0, house_branding: 5, cringe_recreation: 6, shades_of_glory: 0, trivia: 8
    }
  },
  {
    teamId: 'brown',
    points: {
      football: 10, mens_cricket: 0, womens_cricket: 10,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 5, foosball: 0,
      dance: 0, house_branding: 1, cringe_recreation: 8, shades_of_glory: 3, trivia: 11
    }
  },
  {
    teamId: 'purple',
    points: {
      football: 10, mens_cricket: 10, womens_cricket: 5,
      table_tennis: 0, chess: 0, pickleball: 0, carrom: 5, foosball: 0,
      dance: 2, house_branding: 0, cringe_recreation: 8, shades_of_glory: 0, trivia: 1
    }
  }
];

export const FIXTURES = [
  // Matches from yesterday (Completed)
  { id: 'football-1', sportId: 'football', team1Id: 'yellow', team2Id: 'red', date: '2026-04-09T10:00:00Z', status: 'completed', winner: 'yellow' },
  { id: 'mens_cricket-1', sportId: 'mens_cricket', team1Id: 'green', team2Id: 'blue', date: '2026-04-09T13:00:00Z', status: 'completed', winner: 'green' },
  { id: 'table_tennis-1', sportId: 'table_tennis', team1Id: 'pink', team2Id: 'teal', date: '2026-04-09T16:00:00Z', status: 'completed', winner: 'pink' },
  
  // Matches for today (Mixed)
  { id: 'womens_cricket-1', sportId: 'womens_cricket', team1Id: ['yellow', 'purple'], team2Id: ['brown', 'pink'], date: '2026-04-10T09:00:00Z', status: 'completed', winner: ['brown', 'pink'] },
  { id: 'football-2', sportId: 'football', team1Id: 'brown', team2Id: 'purple', date: '2026-04-10T14:30:00Z', status: 'upcoming', winner: null },
  { id: 'chess-1', sportId: 'chess', team1Id: 'green', team2Id: 'red', date: '2026-04-10T16:00:00Z', status: 'upcoming', winner: null },
  
  // Matches for tomorrow (Upcoming)
  { id: 'pickleball-1', sportId: 'pickleball', team1Id: 'blue', team2Id: 'yellow', date: '2026-04-11T10:00:00Z', status: 'upcoming', winner: null },
  { id: 'carrom-1', sportId: 'carrom', team1Id: 'teal', team2Id: 'brown', date: '2026-04-11T12:00:00Z', status: 'upcoming', winner: null },
  { id: 'mens_cricket-2', sportId: 'mens_cricket', team1Id: 'purple', team2Id: 'pink', date: '2026-04-11T15:00:00Z', status: 'upcoming', winner: null },

  // Matches for day after tomorrow
  { id: 'foosball-1', sportId: 'foosball', team1Id: 'yellow', team2Id: 'green', date: '2026-04-12T11:00:00Z', status: 'upcoming', winner: null },
  { id: 'womens_cricket-2', sportId: 'womens_cricket', team1Id: ['blue', 'red'], team2Id: ['green', 'teal'], date: '2026-04-12T14:00:00Z', status: 'upcoming', winner: null },
];
