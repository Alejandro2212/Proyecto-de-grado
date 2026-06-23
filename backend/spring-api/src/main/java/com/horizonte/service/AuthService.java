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

    // =====================================================
    // REGISTRO
    // =====================================================

    public AuthResponse register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {

            return new AuthResponse(
                    null,
                    "El correo electrónico ya está registrado.",
                    null,
                    null
            );
        }

        Rol rol = rolRepository
                .findByNombre("RESIDENTE")
                .orElseThrow(() ->
                        new RuntimeException("Rol RESIDENTE no encontrado")
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setTelefono(request.getTelefono());
        usuario.setCi(request.getCi());

        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        usuario.setRol(rol);

        // Estado inicial
        usuario.setActivo(true);

        // NUEVO: requiere aprobación del administrador
        usuario.setAprobado(false);

        usuario.setFechaRegistro(java.time.LocalDateTime.now());

        usuarioRepository.save(usuario);

        // NO generar token todavía
        return new AuthResponse(
                null,
                "Registro exitoso. Su cuenta está pendiente de aprobación por el administrador.",
                usuario.getId(),
                usuario.getRol().getNombre()
        );
    }

    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado.")
                );

        if (!usuario.isActivo()) {

            throw new RuntimeException(
                    "La cuenta se encuentra deshabilitada."
            );
        }

        if (!usuario.isAprobado()) {

            throw new RuntimeException(
                    "Su cuenta está pendiente de aprobación por el administrador."
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword()
        )) {

            throw new RuntimeException(
                    "Contraseña incorrecta."
            );
        }

        String token = jwtService.generateToken(
                usuario.getEmail()
        );

        return new AuthResponse(
                token,
                "Inicio de sesión exitoso.",
                usuario.getId(),
                usuario.getRol().getNombre()
        );
    }
}