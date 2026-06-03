package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoPedidoRepositorio extends JpaRepository<EstadoPedido, Integer> {

    Optional<EstadoPedido> findByNombre(String nombre);
}