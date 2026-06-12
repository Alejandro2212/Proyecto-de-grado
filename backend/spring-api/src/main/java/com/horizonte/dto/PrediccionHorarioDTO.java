package com.horizonte.dto;

public class PrediccionHorarioDTO {

    private String area;

    private String horarioRecomendado;

    private Double probabilidad;

    private String recomendacion;

    public PrediccionHorarioDTO() {
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getHorarioRecomendado() {
        return horarioRecomendado;
    }

    public void setHorarioRecomendado(String horarioRecomendado) {
        this.horarioRecomendado = horarioRecomendado;
    }

    public Double getProbabilidad() {
        return probabilidad;
    }

    public void setProbabilidad(Double probabilidad) {
        this.probabilidad = probabilidad;
    }

    public String getRecomendacion() {
        return recomendacion;
    }

    public void setRecomendacion(String recomendacion) {
        this.recomendacion = recomendacion;
    }
}