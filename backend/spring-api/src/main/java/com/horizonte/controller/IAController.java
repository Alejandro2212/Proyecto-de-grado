package com.horizonte.controller;

import com.horizonte.service.RecomendacionIAService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin("*")
public class IAController {

    private final RecomendacionIAService recomendacionIAService;

    public IAController(
            RecomendacionIAService recomendacionIAService
    ) {

        this.recomendacionIAService =
                recomendacionIAService;
    }

    @GetMapping("/recomendacion")
    public Map<String, Object> recomendacion() {

        return recomendacionIAService.generar();
    }
}