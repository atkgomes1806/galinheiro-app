import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardPage from './presentation/pages/DashboardPage';
import GalinhasPage from './presentation/pages/GalinhasPage';
import HistoricoPosturaPage from './presentation/pages/HistoricoPosturaPage';
import TratamentosPage from './presentation/pages/TratamentosPage';
import LoginPage from './presentation/pages/LoginPage';
import RequireAuth from './presentation/components/RequireAuth';
import React, { useState, useEffect } from 'react';
import { isAuthenticated, logout } from './utils';
import { LAYOUT, TYPOGRAPHY } from './theme';

function AppNav() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isAuthenticated());
  const navLinks = [
    { to: '/', label: 'Dashboard', icon: '📊', end: true },
    { to: '/galinhas', label: 'Galinhas', icon: '🐔' },
    { to: '/historico', label: 'Histórico', icon: '🥚' },
    { to: '/tratamentos', label: 'Tratamentos', icon: '💊' }
  ];

  useEffect(() => {
    const update = () => setAuthed(isAuthenticated());
    // atualiza inicialmente
    update();
    // escuta mudanças de auth disparadas por login/logout
    window.addEventListener('authChanged', update);
    return () => window.removeEventListener('authChanged', update);
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    navigate('/login');
  };

  return (
    <nav className="app-nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <div className="nav-brand-main">
            <span className="nav-brand-icon" aria-hidden="true">🐔</span>
            <h1 className="nav-brand-title">Galinheiro App</h1>
            <span className="nav-brand-badge">2.0</span>
          </div>
          <p className="nav-brand-subtitle">Gestão inteligente do seu plantel</p>
        </div>

        <div className="nav-right">
          <div className="nav-items" role="navigation" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`}
              >
                <span className="nav-item-icon" aria-hidden="true">{link.icon}</span>
                <span className="nav-item-label">{link.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-auth">
            {authed ? (
              <button onClick={handleLogout} className="btn btn-outline nav-auth-btn">Sair</button>
            ) : (
              <NavLink to="/login" className={({isActive}) => `nav-item nav-login${isActive ? ' nav-item-active' : ''}`}>
                <span className="nav-item-label">Entrar</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily }} className="app-shell">
        <AppNav />

        {/* Conteúdo */}
        <div style={{ maxWidth: LAYOUT.containerMaxWidth, margin: '0 auto', padding: '0 1rem' }} className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            <Route path="/galinhas" element={<RequireAuth><GalinhasPage /></RequireAuth>} />
            <Route path="/historico" element={<RequireAuth><HistoricoPosturaPage /></RequireAuth>} />
            <Route path="/tratamentos" element={<RequireAuth><TratamentosPage /></RequireAuth>} />
          </Routes>
        </div>

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;