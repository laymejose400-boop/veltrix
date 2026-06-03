package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.AuthRespuesta;
import com.veltrix.veltrix.dto.LoginRequest;
import com.veltrix.veltrix.dto.RegistroRequest;
import com.veltrix.veltrix.servicio.UsuarioServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final UsuarioServicio usuarioServicio;

    public AuthControlador(UsuarioServicio usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }

    // POST /api/auth/registro
    @PostMapping("/registro")
    public ResponseEntity<AuthRespuesta> registrar(@RequestBody RegistroRequest request) {
        return ResponseEntity.ok(usuarioServicio.registrar(request));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthRespuesta> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(usuarioServicio.login(request));
    }
    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> body) {
        usuarioServicio.cambiarPassword(body.get("email"), body.get("password"));
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada"));
    }
}