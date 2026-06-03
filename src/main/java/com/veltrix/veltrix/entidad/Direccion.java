package com.veltrix.veltrix.entidad;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "direcciones")
@Data
@NoArgsConstructor
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String calle;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(length = 20)
    private String codigoPostal;

    @Column(nullable = false, length = 100)
    private String pais;

    @Column(nullable = false)
    private Boolean esPrincipal = false;

    // ========== RELACIÓN ==========
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Usuario usuario;
}