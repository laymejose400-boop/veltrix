package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.PerfilRequest;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.repositorio.UsuarioRepositorio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/perfil")
public class PerfilControlador {

    private final UsuarioRepositorio usuarioRepositorio;

    public PerfilControlador(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    // GET /api/perfil → ver mis datos
    @GetMapping
    public ResponseEntity<Map<String, String>> verPerfil(@AuthenticationPrincipal Usuario usuario) {
        Map<String, String> datos = new HashMap<>();
        datos.put("nombre", usuario.getNombre());
        datos.put("email", usuario.getEmail());
        return ResponseEntity.ok(datos);
    }

    // PUT /api/perfil → actualizar mis datos
    @PutMapping
    public ResponseEntity<Map<String, String>> actualizarPerfil(@AuthenticationPrincipal Usuario usuario,
                                                                @RequestBody PerfilRequest request) {
        // Verificar si el nuevo email ya lo tiene otro usuario
        Optional<Usuario> emailExistente = usuarioRepositorio.findByEmail(request.getEmail());
        if (emailExistente.isPresent() && !emailExistente.get().getId().equals(usuario.getId())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "El email ya está en uso por otro usuario");
            return ResponseEntity.badRequest().body(error);
        }

        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuarioRepositorio.save(usuario);

        Map<String, String> datos = new HashMap<>();
        datos.put("nombre", usuario.getNombre());
        datos.put("email", usuario.getEmail());
        datos.put("mensaje", "Perfil actualizado correctamente");
        return ResponseEntity.ok(datos);
    }
}