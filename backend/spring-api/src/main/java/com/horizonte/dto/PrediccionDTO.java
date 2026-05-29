package com.horizonte.dto;

public class PrediccionDTO {

    private String areaMasUsada;

    private String horarioMasUsado;

    private String diaMasReservado;

    private String recomendacion;

    private Long totalReservas;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public String getAreaMasUsada() {
        return areaMasUsada;
    }

    public void setAreaMasUsada(String areaMasUsada) {
        this.areaMasUsada = areaMasUsada;
    }

    public String getHorarioMasUsado() {
        return horarioMasUsado;
    }

    public void setHorarioMasUsado(String horarioMasUsado) {
        this.horarioMasUsado = horarioMasUsado;
    }

    public String getDiaMasReservado() {
        return diaMasReservado;
    }

    public void setDiaMasReservado(String diaMasReservado) {
        this.diaMasReservado = diaMasReservado;
    }

    public String getRecomendacion() {
        return recomendacion;
    }

    public void setRecomendacion(String recomendacion) {
        this.recomendacion = recomendacion;
    }

    public Long getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(Long totalReservas) {
        this.totalReservas = totalReservas;
    }
}