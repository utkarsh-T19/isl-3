import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CalendarDays } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-col items-center justify-center" style={{ flex: 1, padding: '20px', minHeight: '100%', gap: '48px' }}>
      <div className="text-center glass-panel" style={{ padding: '48px 32px', borderRadius: '40px', maxWidth: '600px', width: '100%' }}>
        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', borderRadius: '30px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(255, 165, 0, 0.4)' }}>
          {/* Logo Placeholder */}
          <Trophy size={48} color="#FFF" />
        </div>
        
        <h1 style={{ fontSize: '3rem', margin: '0 0 16px' }}>IDfy Sports League 3.0</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          Welcome back to the ultimate corporate showdown. Check live standings and upcoming matches.
        </p>

        <div className="flex-col" style={{ gap: '16px' }}>
          <Link to="/leaderboard" className="apple-btn" style={{ padding: '20px 32px', fontSize: '1.2rem', background: '#FFD700', color: '#000', width: '100%' }}>
            <Trophy size={24} style={{ marginRight: '12px' }} />
            View Leaderboard
          </Link>
          
          <Link to="/fixtures" className="apple-btn" style={{ padding: '20px 32px', fontSize: '1.2rem', width: '100%' }}>
            <CalendarDays size={24} style={{ marginRight: '12px' }} />
            Fixtures & Results
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
