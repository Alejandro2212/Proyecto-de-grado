package com.horizonte.controller;

import com.horizonte.dto.UsuarioDTO;
import com.horizonte.entity.Usuario;
import com.horizonte.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(
            UsuarioService usuarioService
    ) {
        this.usuarioService = usuarioService;
    }

    // =====================================
    // LISTAR TODOS
    // =====================================

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    // =====================================
    // LISTAR PENDIENTES DE APROBACIÓN
    // =====================================

    @GetMapping("/pendientes")
    public List<Usuario> listarPendientes() {
        return usuarioService.listarPendientes();
    }

    // =====================================
    // CREAR USUARIO (ADMIN)
    // =====================================

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody UsuarioDTO dto
    ) {

        try {

            return ResponseEntity.ok(
                    usuarioService.crear(dto)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================
    // APROBAR USUARIO
    // =====================================

    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobar(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(
                    usuarioService.aprobarUsuario(id)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    // =====================================
    // RECHAZAR USUARIO
    // =====================================

        @DeleteMapping("/{id}/rechazar")
        public ResponseEntity<?> rechazar(
                @PathVariable Long id
        ) {

            try {

                usuarioService.rechazarUsuario(id);

                return ResponseEntity.ok(
                        "Usuario rechazado correctamente."
                );

            } catch (Exception e) {

                return ResponseEntity
                        .badRequest()
                        .body(e.getMessage());
            }
        }

    // =====================================
    // ACTIVAR / DESACTIVAR
    // =====================================

    @PutMapping("/{id}/estado")
    public Usuario cambiarEstado(
            @PathVariable Long id
    ) {

        return usuarioService.cambiarEstado(id);
    }

    // =====================================
    // CAMBIAR ROL
    // =====================================

    @PutMapping("/{id}/rol")
    public Usuario cambiarRol(

            @PathVariable Long id,

            @RequestParam String rol
    ) {

        return usuarioService.cambiarRol(id, rol);
    }

    // =====================================
    // ELIMINAR
    // =====================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            usuarioService.eliminar(id);

            return ResponseEntity.ok(
                    "Usuario eliminado correctamente."
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}