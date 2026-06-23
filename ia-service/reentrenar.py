import subprocess

print("Actualizando dataset...")

subprocess.run(
    [
        "python",
        "scripts/extraer_datos.py"
    ]
)

print("Generando dataset sintético...")

subprocess.run(
    [
        "python",
        "scripts/generar_datos_sinteticos.py"
    ]
)

print("Reentrenando modelo...")

subprocess.run(
    [
        "python",
        "scripts/entrenamiento.py"
    ]
)

print("Modelo actualizado correctamente.")