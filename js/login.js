// ============================================
// VELTRIX - Lógica de inicio de sesión
// ============================================

// Obtener elementos del formulario
const formLogin = document.getElementById('formLogin');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const errorDiv = document.getElementById('errorLogin');
const togglePassword = document.getElementById('togglePassword');

// Configurar ícono inicial según el tipo (por defecto password)
if (togglePassword) {
    const icono = togglePassword.querySelector('i');
    // Inicialmente contraseña oculta → ícono de ojo tachado
    icono.classList.remove('fa-eye');
    icono.classList.add('fa-eye-slash');

    togglePassword.addEventListener('click', function() {
        const tipoActual = inputPassword.getAttribute('type');
        const nuevoTipo = tipoActual === 'password' ? 'text' : 'password';
        inputPassword.setAttribute('type', nuevoTipo);

        // Cambiar ícono para reflejar el nuevo estado
        if (nuevoTipo === 'text') {
            // Contraseña visible → ojo abierto
            icono.classList.remove('fa-eye-slash');
            icono.classList.add('fa-eye');
        } else {
            // Contraseña oculta → ojo tachado
            icono.classList.remove('fa-eye');
            icono.classList.add('fa-eye-slash');
        }
    });
}

// Manejar el envío del formulario
formLogin.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!email || !password) {
        mostrarError('Por favor, completa todos los campos.');
        return;
    }

    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner-3d" style="width:20px;height:20px;border-width:2px;"></span> Ingresando...';

    try {
    const respuesta = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: password })
    });

    // Si la respuesta no es OK, leemos el mensaje de error (puede ser JSON o texto)
    if (!respuesta.ok) {
        let mensaje = 'Error al iniciar sesión.';
        try {
            const errorBody = await respuesta.json();
            mensaje = errorBody.message || mensaje;
        } catch (e) {
            // Si no es JSON, usamos el texto de estado
            mensaje = respuesta.status === 401 
                ? 'Correo o contraseña incorrectos.' 
                : `Error del servidor (${respuesta.status})`;
        }
        throw new Error(mensaje);
    }

    const datos = await respuesta.json();

    // Guardar sesión
    guardarSesion(datos);

    // Redirigir según el rol
    if (datos.rol === 'ADMIN') {
        window.location.href = 'admin/bienvenida.html';
    } else {
        window.location.href = 'index.html';
    }

} catch (error) {
    mostrarError(error.message || 'Error de conexión. Intenta nuevamente.');
    btnLogin.disabled = false;
    btnLogin.innerHTML = '<span>Iniciar Sesión</span><i class="fa-solid fa-arrow-right-to-bracket"></i>';
}
});

function mostrarError(mensaje) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}