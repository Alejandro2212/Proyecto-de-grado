package com.horizonte.controller;

import com.horizonte.service.PdfService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin("*")
public class ReporteController {

    private final PdfService pdfService;

    public ReporteController(
            PdfService pdfService
    ) {
        this.pdfService = pdfService;
    }

    // =========================
    // GENERAR PDF
    // =========================
    @GetMapping(
            value = "/reservas",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> generarPdfReservas() {

        byte[] pdf =
                pdfService.generarPdfReservas();

        return ResponseEntity.ok()

                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=reporte_reservas.pdf"
                )

                .contentType(
                        MediaType.APPLICATION_PDF
                )

                .body(pdf);
    }
}