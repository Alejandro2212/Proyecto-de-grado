package com.horizonte.service;

import com.horizonte.dto.PrediccionHorarioDTO;
import com.horizonte.repository.ReservaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecomendacionIAService {

    private final ReservaRepository reservaRepository;

    public RecomendacionIAService(
            ReservaRepository reservaRepository
    ) {

        this.reservaRepository =
                reservaRepository;
    }

    // =====================================
    // IA ACTUAL
    // =====================================
    public Map<String, Object> generar() {

        Map<String, Object> data =
                new HashMap<>();

        List<Object[]> areas =
                reservaRepository
                        .areasMenosOcupadas();

        List<Object[]> horarios =
                reservaRepository
                        .horariosMenosUsados();

        String mejorArea =
                "Sin datos";

        String mejorHorario =
                "Sin datos";

        Long ocupacionArea =
                0L;

        Long ocupacionHorario =
                0L;

        if (!areas.isEmpty()) {

            mejorArea =
                    areas.get(0)[0].toString();

            ocupacionArea =
                    Long.valueOf(
                            areas.get(0)[1].toString()
                    );
        }

        if (!horarios.isEmpty()) {

            LocalTime hora =
                    (LocalTime) horarios.get(0)[0];

            mejorHorario =
                    hora.toString();

            ocupacionHorario =
                    Long.valueOf(
                            horarios.get(0)[1].toString()
                    );
        }

        data.put(
                "areaRecomendada",
                mejorArea
        );

        data.put(
                "horarioRecomendado",
                mejorHorario
        );

        data.put(
                "ocupacionArea",
                ocupacionArea
        );

        data.put(
                "ocupacionHorario",
                ocupacionHorario
        );

        data.put(
                "nivelDemanda",
                ocupacionArea <= 5
                        ? "BAJA"
                        : ocupacionArea <= 15
                        ? "MEDIA"
                        : "ALTA"
        );

String recomendacion;

if (ocupacionArea <= 5) {

    recomendacion =
            "El área " + mejorArea +
            " tiene baja demanda. " +
            "Se recomienda reservarla cerca de las " +
            mejorHorario +
            " para asegurar disponibilidad inmediata.";

} else if (ocupacionArea <= 15) {

    recomendacion =
            "El área " + mejorArea +
            " presenta demanda moderada. " +
            "Se aconseja realizar reservas con anticipación.";

} else {

    recomendacion =
            "Existe alta demanda en " +
            mejorArea +
            ". Se recomienda evitar horarios pico y considerar otras áreas disponibles.";
}

data.put(
        "mensaje",
        recomendacion
);

        return data;
    }

    // =====================================
    // RECOMENDACION INTELIGENTE
    // =====================================
    public PrediccionHorarioDTO
    obtenerHorarioRecomendado() {

        PrediccionHorarioDTO dto =
                new PrediccionHorarioDTO();

        List<Object[]> areas =
                reservaRepository
                        .areasMenosOcupadas();

        List<Object[]> horarios =
                reservaRepository
                        .horariosMenosUsados();

        if (!areas.isEmpty()) {

            dto.setArea(
                    areas.get(0)[0].toString()
            );
        }

        if (!horarios.isEmpty()) {

            dto.setHorarioRecomendado(
                    horarios.get(0)[0].toString()
            );
        }

        // Simulación IA básica
        dto.setProbabilidad(
                92.0
        );

        dto.setRecomendacion(
                "Según el historial de reservas, este horario presenta menor ocupación y mayor probabilidad de aprobación."
        );

        return dto;
    }
}