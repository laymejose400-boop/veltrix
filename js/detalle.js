// ============================================
// VELTRIX - Detalle de producto (con visor 3D Three.js)
// ============================================

const contenedorImagen = document.getElementById('detalleImagen');
const imagenProducto = document.getElementById('imagenProducto');
const visor3D = document.getElementById('visor3D');
const contenedorInfo = document.querySelector('.detalle-info');
const cargandoDetalle = document.getElementById('cargando');

// Mapeo de productos a rutas de modelos 3D 
const MAPEO_MODELOS = {
    
    'Laptop Veltrix Pro 15': 'modelos/laptop-pro15.glb',
    "iPhone 17 Slim Gray": "modelos/iphone_17_slim_gray.glb",
  "iPhone 17 Pro Max Gold": "modelos/iphone_17_pro_max_gold.glb",

  "Laptop Ejecutiva Ultrabook Black": "modelos/laptop_ultrabook_exec_black.glb",
  "MacBook Pro Silver Edition": "modelos/macbook_pro_silver.glb",

  "Auriculares Inalámbricos con Estuche de Carga": "modelos/earbuds_wireless_case.glb",
  "Parlante Bluetooth Portátil Cilíndrico": "modelos/speaker_bluetooth_cylindrical.glb",
  "Audífonos de Diadema Profesionales": "modelos/headphones_pro_overear.glb",
  'Dron Cuadricóptero Semiprofesional con Cámara HD': 
  'modelos/animated_drone.glb',
  'Nothing Buds 2 Pro': 'modelos/nothing_buds_2_pro.glb',
  
};
function obtenerIdProducto() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function cargarDetalle() {
    const id = obtenerIdProducto();
    if (!id) {
        contenedorInfo.innerHTML = '<p style="text-align:center;color:#f44;">Producto no especificado</p>';
        if (cargandoDetalle) cargandoDetalle.style.display = 'none';
        return;
    }

    try {
        if (cargandoDetalle) cargandoDetalle.style.display = 'block';
        const res = await apiFetch(`/productos/${id}`);
        if (!res.ok) {
            contenedorInfo.innerHTML = '<p style="text-align:center;color:#f44;">Producto no encontrado</p>';
            if (cargandoDetalle) cargandoDetalle.style.display = 'none';
            return;
        }

        const prod = await res.json();
        if (cargandoDetalle) cargandoDetalle.style.display = 'none';

        // Determinar si tenemos modelo 3D para este producto
        const rutaModelo = MAPEO_MODELOS[prod.nombre] || null;

        // Ocultar ambos contenedores primero
        contenedorImagen.style.display = 'none';
        visor3D.style.display = 'none';

        if (rutaModelo) {

    visor3D.style.display = 'block';

    visor3D.setAttribute("camera-orbit", "0deg 85deg 4m");

visor3D.setAttribute("shadow-intensity", "1");

visor3D.setAttribute("exposure", "1");

visor3D.setAttribute("auto-rotate", "");

visor3D.setAttribute("background-color", "#ffffff");

visor3D.setAttribute("src", rutaModelo);

visor3D.addEventListener('load', () => {
    visor3D.play();
});


} else {

    contenedorImagen.style.display = 'flex';
    imagenProducto.src = prod.imagenUrl || 'https://via.placeholder.com/400';
    imagenProducto.alt = prod.nombre;
}

        // Construir información del producto (igual que antes)
        contenedorInfo.innerHTML = `
            <div class="detalle-categoria">${prod.nombreCategoria}</div>
            <h1 class="detalle-nombre">${prod.nombre}</h1>
            <div class="detalle-precio">$${prod.precio.toFixed(2)}</div>
            <p class="detalle-descripcion">${prod.descripcion || 'Sin descripción disponible.'}</p>
            <div class="detalle-acciones">
                <button class="btn-agregar-detalle" onclick="agregarDesdeDetalle(${prod.id}, '${prod.nombre.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;

        if (window.AOS) AOS.refresh();
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        if (cargandoDetalle) cargandoDetalle.style.display = 'none';
    }
}

async function agregarDesdeDetalle(productoId, nombreProducto) {
    if (!estaLogueado()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await apiFetch('/carrito', {
            method: 'POST',
            body: JSON.stringify({ productoId, cantidad: 1 })
        });

        if (res.ok) {
            mostrarToastDetalle(`✅ "${nombreProducto}" agregado al carrito`);
            actualizarContadorCarritoDetalle();
        } else {
            const error = await res.json();
            alert(error.message || 'Error al agregar al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function mostrarToastDetalle(mensaje) {
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

async function actualizarContadorCarritoDetalle() {
    const contador = document.getElementById('contadorCarrito');
    if (!contador || !estaLogueado()) return;

    try {
        const res = await apiFetch('/carrito');
        if (res.ok) {
            const items = await res.json();
            const total = items.reduce((sum, item) => sum + item.cantidad, 0);
            contador.textContent = total;
            contador.style.display = total > 0 ? 'inline' : 'none';
        }
    } catch (error) {
        // Silencioso
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarDetalle();
    actualizarContadorCarritoDetalle();
});