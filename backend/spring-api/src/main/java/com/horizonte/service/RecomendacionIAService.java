package com.horizonte.service;

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

        // =========================
        // AREA MENOS OCUPADA
        // =========================
        if (!areas.isEmpty()) {

            mejorArea =
                    areas.get(0)[0].toString();

            ocupacionArea =
                    Long.valueOf(
                            areas.get(0)[1].toString()
                    );
        }

        // =========================
        // HORARIO MENOS UTILIZADO
        // =========================
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

        // =========================
        // RESPUESTA IA
        // =========================

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

        data.put(
                "mensaje",
                "Se recomienda reservar "
                        + mejorArea
                        + " alrededor de las "
                        + mejorHorario
                        + " porque presenta menor ocupación histórica."
        );

        return data;
    }
}