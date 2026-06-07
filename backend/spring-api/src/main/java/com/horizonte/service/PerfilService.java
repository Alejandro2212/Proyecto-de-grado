package com.horizonte.service;

import com.horizonte.dto.PerfilDTO;
import com.horizonte.dto.PerfilUpdateDTO;
import com.horizonte.entity.Usuario;
import com.horizonte.repository.UsuarioRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.horizonte.dto.CambiarPasswordDTO;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

        public PerfilService(
                UsuarioRepository usuarioRepository,
                PasswordEncoder passwordEncoder
        ) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        }

    // =========================
    // OBTENER PERFIL
    // =========================
    public PerfilDTO obtenerPerfil() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow();

        PerfilDTO dto =
                new PerfilDTO();

        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setCi(usuario.getCi());
        dto.setRol(usuario.getRol().getNombre());

        return dto;
    }

    // =========================
    // ACTUALIZAR PERFIL
    // =========================
    public PerfilDTO actualizar(
            PerfilUpdateDTO dto
    ) {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow();

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setTelefono(dto.getTelefono());
        usuario.setCi(dto.getCi());

        usuarioRepository.save(usuario);

        return obtenerPerfil();
    }

// =========================
// CAMBIAR PASSWORD
// =========================
public void cambiarPassword(
        CambiarPasswordDTO dto
) {

    String email =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();

    Usuario usuario =
            usuarioRepository
                    .findByEmail(email)
                    .orElseThrow();

    if (!passwordEncoder.matches(
            dto.getPasswordActual(),
            usuario.getPassword()
    )) {

        throw new RuntimeException(
                "La contraseña actual es incorrecta"
        );
    }

    usuario.setPassword(
            passwordEncoder.encode(
                    dto.getPasswordNueva()
            )
    );

    usuarioRepository.save(usuario);
}
}