package com.veltrix.veltrix.excepcion;

public class ExcepcionAuth extends RuntimeException {
    public ExcepcionAuth(String mensaje) {
        super(mensaje);
    }
}