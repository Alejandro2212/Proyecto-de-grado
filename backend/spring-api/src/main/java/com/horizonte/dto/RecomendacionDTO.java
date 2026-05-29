package com.horizonte.dto;

public class RecomendacionDTO {

    private String areaRecomendada;

    private String horarioRecomendado;

    private String mensaje;

    public String getAreaRecomendada() {
        return areaRecomendada;
    }

    public void setAreaRecomendada(String areaRecomendada) {
        this.areaRecomendada = areaRecomendada;
    }

    public String getHorarioRecomendado() {
        return horarioRecomendado;
    }

    public void setHorarioRecomendado(String horarioRecomendado) {
        this.horarioRecomendado = horarioRecomendado;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}