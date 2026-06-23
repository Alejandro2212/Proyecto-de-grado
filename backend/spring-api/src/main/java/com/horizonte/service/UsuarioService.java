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

    // =====================================================
    // LISTAR TODOS
    // =====================================================

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    // =====================================================
    // LISTAR PENDIENTES
    // =====================================================

    public List<Usuario> listarPendientes() {
        return usuarioRepository.findByAprobadoFalse();
    }

    // =====================================================
    // CREAR USUARIO DESDE ADMIN
    // =====================================================

    public Usuario crear(UsuarioDTO dto) {

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El correo ya existe.");
        }

        Rol rol = rolRepository
                .findByNombre(dto.getRol().trim().toUpperCase())
                .orElseThrow(() ->
                        new RuntimeException("Rol no encontrado.")
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setTelefono(dto.getTelefono());
        usuario.setCi(dto.getCi());
        usuario.setEmail(dto.getEmail());

        usuario.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );

        usuario.setRol(rol);

        usuario.setActivo(true);

        // IMPORTANTE:
        // Los usuarios creados por el administrador
        // quedan aprobados automáticamente.
        usuario.setAprobado(true);

        usuario.setFechaRegistro(java.time.LocalDateTime.now());

        Usuario nuevo = usuarioRepository.save(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Creó usuario: " + usuario.getNombre()
        );

        return nuevo;
    }

    // =====================================================
    // APROBAR USUARIO
    // =====================================================

    public Usuario aprobarUsuario(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado.")
                );

        usuario.setAprobado(true);

        Usuario actualizado = usuarioRepository.save(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Aprobó usuario: " + usuario.getNombre()
        );

        return actualizado;
    }

    // =====================================================
    // RECHAZAR APROBACIÓN
    // =====================================================
public void rechazarUsuario(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado."
                        )
                );

        usuarioRepository.delete(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Rechazó solicitud de usuario: "
                        + usuario.getNombre()
        );
}

    // =====================================================
    // ACTIVAR / DESACTIVAR
    // =====================================================

    public Usuario cambiarEstado(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado.")
                );

        usuario.setActivo(!usuario.getActivo());

        Usuario actualizado = usuarioRepository.save(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Cambió estado de usuario: " + usuario.getNombre()
        );

        return actualizado;
    }

    // =====================================================
    // CAMBIAR ROL
    // =====================================================

    public Usuario cambiarRol(Long id, String nombreRol) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado.")
                );

        Rol rol = rolRepository
                .findByNombre(nombreRol.trim().toUpperCase())
                .orElseThrow(() ->
                        new RuntimeException("Rol no encontrado.")
                );

        usuario.setRol(rol);

        Usuario actualizado = usuarioRepository.save(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Cambió rol de " +
                        usuario.getNombre() +
                        " a " +
                        rol.getNombre()
        );

        return actualizado;
    }

    // =====================================================
    // ELIMINAR
    // =====================================================

    public void eliminar(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado.")
                );

        usuarioRepository.delete(usuario);

        auditoriaService.registrar(
                "ADMIN",
                "Eliminó usuario: " + usuario.getNombre()
        );
    }
}