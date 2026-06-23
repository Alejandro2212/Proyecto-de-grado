package com.horizonte.controller;

import org.springframework.web.bind.annotation.*;

import com.horizonte.dto.ForgotPasswordRequest;
import com.horizonte.dto.ResetPasswordRequest;
import com.horizonte.service.PasswordResetService;

@RestController
@RequestMapping("/api/password")
@CrossOrigin("*")
public class PasswordResetController {

    private final PasswordResetService service;

    public PasswordResetController(
            PasswordResetService service
    ) {

        this.service = service;
    }

    @PostMapping("/forgot")
    public String forgotPassword(
            @RequestBody
            ForgotPasswordRequest request
    ) {

        return service
                .solicitarRecuperacion(
                        request
                );
    }

    @PostMapping("/reset")
    public String resetPassword(
            @RequestBody
            ResetPasswordRequest request
    ) {

        return service
                .cambiarPassword(
                        request
                );
    }
}