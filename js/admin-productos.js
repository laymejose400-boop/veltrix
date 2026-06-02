// ============================================
// VELTRIX ADMIN - Gestión de productos
// ============================================

const tbody = document.getElementById('tbodyProductos');
const modal = document.getElementById('modalProducto');
const formProducto = document.getElementById('formProducto');
const modalTitulo = document.getElementById('modalTitulo');
const errorModal = document.getElementById('errorModal');
const btnGuardar = document.getElementById('btnGuardarProducto');
let productoEditandoId = null;

// Verificar que sea admin
if (obtenerRol() !== 'ADMIN') {
    window.location.href = '../login.html';
}

// Cargar productos en la tabla
async function cargarProductosAdmin() {
    try {
        document.getElementById('cargandoAdminProductos').style.display = 'block';
        const res = await apiFetch('/productos');
        const productos = await res.json();
        document.getElementById('cargandoAdminProductos').style.display = 'none';

        tbody.innerHTML = productos.map(prod => `
            <tr>
                <td>#${prod.id}</td>
                <td><img src="${prod.imagenUrl || 'https://via.placeholder.com/50'}" alt="${prod.nombre}"></td>
                <td>${prod.nombre}</td>
                <td>${prod.nombreCategoria}</td>
                <td>$${prod.precio.toFixed(2)}</td>
                <td>${prod.stock !== undefined ? prod.stock : 'N/A'}</td>
                <td>
                    <button class="btn-accion editar" onclick="editarProducto(${prod.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-accion eliminar" onclick="eliminarProducto(${prod.id}, '${prod.nombre.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error(error);
        document.getElementById('cargandoAdminProductos').style.display = 'none';
    }
}

// Cargar categorías en el select del modal
async function cargarCategoriasSelect() {
    const select = document.getElementById('prodCategoria');
    const res = await apiFetch('/categorias');
    const categorias = await res.json();
    select.innerHTML = categorias.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('');
}

// Abrir modal para nuevo producto
document.getElementById('btnNuevoProducto').addEventListener('click', () => {
    productoEditandoId = null;
    modalTitulo.textContent = 'Nuevo Producto';
    formProducto.reset();
    errorModal.style.display = 'none';
    modal.classList.add('visible');
});

// Cerrar modal
function cerrarModal() {
    modal.classList.remove('visible');
}

// Guardar producto (crear o actualizar)
formProducto.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorModal.style.display = 'none';

    
const archivoInput = document.getElementById('prodImagenArchivo');
if (archivoInput && archivoInput.files.length > 0) {
    const formData = new FormData();
    formData.append('archivo', archivoInput.files[0]);
    
    try {
        const res = await fetch('http://localhost:8080/api/imagenes/subir', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        });
        const data = await res.json();
        if (data.url) {
            document.getElementById('prodImagen').value = 'http://localhost:8080' + data.url;
        }
    } catch (error) {
        errorModal.textContent = 'Error al subir la imagen';
        errorModal.style.display = 'block';
        return;
    }
}

    const nombre = document.getElementById('prodNombre').value.trim();
    const descripcion = document.getElementById('prodDescripcion').value.trim();
    const precio = parseFloat(document.getElementById('prodPrecio').value);
    const stock = parseInt(document.getElementById('prodStock').value);
    const categoriaId = parseInt(document.getElementById('prodCategoria').value);
    const imagenUrl = document.getElementById('prodImagen').value.trim();

    if (!nombre || isNaN(precio) || isNaN(stock) || !categoriaId) {
        errorModal.textContent = 'Completa todos los campos obligatorios.';
        errorModal.style.display = 'block';
        return;
    }

    const body = { nombre, descripcion, precio, stock, imagenUrl, categoriaId };

    try {
        let res;
        if (productoEditandoId) {
            // Actualizar
            res = await apiFetch(`/productos/${productoEditandoId}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            });
        } else {
            // Crear
            res = await apiFetch('/productos', {
                method: 'POST',
                body: JSON.stringify(body)
            });
        }

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Error al guardar producto');
        }

        cerrarModal();
        cargarProductosAdmin();
        mostrarToast(' Producto guardado exitosamente');

    } catch (error) {
        errorModal.textContent = error.message;
        errorModal.style.display = 'block';
    }
});

// Editar producto (cargar datos en modal)
async function editarProducto(id) {
    const res = await apiFetch(`/productos/${id}`);
    if (!res.ok) return;
    const prod = await res.json();

    productoEditandoId = prod.id;
    modalTitulo.textContent = 'Editar Producto';
    document.getElementById('prodNombre').value = prod.nombre;
    document.getElementById('prodDescripcion').value = prod.descripcion || '';
    document.getElementById('prodPrecio').value = prod.precio;
    document.getElementById('prodStock').value = prod.stock;
    document.getElementById('prodImagen').value = prod.imagenUrl || '';
    // Seleccionar la categoría correcta
    await cargarCategoriasSelect();
    document.getElementById('prodCategoria').value = prod.nombreCategoria ? 
        (await obtenerIdCategoriaPorNombre(prod.nombreCategoria)) : '';
    errorModal.style.display = 'none';
    modal.classList.add('visible');
}

// Obtener id de categoría por nombre (auxiliar)
async function obtenerIdCategoriaPorNombre(nombre) {
    const res = await apiFetch('/categorias');
    const cats = await res.json();
    const cat = cats.find(c => c.nombre === nombre);
    return cat ? cat.id : '';
}

// Eliminar producto
let callbackEliminar = null;

function mostrarModalConfirmar(mensaje, callback) {
    document.getElementById('modalMensaje').textContent = mensaje;
    document.getElementById('modalConfirmar').style.display = 'flex';
    callbackEliminar = callback;
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalConfirmar');
    if (modal) {
        document.getElementById('modalCancelar').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        document.getElementById('modalAceptar').addEventListener('click', () => {
            modal.style.display = 'none';
            if (callbackEliminar) callbackEliminar();
        });
    }
});

async function eliminarProducto(id, nombre) {
    mostrarModalConfirmar(`¿Eliminar "${nombre}"? Esta acción lo desactivará.`, async () => {
        try {
            const res = await apiFetch(`/productos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                cargarProductosAdmin();
                mostrarToast(`🗑️ "${nombre}" eliminado`);
            } else {
                const error = await res.text();
                throw new Error(error || 'Error al eliminar');
            }
        } catch (error) {
            console.error(error);
            alert('Error al eliminar producto: ' + error.message);
        }
    });
}
// Mostrar mensaje toast
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

// Iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosAdmin();
    cargarCategoriasSelect();
});