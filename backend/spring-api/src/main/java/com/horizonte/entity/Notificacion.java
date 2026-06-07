package com.horizonte.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 1000)
    private String mensaje;

    private String tipo;

    private boolean leida = false;

    private LocalDateTime fecha;


@ManyToOne
@JoinColumn(name = "usuario_id")
@JsonIgnore
private Usuario usuario;

    // =========================
    // CONSTRUCTORES
    // =========================

    public Notificacion() {
        this.fecha = LocalDateTime.now();
        this.leida = false;
    }

    public Notificacion(
            String titulo,
            String mensaje,
            String tipo,
            Usuario usuario
    ) {
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.usuario = usuario;
        this.fecha = LocalDateTime.now();
        this.leida = false;
    }

    // =========================
    // GETTERS Y SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public boolean isLeida() {
        return leida;
    }

    public void setLeida(boolean leida) {
        this.leida = leida;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}