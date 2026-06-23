package com.horizonte.service;

import org.springframework.stereotype.Service;

@Service
public class ReentrenamientoIAService {

    public void ejecutarReentrenamiento() {

        try {

            ProcessBuilder exportar =
                    new ProcessBuilder(
                            "python",
                            "modelo/extraer_datos.py"
                    );

            exportar.directory(
                    new java.io.File("../ia-service")
            );

            exportar.start().waitFor();

            ProcessBuilder dataset =
                    new ProcessBuilder(
                            "python",
                            "modelo/generar_datos_sinteticos.py"
                    );

            dataset.directory(
                    new java.io.File("../ia-service")
            );

            dataset.start().waitFor();

            ProcessBuilder entrenar =
                    new ProcessBuilder(
                            "python",
                            "modelo/entrenamiento.py"
                    );

            entrenar.directory(
                    new java.io.File("../ia-service")
            );

            entrenar.start().waitFor();

            System.out.println(
                    "Modelo IA reentrenado correctamente"
            );

        } catch (Exception e) {

            e.printStackTrace();

        }
    }
}