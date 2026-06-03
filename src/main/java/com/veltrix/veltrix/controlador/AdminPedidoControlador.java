package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.PedidoRespuesta;
import com.veltrix.veltrix.servicio.PedidoServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminPedidoControlador {

    private final PedidoServicio pedidoServicio;

    public AdminPedidoControlador(PedidoServicio pedidoServicio) {
        this.pedidoServicio = pedidoServicio;
    }

    // GET /api/admin/pedidos
    @GetMapping
    public ResponseEntity<List<PedidoRespuesta>> listarTodos() {
        return ResponseEntity.ok(pedidoServicio.listarTodos());
    }

    // PUT /api/admin/pedidos/{id}/estado
    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoRespuesta> cambiarEstado(@PathVariable Integer id,
                                                         @RequestBody Map<String, String> body) {
        String nuevoEstado = body.get("estado");
        return ResponseEntity.ok(pedidoServicio.cambiarEstado(id, nuevoEstado));
    }
}