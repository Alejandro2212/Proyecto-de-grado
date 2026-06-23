package com.horizonte.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.horizonte.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // =========================
    // BÚSQUEDA POR EMAIL
    // =========================
    Optional<Usuario> findByEmail(String email);

    Boolean existsByEmail(String email);

    // =========================
    // USUARIOS ACTIVOS
    // =========================
    Long countByActivoTrue();

    @Query("""
           SELECT COUNT(u)
           FROM Usuario u
           WHERE u.activo = true
           """)
    Long usuariosActivos();

    // =========================
    // NUEVOS MÉTODOS PARA APROBACIÓN
    // =========================

    /**
     * Lista todos los usuarios pendientes
     * de aprobación por el administrador.
     */
    List<Usuario> findByAprobadoFalse();

    /**
     * Lista todos los usuarios ya aprobados.
     */
    List<Usuario> findByAprobadoTrue();

    /**
     * Cantidad de usuarios pendientes.
     */
    Long countByAprobadoFalse();

    /**
     * Cantidad de usuarios aprobados.
     */
    Long countByAprobadoTrue();
}