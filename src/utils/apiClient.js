/**
 * Cliente centralizado para todas las llamadas API
 * Asegura que todas las URLs se construyen correctamente con la base URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('API_BASE_URL configurada:', API_BASE_URL);

/**
 * Hace un fetch con la URL base correcta
 * @param {string} endpoint - La ruta del endpoint (ej: '/api/productos')
 * @param {object} options - Opciones de fetch (method, headers, body, etc)
 * @returns {Promise} Respuesta del fetch
 */
export const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Log para debugging
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Para enviar cookies si es necesario
            headers: {
                ...options.headers,
                // Fallback: enviar token en header si existe en cookies o localStorage
                'Authorization': `Bearer ${getCookie('accessToken') || localStorage.getItem('accessToken')}`
            }
        });

        // Si la respuesta no es ok, lanzar error
        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP ${response.status}`);
        }

        // Intentar parsear como JSON
        const data = await response.json();
        console.log(`API Response:`, data);
        return data;
    } catch (error) {
        console.error(`API Error: ${error.message}`, error);
        throw error;
    }
};



/**
 * Helper para leer cookies en el cliente
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}

export { API_BASE_URL };
