import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginWithPassword } from '../../utils';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        const ok = loginWithPassword(password);
        if (ok) {
            navigate(from, { replace: true });
        } else {
            setError('Senha incorreta');
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h2 className="page-header-main">Entrar no Galinheiro</h2>
                <p className="muted">Proteção simples para uso pessoal. Informe a senha.</p>

                <form onSubmit={handleSubmit} className="form-grid">
                    <label className="form-label-small">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        autoFocus
                    />
                    {error && <div className="error-text">{error}</div>}

                    <div className="form-actions">
                        <button className="btn btn-primary" type="submit">Entrar</button>
                        <button type="button" className="btn btn-outline" onClick={() => { setPassword(''); setError(null); }}>Limpar</button>
                    </div>
                </form>

                {/* Informação sobre senha removida para maior discrição */}
            </div>
        </div>
    );
};

export default LoginPage;
