package com.horizonte.dto;

import java.util.List;

public class DashboardStatsDTO {

    private Long totalReservas;

    private Long pendientes;

    private Long aprobadas;

    private Long canceladas;

    private List<Object[]> reservasPorMes;

    private List<Object[]> reservasPorArea;

    public DashboardStatsDTO() {
    }

    public Long getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(Long totalReservas) {
        this.totalReservas = totalReservas;
    }

    public Long getPendientes() {
        return pendientes;
    }

    public void setPendientes(Long pendientes) {
        this.pendientes = pendientes;
    }

    public Long getAprobadas() {
        return aprobadas;
    }

    public void setAprobadas(Long aprobadas) {
        this.aprobadas = aprobadas;
    }

    public Long getCanceladas() {
        return canceladas;
    }

    public void setCanceladas(Long canceladas) {
        this.canceladas = canceladas;
    }

    public List<Object[]> getReservasPorMes() {
        return reservasPorMes;
    }

    public void setReservasPorMes(List<Object[]> reservasPorMes) {
        this.reservasPorMes = reservasPorMes;
    }

    public List<Object[]> getReservasPorArea() {
        return reservasPorArea;
    }

    public void setReservasPorArea(List<Object[]> reservasPorArea) {
        this.reservasPorArea = reservasPorArea;
    }
}