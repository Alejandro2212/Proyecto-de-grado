package com.horizonte.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.horizonte.dto.PrediccionDTO;

@Service
public class PythonIAService {

    public PrediccionDTO ejecutarIA() {

        try {

            // =========================================
            // RUTA DEL PYTHON DEL VENV
            // =========================================

            String pythonExe =
                    "C:/Users/LENOVO/Documents/condominio-horizonte/ia-service/venv/Scripts/python.exe";

            // =========================================
            // RUTA DEL SCRIPT
            // =========================================

            String script =
                    "python/prediccion.py";

            ProcessBuilder pb =
                    new ProcessBuilder(
                            pythonExe,
                            script
                    );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(
                                    process.getInputStream()
                            )
                    );

            StringBuilder output =
                    new StringBuilder();

            String line;

            while ((line = reader.readLine()) != null) {

                output.append(line);
            }

            process.waitFor();

            String resultado =
                    output.toString();

            // =========================================
            // DEBUG
            // =========================================

            System.out.println(resultado);

            // =========================================
            // CONVERTIR JSON
            // =========================================

            ObjectMapper mapper =
                    new ObjectMapper();

            return mapper.readValue(
                    resultado,
                    PrediccionDTO.class
            );

        } catch (Exception e) {

            e.printStackTrace();

            PrediccionDTO dto =
                    new PrediccionDTO();

            dto.setAreaMasUsada(
                    "Error IA"
            );

            dto.setHorarioMasUsado(
                    "Error IA"
            );

            dto.setDiaMasReservado(
                    "Error IA"
            );

            dto.setRecomendacion(
                    e.getMessage()
            );

            return dto;
        }
    }
}