package com.horizonte.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.horizonte.entity.Reserva;
import com.horizonte.entity.enums.EstadoReserva;

public interface ReservaRepository
        extends JpaRepository<Reserva, Long> {

    boolean existsByAreaComun_IdAndFechaAndHoraInicioLessThanAndHoraFinGreaterThan(

            Long areaId,

            LocalDate fecha,

            LocalTime horaFin,

            LocalTime horaInicio
    );

    List<Reserva> findByAreaComun_IdAndFecha(

            Long areaId,

            LocalDate fecha
    );

    @Query(
        "SELECT r FROM Reserva r " +
        "WHERE r.areaComun.id = :areaId " +
        "AND r.fecha = :fecha " +
        "AND r.estado <> 'CANCELADA' " +
        "AND (r.horaInicio < :horaFin " +
        "AND r.horaFin > :horaInicio)"
    )
    List<Reserva> findConflictos(

            @Param("areaId") Long areaId,

            @Param("fecha") LocalDate fecha,

            @Param("horaInicio") LocalTime horaInicio,

            @Param("horaFin") LocalTime horaFin
    );

    @Query("SELECT COUNT(r) FROM Reserva r")
    Long totalReservas();

    @Query(
        "SELECT r.areaComun.nombre, COUNT(r) " +
        "FROM Reserva r " +
        "GROUP BY r.areaComun.nombre"
    )
    List<Object[]> reservasPorArea();

    @Query("""
    SELECT
    FUNCTION('MONTH', r.fecha),
    COUNT(r)
    FROM Reserva r
    WHERE r.fecha IS NOT NULL
    GROUP BY FUNCTION('MONTH', r.fecha)
    ORDER BY FUNCTION('MONTH', r.fecha)
    """)
    List<Object[]> reservasPorMes();

    List<Reserva> findByUsuario_Id(Long usuarioId);
    List<Reserva> findByAreaComun_Id(Long areaId);

    Long countByUsuario_Id(Long usuarioId);

    Long countByAreaComun_Id(Long areaId);

    List<Reserva> findByEstado(EstadoReserva estado);

    Long countByEstado(EstadoReserva estado);

    // ====================================
    // NUEVOS MÉTODOS PARA REPORTES
    // ====================================

    default Long countPendientes() {
        return countByEstado(
                EstadoReserva.PENDIENTE
        );
    }

    default Long countAprobadas() {
        return countByEstado(
                EstadoReserva.APROBADA
        );
    }

    default Long countCanceladas() {
        return countByEstado(
                EstadoReserva.CANCELADA
        );
    }

    @Query(
        "SELECT r.areaComun.nombre, COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY r.areaComun.nombre " +
        "ORDER BY total DESC"
    )
    List<Object[]> areaMasReservada();

    List<Reserva> findTop5ByFechaGreaterThanEqualOrderByFechaAsc(
            LocalDate fecha
    );

    @Query(
        "SELECT r FROM Reserva r " +
        "WHERE " +
        "(:estado IS NULL OR r.estado = :estado) " +
        "AND (:fecha IS NULL OR r.fecha = :fecha)"
    )
    List<Reserva> filtrar(

            @Param("estado") EstadoReserva estado,

            @Param("fecha") LocalDate fecha
    );

    // =========================
    // IA PREDICTIVA
    // =========================

    @Query(
        "SELECT r.areaComun.nombre, COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY r.areaComun.nombre " +
        "ORDER BY total DESC"
    )
    List<Object[]> areasMasUsadas();


    @Query(
        "SELECT r.horaInicio, COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY r.horaInicio " +
        "ORDER BY total DESC"
    )
    List<Object[]> horariosMasUsados();

    @Query(
        "SELECT FUNCTION('DAYNAME', r.fecha), COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY FUNCTION('DAYNAME', r.fecha) " +
        "ORDER BY total DESC"
    )
    List<Object[]> diasMasReservados();

    // =========================
    // IA RECOMENDACIONES
    // =========================

    @Query(
        "SELECT r.areaComun.nombre, COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY r.areaComun.nombre " +
        "ORDER BY total ASC"
    )
    List<Object[]> areasMenosOcupadas();

    @Query(
        "SELECT r.horaInicio, COUNT(r) total " +
        "FROM Reserva r " +
        "GROUP BY r.horaInicio " +
        "ORDER BY total ASC"
    )
    List<Object[]> horariosMenosUsados();

    @Query("""
        SELECT r.horaInicio, COUNT(r)
        FROM Reserva r
        WHERE r.fecha >= CURRENT_DATE
        GROUP BY r.horaInicio
        ORDER BY COUNT(r) ASC
        """)
    List<Object[]> horariosMenosUsadosFuturos();

    @Query("""
    SELECT r.horaInicio, COUNT(r)
    FROM Reserva r
    WHERE r.areaComun.id = :areaId
    AND r.fecha >= CURRENT_DATE
    GROUP BY r.horaInicio
    ORDER BY COUNT(r) ASC
    """)
    List<Object[]> horariosMenosUsadosPorArea(
            @Param("areaId") Long areaId
    );

// =====================================
// DASHBOARD EJECUTIVO AVANZADO
// =====================================

@Query("""
       SELECT COUNT(r)
       FROM Reserva r
       WHERE FUNCTION('MONTH', r.fecha) = FUNCTION('MONTH', CURRENT_DATE)
       """)
Long reservasMesActual();

@Query("""
       SELECT COUNT(r)
       FROM Reserva r
       WHERE r.estado = 'CANCELADA'
       """)
Long totalCanceladasDashboard();

@Query("""
       SELECT r.areaComun.nombre, COUNT(r)
       FROM Reserva r
       GROUP BY r.areaComun.nombre
       ORDER BY COUNT(r) ASC
       """)
List<Object[]> areaMenosReservada(); 


}

