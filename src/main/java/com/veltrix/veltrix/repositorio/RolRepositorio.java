package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepositorio extends JpaRepository<Rol, Integer> {
}