package com.horizonte.dto;

public class NotificacionDTO {

    private String tipo;
    private String mensaje;
    private long timestamp;

    public NotificacionDTO(String tipo, String mensaje, long timestamp) {
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.timestamp = timestamp;
    }

    public String getTipo() {
        return tipo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public long getTimestamp() {
        return timestamp;
    }
}