package com.horizonte.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // DATOS PERSONALES
    // =========================

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String telefono;

    @Column(unique = true)
    private String ci;

    @Column(name = "fecha_registro")
    private java.time.LocalDateTime fechaRegistro;

    // =========================
    // ESTADO DEL USUARIO
    // =========================

    @Column(nullable = false)
    private Boolean activo = true;

    // =========================
    // APROBACIÓN DEL ADMIN
    // =========================

    @Column(nullable = false)
    private Boolean aprobado = false;

    // =========================
    // ROL
    // =========================

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    // =========================
    // CONSTRUCTOR VACÍO
    // =========================

    public Usuario() {
    }

    // =========================
    // GETTERS Y SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCi() {
        return ci;
    }

    public void setCi(String ci) {
        this.ci = ci;
    }

    public java.time.LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(java.time.LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    // =========================
    // ACTIVO
    // =========================

    public Boolean getActivo() {
        return activo;
    }

    public boolean isActivo() {
        return Boolean.TRUE.equals(activo);
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    // =========================
    // APROBADO
    // =========================

    public Boolean getAprobado() {
        return aprobado;
    }

    public boolean isAprobado() {
        return Boolean.TRUE.equals(aprobado);
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
    }

    // =========================
    // ROL
    // =========================

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}