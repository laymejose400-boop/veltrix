package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {

    List<Producto> findByCategoriaIdOrderByIdAsc(Integer categoriaId);

    List<Producto> findByActivoTrue();

    List<Producto> findByCategoriaIdAndActivoTrueOrderByIdAsc(Integer categoriaId);
}