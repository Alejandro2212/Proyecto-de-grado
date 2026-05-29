package com.horizonte.controller;

import com.horizonte.dto.AuthResponse;
import com.horizonte.dto.LoginRequest;
import com.horizonte.dto.RegisterRequest;
import com.horizonte.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // REGISTRO
    // =========================
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}