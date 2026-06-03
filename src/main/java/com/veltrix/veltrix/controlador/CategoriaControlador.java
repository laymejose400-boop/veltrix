package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.CategoriaRespuesta;
import com.veltrix.veltrix.entidad.Categoria;
import com.veltrix.veltrix.servicio.CategoriaServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaControlador {

    private final CategoriaServicio categoriaServicio;

    public CategoriaControlador(CategoriaServicio categoriaServicio) {
        this.categoriaServicio = categoriaServicio;
    }

    // GET /api/categorias - FUNCIONA PERFECTO
    @GetMapping
    public List<CategoriaRespuesta> listar() {
        return categoriaServicio.listarTodas();
    }

    // GET /api/categorias/{id} - FUNCIONA PERFECTO
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaRespuesta> buscar(@PathVariable Integer id) {
        return categoriaServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/categorias - CORREGIDO (Aseguramos ID nulo para que sea inserción limpia)
    @PostMapping
    public ResponseEntity<CategoriaRespuesta> crear(@RequestBody Categoria categoria) {
        categoria.setId(null);
        CategoriaRespuesta creada = categoriaServicio.crear(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // PUT /api/categorias/{id} - CORREGIDO
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaRespuesta> actualizar(@PathVariable Integer id,
                                                         @RequestBody Categoria datos) {
        return categoriaServicio.actualizar(id, datos)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/categorias/{id} - CORREGIDO con manejo de errores de base de datos
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        try {
            if (categoriaServicio.eliminar(id)) {
                return ResponseEntity.noContent().build(); // Devuelve 204 No Content (Éxito)
            }
            return ResponseEntity.notFound().build(); // Devuelve 404 si no existía
        } catch (Exception e) {
            // Si PostgreSQL bloquea el borrado por tener productos amarrados, cae aquí
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // Devuelve 409 Conflicto
        }
    }
}