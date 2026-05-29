package com.horizonte.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.horizonte.entity.Auditoria;
import com.horizonte.service.AuditoriaService;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin("*")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(
            AuditoriaService auditoriaService
    ) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public List<Auditoria> listar() {

        return auditoriaService.listar();
    }
}