export const TEAMS = [
  { id: 'yellow', name: 'Yellow', color: 'var(--team-yellow)', text: '#000000' },
  { id: 'red', name: 'Red', color: 'var(--team-red)', text: '#FFFFFF' },
  { id: 'green', name: 'Green', color: 'var(--team-green)', text: '#FFFFFF' },
  { id: 'blue', name: 'Blue', color: 'var(--team-blue)', text: '#FFFFFF' },
  { id: 'pink', name: 'Pink', color: 'var(--team-pink)', text: '#FFFFFF' },
  { id: 'teal', name: 'Teal', color: 'var(--team-teal)', text: '#000000' },
  { id: 'brown', name: 'Brown', color: 'var(--team-brown)', text: '#FFFFFF' },
  { id: 'purple', name: 'Purple', color: 'var(--team-purple)', text: '#FFFFFF' }
];

export const SPORTS = {
  outdoor: [
    { id: 'football', name: 'Football' },
    { id: 'mens_cricket', name: "Men's Cricket" },
    { id: 'womens_cricket', name: "Women's Cricket" }
  ],
  indoor: [
    { id: 'table_tennis', name: 'Table Tennis' },
    { id: 'chess', name: 'Chess' },
    { id: 'mens_pickleball', name: "Men's Pickleball" },
    { id: 'womens_pickleball', name: "Women's Pickleball" },
    { id: 'carrom', name: 'Carrom' },
    { id: 'foosball', name: 'Foosball' }
  ],
  misc: [
    { id: 'dance', name: 'Dance' },
    { id: 'house_branding', name: 'House Branding' },
    { id: 'cringe_recreation', name: 'Cringe Recreation' },
    { id: 'shades_of_glory', name: 'Shades of Glory' },
    { id: 'trivia', name: 'Trivia' }
  ]
};

export const ALL_SPORTS = [
  ...SPORTS.outdoor,
  ...SPORTS.indoor,
  ...SPORTS.misc
];

// Points awarded to each winning team per match, per sport
export const SPORT_WIN_POINTS = {
  football:       10,
  mens_cricket:   10,
  womens_cricket:  5, // each team in the winning combined pair gets 5
  table_tennis:    5,
  chess:           5,
  carrom:          5,
  mens_pickleball:   5,
  womens_pickleball: 5,
  foosball:        5,
};
