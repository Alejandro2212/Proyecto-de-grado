package com.horizonte.service;

import com.horizonte.dto.UsuarioDTO;
import com.horizonte.entity.Rol;
import com.horizonte.entity.Usuario;

import com.horizonte.repository.RolRepository;
import com.horizonte.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            AuditoriaService auditoriaService
    ) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    // =========================
    // LISTAR
    // =========================
    public List<Usuario> listar() {

        return usuarioRepository.findAll();
    }

    // =========================
    // CREAR
    // =========================
    public Usuario crear(
            UsuarioDTO dto
    ) {

        if (usuarioRepository
                .findByEmail(dto.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "El correo ya existe"
            );
        }

        Rol rol = rolRepository
                .findByNombre(
                        dto.getRol()
                                .trim()
                                .toUpperCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Rol no encontrado"
                        )
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(dto.getNombre());

        usuario.setApellido(dto.getApellido());

        usuario.setTelefono(dto.getTelefono());

        usuario.setCi(dto.getCi());

        usuario.setEmail(dto.getEmail());

        

        usuario.setPassword(
                passwordEncoder.encode(
                        dto.getPassword()
                )
        );

        usuario.setRol(rol);

        usuario.setActivo(true);

        usuario.setFechaRegistro(java.time.LocalDateTime.now());
        

        Usuario nuevo =
                usuarioRepository.save(usuario);

        // AUDITORÍA
        auditoriaService.registrar(
                "ADMIN",
                "Creó usuario: " + usuario.getNombre()
        );

        return nuevo;
    }

    // =========================
    // ACTIVAR / DESACTIVAR
    // =========================
    public Usuario cambiarEstado(
            Long id
    ) {

        Usuario usuario =
                usuarioRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );

        usuario.setActivo(
                !usuario.getActivo()
        );

        Usuario actualizado =
                usuarioRepository.save(usuario);

        // AUDITORÍA
        auditoriaService.registrar(
                "ADMIN",
                "Cambió estado de usuario: "
                        + usuario.getNombre()
        );

        return actualizado;
    }

    // =========================
    // CAMBIAR ROL
    // =========================
    public Usuario cambiarRol(

            Long id,

            String nombreRol
    ) {

        Usuario usuario =
                usuarioRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );

        String rolLimpio =
                nombreRol
                        .trim()
                        .toUpperCase();

        Rol rol =
                rolRepository.findByNombre(rolLimpio)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Rol no encontrado: "
                                                + rolLimpio
                                )
                        );

        usuario.setRol(rol);

        Usuario actualizado =
                usuarioRepository.save(usuario);

        // AUDITORÍA
        auditoriaService.registrar(
                "ADMIN",
                "Cambió rol de "
                        + usuario.getNombre()
                        + " a "
                        + rol.getNombre()
        );

        return actualizado;
    }

    // =========================
    // ELIMINAR
    // =========================
    public void eliminar(
            Long id
    ) {

        Usuario usuario =
                usuarioRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );

        usuarioRepository.delete(usuario);

        // AUDITORÍA
        auditoriaService.registrar(
                "ADMIN",
                "Eliminó usuario: "
                        + usuario.getNombre()
        );
    }
}