// ============================================
// VELTRIX - Historial de pedidos del cliente
// ============================================

const pedidosLista = document.getElementById('pedidosLista');
const sinPedidos = document.getElementById('sinPedidos');
const cargandoPedidos = document.getElementById('cargandoPedidos');

/**
 * Carga el historial de pedidos del usuario desde la API.
 */
async function cargarPedidos() {
    if (!estaLogueado()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        cargandoPedidos.style.display = 'block';
        const res = await apiFetch('/pedidos');
        const pedidos = await res.json();
        cargandoPedidos.style.display = 'none';

        if (pedidos.length === 0) {
            sinPedidos.style.display = 'block';
            pedidosLista.innerHTML = '';
            return;
        }

        sinPedidos.style.display = 'none';

        // Construir tarjeta por cada pedido
        pedidosLista.innerHTML = pedidos.map(pedido => {
            // Productos del pedido
            const productosHTML = pedido.detalles.map(detalle => `
                <div class="pedido-producto">
                    <span class="pedido-producto-nombre">${detalle.nombreProducto}</span>
                    <span class="pedido-producto-detalle">x${detalle.cantidad} · $${detalle.precioUnitario.toFixed(2)}</span>
                    <span class="pedido-producto-precio">$${detalle.subtotal.toFixed(2)}</span>
                </div>
            `).join('');

            // Clase CSS según estado
            const claseEstado = `estado-${pedido.estado.toLowerCase()}`;

            // Fecha formateada
            const fecha = new Date(pedido.creadoEn).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="pedido-tarjeta" data-aos="fade-up">
                    <div class="pedido-cabecera">
                        <span class="pedido-id">Pedido #${pedido.id}</span>
                        <span class="pedido-estado ${claseEstado}">${pedido.estado}</span>
                    </div>
                    <div class="pedido-cuerpo">
                        <div class="pedido-productos">
                            ${productosHTML}
                        </div>
                    </div>
                    <div class="pedido-footer">
                        <span class="pedido-fecha"><i class="fa-solid fa-calendar"></i> ${fecha}</span>
                        <span class="pedido-total">Total: $${pedido.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Refrescar animaciones
        if (window.AOS) AOS.refresh();

    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        cargandoPedidos.style.display = 'none';
    }
}

// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', cargarPedidos);