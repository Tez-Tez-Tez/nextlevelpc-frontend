import { apiFetch } from './apiClient';

/**
 * Llama al endpoint de refresco para obtener un nuevo Access Token.
 * @returns {Promise<string>} El nuevo Access Token.
 */
const refreshAccessToken = async () => {
    try {
        const data = await apiFetch('/api/usuarios/refresh', {
            method: 'POST',
        });
        const newAccessToken = data.access_token;
        
        if (!newAccessToken) {
            throw new Error('Respuesta de refresh incompleta');
        }

        return newAccessToken;

    } catch (error) {
        console.error('Error durante el proceso de refresco:', error);
        throw error;
    }
};

export default refreshAccessToken;