package com.horizonte.service;

import com.horizonte.dto.AuthResponse;
import com.horizonte.dto.LoginRequest;
import com.horizonte.dto.RegisterRequest;

import com.horizonte.entity.Rol;
import com.horizonte.entity.Usuario;

import com.horizonte.repository.RolRepository;
import com.horizonte.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    private final RolRepository rolRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================
    public AuthResponse register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(
                request.getEmail()
        )) {

            return new AuthResponse(
                    null,
                    "El email ya está registrado",
                    null,
                    null
            );
        }

        Rol rol = rolRepository
                .findByNombre("RESIDENTE")
                .orElseGet(() ->
                        rolRepository.save(
                                new Rol("RESIDENTE")
                        )
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());

        usuario.setApellido(request.getApellido());

        usuario.setEmail(request.getEmail());

        usuario.setTelefono(request.getTelefono());

        usuario.setCi(request.getCi());

        usuario.setActivo(true);

        usuario.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        usuario.setRol(rol);

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(
                usuario.getEmail()
        );

        return new AuthResponse(
                token,
                "Usuario registrado correctamente",
                usuario.getId(),
                usuario.getRol().getNombre()
        );
    }

    // =========================
    // LOGIN
    // =========================
    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        if (!usuario.getActivo()) {

            throw new RuntimeException(
                    "Usuario desactivado"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword()
        )) {

            throw new RuntimeException(
                    "Contraseña incorrecta"
            );
        }

        String token = jwtService.generateToken(
                usuario.getEmail()
        );

        return new AuthResponse(
                token,
                "Login correcto",
                usuario.getId(),
                usuario.getRol().getNombre()
        );
    }
}