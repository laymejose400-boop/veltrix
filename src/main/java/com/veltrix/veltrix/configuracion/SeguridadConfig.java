package com.veltrix.veltrix.configuracion;

import com.veltrix.veltrix.seguridad.JwtFiltro;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SeguridadConfig {

    private final JwtFiltro jwtFiltro;

    public SeguridadConfig(JwtFiltro jwtFiltro) {
        this.jwtFiltro = jwtFiltro;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/contactos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contactos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categorias").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/carrito/**").hasRole("CLIENTE")
                        .requestMatchers(HttpMethod.POST, "/api/imagenes/subir").hasRole("ADMIN")
                        .requestMatchers("/api/perfil/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/direcciones/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/direcciones/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/direcciones/**").authenticated()
                        .requestMatchers("/api/pedidos/**").hasRole("CLIENTE")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFiltro, AuthorizationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}