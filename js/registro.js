// ============================================
// VELTRIX - Lógica de registro de usuario
// ============================================

// Obtener elementos del formulario
const formRegistro = document.getElementById('formRegistro');
const inputNombre = document.getElementById('nombre');
const inputEmailReg = document.getElementById('email');
const inputPasswordReg = document.getElementById('password');
const inputConfirmar = document.getElementById('confirmar');
const btnRegistro = document.getElementById('btnRegistro');
const errorRegistro = document.getElementById('errorRegistro');

const togglePasswordRegistro = document.getElementById('togglePasswordRegistro');
const toggleConfirmarRegistro = document.getElementById('toggleConfirmarRegistro');

// Función para cambiar el tipo de ambos campos de contraseña y actualizar los dos íconos
function toggleAmbasContraseñas() {
    const tipoActual = inputPasswordReg.getAttribute('type');
    const nuevoTipo = tipoActual === 'password' ? 'text' : 'password';
    inputPasswordReg.setAttribute('type', nuevoTipo);
    inputConfirmar.setAttribute('type', nuevoTipo);

    // Actualizar ambos íconos según el nuevo estado
    const icono1 = togglePasswordRegistro.querySelector('i');
    const icono2 = toggleConfirmarRegistro.querySelector('i');

    if (nuevoTipo === 'text') {
        // Contraseñas visibles → íconos de ojo abierto
        icono1.classList.remove('fa-eye-slash');
        icono1.classList.add('fa-eye');
        icono2.classList.remove('fa-eye-slash');
        icono2.classList.add('fa-eye');
    } else {
        // Contraseñas ocultas → íconos de ojo tachado
        icono1.classList.remove('fa-eye');
        icono1.classList.add('fa-eye-slash');
        icono2.classList.remove('fa-eye');
        icono2.classList.add('fa-eye-slash');
    }
}

// Inicializar íconos en estado "oculto" (ojo tachado)
if (togglePasswordRegistro && toggleConfirmarRegistro) {
    const icono1 = togglePasswordRegistro.querySelector('i');
    const icono2 = toggleConfirmarRegistro.querySelector('i');
    icono1.classList.add('fa-eye-slash');
    icono2.classList.add('fa-eye-slash');

    // Al hacer clic en cualquiera de los botones, se alternan ambos campos
    togglePasswordRegistro.addEventListener('click', toggleAmbasContraseñas);
    toggleConfirmarRegistro.addEventListener('click', toggleAmbasContraseñas);
}

// Manejar envío del formulario de registro
formRegistro.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    // Ocultar error previo
    errorRegistro.style.display = 'none';
    errorRegistro.textContent = '';

    // Obtener valores
    const nombre = inputNombre.value.trim();
    const email = inputEmailReg.value.trim();
    const password = inputPasswordReg.value;
    const confirmar = inputConfirmar.value;

    // Validaciones
    if (!nombre || !email || !password || !confirmar) {
        mostrarErrorRegistro('Completa todos los campos.');
        return;
    }

    if (password.length < 6) {
        mostrarErrorRegistro('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (password !== confirmar) {
        mostrarErrorRegistro('Las contraseñas no coinciden.');
        return;
    }

    // Deshabilitar botón
    btnRegistro.disabled = true;
    btnRegistro.innerHTML = '<span class="spinner-3d" style="width:20px;height:20px;border-width:2px;"></span> Creando cuenta...';

    try {
        const respuesta = await apiFetch('/auth/registro', {
            method: 'POST',
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                password: password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.message || 'Error al registrarse');
        }

        // Guardar sesión automáticamente
        guardarSesion(datos);

        // Redirigir al inicio
        window.location.href = 'index.html';

    } catch (error) {
        mostrarErrorRegistro(error.message || 'Error de conexión');
        btnRegistro.disabled = false;
        btnRegistro.innerHTML = '<span>Crear Cuenta</span><i class="fa-solid fa-arrow-right-to-bracket"></i>';
    }
});

/**
 * Muestra un mensaje de error en el formulario.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarErrorRegistro(mensaje) {
    errorRegistro.textContent = mensaje;
    errorRegistro.style.display = 'block';
}