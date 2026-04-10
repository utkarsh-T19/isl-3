export const TEAMS = [
  { id: 'yellow', name: 'Yellow', color: '#FBD316', text: '#000000' },
  { id: 'red', name: 'Red', color: '#FF0000', text: '#FFFFFF' },
  { id: 'green', name: 'Green', color: '#34A853', text: '#FFFFFF' },
  { id: 'blue', name: 'Blue', color: '#1C43B9', text: '#FFFFFF' },
  { id: 'pink', name: 'Pink', color: '#FF8282', text: '#FFFFFF' },
  { id: 'teal', name: 'Teal', color: '#1FC9B4', text: '#000000' },
  { id: 'brown', name: 'Brown', color: '#793722', text: '#FFFFFF' },
  { id: 'purple', name: 'Purple', color: '#9900FF', text: '#FFFFFF' }
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
    { id: 'pickleball', name: 'Pickleball' },
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
