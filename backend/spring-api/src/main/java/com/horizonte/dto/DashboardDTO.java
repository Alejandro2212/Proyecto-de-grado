package com.horizonte.dto;

public class DashboardDTO {

    private Long totalReservas;
    private Long aprobadas;
    private Long pendientes;
    private Long canceladas;
    private Long reservasMes;
    private Double porcentajeCancelacion;
    private String areaMenosUsada;

    private Long usuariosActivos;
    private Long areasActivas;
    private Double porcentajeAprobacion;
    private Double promedioReservasPorUsuario;
    private String mensajeIA;

    private String areaTop;

    public DashboardDTO() {
    }

    public Long getTotalReservas() {
        return totalReservas;
    }

    public void setTotalReservas(Long totalReservas) {
        this.totalReservas = totalReservas;
    }

    public Long getAprobadas() {
        return aprobadas;
    }

    public void setAprobadas(Long aprobadas) {
        this.aprobadas = aprobadas;
    }

    public Long getPendientes() {
        return pendientes;
    }

    public void setPendientes(Long pendientes) {
        this.pendientes = pendientes;
    }

    public Long getCanceladas() {
        return canceladas;
    }

    public void setCanceladas(Long canceladas) {
        this.canceladas = canceladas;
    }

    public Long getUsuariosActivos() {
        return usuariosActivos;
    }

    public void setUsuariosActivos(Long usuariosActivos) {
        this.usuariosActivos = usuariosActivos;
    }

    public Long getAreasActivas() {
        return areasActivas;
    }

    public void setAreasActivas(Long areasActivas) {
        this.areasActivas = areasActivas;
    }

    public String getAreaTop() {
        return areaTop;
    }

    public void setAreaTop(String areaTop) {
        this.areaTop = areaTop;
    }

public Long getReservasMes() {
    return reservasMes;
}

public void setReservasMes(Long reservasMes) {
    this.reservasMes = reservasMes;
}

public Double getPorcentajeCancelacion() {
    return porcentajeCancelacion;
}

public void setPorcentajeCancelacion(Double porcentajeCancelacion) {
    this.porcentajeCancelacion = porcentajeCancelacion;
}

public String getAreaMenosUsada() {
    return areaMenosUsada;
}

public void setAreaMenosUsada(String areaMenosUsada) {
    this.areaMenosUsada = areaMenosUsada;
}

public Double getPorcentajeAprobacion() {
    return porcentajeAprobacion;
}

public void setPorcentajeAprobacion(
        Double porcentajeAprobacion
) {
    this.porcentajeAprobacion =
            porcentajeAprobacion;
}

public Double getPromedioReservasPorUsuario() {
    return promedioReservasPorUsuario;
}

public void setPromedioReservasPorUsuario(
        Double promedioReservasPorUsuario
) {
    this.promedioReservasPorUsuario =
            promedioReservasPorUsuario;
}

public String getMensajeIA() {
    return mensajeIA;
}

public void setMensajeIA(
        String mensajeIA
) {
    this.mensajeIA = mensajeIA;
}
}