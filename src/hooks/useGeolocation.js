/**
 * Hook: useGeolocation
 * 
 * Gerencia geolocalização GPS do usuário com cache inteligente
 * e fallback para coordenadas padrão
 * 
 * @author Galinheiro App Team
 * @description Hook personalizado para solicitar e gerenciar localização do usuário
 */

import { useState, useEffect, useCallback } from 'react';

// Configurações padrão
const DEFAULT_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 segundos
    maximumAge: 300000 // 5 minutos de cache
};

const CACHE_KEY = 'galinheiro_user_location';
const PERMISSION_KEY = 'galinheiro_location_permission';

export const useGeolocation = () => {
    const [coordinates, setCoordinates] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permission, setPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

    // Carregar dados do cache ao inicializar
    useEffect(() => {
        loadCachedLocation();
        checkPermissionStatus();
    }, []);

    /**
     * Carrega localização salva no localStorage
     */
    const loadCachedLocation = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const permissionCache = localStorage.getItem(PERMISSION_KEY);
            
            if (cached) {
                const data = JSON.parse(cached);
                const now = Date.now();
                
                // Verificar se cache ainda é válido (24 horas)
                if (data.timestamp && (now - data.timestamp) < 24 * 60 * 60 * 1000) {
                    setCoordinates({
                        latitude: data.latitude,
                        longitude: data.longitude
                    });
                    setLocationName(data.locationName);
                    setIsLocationEnabled(true);
                    
                    console.log('📍 Localização carregada do cache:', data.locationName);
                }
            }
            
            if (permissionCache) {
                setPermission(permissionCache);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cache de localização:', error);
        }
    }, []);

    /**
     * Verifica status atual da permissão de geolocalização
     */
    const checkPermissionStatus = useCallback(async () => {
        if (!navigator.permissions) return;
        
        try {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            setPermission(permissionStatus.state);
            
            // Escutar mudanças na permissão
            permissionStatus.onchange = () => {
                setPermission(permissionStatus.state);
                localStorage.setItem(PERMISSION_KEY, permissionStatus.state);
            };
        } catch (error) {
            console.warn('⚠️ Não foi possível verificar permissões:', error);
        }
    }, []);

    /**
     * Obtém nome da localização usando reverse geocoding (simplificado)
     */
    const getLocationName = useCallback(async (lat, lng) => {
        try {
            // Usar API de reverse geocoding gratuita
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=pt`
            );
            
            if (!response.ok) throw new Error('Falha na geocodificação');
            
            const data = await response.json();
            
            // Formar nome da localização
            const city = data.city || data.locality || data.principalSubdivision;
            const state = data.principalSubdivisionCode || data.principalSubdivision;
            const country = data.countryCode || data.countryName;
            
            if (city && state) {
                return `${city}, ${state}`;
            } else if (city) {
                return city;
            } else if (country) {
                return `${country}`;
            } else {
                return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao obter nome da localização:', error);
            return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
        }
    }, []);

    /**
     * Salva localização no cache
     */
    const saveLocationToCache = useCallback((lat, lng, name) => {
        try {
            const data = {
                latitude: lat,
                longitude: lng,
                locationName: name,
                timestamp: Date.now()
            };
            
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            console.log('💾 Localização salva no cache:', name);
        } catch (error) {
            console.warn('⚠️ Erro ao salvar localização no cache:', error);
        }
    }, []);

    /**
     * Solicita permissão e obtém coordenadas GPS do usuário
     */
    const requestLocation = useCallback(async () => {
        if (!navigator.geolocation) {
            setError('Geolocalização não suportada neste navegador');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('📍 Solicitando localização do usuário...');

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    DEFAULT_OPTIONS
                );
            });

            const { latitude, longitude } = position.coords;
            
            console.log(`✅ Localização obtida: ${latitude}, ${longitude}`);
            console.log(`🎯 Precisão: ${position.coords.accuracy}m`);

            // Obter nome da localização
            const locationName = await getLocationName(latitude, longitude);

            // Atualizar estado
            setCoordinates({ latitude, longitude });
            setLocationName(locationName);
            setIsLocationEnabled(true);
            setPermission('granted');

            // Salvar no cache
            saveLocationToCache(latitude, longitude, locationName);
            localStorage.setItem(PERMISSION_KEY, 'granted');

            console.log(`🌍 Localização definida: ${locationName}`);
            return true;

        } catch (error) {
            console.error('❌ Erro ao obter localização:', error);
            
            let errorMessage = 'Não foi possível obter sua localização';
            
            switch (error.code) {
                case 1: // PERMISSION_DENIED
                    errorMessage = 'Permissão para acessar localização foi negada';
                    setPermission('denied');
                    localStorage.setItem(PERMISSION_KEY, 'denied');
                    break;
                case 2: // POSITION_UNAVAILABLE
                    errorMessage = 'Localização indisponível no momento';
                    break;
                case 3: // TIMEOUT
                    errorMessage = 'Tempo esgotado para obter localização';
                    break;
                default:
                    errorMessage = error.message || 'Erro desconhecido';
            }
            
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    }, [getLocationName, saveLocationToCache]);

    /**
     * Limpa localização do usuário e volta para padrão
     */
    const clearLocation = useCallback(() => {
        setCoordinates(null);
        setLocationName(null);
        setIsLocationEnabled(false);
        setError(null);
        
        // Limpar cache
        localStorage.removeItem(CACHE_KEY);
        
        console.log('🧹 Localização do usuário removida');
    }, []);

    /**
     * Obtém coordenadas atuais (GPS ou fallback)
     */
    const getCurrentCoordinates = useCallback(() => {
        if (coordinates) {
            return coordinates;
        }
        
        // Fallback para coordenadas padrão do .env
        return {
            latitude: parseFloat(process.env.VITE_LOCATION_LATITUDE) || -23.5505,
            longitude: parseFloat(process.env.VITE_LOCATION_LONGITUDE) || -46.6333
        };
    }, [coordinates]);

    /**
     * Obtém nome da localização atual (GPS ou fallback)
     */
    const getCurrentLocationName = useCallback(() => {
        if (locationName) {
            return locationName;
        }
        
        return process.env.VITE_LOCATION_NAME || 'São Paulo';
    }, [locationName]);

    /**
     * Verifica se geolocalização está disponível
     */
    const isGeolocationAvailable = useCallback(() => {
        return 'geolocation' in navigator;
    }, []);

    /**
     * Verifica se pode solicitar localização (não foi negada permanentemente)
     */
    const canRequestLocation = useCallback(() => {
        return permission !== 'denied' && isGeolocationAvailable();
    }, [permission, isGeolocationAvailable]);

    return {
        // Estado
        coordinates,
        locationName,
        loading,
        error,
        permission,
        isLocationEnabled,
        
        // Coordenadas atuais (GPS ou fallback)
        currentCoordinates: getCurrentCoordinates(),
        currentLocationName: getCurrentLocationName(),
        
        // Ações
        requestLocation,
        clearLocation,
        
        // Utilitários
        isGeolocationAvailable: isGeolocationAvailable(),
        canRequestLocation: canRequestLocation()
    };
};