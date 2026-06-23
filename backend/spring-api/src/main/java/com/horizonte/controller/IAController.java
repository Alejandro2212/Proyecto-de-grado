package com.horizonte.controller;

import com.horizonte.dto.PrediccionHorarioDTO;
import com.horizonte.dto.PrediccionRequest;
import com.horizonte.service.IAFastApiService;
import com.horizonte.service.RecomendacionIAService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin("*")
public class IAController {

    private final RecomendacionIAService recomendacionIAService;
    private final IAFastApiService iaFastApiService;

    public IAController(
            RecomendacionIAService recomendacionIAService,
            IAFastApiService iaFastApiService
    ) {

        this.recomendacionIAService =
                recomendacionIAService;

        this.iaFastApiService = iaFastApiService;
    }

    // ====================================
    // IA ACTUAL
    // ====================================

    @GetMapping("/recomendacion")
    public Map<String, Object> recomendacion() {

        return recomendacionIAService.generar();
    }

        @GetMapping("/recomendacion-horario-global")
        public PrediccionHorarioDTO obtenerHorarioGlobal() {

        return recomendacionIAService
                .obtenerHorarioGlobal();
        }

    // ====================================
    // NUEVA IA HORARIOS
    // ====================================

    @GetMapping("/recomendacion-horario")
    public PrediccionHorarioDTO obtenerHorario(

            @RequestParam Long areaId,

            @RequestParam String fecha
    ) {

        return recomendacionIAService
                .obtenerHorarioRecomendado(
                        areaId,
                        fecha
                );
    }

    @PostMapping("/predecir")
    public String predecir(
            @RequestBody PrediccionRequest request
    ) {

        return iaFastApiService
                .obtenerPrediccion(request);
    }
}