package com.horizonte.service;

import com.horizonte.dto.DashboardDTO;
import com.horizonte.repository.AreaComunRepository;
import com.horizonte.repository.ReservaRepository;
import com.horizonte.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AreaComunRepository areaRepository;

    public DashboardService(
            ReservaRepository reservaRepository,
            UsuarioRepository usuarioRepository,
            AreaComunRepository areaRepository
    ) {

        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
        this.areaRepository = areaRepository;
    }

public DashboardDTO obtenerResumen() {

    DashboardDTO dto =
            new DashboardDTO();

    Long totalReservas =
            reservaRepository.totalReservas();

    Long canceladas =
            reservaRepository.countCanceladas();

    dto.setTotalReservas(
            totalReservas
    );

    dto.setPendientes(
            reservaRepository.countPendientes()
    );

    dto.setAprobadas(
            reservaRepository.countAprobadas()
    );

    dto.setCanceladas(
            canceladas
    );

    dto.setUsuariosActivos(
            usuarioRepository.countByActivoTrue()
    );

    dto.setAreasActivas(
            areaRepository.countByActivoTrue()
    );

    dto.setReservasMes(
            reservaRepository.reservasMesActual()
    );

    // =====================
    // PORCENTAJE CANCELACIÓN
    // =====================

    double porcentaje = 0.0;

    if (totalReservas > 0) {

        porcentaje =
                (canceladas.doubleValue()
                        / totalReservas.doubleValue())
                        * 100;
    }

    dto.setPorcentajeCancelacion(
            Math.round(
                    porcentaje * 100.0
            ) / 100.0
    );

    // =====================
    // ÁREA MÁS USADA
    // =====================

    List<Object[]> top =
            reservaRepository.areaMasReservada();

    if (!top.isEmpty()) {

        dto.setAreaTop(
                String.valueOf(
                        top.get(0)[0]
                )
        );
    }

    // =====================
    // ÁREA MENOS USADA
    // =====================

    List<Object[]> menos =
            reservaRepository.areaMenosReservada();

    if (!menos.isEmpty()) {

        dto.setAreaMenosUsada(
                String.valueOf(
                        menos.get(0)[0]
                )
        );
    }

    // =====================
// % APROBACIÓN
// =====================

double porcentajeAprobacion = 0;

if (totalReservas > 0) {

    porcentajeAprobacion =
            (dto.getAprobadas()
                    .doubleValue()
                    / totalReservas.doubleValue())
                    * 100;
}

dto.setPorcentajeAprobacion(

        Math.round(
                porcentajeAprobacion * 100
        ) / 100.0
);

// =====================
// PROMEDIO POR USUARIO
// =====================

double promedio = 0;

if (dto.getUsuariosActivos() > 0) {

    promedio =
            totalReservas.doubleValue()
                    /
                    dto.getUsuariosActivos()
                            .doubleValue();
}

dto.setPromedioReservasPorUsuario(

        Math.round(
                promedio * 100
        ) / 100.0
);

// =====================
// MENSAJE IA
// =====================

String mensajeIA =
        "La demanda más alta se concentra en "
        + dto.getAreaTop()
        + ". Se recomienda habilitar horarios adicionales y promover el uso de "
        + dto.getAreaMenosUsada()
        + " para equilibrar la ocupación.";

dto.setMensajeIA(
        mensajeIA
);
    return dto;
}
}