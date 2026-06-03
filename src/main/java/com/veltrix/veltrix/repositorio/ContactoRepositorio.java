package com.veltrix.veltrix.repositorio;

import com.veltrix.veltrix.entidad.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactoRepositorio extends JpaRepository<Contacto, Integer> {

    List<Contacto> findAllByOrderByCreadoEnDesc();
}