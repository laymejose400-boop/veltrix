package com.veltrix.veltrix.seguridad;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey clave = Keys.hmacShaKeyFor(
            "Veltrix2026SecretKeyParaJWTCon256Bits!!".getBytes()
    );

    // Generar token
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(clave)
                .compact();
    }

    // Extraer email del token
    public String extraerEmail(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Validar token
    public boolean esTokenValido(String token) {
        try {
            Jwts.parser()
                    .verifyWith(clave)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}