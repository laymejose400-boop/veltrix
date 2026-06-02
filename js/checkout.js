// ============================================
// VELTRIX – Lógica de checkout (seguro)
// ============================================

const checkoutResumen = document.getElementById('checkoutResumen');
const btnConfirmar = document.getElementById('btnConfirmar');
const errorCheckout = document.getElementById('errorCheckout');

/**
 * Carga los items del carrito y muestra el resumen.
 * NO modifica el carrito (solo lectura).
 */
async function cargarCheckout() {
    if (!estaLogueado()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await apiFetch('/carrito');
        const items = await res.json();

        if (items.length === 0) {
            mostrarErrorCheckout('Tu carrito está vacío. Agrega productos primero.');
            setTimeout(() => {
                window.location.href = 'carrito.html';
            }, 1500);
            return;
        }

        let total = 0;

        const itemsHTML = items.map(item => {
            total += item.subtotal;
            return `
                <div class="checkout-item">
                    <span class="checkout-item-nombre">${item.nombreProducto}</span>
                    <span class="checkout-item-cantidad">x${item.cantidad}</span>
                    <span class="checkout-item-precio">$${item.subtotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        checkoutResumen.innerHTML = `
            <h3 class="resumen-titulo">Resumen del Pedido</h3>
            ${itemsHTML}
            <div class="checkout-total">
                <span>Total a Pagar</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;

    } catch (error) {
        console.error('Error al cargar checkout:', error);
        mostrarErrorCheckout('Error al cargar los datos del carrito.');
    }
}

/**
 * Confirma el pedido llamando a la API.
 * Solo aquí se crea el pedido (el backend vacía el carrito).
 */
async function confirmarPedido() {
    const metodoPago = document.querySelector('input[name="pago"]:checked');
    const metodo = metodoPago ? metodoPago.value : 'TARJETA';

    btnConfirmar.disabled = true;
    btnConfirmar.innerHTML = '<span class="spinner-3d" style="width:20px;height:20px;border-width:2px;"></span> Procesando...';
    errorCheckout.style.display = 'none';

    try {
        const respuesta = await apiFetch('/pedidos', {
            method: 'POST'
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.message || 'Error al crear el pedido');
        }

        const pedido = await respuesta.json();

        // Mostrar pantalla de éxito
        checkoutResumen.innerHTML = `
            <div style="text-align:center; padding: 40px 0;">
                <i class="fa-solid fa-circle-check" style="font-size: 5rem; color: #00ff88; animation: pulso 1s ease infinite;"></i>
                <h3 style="color: var(--texto-claro); margin-top: 24px;">¡Pedido #${pedido.id} Confirmado!</h3>
                <p style="color: #aaa; margin: 12px 0;">Total: $${pedido.total.toFixed(2)}</p>
                <p style="color: #888;">Estado: ${pedido.estado}</p>
                <a href="mis-pedidos.html" class="boton-checkout" style="margin-top:24px; display:inline-flex;">
                    <i class="fa-solid fa-box"></i> Ver Mis Pedidos
                </a>
                <a href="index.html" class="btn-detalle" style="margin-top:12px; display:inline-block;">
                    Seguir Comprando
                </a>
            </div>
        `;

        document.querySelector('.checkout-form').style.display = 'none';
        actualizarContadorCarrito();

    } catch (error) {
        mostrarErrorCheckout(error.message || 'Error al procesar el pedido');
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = '<span>Confirmar Pedido</span><i class="fa-solid fa-lock"></i>';
    }
}

function mostrarErrorCheckout(mensaje) {
    errorCheckout.textContent = mensaje;
    errorCheckout.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    cargarCheckout();
    actualizarContadorCarrito();
});