import React, { useEffect, useState } from 'react';
import GalinhasList from '../components/GalinhasList';
import GalinhaForm from '../components/GalinhaForm';
import { listarGalinhas } from '../../application/use-cases/listarGalinhas';

const GalinhasPage = () => {
    const [galinhas, setGalinhas] = useState([]);
    const [galinhaEmEdicao, setGalinhaEmEdicao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carrega a lista de galinhas ao montar o componente
    useEffect(() => {
        carregarGalinhas();
    }, []);

    const carregarGalinhas = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await listarGalinhas();
            setGalinhas(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao carregar galinhas:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handler: Quando uma nova galinha é criada
    const handleGalinhaCriada = (novaGalinha) => {
        setGalinhas((galinhasAtuais) => [...galinhasAtuais, novaGalinha]);
    };

    // Handler: Quando uma galinha é atualizada
    const handleGalinhaAtualizada = (galinhaAtualizada) => {
        setGalinhas((galinhasAtuais) =>
            galinhasAtuais.map((g) => 
                g.id === galinhaAtualizada.id ? galinhaAtualizada : g
            )
        );
        setGalinhaEmEdicao(null); // Limpa o modo de edição
    };

    // Handler: Quando uma galinha é removida
    const handleGalinhaRemovida = (idRemovido) => {
        setGalinhas((galinhasAtuais) => 
            galinhasAtuais.filter((g) => g.id !== idRemovido)
        );
    };

    // Handler: Quando o usuário clica em "Editar"
    const handleEditarGalinha = (galinha) => {
        setGalinhaEmEdicao(galinha);
        // Scroll para o formulário
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handler: Quando o usuário cancela a edição
    const handleCancelarEdicao = () => {
        setGalinhaEmEdicao(null);
    };

    if (loading) {
        return (
            <div className="galinhas-page">
                <h1>Gerenciamento de Galinhas 🐔</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="galinhas-page">
            <h1>Gerenciamento de Galinhas 🐔</h1>

            {error && (
                <div className="error-message">
                    <p>Erro ao carregar dados: {error}</p>
                    <button onClick={carregarGalinhas}>Tentar Novamente</button>
                </div>
            )}

            <GalinhaForm
                galinhaParaEditar={galinhaEmEdicao}
                onGalinhaCriada={handleGalinhaCriada}
                onGalinhaAtualizada={handleGalinhaAtualizada}
                onCancelar={handleCancelarEdicao}
            />

            <GalinhasList
                galinhas={galinhas}
                onGalinhaRemovida={handleGalinhaRemovida}
                onEditarGalinha={handleEditarGalinha}
            />
        </div>
    );
};

export default GalinhasPage;