package com.horizonte.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.horizonte.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Boolean existsByEmail(String email);

    Long countByActivoTrue();
    
@Query("""
       SELECT COUNT(u)
       FROM Usuario u
       WHERE u.activo = true
       """)
Long usuariosActivos();
}