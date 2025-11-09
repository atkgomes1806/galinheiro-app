// src/utils/index.js
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
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