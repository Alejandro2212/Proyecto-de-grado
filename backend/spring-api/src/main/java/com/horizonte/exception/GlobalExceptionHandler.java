package com.horizonte.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // RESERVA EXCEPTION
    // =========================
    @ExceptionHandler(
            ReservaException.class
    )
    public ResponseEntity<?> manejarReservaException(
            ReservaException ex
    ) {

        Map<String, Object> error =
                new HashMap<>();

        error.put(
                "mensaje",
                ex.getMessage()
        );

        error.put(
                "codigo",
                400
        );

        error.put(
                "fecha",
                LocalDateTime.now()
        );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    // =========================
    // GENERALES
    // =========================
    @ExceptionHandler(
            Exception.class
    )
    public ResponseEntity<?> manejarGeneral(
            Exception ex
    ) {

        Map<String, Object> error =
                new HashMap<>();

        error.put(
                "mensaje",
                ex.getMessage()
        );

        error.put(
                "codigo",
                500
        );

        error.put(
                "fecha",
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}