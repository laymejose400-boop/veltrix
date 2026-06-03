package com.veltrix.veltrix.seguridad;

import com.veltrix.veltrix.entidad.Usuario;
import com.veltrix.veltrix.repositorio.UsuarioRepositorio;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtFiltro extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioRepositorio usuarioRepositorio;

    public JwtFiltro(JwtUtil jwtUtil, UsuarioRepositorio usuarioRepositorio) {
        this.jwtUtil = jwtUtil;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.esTokenValido(token)) {
                String email = jwtUtil.extraerEmail(token);
                Optional<Usuario> usuarioOpt = usuarioRepositorio.findByEmail(email);

                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    usuario,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre()))
                            );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}