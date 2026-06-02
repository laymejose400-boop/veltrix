package com.veltrix.veltrix.servicio;

import com.veltrix.veltrix.dto.DetallePedidoRespuesta;
import com.veltrix.veltrix.dto.PedidoRespuesta;
import com.veltrix.veltrix.entidad.*;
import com.veltrix.veltrix.repositorio.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoServicio {

    private final PedidoRepositorio pedidoRepositorio;
    private final CarritoRepositorio carritoRepositorio;
    private final ProductoRepositorio productoRepositorio;
    private final EstadoPedidoRepositorio estadoPedidoRepositorio;

    public PedidoServicio(PedidoRepositorio pedidoRepositorio,
                          CarritoRepositorio carritoRepositorio,
                          ProductoRepositorio productoRepositorio,
                          EstadoPedidoRepositorio estadoPedidoRepositorio) {
        this.pedidoRepositorio = pedidoRepositorio;
        this.carritoRepositorio = carritoRepositorio;
        this.productoRepositorio = productoRepositorio;
        this.estadoPedidoRepositorio = estadoPedidoRepositorio;
    }

    @Transactional
    public PedidoRespuesta crearPedido(Usuario usuario) {
        List<Carrito> itemsCarrito = carritoRepositorio.findByUsuarioId(usuario.getId());

        if (itemsCarrito.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        for (Carrito item : itemsCarrito) {
            Producto producto = item.getProducto();
            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        EstadoPedido estadoPendiente = estadoPedidoRepositorio.findById(1)
                .orElseThrow(() -> new RuntimeException("Estado PENDIENTE no encontrado"));
        pedido.setEstadoActual(estadoPendiente);

        BigDecimal total = BigDecimal.ZERO;
        List<DetallePedido> detalles = new ArrayList<>();

        for (Carrito item : itemsCarrito) {
            Producto producto = item.getProducto();
            BigDecimal precioUnitario = producto.getPrecio();
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));
            total = total.add(subtotal);

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalles.add(detalle);

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepositorio.save(producto);
        }

        pedido.setTotal(total);
        pedido.setDetalles(detalles);
        pedidoRepositorio.save(pedido);

        carritoRepositorio.deleteByUsuarioId(usuario.getId());

        return convertirADto(pedido);
    }

    public List<PedidoRespuesta> historial(Usuario usuario) {
        return pedidoRepositorio.findByUsuarioIdOrderByCreadoEnDesc(usuario.getId())
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Admin: Listar todos los pedidos
    public List<PedidoRespuesta> listarTodos() {
        return pedidoRepositorio.findAllByOrderByCreadoEnDesc()
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Admin: Cambiar estado del pedido
    public PedidoRespuesta cambiarEstado(Integer id, String nuevoEstado) {
        Pedido pedido = pedidoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        EstadoPedido estado = estadoPedidoRepositorio.findByNombre(nuevoEstado)
                .orElseThrow(() -> new RuntimeException("Estado no encontrado"));

        pedido.setEstadoActual(estado);
        pedido.setActualizadoEn(LocalDateTime.now());
        pedidoRepositorio.save(pedido);

        return convertirADto(pedido);
    }

    private PedidoRespuesta convertirADto(Pedido pedido) {
        List<DetallePedidoRespuesta> detallesDto = pedido.getDetalles().stream()
                .map(d -> new DetallePedidoRespuesta(
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad()))
                ))
                .collect(Collectors.toList());

        return new PedidoRespuesta(
                pedido.getId(),
                pedido.getTotal(),
                pedido.getEstadoActual().getNombre(),
                pedido.getCreadoEn(),
                pedido.getUsuario().getEmail(),
                detallesDto
        );
    }
}