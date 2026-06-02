// ============================================
// VELTRIX ADMIN - Gestión de pedidos
// ============================================

const tbodyPedidos = document.getElementById('tbodyPedidos');
let pedidoActualId = null;

// Verificar que sea admin
if (obtenerRol() !== 'ADMIN') {
    window.location.href = '../login.html';
}

// Cargar todos los pedidos
async function cargarPedidosAdmin() {
    try {
        document.getElementById('cargandoAdminPedidos').style.display = 'block';
        const res = await apiFetch('/admin/pedidos');
        const pedidos = await res.json();
        document.getElementById('cargandoAdminPedidos').style.display = 'none';

        tbodyPedidos.innerHTML = pedidos.map(ped => {
            const fecha = new Date(ped.creadoEn).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            const claseEstado = `estado-${ped.estado.toLowerCase()}`;
            return `
                <tr>
                    <td>#${ped.id}</td>
                    <td>${ped.email || 'N/A'}</td>
                    <td>$${ped.total.toFixed(2)}</td>
                    <td><span class="pedido-estado ${claseEstado}">${ped.estado}</span></td>
                    <td>${fecha}</td>
                    <td>
                        <button class="btn-accion editar" onclick="verDetallePedido(${ped.id})"><i class="fa-solid fa-eye"></i> Ver</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error(error);
        document.getElementById('cargandoAdminPedidos').style.display = 'none';
    }
}

// Ver detalle del pedido en el modal
async function verDetallePedido(id) {
    try {
        const res = await apiFetch('/admin/pedidos');
        const pedidos = await res.json();
        const pedido = pedidos.find(p => p.id === id);
        if (!pedido) return;

        pedidoActualId = pedido.id;
        document.getElementById('nuevoEstado').value = pedido.estado;

        const detallesHTML = pedido.detalles.map(d => `
    <div class="pedido-producto" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <span style="flex: 1; color: var(--texto-claro);">${d.nombreProducto}</span>
        <span style="color: #888; margin: 0 20px; white-space: nowrap;">x${d.cantidad}</span>
        <span style="font-weight: 700; color: var(--primario); white-space: nowrap;">$${d.subtotal.toFixed(2)}</span>
    </div>
`).join('');

        document.getElementById('modalPedidoContenido').innerHTML = `
            <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
            <p><strong>Estado:</strong> ${pedido.estado}</p>
            <p><strong>Cliente:</strong> ${pedido.email || 'N/A'}</p>
            <div class="pedido-productos" style="margin-top:15px;">${detallesHTML}</div>
        `;

        document.getElementById('modalPedido').classList.add('visible');
    } catch (error) {
        console.error(error);
    }
}

// Cambiar estado del pedido
async function cambiarEstadoPedido() {
    if (!pedidoActualId) return;
    const nuevoEstado = document.getElementById('nuevoEstado').value;

    try {
        const res = await apiFetch(`/admin/pedidos/${pedidoActualId}/estado`, {
            method: 'PUT',
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (res.ok) {
            document.getElementById('modalPedido').classList.remove('visible');
            cargarPedidosAdmin();
            mostrarToastAdmin(`✅ Pedido #${pedidoActualId} actualizado a ${nuevoEstado}`);
        } else {
            const err = await res.text();
            alert(err || 'Error al cambiar estado');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
}

// Toast para admin
function mostrarToastAdmin(mensaje) {
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
document.addEventListener('DOMContentLoaded', cargarPedidosAdmin);