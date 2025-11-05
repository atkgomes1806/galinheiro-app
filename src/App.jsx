import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './presentation/pages/DashboardPage';
import GalinhasPage from './presentation/pages/GalinhasPage';
import HistoricoPosturaPage from './presentation/pages/HistoricoPosturaPage';
import TratamentosPage from './presentation/pages/TratamentosPage';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navegação */}
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/" style={linkStyle}>Dashboard</Link>
              <Link to="/galinhas" style={linkStyle}>Galinhas</Link>
              <Link to="/historico" style={linkStyle}>Histórico de Postura</Link>
              <Link to="/tratamentos" style={linkStyle}>Tratamentos</Link>
            </div>
          </div>
        </nav>

        {/* Conteúdo */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/galinhas" element={<GalinhasPage />} />
            <Route path="/historico" element={<HistoricoPosturaPage />} />
            <Route path="/tratamentos" element={<TratamentosPage />} />
          </Routes>
        </div>
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