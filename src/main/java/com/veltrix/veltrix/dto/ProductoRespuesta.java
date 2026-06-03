package com.veltrix.veltrix.dto;

import java.math.BigDecimal;

public class ProductoRespuesta {

    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String imagenUrl;
    private String nombreCategoria;

    public ProductoRespuesta() {}

    public ProductoRespuesta(Integer id, String nombre, String descripcion,
                             BigDecimal precio, Integer stock, String imagenUrl,
                             String nombreCategoria) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagenUrl = imagenUrl;
        this.nombreCategoria = nombreCategoria;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }
}