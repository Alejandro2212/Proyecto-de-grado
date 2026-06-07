package com.horizonte.dto;

public class DashboardEjecutivoDTO {

    private Long totalReservas;
    private Long reservasMes;
    private Long usuariosActivos;

    private Double porcentajeCancelacion;

    private String areaMasUsada;
    private String areaMenosUsada;

    public DashboardEjecutivoDTO() {
    }

    public Long getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(Long totalReservas) {
        this.totalReservas = totalReservas;
    }

    public Long getReservasMes() {
        return reservasMes;
    }

    public void setReservasMes(Long reservasMes) {
        this.reservasMes = reservasMes;
    }

    public Long getUsuariosActivos() {
        return usuariosActivos;
    }

    public void setUsuariosActivos(Long usuariosActivos) {
        this.usuariosActivos = usuariosActivos;
    }

    public Double getPorcentajeCancelacion() {
        return porcentajeCancelacion;
    }

    public void setPorcentajeCancelacion(Double porcentajeCancelacion) {
        this.porcentajeCancelacion = porcentajeCancelacion;
    }

    public String getAreaMasUsada() {
        return areaMasUsada;
    }

    public void setAreaMasUsada(String areaMasUsada) {
        this.areaMasUsada = areaMasUsada;
    }

    public String getAreaMenosUsada() {
        return areaMenosUsada;
    }

    public void setAreaMenosUsada(String areaMenosUsada) {
        this.areaMenosUsada = areaMenosUsada;
    }
}