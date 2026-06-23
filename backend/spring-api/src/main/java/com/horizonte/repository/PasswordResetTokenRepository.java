package com.horizonte.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.horizonte.entity.PasswordResetToken;
import com.horizonte.entity.Usuario;

public interface PasswordResetTokenRepository
        extends JpaRepository<
        PasswordResetToken,
        Long> {

    Optional<PasswordResetToken>
    findByToken(String token);

    Optional<PasswordResetToken>
    findByUsuario(Usuario usuario);

    void deleteByUsuario(Usuario usuario);
}