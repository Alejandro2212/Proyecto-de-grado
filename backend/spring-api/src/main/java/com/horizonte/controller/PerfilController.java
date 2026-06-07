package com.horizonte.controller;

import com.horizonte.dto.PerfilDTO;
import com.horizonte.dto.PerfilUpdateDTO;
import com.horizonte.service.PerfilService;
import com.horizonte.dto.CambiarPasswordDTO;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin("*")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(
            PerfilService perfilService
    ) {
        this.perfilService = perfilService;
    }

    // =========================
    // OBTENER PERFIL
    // =========================
    @GetMapping
    public PerfilDTO obtenerPerfil() {

        return perfilService.obtenerPerfil();
    }

    // =========================
    // ACTUALIZAR PERFIL
    // =========================
    @PutMapping
    public PerfilDTO actualizarPerfil(
            @RequestBody PerfilUpdateDTO dto
    ) {

        return perfilService.actualizar(dto);
    }

    // =========================
    // CAMBIAR PASSWORD
    // =========================
    @PutMapping("/password")
    public String cambiarPassword(
            @RequestBody CambiarPasswordDTO dto
    ) {

        perfilService.cambiarPassword(dto);

        return "Contraseña actualizada correctamente";
    }   
}