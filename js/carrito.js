// ============================================
// VELTRIX - Lógica del carrito de compras (corregido)
// ============================================

const carritoLista = document.getElementById('carritoLista');
const carritoResumen = document.getElementById('carritoResumen');
const carritoVacio = document.getElementById('carritoVacio');
const cargandoCarrito = document.getElementById('cargandoCarrito');

/**
 * Muestra un pequeño mensaje toast en la esquina inferior.
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
 * Carga los items del carrito desde la API y los muestra.
 */
async function cargarCarrito() {
    console.log('🔄 cargarCarrito() llamado');
    if (!estaLogueado()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Limpiar la lista mientras carga
        carritoLista.innerHTML = '';
        carritoResumen.innerHTML = '';
        cargandoCarrito.style.display = 'block';

        const res = await apiFetch('/carrito');
        console.log('📡 GET /api/carrito status:', res.status);
        const items = await res.json();
        console.log('📦 Items recibidos:', items.length, items);
        cargandoCarrito.style.display = 'none';

        if (items.length === 0) {
            console.log('ℹ️ Carrito vacío');
            carritoVacio.style.display = 'block';
            document.getElementById('contadorCarrito').textContent = '0';
            document.getElementById('contadorCarrito').style.display = 'none';
            return;
        }

        carritoVacio.style.display = 'none';
        let total = 0;

        carritoLista.innerHTML = items.map(item => {
            total += item.subtotal;
            return `
                <div class="item-carrito" data-aos="fade-up">
                    <img src="${item.imagenUrl || 'https://via.placeholder.com/100'}" alt="${item.nombreProducto}">
                    <div class="item-info">
                        <div class="item-nombre">${item.nombreProducto}</div>
                        <div class="item-precio">$${item.precioUnitario.toFixed(2)}</div>
                        <div class="item-cantidad">
                            <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">−</button>
                            <span class="cantidad-numero">${item.cantidad}</span>
                            <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="item-subtotal">$${item.subtotal.toFixed(2)}</div>
                    <button class="btn-eliminar" onclick="eliminarItem(${item.id}, '${item.nombreProducto.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-trash"></i> Eliminar
                    </button>
                </div>
            `;
        }).join('');
        console.log('✅ Lista renderizada con', items.length, 'items');

        carritoResumen.innerHTML = `
            <h3 class="resumen-titulo">Resumen del Pedido</h3>
            <div class="resumen-linea">
                <span>Subtotal</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="resumen-linea">
                <span>Envío</span>
                <span>Gratis</span>
            </div>
            <div class="resumen-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="boton-checkout">
                <i class="fa-solid fa-lock"></i> Proceder al Pago
            </a>
        `;

        const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'inline' : 'none';
        }

        if (window.AOS) AOS.refresh();
    } catch (error) {
        console.error('❌ Error en cargarCarrito:', error);
        cargandoCarrito.style.display = 'none';
    }
}

/**
 * Cambia la cantidad de un item del carrito.
 */
async function cambiarCantidad(itemId, delta) {
    try {
        // 1. Obtener la fila actual desde el DOM
        const boton = document.querySelector(`button[onclick*="cambiarCantidad(${itemId}"]`);
        const fila = boton ? boton.closest('.item-carrito') : null;
        if (!fila) {
            // Si no encontramos la fila, recargamos todo como fallback
            await cargarCarrito();
            return;
        }

        // 2. Leer la cantidad actual mostrada
        const cantidadSpan = fila.querySelector('.cantidad-numero');
        let cantidadActual = parseInt(cantidadSpan.textContent.trim(), 10);
        if (isNaN(cantidadActual)) cantidadActual = 0;

        const nuevaCantidad = cantidadActual + delta;
        if (nuevaCantidad < 1) {
            // Si llega a 0, eliminamos el ítem directamente
            await eliminarItem(itemId, '');
            return;
        }

        // 3. Enviar la actualización al backend
        const res = await apiFetch(`/carrito/${itemId}?cantidad=${nuevaCantidad}`, {
            method: 'PUT'
        });
        if (!res.ok) {
            const error = await res.text();
            console.error('Error al actualizar cantidad:', error);
            return;
        }

        // 4. Actualizar el DOM de la fila
        cantidadSpan.textContent = nuevaCantidad;

        // Obtener el precio unitario (puede estar en el atributo data o lo sacamos del texto)
        const precioElement = fila.querySelector('.item-precio');
        let precioUnitario = 0;
        if (precioElement) {
            const precioTexto = precioElement.textContent.replace('$', '').trim();
            precioUnitario = parseFloat(precioTexto);
        }

        const subtotal = precioUnitario * nuevaCantidad;
        const subtotalElement = fila.querySelector('.item-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        // 5. Recalcular el total y actualizar el resumen
        const res2 = await apiFetch('/carrito');
        const items = await res2.json();

        let total = 0;
        items.forEach(item => { total += item.subtotal; });

        document.getElementById('carritoResumen').innerHTML = `
            <h3 class="resumen-titulo">Resumen del Pedido</h3>
            <div class="resumen-linea"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
            <div class="resumen-linea"><span>Envío</span><span>Gratis</span></div>
            <div class="resumen-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
            <a href="checkout.html" class="boton-checkout"><i class="fa-solid fa-lock"></i> Proceder al Pago</a>
        `;

        // 6. Actualizar contador
        const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    } catch (error) {
        console.error('Error al cambiar cantidad:', error);
    }
}

/**
 * Elimina un item del carrito.
 */
async function eliminarItem(itemId, nombre) {
    try {
        const res = await apiFetch(`/carrito/${itemId}`, { method: 'DELETE' });

        if (!res.ok) {
            const error = await res.text();
            console.error('Error del servidor:', error);
            return;
        }

        // 1. Obtener la fila y desvanecerla
        const boton = document.querySelector(`button[onclick*="eliminarItem(${itemId}"]`);
        const fila = boton ? boton.closest('.item-carrito') : null;
        if (fila) {
            fila.style.transition = 'opacity 0.25s, transform 0.25s';
            fila.style.opacity = '0';
            fila.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if (fila.parentNode) fila.remove();
            }, 250);
        }

        // 2. Mostrar mensaje
        mostrarToast(`🗑️ "${nombre}" eliminado`);

        // 3. Obtener la lista real actualizada
        const res2 = await apiFetch('/carrito');
        const items = await res2.json();

        // 4. Si ya no hay items, mostrar carrito vacío
        if (!items.length) {
            document.getElementById('carritoVacio').style.display = 'block';
            document.getElementById('carritoLista').innerHTML = '';
            document.getElementById('carritoResumen').innerHTML = '';
            const contador = document.getElementById('contadorCarrito');
            if (contador) {
                contador.textContent = '0';
                contador.style.display = 'none';
            }
            return;
        }

        // 5. Recalcular resumen
        let total = 0;
        items.forEach(item => { total += item.subtotal; });
        document.getElementById('carritoResumen').innerHTML = `
            <h3 class="resumen-titulo">Resumen del Pedido</h3>
            <div class="resumen-linea"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
            <div class="resumen-linea"><span>Envío</span><span>Gratis</span></div>
            <div class="resumen-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
            <a href="checkout.html" class="boton-checkout"><i class="fa-solid fa-lock"></i> Proceder al Pago</a>
        `;

        // 6. Actualizar contador
        const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        const contador = document.getElementById('contadorCarrito');
        if (contador) {
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    } catch (error) {
        console.error('Error al eliminar item:', error);
    }
}

// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (estaLogueado()) {
        cargarCarrito();
    } else {
        window.location.href = 'login.html';
    }
});