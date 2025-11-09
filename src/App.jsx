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

  // estilos base para nav items
  const baseItemStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  // estilo quando ativo: fundo off-white, canto direito arredondado criando a "aba" fluida
  const activeItemStyle = {
    background: '#F7F7F7',
    color: '#1f2d3d',
    borderRadius: '0 12px 12px 0',
    padding: '0.5rem 0.9rem'
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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <NavLink to="/" style={({isActive}) => ({...baseItemStyle, ...(isActive ? activeItemStyle : {})})} end>
            <span style={{ color: 'inherit' }}>Dashboard</span>
          </NavLink>

          <NavLink to="/galinhas" style={({isActive}) => ({...baseItemStyle, ...(isActive ? activeItemStyle : {})})}>
            <span style={{ color: 'inherit' }}>Galinhas</span>
          </NavLink>

          <NavLink to="/historico" style={({isActive}) => ({...baseItemStyle, ...(isActive ? activeItemStyle : {})})}>
            <span style={{ color: 'inherit' }}>Histórico de Postura</span>
          </NavLink>

          <NavLink to="/tratamentos" style={({isActive}) => ({...baseItemStyle, ...(isActive ? activeItemStyle : {})})}>
            <span style={{ color: 'inherit' }}>Tratamentos</span>
          </NavLink>

          {authed ? (
            <button onClick={handleLogout} className="btn" style={{ marginLeft: '1rem' }}>Sair</button>
          ) : (
            <NavLink to="/login" style={({isActive}) => ({...baseItemStyle, marginLeft: '1rem', ...(isActive ? activeItemStyle : {})})}>
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