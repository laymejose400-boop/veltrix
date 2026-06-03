// ============================================
// VELTRIX - Conexión con el backend
// ============================================

const API_BASE = 'https://veltrix-api-dzez.onrender.com/api';

/**
 * Realiza una petición a la API.
 * Agrega automáticamente el token JWT si existe.
 * Maneja errores 401 (token expirado) redirigiendo al login.
 *
 * @param {string} endpoint - Ej: '/productos'
 * @param {object} options - Opciones de fetch (method, body, headers...)
 * @returns {Promise<Response>}
 */
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const respuesta = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    // Si el token expiró, redirigir al login
    if (respuesta.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }
    }

    return respuesta;
}