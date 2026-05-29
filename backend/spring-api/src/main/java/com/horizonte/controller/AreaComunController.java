package com.horizonte.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.horizonte.entity.AreaComun;
import com.horizonte.service.AreaComunService;

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

    @DeleteMapping("/{id}")
    public void eliminar(
            @PathVariable Long id
    ) {
        areaService.eliminar(id);
    }
}