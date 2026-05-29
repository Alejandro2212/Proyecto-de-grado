package com.horizonte.service;

import com.horizonte.entity.Auditoria;
import com.horizonte.repository.AuditoriaRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(
            AuditoriaRepository auditoriaRepository
    ) {
        this.auditoriaRepository = auditoriaRepository;
    }

    // =========================
    // REGISTRAR
    // =========================
    public void registrar(
            String usuario,
            String accion
    ) {

        Auditoria log = new Auditoria();

        log.setUsuario(usuario);

        log.setAccion(accion);

        log.setFecha(LocalDateTime.now());

        auditoriaRepository.save(log);
    }

    // =========================
    // LISTAR
    // =========================
    public List<Auditoria> listar() {

        return auditoriaRepository.findAll();
    }
}