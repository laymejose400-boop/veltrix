package com.veltrix.veltrix.dto;

public class PerfilRequest {

    private String nombre;
    private String email;

    public PerfilRequest() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}