import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Fixtures from './pages/Fixtures';
import Schedule from './pages/Schedule';
import Teams from './pages/Teams';
import Standings from './pages/Standings';
import Progression from './pages/Progression';
import AdminPanel from './pages/AdminPanel';
import { LeagueProvider } from './context/LeagueContext';

function App() {
  return (
    <HashRouter>
      <LeagueProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="teams" element={<Teams />} />
            <Route path="standings" element={<Standings />} />
            <Route path="progression" element={<Progression />} />
          </Route>
          <Route path="admin" element={<AdminPanel />} />
        </Routes>
      </LeagueProvider>
    </HashRouter>
  );
}

export default App;

