package com.veltrix.veltrix.dto;

public class AgregarCarritoRequest {

    private Integer productoId;
    private Integer cantidad;

    public AgregarCarritoRequest() {}

    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}