import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Trophy, Calendar, Home, Users, BarChart2, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',           label: 'Home',       Icon: Home },
  { to: '/leaderboard',label: 'Standings',  Icon: Trophy },
  { to: '/standings',  label: 'Pools',      Icon: BarChart2 },
  { to: '/schedule',   label: 'Schedule',   Icon: ClipboardList },
  { to: '/teams',      label: 'Teams',      Icon: Users },
  { to: '/fixtures',   label: 'Fixtures',   Icon: Calendar },
];

const Layout = () => {
  const { pathname } = useLocation();
  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Desktop Top Nav ──────────────────────────────── */}
      <nav className="top-nav" style={{ margin: '16px auto', width: 'calc(100% - 32px)' }}>
        <Link to="/" className="top-nav-logo">
          <div className="top-nav-logo-icon">⚡</div>
          <span>IDfy SL 3.0</span>
        </Link>

        <div className="top-nav-links">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <div className="chip chip-yellow" style={{ fontSize: '11px' }}>
          ⚡ Yellow House
        </div>
      </nav>

      {/* ── Page Content ─────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="footer" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--yellow)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#0E0C00', fontSize: '14px' }}>
            ⚡
          </div>
          <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--yellow)' }}>Powered by Yellow House</span>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>IDfy Sports League 3.0 · 2026</p>
      </footer>

      {/* ── Mobile Bottom Nav ─────────────────────────────── */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className={`bottom-nav-item ${isActive(to) ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
