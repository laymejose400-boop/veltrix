package com.veltrix.veltrix.servicio;

import com.veltrix.veltrix.dto.CategoriaRespuesta;
import com.veltrix.veltrix.entidad.Categoria;
import com.veltrix.veltrix.repositorio.CategoriaRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaServicio {

    private final CategoriaRepositorio categoriaRepositorio;

    public CategoriaServicio(CategoriaRepositorio categoriaRepositorio) {
        this.categoriaRepositorio = categoriaRepositorio;
    }

    public List<CategoriaRespuesta> listarTodas() {
        return categoriaRepositorio.findAll().stream()
                .map(c -> new CategoriaRespuesta(c.getId(), c.getNombre(), c.getDescripcion()))
                .collect(Collectors.toList());
    }

    public Optional<CategoriaRespuesta> buscarPorId(Integer id) {
        return categoriaRepositorio.findById(id)
                .map(c -> new CategoriaRespuesta(c.getId(), c.getNombre(), c.getDescripcion()));
    }

    public CategoriaRespuesta crear(Categoria categoria) {
        Categoria guardada = categoriaRepositorio.save(categoria);
        return new CategoriaRespuesta(guardada.getId(), guardada.getNombre(), guardada.getDescripcion());
    }

    public Optional<CategoriaRespuesta> actualizar(Integer id, Categoria datos) {
        return categoriaRepositorio.findById(id).map(categoriaExistente -> {
            categoriaExistente.setNombre(datos.getNombre());
            categoriaExistente.setDescripcion(datos.getDescripcion());
            Categoria actualizada = categoriaRepositorio.save(categoriaExistente);
            return new CategoriaRespuesta(actualizada.getId(), actualizada.getNombre(), actualizada.getDescripcion());
        });
    }

    public boolean eliminar(Integer id) {
        if (categoriaRepositorio.existsById(id)) {
            categoriaRepositorio.deleteById(id);
            return true;
        }
        return false;
    }
}