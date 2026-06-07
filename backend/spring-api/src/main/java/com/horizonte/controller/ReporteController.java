package com.horizonte.controller;

import com.horizonte.service.ReporteService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin("*")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(
            ReporteService reporteService
    ) {
        this.reporteService = reporteService;
    }

    @GetMapping("/general")
    public ResponseEntity<byte[]>
    reporteGeneral() {

        byte[] pdf =
                reporteService
                        .generarReporteGeneral();

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte.pdf"
                )

                .contentType(
                        MediaType.APPLICATION_PDF
                )

                .body(pdf);
    }

        @GetMapping("/area/{id}")
        public ResponseEntity<byte[]> reporteArea(
                @PathVariable Long id
        ) {

        byte[] pdf =
                reporteService
                        .generarReporteArea(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte-area.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        }

        @GetMapping("/usuario/{id}")
        public ResponseEntity<byte[]> reporteUsuario(
                @PathVariable Long id
        ) {

        byte[] pdf =
                reporteService
                        .generarReporteUsuario(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte-usuario.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
        }
}