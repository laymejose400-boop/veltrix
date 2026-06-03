package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.entidad.Direccion;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.repositorio.DireccionRepositorio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionControlador {

    private final DireccionRepositorio direccionRepositorio;

    public DireccionControlador(DireccionRepositorio direccionRepositorio) {
        this.direccionRepositorio = direccionRepositorio;
    }

    // GET /api/direcciones → listar mis direcciones
    @GetMapping
    public List<Direccion> listar(@AuthenticationPrincipal Usuario usuario) {
        return direccionRepositorio.findByUsuarioId(usuario.getId());
    }

    // POST /api/direcciones → agregar dirección
    @PostMapping
    public Direccion crear(@AuthenticationPrincipal Usuario usuario, @RequestBody Direccion direccion) {
        direccion.setUsuario(usuario);
        return direccionRepositorio.save(direccion);
    }

    // DELETE /api/direcciones/{id} → eliminar dirección
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        return direccionRepositorio.findById(id)
                .filter(d -> d.getUsuario().getId().equals(usuario.getId()))
                .map(d -> {
                    direccionRepositorio.delete(d);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}