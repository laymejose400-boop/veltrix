package com.veltrix.veltrix.servicio;

import com.veltrix.veltrix.dto.ProductoRespuesta;
import com.veltrix.veltrix.entidad.Categoria;
import com.veltrix.veltrix.entidad.Producto;
import com.veltrix.veltrix.repositorio.CategoriaRepositorio;
import com.veltrix.veltrix.repositorio.ProductoRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServicio {

    private final ProductoRepositorio productoRepositorio;
    private final CategoriaRepositorio categoriaRepositorio;

    public ProductoServicio(ProductoRepositorio productoRepositorio,
                            CategoriaRepositorio categoriaRepositorio) {
        this.productoRepositorio = productoRepositorio;
        this.categoriaRepositorio = categoriaRepositorio;
    }

    // Listar todos los activos
    public List<ProductoRespuesta> listarActivos() {
        return productoRepositorio.findByActivoTrue()
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Filtrar por categoría
    public List<ProductoRespuesta> listarPorCategoria(Integer categoriaId) {
        return productoRepositorio.findByCategoriaIdAndActivoTrueOrderByIdAsc(categoriaId)
                .stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<ProductoRespuesta> buscarPorId(Integer id) {
        return productoRepositorio.findById(id)
                .map(this::convertirADto);
    }

    // Crear producto
    public ProductoRespuesta crear(Producto producto, Integer categoriaId) {
        Categoria categoria = categoriaRepositorio.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        producto.setCategoria(categoria);
        producto.setActivo(true);
        Producto guardado = productoRepositorio.save(producto);
        return convertirADto(guardado);
    }

    // Actualizar producto
    public Optional<ProductoRespuesta> actualizar(Integer id, Producto datos, Integer categoriaId) {
        return productoRepositorio.findById(id).map(producto -> {
            producto.setNombre(datos.getNombre());
            producto.setDescripcion(datos.getDescripcion());
            producto.setPrecio(datos.getPrecio());
            producto.setStock(datos.getStock());
            producto.setImagenUrl(datos.getImagenUrl());
            if (categoriaId != null) {
                Categoria categoria = categoriaRepositorio.findById(categoriaId)
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                producto.setCategoria(categoria);
            }
            return convertirADto(productoRepositorio.save(producto));
        });
    }

    // Eliminar (desactivar)
    public boolean eliminar(Integer id) {
        return productoRepositorio.findById(id).map(producto -> {
            producto.setActivo(false);
            productoRepositorio.save(producto);
            return true;
        }).orElse(false);
    }

    // Conversión a DTO
    private ProductoRespuesta convertirADto(Producto producto) {
        String nombreCategoria = producto.getCategoria() != null
                ? producto.getCategoria().getNombre()
                : "Sin categoría";

        return new ProductoRespuesta(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getImagenUrl(),
                nombreCategoria
        );
    }
}