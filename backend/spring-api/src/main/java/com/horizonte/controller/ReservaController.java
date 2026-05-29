package com.horizonte.controller;

import com.horizonte.dto.PrediccionDTO;
import com.horizonte.dto.ReservaDTO;

import com.horizonte.entity.Reserva;
import com.horizonte.entity.enums.EstadoReserva;

import com.horizonte.service.PythonIAService;
import com.horizonte.service.RecomendacionIAService;
import com.horizonte.service.ReservaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin("*")
public class ReservaController {

    // =========================
    // SERVICES
    // =========================

    private final ReservaService reservaService;

    private final PythonIAService pythonIAService;

    private final RecomendacionIAService recomendacionIAService;

    // =========================
    // CONSTRUCTOR
    // =========================

    public ReservaController(

            ReservaService reservaService,

            PythonIAService pythonIAService,

            RecomendacionIAService recomendacionIAService
    ) {

        this.reservaService =
                reservaService;

        this.pythonIAService =
                pythonIAService;

        this.recomendacionIAService =
                recomendacionIAService;
    }

    // =========================
    // CREAR RESERVA
    // =========================

    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody ReservaDTO dto
    ) {

        try {

            return ResponseEntity.ok(
                    reservaService.crear(dto)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // CAMBIAR ESTADO
    // =========================

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(

            @PathVariable Long id,

            @RequestParam EstadoReserva estado
    ) {

        try {

            return ResponseEntity.ok(
                    reservaService.cambiarEstado(
                            id,
                            estado
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // LISTAR
    // =========================

    @GetMapping
    public List<Reserva> listar() {

        return reservaService.listar();
    }

    // =========================
    // PENDIENTES
    // =========================

    @GetMapping("/pendientes")
    public List<Reserva> pendientes() {

        return reservaService.pendientes();
    }

    // =========================
    // FILTRAR
    // =========================

    @GetMapping("/filtrar")
    public List<Reserva> filtrar(

            @RequestParam(required = false)
            EstadoReserva estado,

            @RequestParam(required = false)
            String fecha
    ) {

        LocalDate fechaParsed = null;

        if (
                fecha != null &&
                !fecha.isEmpty()
        ) {

            fechaParsed =
                    LocalDate.parse(fecha);
        }

        return reservaService.filtrar(
                estado,
                fechaParsed
        );
    }

    // =========================
    // DISPONIBILIDAD
    // =========================

    @GetMapping("/disponibilidad")
    public List<Reserva> disponibilidad(

            @RequestParam Long areaId,

            @RequestParam String fecha
    ) {

        return reservaService
                .obtenerReservasPorFecha(

                        areaId,

                        LocalDate.parse(fecha)
                );
    }

    // =========================
    // VALIDAR
    // =========================

    @GetMapping("/validar")
    public boolean validar(

            @RequestParam Long areaId,

            @RequestParam String fecha,

            @RequestParam String horaInicio,

            @RequestParam String horaFin
    ) {

        return reservaService
                .validarDisponibilidad(

                        areaId,

                        LocalDate.parse(fecha),

                        LocalTime.parse(horaInicio),

                        LocalTime.parse(horaFin)
                );
    }

    // =========================
    // STATS
    // =========================

    @GetMapping("/stats/total")
    public Long total() {

        return reservaService.totalReservas();
    }

    @GetMapping("/stats/pendientes")
    public Long pendientesCount() {

        return reservaService.pendientesCount();
    }

    @GetMapping("/stats/aprobadas")
    public Long aprobadasCount() {

        return reservaService.aprobadasCount();
    }

    @GetMapping("/stats/canceladas")
    public Long canceladasCount() {

        return reservaService.canceladasCount();
    }

    @GetMapping("/stats/areas")
    public List<Object[]> porArea() {

        return reservaService.reservasPorArea();
    }

    @GetMapping("/stats/mes")
    public List<Object[]> porMes() {

        return reservaService.reservasPorMes();
    }

    @GetMapping("/stats/area-top")
    public List<Object[]> topArea() {

        return reservaService.areaMasReservada();
    }

    @GetMapping("/stats/proximas")
    public List<Reserva> proximas() {

        return reservaService.proximasReservas();
    }

    // =========================
    // USUARIO
    // =========================

    @GetMapping("/usuario")
    public List<Reserva> porUsuario(

            @RequestParam Long usuarioId,

            @RequestParam String rol
    ) {

        return reservaService
                .listarPorUsuario(
                        usuarioId,
                        rol
                );
    }

    // =========================
    // IA PREDICTIVA JAVA
    // =========================

    @GetMapping("/stats/prediccion-java")
    public PrediccionDTO prediccionJava() {

        return reservaService
                .obtenerPrediccion();
    }

    // =========================
    // IA PYTHON REAL
    // =========================

    @GetMapping("/stats/prediccion")
    public PrediccionDTO pythonIA() {

        return pythonIAService
                .ejecutarIA();
    }

    // =========================
    // IA RECOMENDACION
    // =========================

    @GetMapping("/stats/recomendacion")
    public ResponseEntity<?> recomendacion() {

        return ResponseEntity.ok(
                recomendacionIAService.generar()
        );
    }
}