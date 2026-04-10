import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Trophy, Calendar, Home } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex-col" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Dynamic Header if not on Home Page */}
      {location.pathname !== '/' && (
        <header className="glass-panel" style={{ margin: '16px', padding: '16px 24px', borderRadius: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '16px', zIndex: 100 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={20} />
            <span>IDfy SL 3.0</span>
          </Link>
          <nav style={{ display: 'flex', gap: '16px' }}>
            <Link to="/leaderboard" style={{ color: location.pathname === '/leaderboard' ? 'var(--text-main)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={18} />
              <span className="hide-on-mobile">Leaderboard</span>
            </Link>
            <Link to="/fixtures" style={{ color: location.pathname === '/fixtures' ? 'var(--text-main)' : 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={18} />
              <span className="hide-on-mobile">Fixtures</span>
            </Link>
          </nav>
        </header>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ margin: '16px', padding: '24px', textAlign: 'center', borderBottomLeftRadius: '0', borderBottomRightRadius: '0', marginBottom: 0 }}>
        <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Powered by the Yellow House
        </p>
        <div style={{ marginTop: '12px', opacity: 0.5 }}>
          {/* Logo Placeholder */}
          <div style={{ width: '40px', height: '40px', background: '#FFD700', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>
            YH
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
