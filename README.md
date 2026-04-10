# IDfy Sports League 3.0

Welcome to the **IDfy Sports League 3.0** official web application! This is a fast, responsive, mobile-first React application designed to track the live standings, fixtures, and results of the 2026 sports league.

## 🚀 How to Run Locally

Because the project was scaffolded with Vite, firing it up consists of two standard steps. Ensure you have Node.js installed.

1. Install all dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the provided `localhost` URL in your web browser.

---

## 📊 How to Update the Database (Scores & Fixtures)

This application has been meticulously designed to operate **without the need for a complex backend server**. Instead, the entire database lives inside a perfectly formatted, static JavaScript file:

**`src/data/leagueData.js`**

Whenever you push updates to this file, your live frontend website will immediately reflect the changes!

### Updating the Leaderboard Points

Open up `src/data/leagueData.js` and locate the `LEADERBOARD` array.
To add points for a team, simply locate their object block and update the number next to the activity/sport.
_(Note: Do not worry about recalculating the `total` score. The frontend application automatically adds up all the values securely in real-time!)_

```javascript
  {
    teamId: 'yellow',
    points: {
      football: 10, mens_cricket: 0, womens_cricket: 5,
      table_tennis: 5, chess: 10, pickleball: 0, // ... just update these numbers!
    }
  },
```

### Adding and Updating Fixtures

Open up `src/data/leagueData.js` and scroll down to the `FIXTURES` array.

#### 1. Adding a new match:

Drop a new block into the array mimicking the structure below.

```javascript
{
  id: 'football-10',             // A unique ID for the match
  sportId: 'football',           // Must match the exact sport ID from constants.js
  team1Id: 'yellow',             // The ID of House 1
  team2Id: 'red',                // The ID of House 2
  date: '2026-04-15T10:00:00Z',  // Standard ISO timestamp
  status: 'upcoming',            // Must be 'upcoming' or 'completed'
  winner: null                   // Leave as null if it hasn't happened yet
}
```

#### 2. Resolving a completed match:

When a match finishes, simply update its status and define the winner using their Team ID:

```javascript
  status: 'completed',
  winner: 'yellow' // Use 'draw' if it was a tie
```

#### 3. Combined Teams (Specific to Women's Cricket):

Because the Women's Cricket matches consist of merged teams (e.g., Yellow + Purple vs Brown + Pink), simply provide an array of strings natively rather than a single string! The UI will automatically display this as a collaborative team.

```javascript
{
  id: 'womens_cricket-5',
  sportId: 'womens_cricket',
  team1Id: ['yellow', 'purple'], // Standard array
  team2Id: ['brown', 'pink'],
  date: '2026-04-10T09:00:00Z',
  status: 'completed',
  winner: ['brown', 'pink']      // The winner is also declared as an array!
}
```
