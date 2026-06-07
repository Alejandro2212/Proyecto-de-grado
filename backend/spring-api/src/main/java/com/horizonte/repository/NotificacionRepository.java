package com.horizonte.repository;

import com.horizonte.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository
        extends JpaRepository<Notificacion, Long> {

    List<Notificacion>
    findByUsuarioIdOrderByFechaDesc(
            Long usuarioId
    );

    Long countByUsuarioIdAndLeidaFalse(
            Long usuarioId
    );
    void deleteByUsuarioId(
            Long usuarioId
    );
}