package com.horizonte.controller;

import com.horizonte.entity.AreaComun;
import com.horizonte.service.AreaComunService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin("*")
public class AreaComunController {

    private final AreaComunService areaService;

    public AreaComunController(
            AreaComunService areaService
    ) {
        this.areaService = areaService;
    }

    @GetMapping
    public List<AreaComun> listar() {
        return areaService.listar();
    }

    @GetMapping("/activas")
    public List<AreaComun> activas() {
        return areaService.listarActivas();
    }

    @PostMapping
    public AreaComun guardar(
            @RequestBody AreaComun area
    ) {
        return areaService.guardar(area);
    }

    @GetMapping("/{id}")
    public AreaComun obtener(
            @PathVariable Long id
    ) {
        return areaService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public AreaComun actualizar(
            @PathVariable Long id,
            @RequestBody AreaComun area
    ) {
        return areaService.actualizar(id, area);
    }

    @PutMapping("/{id}/activar")
    public AreaComun activar(
            @PathVariable Long id
    ) {
        return areaService.activar(id);
    }

    @PutMapping("/{id}/desactivar")
    public AreaComun desactivar(
            @PathVariable Long id
    ) {
        return areaService.desactivar(id);
    }
}