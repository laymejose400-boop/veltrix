package com.veltrix.veltrix.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PedidoRespuesta {

    private Integer id;
    private BigDecimal total;
    private String estado;
    private LocalDateTime creadoEn;
    private String email;
    private List<DetallePedidoRespuesta> detalles;

    public PedidoRespuesta() {}

    public PedidoRespuesta(Integer id, BigDecimal total, String estado,
                           LocalDateTime creadoEn, String email,
                           List<DetallePedidoRespuesta> detalles) {
        this.id = id;
        this.total = total;
        this.estado = estado;
        this.creadoEn = creadoEn;
        this.email = email;
        this.detalles = detalles;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<DetallePedidoRespuesta> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoRespuesta> detalles) { this.detalles = detalles; }
}