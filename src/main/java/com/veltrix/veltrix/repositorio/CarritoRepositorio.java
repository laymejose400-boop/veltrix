package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoRepositorio extends JpaRepository<Carrito, Integer> {

    List<Carrito> findByUsuarioId(Integer usuarioId);

    Optional<Carrito> findByUsuarioIdAndProductoId(Integer usuarioId, Integer productoId);

    void deleteByUsuarioId(Integer usuarioId);
}