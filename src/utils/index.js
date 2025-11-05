// src/utils/index.js
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
};

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};