package com.horizonte.service;

import com.horizonte.entity.Notificacion;
import com.horizonte.entity.Usuario;
import com.horizonte.repository.NotificacionRepository;
import com.horizonte.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository repository;

    private final UsuarioRepository usuarioRepository;

    public NotificacionService(
            NotificacionRepository repository,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

// =========================
// CREAR NOTIFICACION SIMPLE
// =========================
public void crearNotificacion(
        Long usuarioId,
        String titulo,
        String mensaje
) {

    crearNotificacion(
            usuarioId,
            titulo,
            mensaje,
            "GENERAL"
    );
}

// =========================
// CREAR NOTIFICACION CON TIPO
// =========================
public void crearNotificacion(
        Long usuarioId,
        String titulo,
        String mensaje,
        String tipo
) {

    Usuario usuario =
            usuarioRepository
                    .findById(usuarioId)
                    .orElseThrow();

    Notificacion n =
            new Notificacion();

    n.setTitulo(titulo);

    n.setMensaje(mensaje);

    n.setTipo(tipo);

    n.setUsuario(usuario);

    n.setFecha(LocalDateTime.now());

    n.setLeida(false);

    repository.save(n);
}

    // =========================
    // LISTAR
    // =========================
    public List<Notificacion> listar(
            Long usuarioId
    ) {

        return repository
                .findByUsuarioIdOrderByFechaDesc(
                        usuarioId
                );
    }

    // =========================
    // PENDIENTES
    // =========================
    public Long pendientes(
            Long usuarioId
    ) {

        return repository
                .countByUsuarioIdAndLeidaFalse(
                        usuarioId
                );
    }

    // =========================
    // MARCAR LEIDA
    // =========================
    public void marcarLeida(
            Long id
    ) {

        Notificacion n =
                repository.findById(id)
                        .orElseThrow();

        n.setLeida(true);

        repository.save(n);
    }

        // =========================
        // MARCAR TODAS LEIDAS
        // =========================
        public void marcarTodasLeidas(Long usuarioId) {

        List<Notificacion> lista =
                repository.findByUsuarioIdOrderByFechaDesc(
                        usuarioId
                );

        lista.forEach(n ->
                n.setLeida(true));

        repository.saveAll(lista);
        }

        // =========================
        // ELIMINAR UNA
        // =========================
        public void eliminar(Long id) {

        repository.deleteById(id);
        }

        // =========================
        // ELIMINAR TODAS
        // =========================
        public void eliminarTodas(Long usuarioId) {

        repository.deleteByUsuarioId(
                usuarioId
        );
        }
}