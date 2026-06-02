package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.AgregarCarritoRequest;
import com.veltrix.veltrix.dto.CarritoItemRespuesta;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.servicio.CarritoServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoControlador {

    private final CarritoServicio carritoServicio;

    public CarritoControlador(CarritoServicio carritoServicio) {
        this.carritoServicio = carritoServicio;
    }

    // GET /api/carrito
    @GetMapping
    public ResponseEntity<List<CarritoItemRespuesta>> ver(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carritoServicio.verCarrito(usuario.getId()));
    }

    // POST /api/carrito
    @PostMapping
    public ResponseEntity<CarritoItemRespuesta> agregar(@AuthenticationPrincipal Usuario usuario,
                                                        @RequestBody AgregarCarritoRequest request) {
        return ResponseEntity.ok(carritoServicio.agregar(usuario, request));
    }

    // PUT /api/carrito/1
    @PutMapping("/{id}")
    public ResponseEntity<CarritoItemRespuesta> actualizar(@PathVariable Integer id,
                                                           @RequestParam Integer cantidad,
                                                           @AuthenticationPrincipal Usuario usuario) {
        return carritoServicio.actualizarCantidad(id, cantidad, usuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/carrito/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id,
                                         @AuthenticationPrincipal Usuario usuario) {
        if (carritoServicio.eliminar(id, usuario)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}