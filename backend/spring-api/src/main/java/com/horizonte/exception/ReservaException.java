package com.horizonte.exception;

public class ReservaException
        extends RuntimeException {

    public ReservaException(
            String mensaje
    ) {

        super(mensaje);
    }
}