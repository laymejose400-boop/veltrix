package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepositorio extends JpaRepository<Direccion, Integer> {

    List<Direccion> findByUsuarioId(Integer usuarioId);
}