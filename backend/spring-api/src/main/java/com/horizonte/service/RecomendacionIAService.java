package com.horizonte.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.horizonte.dto.PrediccionHorarioDTO;
import com.horizonte.repository.ReservaRepository;

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
                .horariosMenosUsadosFuturos();

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
public PrediccionHorarioDTO obtenerHorarioRecomendado(
        Long areaId,
        String fecha
) {

        PrediccionHorarioDTO dto =
                new PrediccionHorarioDTO();

        List<Object[]> areas =
                reservaRepository
                        .areasMenosOcupadas();

        List<Object[]> horariosReservados =
                reservaRepository
                        .horariosMenosUsadosPorArea(
                                areaId
                        );

        Set<Integer> horasUsadas =
                new HashSet<>();

        for (Object[] h : horariosReservados) {

        LocalTime hora =
                (LocalTime) h[0];

        horasUsadas.add(
                hora.getHour()
        );
        }

        List<String> horariosLibres =
                new ArrayList<>();

        for (int h = 6; h <= 22; h++) {

        if (!horasUsadas.contains(h)) {

                horariosLibres.add(
                        String.format("%02d:00", h)
                );
        }
        }

        System.out.println("HORARIOS RESERVADOS:");

        for (Object[] h : horariosReservados) {

        System.out.println(
                h[0] + " -> " + h[1]
        );
        }

        System.out.println("HORARIOS LIBRES:");

        for (String hora : horariosLibres) {

        System.out.println(hora);
        }

        dto.setArea(
                "Área seleccionada"
        );

        if (!horariosLibres.isEmpty()) {

        dto.setHorarioRecomendado(
                horariosLibres.get(0)
        );

        } else {

        dto.setHorarioRecomendado(
                "Sin horarios libres"
        );
        }

        double probabilidad;

        if (horariosLibres.size() >= 10) {

        probabilidad = 95.0;

        dto.setRecomendacion(
                "Existen muchos horarios libres disponibles para esta área."
        );

        } else if (horariosLibres.size() >= 5) {

        probabilidad = 85.0;

        dto.setRecomendacion(
                "Hay disponibilidad moderada para esta área."
        );

        } else {

        probabilidad = 70.0;

        dto.setRecomendacion(
                "La disponibilidad es limitada. Se recomienda reservar cuanto antes."
        );
        }

        dto.setProbabilidad(probabilidad);

        // ============================
        // HORARIOS ALTERNATIVOS
        // ============================

        List<String> alternativas =
                new ArrayList<>();

        for (String hora : horariosLibres) {

        alternativas.add(hora);

        if (alternativas.size() == 5) {
                break;
        }
        }

        dto.setHorariosAlternativos(
                alternativas
        );

        if (!alternativas.isEmpty()) {

                dto.setMejorHorarioAlternativo(
                        alternativas.get(0)
                );
        }

        return dto;
        }

        public PrediccionHorarioDTO obtenerHorarioGlobal() {

        PrediccionHorarioDTO dto =
                new PrediccionHorarioDTO();

        List<Object[]> horarios =
                reservaRepository
                        .horariosMenosUsadosFuturos();

        List<String> alternativas =
                new ArrayList<>();

        for (Object[] h : horarios) {

                if (h[0] != null) {

                alternativas.add(
                        h[0].toString()
                );
                }

                if (alternativas.size() == 5) {
                break;
                }
        }

        dto.setHorariosAlternativos(
                alternativas
        );

        if (!alternativas.isEmpty()) {

                dto.setHorarioRecomendado(
                        alternativas.get(0)
                );

                dto.setMejorHorarioAlternativo(
                        alternativas.get(0)
                );
        }

        dto.setProbabilidad(90.0);

        dto.setRecomendacion(
                "Horarios globales recomendados según el historial general del sistema."
        );

        return dto;
        }
}