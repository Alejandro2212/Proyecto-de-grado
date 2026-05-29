package com.horizonte.dto;

public class AuthResponse {

    private String token;

    private String mensaje;

    private Long usuarioId;

    private String rol;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            String mensaje,
            Long usuarioId,
            String rol
    ) {
        this.token = token;
        this.mensaje = mensaje;
        this.usuarioId = usuarioId;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public String getMensaje() {
        return mensaje;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getRol() {
        return rol;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}