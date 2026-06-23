package com.horizonte.dto;

import java.util.List;

public class PrediccionHorarioDTO {

    private String area;

    private String horarioRecomendado;

    private Double probabilidad;

    private String recomendacion;

    // 🔥 NUEVOS CAMPOS PARA HORARIO INTELIGENTE
    private String mejorHorarioAlternativo;

    private List<String> horariosAlternativos;

    public PrediccionHorarioDTO() {
    }

    // =========================
    // GETTERS Y SETTERS
    // =========================

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

    // =========================
    // NUEVOS GETTERS
    // =========================

    public String getMejorHorarioAlternativo() {
        return mejorHorarioAlternativo;
    }

    public void setMejorHorarioAlternativo(String mejorHorarioAlternativo) {
        this.mejorHorarioAlternativo = mejorHorarioAlternativo;
    }

    public List<String> getHorariosAlternativos() {
        return horariosAlternativos;
    }

    public void setHorariosAlternativos(List<String> horariosAlternativos) {
        this.horariosAlternativos = horariosAlternativos;
    }
}