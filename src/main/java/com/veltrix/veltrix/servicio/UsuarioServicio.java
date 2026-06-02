package com.veltrix.veltrix.servicio;

import com.veltrix.veltrix.dto.AuthRespuesta;
import com.veltrix.veltrix.dto.LoginRequest;
import com.veltrix.veltrix.dto.RegistroRequest;
import com.veltrix.veltrix.entidad.Rol;
import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.excepcion.ExcepcionAuth;
import com.veltrix.veltrix.repositorio.RolRepositorio;
import com.veltrix.veltrix.repositorio.UsuarioRepositorio;
import com.veltrix.veltrix.seguridad.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final RolRepositorio rolRepositorio;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuarioServicio(UsuarioRepositorio usuarioRepositorio,
                           RolRepositorio rolRepositorio,
                           JwtUtil jwtUtil) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.rolRepositorio = rolRepositorio;
        this.jwtUtil = jwtUtil;
    }

    // Registro de nuevo usuario
    public AuthRespuesta registrar(RegistroRequest request) {
        if (usuarioRepositorio.existsByEmail(request.getEmail())) {
            throw new ExcepcionAuth("El email ya está registrado");
        }

        Rol rolCliente = rolRepositorio.findById(2)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(encoder.encode(request.getPassword()));
        usuario.setRol(rolCliente);
        usuario.setActivo(true);
        usuarioRepositorio.save(usuario);

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().getNombre());
        return new AuthRespuesta(token, usuario.getEmail(), usuario.getRol().getNombre(), usuario.getNombre());
    }

    // Login
    public AuthRespuesta login(LoginRequest request) {
        Usuario usuario = usuarioRepositorio.findByEmail(request.getEmail())
                .orElseThrow(() -> new ExcepcionAuth("Email o contraseña incorrectos"));

        if (!encoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new ExcepcionAuth("Email o contraseña incorrectos");
        }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().getNombre());
        return new AuthRespuesta(token, usuario.getEmail(), usuario.getRol().getNombre(), usuario.getNombre());
    }
}