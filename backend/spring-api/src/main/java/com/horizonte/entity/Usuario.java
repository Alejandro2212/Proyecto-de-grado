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
    // ESTADO
    // =========================
    @Column(nullable = false)
    private Boolean activo = true;

    // =========================
    // RELACIÓN ROL
    // =========================
    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    // =========================
    // CONSTRUCTORES
    // =========================
    public Usuario() {
    }

    public Usuario(
            String nombre,
            String apellido,
            String email,
            String password,
            String telefono,
            String ci,
            Rol rol
    ) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.ci = ci;
        this.rol = rol;
        this.activo = true;
        this.fechaRegistro =
            java.time.LocalDateTime.now();
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

    // =========================
    // NOMBRE
    // =========================
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // =========================
    // APELLIDO
    // =========================
    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    // =========================
    // EMAIL
    // =========================
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // =========================
    // PASSWORD
    // =========================
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // =========================
    // TELÉFONO
    // =========================
    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    // =========================
    // ACTIVO
    // =========================

    // Getter tradicional
    public Boolean getActivo() {
        return activo;
    }

    // Getter booleano profesional
    public boolean isActivo() {
        return Boolean.TRUE.equals(activo);
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
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

    public String getCi() {
        return ci;
    }

    public void setCi(String ci) {
        this.ci = ci;
    }

    public java.time.LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(
            java.time.LocalDateTime fechaRegistro
    ) {
        this.fechaRegistro = fechaRegistro;
    }
}