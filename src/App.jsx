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
import { COLORS, LAYOUT, TYPOGRAPHY } from './theme';

function AppNav() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(isAuthenticated());

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
        <h2 style={{ margin: 0, color: COLORS.primaryLight, fontFamily: TYPOGRAPHY.fontFamily }}>🐔 Galinheiro App</h2>
        <div className="nav-items">
          <NavLink to="/" className={({isActive}) => `nav-item${isActive ? ' nav-item-active' : ''}`} end>
            <span style={{ color: 'inherit' }}>Dashboard</span>
          </NavLink>

          <NavLink to="/galinhas" className={({isActive}) => `nav-item${isActive ? ' nav-item-active' : ''}`}>
            <span style={{ color: 'inherit' }}>Galinhas</span>
          </NavLink>

          <NavLink to="/historico" className={({isActive}) => `nav-item${isActive ? ' nav-item-active' : ''}`}>
            <span style={{ color: 'inherit' }}>Histórico de Postura</span>
          </NavLink>

          <NavLink to="/tratamentos" className={({isActive}) => `nav-item${isActive ? ' nav-item-active' : ''}`}>
            <span style={{ color: 'inherit' }}>Tratamentos</span>
          </NavLink>

          {authed ? (
            <button onClick={handleLogout} className="btn ml-1">Sair</button>
          ) : (
            <NavLink to="/login" className={({isActive}) => `nav-item ml-1${isActive ? ' nav-item-active' : ''}`}>
              <span style={{ color: 'inherit' }}>Entrar</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: TYPOGRAPHY.fontFamily }}>
        <AppNav />

        {/* Conteúdo */}
        <div style={{ maxWidth: LAYOUT.containerMaxWidth, margin: '0 auto', padding: '0 1rem' }}>
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

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  transition: 'background 0.2s'
};

export default App;