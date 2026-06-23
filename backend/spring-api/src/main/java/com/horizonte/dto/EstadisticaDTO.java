package com.horizonte.dto;

public class EstadisticaDTO {

    private String nombre;
    private Long cantidad;

    public EstadisticaDTO() {
    }

    public EstadisticaDTO(
            String nombre,
            Long cantidad
    ) {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getCantidad() {
        return cantidad;
    }

    public void setCantidad(Long cantidad) {
        this.cantidad = cantidad;
    }
}