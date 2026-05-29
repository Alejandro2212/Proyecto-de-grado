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

        String mejorArea = "Sin datos";

        String mejorHorario = "Sin datos";

        if (!areas.isEmpty()) {

            mejorArea =
                    areas.get(0)[0].toString();
        }

        if (!horarios.isEmpty()) {

            LocalTime hora =
                    (LocalTime) horarios.get(0)[0];

            mejorHorario =
                    hora.toString();
        }

        data.put(
                "mejorArea",
                mejorArea
        );

        data.put(
                "mejorHorario",
                mejorHorario
        );

        data.put(
                "mensaje",
                "La IA recomienda reservar el área "
                        + mejorArea
                        + " alrededor de las "
                        + mejorHorario
                        + " porque tiene menor congestión."
        );

        return data;
    }
}