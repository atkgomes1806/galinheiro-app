import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DashboardPage from './presentation/pages/DashboardPage';
import GalinhasPage from './presentation/pages/GalinhasPage';
import HistoricoPosturaPage from './presentation/pages/HistoricoPosturaPage';
import TratamentosPage from './presentation/pages/TratamentosPage';
import LoginPage from './presentation/pages/LoginPage';
import RequireAuth from './presentation/components/RequireAuth';
import React, { useState, useEffect } from 'react';
import { isAuthenticated, logout } from './utils';

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
    <nav style={{
      background: '#2c3e50',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, color: 'white' }}>🐔 Galinheiro App</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/galinhas" style={linkStyle}>Galinhas</Link>
          <Link to="/historico" style={linkStyle}>Histórico de Postura</Link>
          <Link to="/tratamentos" style={linkStyle}>Tratamentos</Link>
          {authed ? (
            <button onClick={handleLogout} className="btn" style={{ marginLeft: '1rem' }}>Sair</button>
          ) : (
            <Link to="/login" style={{ ...linkStyle, marginLeft: '1rem' }}>Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <AppNav />

        {/* Conteúdo */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
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