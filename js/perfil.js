// ============================================
// VELTRIX - Página de Perfil
// ============================================

const formPerfil = document.getElementById('formPerfil');
const perfilNombre = document.getElementById('perfilNombre');
const perfilEmail = document.getElementById('perfilEmail');
const errorPerfil = document.getElementById('errorPerfil');
const btnGuardarPerfil = document.getElementById('btnGuardarPerfil');
const listaDirecciones = document.getElementById('listaDirecciones');

// Verificar que esté logueado
if (!estaLogueado()) {
    window.location.href = 'login.html';
}

// Cargar datos del perfil
async function cargarPerfil() {
    try {
        const res = await apiFetch('/perfil');
        if (res.ok) {
            const datos = await res.json();
            perfilNombre.value = datos.nombre || '';
            perfilEmail.value = datos.email || '';
        }
    } catch (error) {
        console.error('Error al cargar perfil:', error);
    }
}

// Guardar cambios del perfil
formPerfil.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorPerfil.style.display = 'none';

    const nombre = perfilNombre.value.trim();
    const email = perfilEmail.value.trim();

    if (!nombre || !email) {
        errorPerfil.textContent = 'Completa todos los campos.';
        errorPerfil.style.display = 'block';
        return;
    }

    btnGuardarPerfil.disabled = true;
    btnGuardarPerfil.innerHTML = '<span class="spinner-3d" style="width:20px;height:20px;border-width:2px;"></span> Guardando...';

    try {
        const res = await apiFetch('/perfil', {
            method: 'PUT',
            body: JSON.stringify({ nombre, email })
        });

        if (res.ok) {
            const datos = await res.json();
            // Actualizar nombre en localStorage y navbar
            localStorage.setItem('nombre', datos.nombre);
            localStorage.setItem('email', datos.email);
            mostrarToastPerfil('✅ Perfil actualizado correctamente');
            actualizarNav();
        } else {
            const err = await res.json();
            errorPerfil.textContent = err.message || 'Error al guardar';
            errorPerfil.style.display = 'block';
        }
    } catch (error) {
        errorPerfil.textContent = 'Error de conexión';
        errorPerfil.style.display = 'block';
    }

    btnGuardarPerfil.disabled = false;
    btnGuardarPerfil.innerHTML = '<span>Guardar Cambios</span><i class="fa-solid fa-floppy-disk"></i>';
});

// Cargar direcciones
async function cargarDirecciones() {
    try {
        const res = await apiFetch('/direcciones');
        if (res.ok) {
            const direcciones = await res.json();
            if (direcciones.length === 0) {
                listaDirecciones.innerHTML = '<p style="color:#888;">No tienes direcciones guardadas.</p>';
                return;
            }
            listaDirecciones.innerHTML = direcciones.map(d => `
                <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--borde); border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                    <p style="color: var(--texto-claro); margin-bottom: 6px;"><i class="fa-solid fa-location-dot" style="color: var(--primario);"></i> ${d.calle}, ${d.ciudad}</p>
                    <p style="color: #888; font-size: 0.9rem;">CP: ${d.codigoPostal || 'N/A'} | ${d.pais}</p>
                    <button style="background:none; border:none; color: #f44; cursor:pointer; margin-top: 8px;" onclick="eliminarDireccion(${d.id})">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar direcciones:', error);
    }
}

// Mostrar formulario de nueva dirección
function mostrarFormDireccion() {
    document.getElementById('formDireccion').style.display = 'block';
}

// Guardar nueva dirección
async function guardarDireccion() {
    const calle = document.getElementById('dirCalle').value.trim();
    const ciudad = document.getElementById('dirCiudad').value.trim();
    const codigoPostal = document.getElementById('dirCodigoPostal').value.trim();
    const pais = document.getElementById('dirPais').value.trim();

    if (!calle || !ciudad || !pais) {
        alert('Completa calle, ciudad y país.');
        return;
    }

    try {
        const res = await apiFetch('/direcciones', {
            method: 'POST',
            body: JSON.stringify({ calle, ciudad, codigoPostal, pais, esPrincipal: false })
        });

        if (res.ok) {
            mostrarToastPerfil('✅ Dirección guardada');
            document.getElementById('formDireccion').style.display = 'none';
            document.getElementById('dirCalle').value = '';
            document.getElementById('dirCiudad').value = '';
            document.getElementById('dirCodigoPostal').value = '';
            document.getElementById('dirPais').value = '';
            cargarDirecciones();
        } else {
            alert('Error al guardar dirección');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

// Eliminar dirección
async function eliminarDireccion(id) {
    if (!confirm('¿Eliminar esta dirección?')) return;

    try {
        const res = await apiFetch(`/direcciones/${id}`, { method: 'DELETE' });
        if (res.ok) {
            mostrarToastPerfil('🗑️ Dirección eliminada');
            cargarDirecciones();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Toast local
function mostrarToastPerfil(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
    
    if (obtenerRol() !== 'ADMIN') {
        cargarDirecciones();
    } else {
        const tarjetas = document.querySelectorAll('.auth-tarjeta');
        if (tarjetas.length >= 2) {
            tarjetas[1].style.display = 'none';
        }
    }
    
    actualizarNav();
});

function cancelarDireccion() {
    document.getElementById('formDireccion').style.display = 'none';
    document.getElementById('dirCalle').value = '';
    document.getElementById('dirCiudad').value = '';
    document.getElementById('dirCodigoPostal').value = '';
    document.getElementById('dirPais').value = '';
}