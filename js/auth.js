// ============================================
// VELTRIX - Autenticación y sesión
// ============================================

function estaLogueado() {
    return !!localStorage.getItem('token');
}

function obtenerRol() {
    return localStorage.getItem('rol');
}

function guardarSesion(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('nombre', data.nombre || data.email.split('@')[0]);
}


function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
    window.location.href = '../index.html';
}

function actualizarNav() {
    const linkLogin = document.getElementById('linkLogin');
    const navUsuario = document.getElementById('navUsuario');
    const linkAdmin = document.getElementById('linkAdmin');
    const linkCarrito = document.getElementById('linkCarrito');
    const linkPedidos = document.getElementById('linkPedidos');
    const linkNombre = document.getElementById('linkNombre');

    if (!linkLogin || !navUsuario) return;

    if (estaLogueado()) {
        linkLogin.style.display = 'none';
        navUsuario.style.display = 'block';

        if (linkNombre) {
            const nombre = localStorage.getItem('nombre') || localStorage.getItem('email') || 'Usuario';
            linkNombre.textContent = '👤 ' + nombre;
        }

        if (obtenerRol() === 'ADMIN') {
            if (linkCarrito) linkCarrito.style.display = 'none';
            if (linkPedidos) linkPedidos.style.display = 'none';
            if (linkAdmin) linkAdmin.style.display = 'inline';
        } else {
            if (linkCarrito) linkCarrito.style.display = 'inline';
            if (linkPedidos) linkPedidos.style.display = 'inline';
            if (linkAdmin) linkAdmin.style.display = 'none';
        }
    } else {
        linkLogin.style.display = 'inline';
        navUsuario.style.display = 'none';
        if (linkAdmin) linkAdmin.style.display = 'none';
        if (linkCarrito) linkCarrito.style.display = 'inline';
        if (linkPedidos) linkPedidos.style.display = 'inline';
    }

    if (obtenerRol() === 'ADMIN') {
        const navExploracion = document.getElementById('navExploracion');
        const navSeparador = document.getElementById('navSeparador');
        if (navExploracion) navExploracion.style.display = 'none';
        if (navSeparador) navSeparador.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', actualizarNav);

// ============================================
// CAMBIO DE TEMA (océano + partículas ↔ espacio neón sin partículas)
// ============================================

const temas = {
    oceano: 'linear-gradient(180deg, #020814 0%, #0a1628 30%, #061220 60%, #020810 100%)',
    espacio: 'linear-gradient(180deg, #000000 0%, #000000 100%)'
};

let temaActual = localStorage.getItem('tema') || 'oceano';

function cambiarTema() {
    const body = document.body;
    const canvasParticulas = document.getElementById('particulas');

    if (temaActual === 'espacio') {
        body.style.backgroundImage = temas.oceano;
        if (canvasParticulas) canvasParticulas.style.display = 'block';
        temaActual = 'oceano';
        localStorage.setItem('tema', 'oceano');
    } else {
        body.style.backgroundImage = temas.espacio;
        if (canvasParticulas) canvasParticulas.style.display = 'none';
        temaActual = 'espacio';
        localStorage.setItem('tema', 'espacio');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema');
    const canvasParticulas = document.getElementById('particulas');
    if (temaGuardado === 'espacio') {
        document.body.style.backgroundImage = temas.espacio;
        if (canvasParticulas) canvasParticulas.style.display = 'none';
        temaActual = 'espacio';
    }
});

// Menú desplegable de usuario
document.addEventListener('click', function(e) {
    const menu = document.getElementById('menuUsuario');
    const btn = document.getElementById('btnUsuario');
    if (!menu || !btn) return;

    if (btn.contains(e.target)) {
        menu.classList.toggle('visible');
    } else if (!menu.contains(e.target)) {
        menu.classList.remove('visible');
    }
});