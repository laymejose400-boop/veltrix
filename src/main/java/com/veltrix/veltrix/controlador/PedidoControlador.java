package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.PedidoRespuesta;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.servicio.PedidoServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoControlador {

    private final PedidoServicio pedidoServicio;

    public PedidoControlador(PedidoServicio pedidoServicio) {
        this.pedidoServicio = pedidoServicio;
    }

    // POST /api/pedidos → Crear pedido desde carrito
    @PostMapping
    public ResponseEntity<PedidoRespuesta> crear(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pedidoServicio.crearPedido(usuario));
    }

    // GET /api/pedidos → Historial de pedidos
    @GetMapping
    public ResponseEntity<List<PedidoRespuesta>> historial(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pedidoServicio.historial(usuario));
    }
}