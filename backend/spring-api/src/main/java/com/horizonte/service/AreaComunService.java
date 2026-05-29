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

    public AreaComun guardar(AreaComun area) {
        return areaRepository.save(area);
    }

    public AreaComun obtenerPorId(Long id) {

        return areaRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Área no encontrada"));
    }

    public AreaComun actualizar(Long id, AreaComun area) {

        AreaComun existente = obtenerPorId(id);

        existente.setNombre(area.getNombre());
        existente.setDescripcion(area.getDescripcion());
        existente.setCapacidad(area.getCapacidad());
        existente.setHorarioInicio(area.getHorarioInicio());
        existente.setHorarioFin(area.getHorarioFin());

        return areaRepository.save(existente);
    }

    public void eliminar(Long id) {
        areaRepository.deleteById(id);
    }
}