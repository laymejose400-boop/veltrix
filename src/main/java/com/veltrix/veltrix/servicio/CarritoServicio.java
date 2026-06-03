package com.veltrix.veltrix.servicio;

import com.veltrix.veltrix.dto.AgregarCarritoRequest;
import com.veltrix.veltrix.dto.CarritoItemRespuesta;
import com.veltrix.veltrix.entidad.Carrito;
import com.veltrix.veltrix.entidad.Producto;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.repositorio.CarritoRepositorio;
import com.veltrix.veltrix.repositorio.ProductoRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarritoServicio {

    private final CarritoRepositorio carritoRepositorio;
    private final ProductoRepositorio productoRepositorio;

    public CarritoServicio(CarritoRepositorio carritoRepositorio,
                           ProductoRepositorio productoRepositorio) {
        this.carritoRepositorio = carritoRepositorio;
        this.productoRepositorio = productoRepositorio;
    }

    // Ver carrito del usuario
    public List<CarritoItemRespuesta> verCarrito(Integer usuarioId) {
        return carritoRepositorio.findByUsuarioId(usuarioId)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Agregar producto al carrito
    public CarritoItemRespuesta agregar(Usuario usuario, AgregarCarritoRequest request) {
        Producto producto = productoRepositorio.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Optional<Carrito> existente = carritoRepositorio
                .findByUsuarioIdAndProductoId(usuario.getId(), request.getProductoId());

        Carrito item;
        if (existente.isPresent()) {
            item = existente.get();
            item.setCantidad(item.getCantidad() + request.getCantidad());
        } else {
            item = new Carrito();
            item.setUsuario(usuario);
            item.setProducto(producto);
            item.setCantidad(request.getCantidad());
        }

        Carrito guardado = carritoRepositorio.save(item);
        return convertirADto(guardado);
    }

    // Actualizar cantidad
    public Optional<CarritoItemRespuesta> actualizarCantidad(Integer id, Integer cantidad, Usuario usuario) {
        return carritoRepositorio.findById(id).map(item -> {
            if (!item.getUsuario().getId().equals(usuario.getId())) {
                throw new RuntimeException("No autorizado");
            }
            item.setCantidad(cantidad);
            return convertirADto(carritoRepositorio.save(item));
        });
    }

    // Eliminar item del carrito
    public boolean eliminar(Integer id, Usuario usuario) {
        return carritoRepositorio.findById(id).map(item -> {
            if (!item.getUsuario().getId().equals(usuario.getId())) {
                throw new RuntimeException("No autorizado");
            }
            carritoRepositorio.delete(item);
            return true;
        }).orElse(false);
    }

    // Vaciar carrito
    @Transactional
    public void vaciar(Integer usuarioId) {
        carritoRepositorio.deleteByUsuarioId(usuarioId);
    }

    // Conversión a DTO
    private CarritoItemRespuesta convertirADto(Carrito item) {
        BigDecimal subtotal = item.getProducto().getPrecio()
                .multiply(BigDecimal.valueOf(item.getCantidad()));

        return new CarritoItemRespuesta(
                item.getId(),
                item.getProducto().getId(),
                item.getProducto().getNombre(),
                item.getProducto().getPrecio(),
                item.getCantidad(),
                subtotal,
                item.getProducto().getImagenUrl()
        );
    }
}