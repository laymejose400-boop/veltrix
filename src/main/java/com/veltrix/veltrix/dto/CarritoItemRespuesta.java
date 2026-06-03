package com.veltrix.veltrix.dto;

import java.math.BigDecimal;

public class CarritoItemRespuesta {

    private Integer id;
    private Integer productoId;
    private String nombreProducto;
    private BigDecimal precioUnitario;
    private Integer cantidad;
    private BigDecimal subtotal;
    private String imagenUrl;

    public CarritoItemRespuesta() {}

    public CarritoItemRespuesta(Integer id, Integer productoId, String nombreProducto,
                                BigDecimal precioUnitario, Integer cantidad,
                                BigDecimal subtotal, String imagenUrl) {
        this.id = id;
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
        this.imagenUrl = imagenUrl;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }

    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}