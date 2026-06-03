package com.veltrix.veltrix.datos;

import com.veltrix.veltrix.entidad.*;
import com.veltrix.veltrix.repositorio.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CargaDatosIniciales implements CommandLineRunner {

    private final RolRepositorio rolRepositorio;
    private final EstadoPedidoRepositorio estadoPedidoRepositorio;
    private final CategoriaRepositorio categoriaRepositorio;
    private final ProductoRepositorio productoRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final BCryptPasswordEncoder encoder;

    public CargaDatosIniciales(RolRepositorio rolRepositorio,
                               EstadoPedidoRepositorio estadoPedidoRepositorio,
                               CategoriaRepositorio categoriaRepositorio,
                               ProductoRepositorio productoRepositorio,
                               UsuarioRepositorio usuarioRepositorio,
                               BCryptPasswordEncoder encoder) {
        this.rolRepositorio = rolRepositorio;
        this.estadoPedidoRepositorio = estadoPedidoRepositorio;
        this.categoriaRepositorio = categoriaRepositorio;
        this.productoRepositorio = productoRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (rolRepositorio.count() == 0) {
            Rol admin = crearRol("ADMIN");
            Rol cliente = crearRol("CLIENTE");
            rolRepositorio.saveAll(List.of(admin, cliente));
            System.out.println(" Roles insertados");

            // Crear usuario admin por defecto
            Usuario usuarioAdmin = new Usuario();
            usuarioAdmin.setNombre("Admin Veltrix");
            usuarioAdmin.setEmail("admin@veltrix.com");
            usuarioAdmin.setPasswordHash(encoder.encode("admin123"));
            usuarioAdmin.setRol(admin);
            usuarioAdmin.setActivo(true);
            usuarioRepositorio.save(usuarioAdmin);
            System.out.println(" Usuario ADMIN creado: admin@veltrix.com / admin123");
        }

        if (estadoPedidoRepositorio.count() == 0) {
            estadoPedidoRepositorio.saveAll(List.of(
                    crearEstado("PENDIENTE"),
                    crearEstado("CONFIRMADO"),
                    crearEstado("ENVIADO"),
                    crearEstado("ENTREGADO"),
                    crearEstado("CANCELADO")
            ));
            System.out.println(" Estados de pedido insertados");
        }

        if (categoriaRepositorio.count() == 0) {
            Categoria laptops = crearCategoria("Laptops", "Computadoras portátiles de alto rendimiento");
            Categoria smartphones = crearCategoria("Smartphones", "Teléfonos inteligentes");
            Categoria accesorios = crearCategoria("Accesorios", "Periféricos y accesorios tecnológicos");
            categoriaRepositorio.saveAll(List.of(laptops, smartphones, accesorios));
            System.out.println(" Categorías insertadas");

            productoRepositorio.saveAll(List.of(
                    crearProducto("Laptop Veltrix Pro 15", "Procesador i7, 16GB RAM, 512GB SSD",
                            new BigDecimal("1299.99"), 10, laptops, "https://via.placeholder.com/300"),
                    crearProducto("Smartphone Veltrix X", "Pantalla AMOLED 6.7\", 128GB almacenamiento",
                            new BigDecimal("899.99"), 25, smartphones, "https://via.placeholder.com/300"),
                    crearProducto("Teclado Mecánico RGB", "Switches Cherry MX, retroiluminación personalizable",
                            new BigDecimal("79.99"), 50, accesorios, "https://via.placeholder.com/300")
            ));
            System.out.println(" Productos insertados");
        }
    }

    private Rol crearRol(String nombre) {
        Rol rol = new Rol();
        rol.setNombre(nombre);
        return rol;
    }

    private EstadoPedido crearEstado(String nombre) {
        EstadoPedido estado = new EstadoPedido();
        estado.setNombre(nombre);
        return estado;
    }

    private Categoria crearCategoria(String nombre, String descripcion) {
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);
        return categoria;
    }

    private Producto crearProducto(String nombre, String descripcion, BigDecimal precio,
                                   Integer stock, Categoria categoria, String imagenUrl) {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setCategoria(categoria);
        producto.setImagenUrl(imagenUrl);
        return producto;
    }
}