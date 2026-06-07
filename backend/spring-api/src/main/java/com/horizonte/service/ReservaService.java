package com.horizonte.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.horizonte.dto.PrediccionDTO;
import com.horizonte.dto.ReservaDTO;
import com.horizonte.entity.AreaComun;
import com.horizonte.entity.Reserva;
import com.horizonte.entity.Usuario;
import com.horizonte.entity.enums.EstadoReserva;
import com.horizonte.exception.ReservaException;
import com.horizonte.repository.AreaComunRepository;
import com.horizonte.repository.ReservaRepository;
import com.horizonte.repository.UsuarioRepository;
import com.horizonte.service.NotificacionService;


@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;

    private final UsuarioRepository usuarioRepository;

    private final AreaComunRepository areaRepository;

    private final EmailService emailService;

    private final SimpMessagingTemplate messagingTemplate;

    private final AuditoriaService auditoriaService;

    private final NotificacionService notificacionService;

    public ReservaService(
            ReservaRepository reservaRepository,
            UsuarioRepository usuarioRepository,
            AreaComunRepository areaRepository,
            EmailService emailService,
            SimpMessagingTemplate messagingTemplate,
            AuditoriaService auditoriaService,
            NotificacionService notificacionService
    ) {

        this.reservaRepository = reservaRepository;

        this.usuarioRepository = usuarioRepository;

        this.areaRepository = areaRepository;

        this.emailService = emailService;

        this.messagingTemplate = messagingTemplate;

        this.auditoriaService = auditoriaService;

        this.notificacionService = notificacionService;
    }

    // =====================================================
    // CREAR RESERVA
    // =====================================================
    public Reserva crear(ReservaDTO dto) {

        Usuario usuario = usuarioRepository
                .findById(dto.getUsuarioId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        AreaComun area = areaRepository
                .findById(dto.getAreaId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Área no encontrada"
                        )
                );

        Reserva reserva = new Reserva();       

        reserva.setUsuario(usuario);

        reserva.setAreaComun(area);

        reserva.setFecha(dto.getFecha());

        reserva.setHoraInicio(dto.getHoraInicio());

        reserva.setHoraFin(dto.getHoraFin());

        reserva.setEstado(
                EstadoReserva.PENDIENTE
        );

        validarReserva(reserva);

        Reserva nueva =
                reservaRepository.save(reserva);

        notificacionService.crearNotificacion(
                usuario.getId(),
                "Reserva registrada",
                "Tu solicitud para "
                        + area.getNombre()
                        + " fue registrada correctamente.",
                "RESERVA"
        );        

        // AUDITORIA
        try {

            auditoriaService.registrar(
                    "CREAR_RESERVA",
                    usuario.getNombre()
                            + " creó una reserva para "
                            + area.getNombre()
            );

        } catch (Exception e) {

            System.out.println(e.getMessage());
        }

        return nueva;
    }

    // =====================================================
    // CAMBIAR ESTADO
    // =====================================================
    public Reserva cambiarEstado(
            Long reservaId,
            EstadoReserva estado
    ) {

        Reserva reserva = reservaRepository
                .findById(reservaId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Reserva no encontrada"
                        )
                );

        reserva.setEstado(estado);

        Reserva actualizada =
                reservaRepository.save(reserva);

        notificacionService.crearNotificacion(
                reserva.getUsuario().getId(),
                "Estado actualizado",
                "Tu reserva para "
                        + reserva.getAreaComun().getNombre()
                        + " fue "
                        + estado,
                "ESTADO"
        );

        // =========================
        // EMAIL
        // =========================
        try {

            emailService.enviarCorreo(

                    reserva.getUsuario().getEmail(),

                    "Estado de Reserva Actualizado",

                    "Su reserva para "
                            + reserva.getAreaComun().getNombre()
                            + " fue "
                            + estado
            );

        } catch (Exception e) {

            System.out.println(e.getMessage());
        }

        // =========================
        // WEBSOCKET
        // =========================
        try {

            Map<String, Object> payload =
                    new HashMap<>();

            payload.put(
                    "mensaje",
                    "Reserva " + estado
            );

            payload.put(
                    "estado",
                    estado
            );

            payload.put(
                    "usuario",
                    reserva.getUsuario().getNombre()
            );

            payload.put(
                    "area",
                    reserva.getAreaComun().getNombre()
            );

            payload.put(
                    "fecha",
                    reserva.getFecha()
            );

            messagingTemplate.convertAndSend(
                    "/topic/reservas",
                    payload
            );

        } catch (Exception e) {

            System.out.println(e.getMessage());
        }

        // =========================
        // AUDITORIA
        // =========================
        try {

            auditoriaService.registrar(
                    "CAMBIO_ESTADO",
                    "Reserva "
                            + reserva.getId()
                            + " cambió a "
                            + estado
            );

        } catch (Exception e) {

            System.out.println(e.getMessage());
        }

        return actualizada;
    }

    // =====================================================
    // LISTAR
    // =====================================================
    public List<Reserva> listar() {

        return reservaRepository.findAll();
    }

    public List<Reserva> pendientes() {

        return reservaRepository.findByEstado(
                EstadoReserva.PENDIENTE
        );
    }

    // =====================================================
    // RESERVAS POR FECHA
    // =====================================================
    public List<Reserva> obtenerReservasPorFecha(
            Long areaId,
            LocalDate fecha
    ) {

        return reservaRepository
                .findByAreaComun_IdAndFecha(
                        areaId,
                        fecha
                );
    }

// =====================================================
// CANCELAR RESERVA
// =====================================================
public Reserva cancelarReserva(
        Long reservaId,
        Long usuarioId
) {

    Reserva reserva = reservaRepository
            .findById(reservaId)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Reserva no encontrada"
                    )
            );

    if (
            !reserva.getUsuario().getId()
                    .equals(usuarioId)
    ) {

        throw new RuntimeException(
                "No tiene permiso para cancelar esta reserva"
        );
    }

    if (
            reserva.getEstado()
                    == EstadoReserva.CANCELADA
    ) {

        throw new RuntimeException(
                "La reserva ya está cancelada"
        );
    }

    if (
            reserva.getEstado()
                    == EstadoReserva.RECHAZADA
    ) {

        throw new RuntimeException(
                "No puede cancelar una reserva rechazada"
        );
    }

    reserva.setEstado(
            EstadoReserva.CANCELADA
    );

    Reserva actualizada =
            reservaRepository.save(reserva);

        notificacionService.crearNotificacion(
                reserva.getUsuario().getId(),
                "Reserva cancelada",
                "La reserva para "
                        + reserva.getAreaComun().getNombre()
                        + " fue cancelada.",
                "CANCELACION"
        );

    try {

        auditoriaService.registrar(
                "CANCELAR_RESERVA",
                reserva.getUsuario().getNombre()
                        + " canceló la reserva "
                        + reserva.getId()
        );

    } catch (Exception e) {

        System.out.println(e.getMessage());
    }

    return actualizada;
}

// =====================================================
// VALIDAR RESERVA
// =====================================================
        public void validarReserva(
                Reserva reserva
        ) {

        // =========================
        // USUARIO ACTIVO
        // =========================
        if (!reserva.getUsuario().isActivo()) {

                throw new RuntimeException(
                        "El usuario está inactivo"
                );
        }

        // =========================
        // AREA ACTIVA
        // =========================
        if (!reserva.getAreaComun().isActivo()) {

                throw new RuntimeException(
                        "El área seleccionada está inactiva"
                );
        }

        // =========================
        // FECHA PASADA
        // =========================
        if (
                reserva.getFecha()
                        .isBefore(LocalDate.now())
        ) {

                throw new RuntimeException(
                        "No puede reservar fechas pasadas"
                );
        }

        // =========================
        // HORAS IGUALES
        // =========================
        if (
                reserva.getHoraInicio()
                        .equals(
                                reserva.getHoraFin()
                        )
        ) {

                throw new RuntimeException(
                        "La hora inicio y fin no pueden ser iguales"
                );
        }

        // =========================
        // HORA FIN MENOR
        // =========================
        if (
                reserva.getHoraFin()
                        .isBefore(
                                reserva.getHoraInicio()
                        )
        ) {

                throw new RuntimeException(
                        "La hora fin no puede ser menor a la hora inicio"
                );
        }

        // =========================
        // HORARIO GENERAL
        // =========================
        LocalTime apertura =
                LocalTime.of(6, 0);

        LocalTime cierre =
                LocalTime.of(23, 0);

        if (
                reserva.getHoraInicio()
                        .isBefore(apertura)
                ||
                reserva.getHoraFin()
                        .isAfter(cierre)
        ) {

                throw new RuntimeException(
                        "Horario permitido: 06:00 a 23:00"
                );
        }

        // =========================
        // HORA PASADA DEL MISMO DIA
        // =========================
        if (
                reserva.getFecha()
                        .equals(LocalDate.now())
        ) {

                if (
                        reserva.getHoraInicio()
                                .isBefore(
                                        LocalTime.now()
                                )
                ) {

                throw new RuntimeException(
                        "No puede reservar horas pasadas"
                );
                }
        }

        // =========================
        // HORARIO DEL AREA
        // =========================
        if (
                reserva.getHoraInicio().isBefore(
                        reserva.getAreaComun()
                                .getHorarioInicio()
                )
                ||
                reserva.getHoraFin().isAfter(
                        reserva.getAreaComun()
                                .getHorarioFin()
                )
        ) {

                throw new ReservaException(
                        "Fuera del horario permitido para el área"
                );
        }

        // =========================
        // CONFLICTOS
        // =========================
        List<Reserva> conflictos =
                reservaRepository.findConflictos(

                        reserva.getAreaComun().getId(),

                        reserva.getFecha(),

                        reserva.getHoraInicio(),

                        reserva.getHoraFin()
                );

        if (!conflictos.isEmpty()) {

                throw new ReservaException(
                        "El horario ya está reservado"
                );
        }
        }

    // =====================================================
    // DASHBOARD
    // =====================================================
    public Long totalReservas() {

        return reservaRepository.totalReservas();
    }

    public Long pendientesCount() {

        return reservaRepository.countByEstado(
                EstadoReserva.PENDIENTE
        );
    }

    public Long aprobadasCount() {

        return reservaRepository.countByEstado(
                EstadoReserva.APROBADA
        );
    }

    public Long canceladasCount() {

        return reservaRepository.countByEstado(
                EstadoReserva.CANCELADA
        );
    }

    public List<Object[]> reservasPorArea() {

        return reservaRepository.reservasPorArea();
    }

    public List<Object[]> reservasPorMes() {

        return reservaRepository.reservasPorMes();
    }

    public List<Object[]> areaMasReservada() {

        return reservaRepository.areaMasReservada();
    }

    public List<Reserva> proximasReservas() {

        return reservaRepository
                .findTop5ByFechaGreaterThanEqualOrderByFechaAsc(
                        LocalDate.now()
                );
    }

    // =====================================================
    // FILTROS
    // =====================================================
    public List<Reserva> filtrar(
            EstadoReserva estado,
            LocalDate fecha
    ) {

        return reservaRepository
                .filtrar(estado, fecha);
    }

    // =====================================================
    // LISTAR POR USUARIO
    // =====================================================
    public List<Reserva> listarPorUsuario(
            Long usuarioId,
            String rol
    ) {

        if ("ADMIN".equalsIgnoreCase(rol)) {

            return reservaRepository.findAll();
        }

        return reservaRepository
                .findByUsuario_Id(usuarioId);
    }

    // =====================================================
    // VALIDAR DISPONIBILIDAD
    // =====================================================
    public boolean validarDisponibilidad(

            Long areaId,

            LocalDate fecha,

            LocalTime horaInicio,

            LocalTime horaFin
    ) {

        List<Reserva> conflictos =
                reservaRepository.findConflictos(

                        areaId,

                        fecha,

                        horaInicio,

                        horaFin
                );

        return conflictos.isEmpty();
    }

    // =====================================================
    // IA PREDICTIVA
    // =====================================================
    public PrediccionDTO obtenerPrediccion() {

        PrediccionDTO dto =
                new PrediccionDTO();

        // =========================
        // AREA MÁS USADA
        // =========================
        List<Object[]> areas =
                reservaRepository
                        .areasMasUsadas();

        if (!areas.isEmpty()) {

            dto.setAreaMasUsada(
                    areas.get(0)[0].toString()
            );
        }

        // =========================
        // HORARIO MÁS USADO
        // =========================
        List<Object[]> horarios =
                reservaRepository
                        .horariosMasUsados();

        if (!horarios.isEmpty()) {

            dto.setHorarioMasUsado(
                    horarios.get(0)[0].toString()
            );
        }

        // =========================
        // DIA MÁS RESERVADO
        // =========================
        List<Object[]> dias =
                reservaRepository
                        .diasMasReservados();

        if (!dias.isEmpty()) {

            dto.setDiaMasReservado(
                    dias.get(0)[0].toString()
            );
        }

        // =========================
        // TOTAL
        // =========================
        dto.setTotalReservas(
                reservaRepository.totalReservas()
        );

        // =========================
        // RECOMENDACION IA
        // =========================
        Long total =
                reservaRepository.totalReservas();

        if (total > 100) {

            dto.setRecomendacion(
                    "Alta demanda detectada. " +
                    "Se recomienda ampliar horarios."
            );

        } else if (total > 50) {

            dto.setRecomendacion(
                    "Demanda moderada detectada."
            );

        } else {

            dto.setRecomendacion(
                    "Demanda baja actualmente."
            );
        }

        return dto;
    }
}