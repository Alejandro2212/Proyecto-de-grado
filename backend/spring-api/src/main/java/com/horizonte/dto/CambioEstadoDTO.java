package com.horizonte.dto;

import com.horizonte.entity.enums.EstadoReserva;

public class CambioEstadoDTO {

    private EstadoReserva estado;

    public CambioEstadoDTO() {
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(
            EstadoReserva estado
    ) {
        this.estado = estado;
    }
}