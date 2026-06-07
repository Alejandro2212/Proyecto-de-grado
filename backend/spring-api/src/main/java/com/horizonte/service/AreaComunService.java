package com.horizonte.service;

import com.horizonte.entity.AreaComun;
import com.horizonte.repository.AreaComunRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AreaComunService {

    private final AreaComunRepository areaRepository;

    public AreaComunService(
            AreaComunRepository areaRepository
    ) {
        this.areaRepository = areaRepository;
    }

    public List<AreaComun> listar() {
        return areaRepository.findAll();
    }

    public List<AreaComun> listarActivas() {
        return areaRepository.findByActivoTrue();
    }

    public AreaComun guardar(
            AreaComun area
    ) {
        area.setActivo(true);

        return areaRepository.save(area);
    }

    public AreaComun obtenerPorId(
            Long id
    ) {
        return areaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Área no encontrada"
                        )
                );
    }

    public AreaComun actualizar(
            Long id,
            AreaComun area
    ) {

        AreaComun existente =
                obtenerPorId(id);

        existente.setNombre(
                area.getNombre()
        );

        existente.setDescripcion(
                area.getDescripcion()
        );

        existente.setCapacidad(
                area.getCapacidad()
        );

        existente.setHorarioInicio(
                area.getHorarioInicio()
        );

        existente.setHorarioFin(
                area.getHorarioFin()
        );

        return areaRepository.save(
                existente
        );
    }

    // =====================
    // DESACTIVAR
    // =====================
    public AreaComun desactivar(
            Long id
    ) {

        AreaComun area =
                obtenerPorId(id);

        area.setActivo(false);

        return areaRepository.save(area);
    }

    // =====================
    // ACTIVAR
    // =====================
    public AreaComun activar(
            Long id
    ) {

        AreaComun area =
                obtenerPorId(id);

        area.setActivo(true);

        return areaRepository.save(area);
    }
}