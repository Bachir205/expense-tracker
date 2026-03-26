import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Layout.css';

const NAV = [
  { to: '/',          label: 'Dashboard', icon: '⊞', end: true },
  { to: '/expenses',  label: 'Expenses',  icon: '↕' },
  { to: '/budgets',   label: 'Budgets',   icon: '◎' },
  { to: '/analytics', label: 'Analytics', icon: '∿' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">💰</div>
          Spendly
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Menu</div>
          <nav className="sidebar-nav">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.currency}</div>
          </div>
          <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }} title="Logout">⏻</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
