package com.horizonte.controller;

import com.horizonte.entity.Notificacion;
import com.horizonte.service.NotificacionService;
import com.horizonte.dto.NotificacionGeneralDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin("*")
public class NotificacionController {

    private final NotificacionService service;

    public NotificacionController(
            NotificacionService service
    ) {
        this.service = service;
    }

    // ====================================
    // LISTAR NOTIFICACIONES DEL USUARIO
    // ====================================
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> listar(
            @PathVariable Long usuarioId
    ) {

        return ResponseEntity.ok(
                service.listar(usuarioId)
        );
    }

    // ====================================
    // CONTAR NO LEÍDAS
    // ====================================
    @GetMapping("/usuario/{usuarioId}/pendientes")
    public ResponseEntity<Long> pendientes(
            @PathVariable Long usuarioId
    ) {

        return ResponseEntity.ok(
                service.pendientes(usuarioId)
        );
    }

    // ====================================
    // MARCAR COMO LEÍDA
    // ====================================
    @PutMapping("/{id}/leida")
    public ResponseEntity<String> marcarLeida(
            @PathVariable Long id
    ) {

        service.marcarLeida(id);

        return ResponseEntity.ok(
                "Notificación marcada como leída"
        );
    }

        @PutMapping("/usuario/{usuarioId}/todas-leidas")
        public void marcarTodas(
                @PathVariable Long usuarioId
        ) {
        service.marcarTodasLeidas(usuarioId);
        }

        @DeleteMapping("/{id}")
        public void eliminar(
                @PathVariable Long id
        ) {
        service.eliminar(id);
        }

        @DeleteMapping("/usuario/{usuarioId}")
        public void eliminarTodas(
                @PathVariable Long usuarioId
        ) {
        service.eliminarTodas(usuarioId);
        }

        // ====================================
        // ENVIAR NOTIFICACIÓN GENERAL
        // ====================================
        @PostMapping("/general")
        public void crearGeneral(
                @RequestBody
                NotificacionGeneralDTO dto
        ) {

        service.crearNotificacionGeneral(

                dto.getTitulo(),

                dto.getMensaje(),

                dto.getTipo()
        );
        }        
}