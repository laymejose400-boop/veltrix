// ============================================
// VELTRIX - Catálogo de productos
// ============================================

const contenedorCatalogo = document.getElementById('catalogoProductos');
const contenedorFiltros = document.querySelector('.filtro-categorias');
const cargando = document.getElementById('cargando');

/**
 * Carga las categorías desde la API y crea los botones de filtro.
 */
async function cargarCategorias() {
    try {
        const res = await apiFetch('/categorias');
        const categorias = await res.json();

        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filtro-btn';
            btn.textContent = cat.nombre;
            btn.dataset.categoria = cat.id;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');
                cargarProductos(cat.id);
            });
            contenedorFiltros.appendChild(btn);
        });

        const btnTodos = document.querySelector('[data-categoria=""]');
        if (btnTodos) {
            btnTodos.addEventListener('click', () => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
                btnTodos.classList.add('activo');
                cargarProductos();
            });
        }

    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

/**
 * Carga los productos desde la API y los muestra en la grilla.
 * @param {number|null} categoriaId
 */
let productosActuales = [];

async function cargarProductos(categoriaId = null) {
    if (cargando) cargando.style.display = 'block';
    if (contenedorCatalogo) contenedorCatalogo.innerHTML = '';

    try {
        let endpoint = '/productos';
        if (categoriaId) {
            endpoint = `/productos/buscar?categoria=${categoriaId}`;
        }

        const res = await apiFetch(endpoint);
        const productos = await res.json();
        productosActuales = productos;

        if (cargando) cargando.style.display = 'none';

        // Solo mostrar los primeros 4 si hay categoría seleccionada
        const productosMostrar = categoriaId ? productos.slice(0, 4) : productos.slice(0, 8);

        renderizarProductos(productosMostrar);

        // Mostrar botón "Ver más" si hay categoría y más de 4 productos
        const verMasContenedor = document.getElementById('verMasContenedor');
        const btnVerMas = document.getElementById('btnVerMas');
        const verMasCategoria = document.getElementById('verMasCategoria');

        if (verMasContenedor && categoriaId && productos.length > 4) {
            verMasContenedor.style.display = 'block';
            const nombreCategoria = productos[0].nombreCategoria;
            verMasCategoria.textContent = nombreCategoria;
            btnVerMas.href = `catalogo.html?categoria=${categoriaId}`;
        } else if (verMasContenedor) {
            verMasContenedor.style.display = 'none';
        }

    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (cargando) cargando.style.display = 'none';
        contenedorCatalogo.innerHTML = '<p style="text-align:center;color:#f44;">Error al cargar productos</p>';
    }
}
function renderizarProductos(productos) {
    if (!contenedorCatalogo) return;

    if (productos.length === 0) {
        contenedorCatalogo.innerHTML = `
            <div class="sin-productos" data-aos="fade-up">
                <i class="fa-solid fa-magnifying-glass" style="font-size:4rem; color: var(--primario);"></i>
                <p style="text-align:center; color: #888; margin-top:20px;">No se encontraron productos</p>
            </div>`;
        return;
    }

    contenedorCatalogo.innerHTML = '';
    productos.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.setAttribute('data-aos', 'fade-up');
        tarjeta.innerHTML = `
            <img src="${prod.imagenUrl || 'https://via.placeholder.com/300'}" alt="${prod.nombre}">
            <div class="tarjeta-cuerpo">
                <div class="tarjeta-categoria">${prod.nombreCategoria}</div>
                <h3 class="tarjeta-nombre">${prod.nombre}</h3>
                <div class="tarjeta-precio">$${prod.precio.toFixed(2)}</div>
                <div class="tarjeta-botones">
                    <a href="detalle.html?id=${prod.id}" class="btn-detalle">Detalles</a>
                    <button class="btn-carrito" onclick="agregarAlCarrito(${prod.id}, '${prod.nombre}')">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        contenedorCatalogo.appendChild(tarjeta);
    });

    if (window.AOS) AOS.refresh();
}

/**
 * Agrega un producto al carrito (si está logueado).
 */
async function agregarAlCarrito(productoId, nombreProducto) {
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
            mostrarToast(`✅ "${nombreProducto}" agregado al carrito`);
            actualizarContadorCarrito();
        } else {
            const error = await res.json();
            alert(error.message || 'Error al agregar al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

/**
 * Muestra un pequeño mensaje toast.
 */
function mostrarToast(mensaje) {
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

/**
 * Actualiza el número del badge del carrito. Solo si es CLIENTE.
 */
async function actualizarContadorCarrito() {
    const contador = document.getElementById('contadorCarrito');
    if (!contador) return;

    // Solo clientes tienen carrito, los admin no
    if (!estaLogueado() || obtenerRol() !== 'CLIENTE') {
        contador.style.display = 'none';
        return;
    }

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

// Búsqueda en tiempo real
const inputBusqueda = document.getElementById('busquedaProductos');
if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();
        const filtrados = productosActuales.filter(prod =>
            prod.nombre.toLowerCase().includes(termino) ||
            prod.nombreCategoria.toLowerCase().includes(termino)
        );
        renderizarProductos(filtrados);
    });
}
// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
    actualizarContadorCarrito();
});