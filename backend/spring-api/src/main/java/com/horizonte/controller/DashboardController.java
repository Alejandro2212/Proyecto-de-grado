package com.horizonte.controller;

import com.horizonte.dto.DashboardDTO;
import com.horizonte.service.DashboardService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public DashboardDTO resumen() {

        return dashboardService.obtenerResumen();
    }
}