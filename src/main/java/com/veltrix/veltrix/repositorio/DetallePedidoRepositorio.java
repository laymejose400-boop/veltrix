package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Integer> {
}