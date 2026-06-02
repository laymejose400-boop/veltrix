package com.veltrix.veltrix.controlador;

import com.veltrix.veltrix.dto.ProductoRespuesta;
import com.veltrix.veltrix.entidad.Producto;
import com.veltrix.veltrix.servicio.ProductoServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoControlador {

    private final ProductoServicio productoServicio;

    public ProductoControlador(ProductoServicio productoServicio) {
        this.productoServicio = productoServicio;
    }

    // GET /api/productos
    @GetMapping
    public List<ProductoRespuesta> listar() {
        return productoServicio.listarActivos();
    }

    // GET /api/productos/buscar?categoria=1
    @GetMapping("/buscar")
    public List<ProductoRespuesta> listarPorCategoria(@RequestParam Integer categoria) {
        return productoServicio.listarPorCategoria(categoria);
    }

    // GET /api/productos/1
    @GetMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> buscar(@PathVariable Integer id) {
        return productoServicio.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/productos
    @PostMapping
    public ResponseEntity<ProductoRespuesta> crear(@RequestBody Map<String, Object> body) {
        Integer categoriaId = (Integer) body.get("categoriaId");

        Producto producto = new Producto();
        producto.setNombre((String) body.get("nombre"));
        producto.setDescripcion((String) body.get("descripcion"));
        producto.setPrecio(new java.math.BigDecimal(body.get("precio").toString()));
        producto.setStock((Integer) body.get("stock"));
        producto.setImagenUrl((String) body.get("imagenUrl"));

        ProductoRespuesta creado = productoServicio.crear(producto, categoriaId);
        return ResponseEntity.ok(creado);
    }

    // PUT /api/productos/1
    @PutMapping("/{id}")
    public ResponseEntity<ProductoRespuesta> actualizar(@PathVariable Integer id,
                                                        @RequestBody Map<String, Object> body) {
        Integer categoriaId = body.get("categoriaId") != null
                ? (Integer) body.get("categoriaId") : null;

        Producto datos = new Producto();
        datos.setNombre((String) body.get("nombre"));
        datos.setDescripcion((String) body.get("descripcion"));
        datos.setPrecio(new java.math.BigDecimal(body.get("precio").toString()));
        datos.setStock((Integer) body.get("stock"));
        datos.setImagenUrl((String) body.get("imagenUrl"));

        return productoServicio.actualizar(id, datos, categoriaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/productos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (productoServicio.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}