package com.horizonte.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.horizonte.dto.ForgotPasswordRequest;
import com.horizonte.dto.ResetPasswordRequest;
import com.horizonte.entity.PasswordResetToken;
import com.horizonte.entity.Usuario;
import com.horizonte.repository.PasswordResetTokenRepository;
import com.horizonte.repository.UsuarioRepository;

@Service
public class PasswordResetService {

    private final UsuarioRepository usuarioRepository;

    private final PasswordResetTokenRepository tokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

        @Value("${app.frontend.url}")
        private String frontendUrl;    

    public PasswordResetService(
            UsuarioRepository usuarioRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {

        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ====================================
    // SOLICITAR RECUPERACIÓN
    // ====================================

    public String solicitarRecuperacion(
            ForgotPasswordRequest request
    ) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No existe un usuario con ese correo"
                                )
                        );

                // ============================
                // ELIMINAR TOKEN ANTERIOR
                // ============================

                tokenRepository
                        .findByUsuario(usuario)
                        .ifPresent(tokenRepository::delete);

        String token =
                UUID.randomUUID().toString();

        PasswordResetToken reset =
                new PasswordResetToken();

        reset.setToken(token);

        reset.setUsuario(usuario);

        reset.setExpiracion(
                LocalDateTime.now()
                        .plusMinutes(15)
        );

        tokenRepository.save(reset);

        String enlace =
                frontendUrl
                + "/reset-password?token="
                + token;

        emailService.enviarCorreo(

                usuario.getEmail(),

                "Recuperación de contraseña",

                "Hola "
                        + usuario.getNombre()
                        + "\n\n"
                        + "Para restablecer tu contraseña ingresa al siguiente enlace:\n\n"
                        + enlace
                        + "\n\n"
                        + "Este enlace expirará en 15 minutos."
        );

        return "Correo enviado correctamente";
    }

    // ====================================
    // CAMBIAR PASSWORD
    // ====================================

    public String cambiarPassword(
            ResetPasswordRequest request
    ) {

        PasswordResetToken token =
                tokenRepository
                        .findByToken(
                                request.getToken()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Token inválido"
                                )
                        );

        if (
                token.getExpiracion()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            throw new RuntimeException(
                    "El enlace ha expirado"
            );
        }

        Usuario usuario =
                token.getUsuario();

        usuario.setPassword(
                passwordEncoder.encode(
                        request.getNuevaPassword()
                )
        );

        usuarioRepository.save(usuario);

        tokenRepository.delete(token);

        return "Contraseña actualizada correctamente";
    }


}