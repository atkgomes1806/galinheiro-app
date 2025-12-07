// src/utils/index.js
// Datas: helpers timezone-safe (evitam perder 1 dia ao converter)
export const toDateLocalNoTZ = (dateStr) => {
    // Se a string já tem tempo, apenas cria Date direto
    if (dateStr && dateStr.includes('T')) {
        return new Date(dateStr);
    }
    // Força horário meio-dia para evitar offset negativo de timezone
    return new Date(`${dateStr}T12:00:00`);
};

export const formatDate = (date) => {
    if (!date) return '';
    // date pode ser Date ou string; usa helper para não perder dia
    const d = date instanceof Date ? date : toDateLocalNoTZ(date);
    return d.toLocaleDateString('pt-BR');
};

export const formatDateBRFromString = (dateStr) => {
    if (!dateStr) return '';
    // Prioriza substring do formato YYYY-MM-DD para evitar offset
    if (!dateStr.includes('T') && dateStr.includes('-')) {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    }
    return formatDate(dateStr);
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helpers para avatares (usados no dashboard)
export const getAvatarColor = (nome) => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    if (!nome) return colors[0];
    const index = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
};

export const getInitial = (nome) => {
    if (!nome) return '?';
    return nome.charAt(0).toUpperCase();
};

// Autenticação simples (fake) para uso local
export const AUTH_KEY = 'galinheiro_auth_v1';

export function isAuthenticated() {
    try {
        return localStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
        return false;
    }
}

export function loginWithPassword(password) {
    // Use uma senha simples para proteção básica. Pode ser sobrescrita via env VITE_DEV_PASSWORD
    const envPassword = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DEV_PASSWORD) || 'galinheiro';
    if (password === envPassword) {
        localStorage.setItem(AUTH_KEY, 'true');
        try {
            // Notifica a aplicação que o estado de auth mudou
            window.dispatchEvent(new Event('authChanged'));
        } catch (e) {
            // noop
        }
        return true;
    }
    return false;
}

export function logout() {
    try {
        localStorage.removeItem(AUTH_KEY);
        try {
            window.dispatchEvent(new Event('authChanged'));
        } catch (e) {
            // noop
        }
    } catch (e) {
        // noop
    }
}