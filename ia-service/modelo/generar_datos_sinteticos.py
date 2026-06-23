import pandas as pd
import random
import os

# ===========================
# Cargar datos reales
# ===========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ruta_csv = os.path.join(BASE_DIR, "datos", "reservas.csv")

df = pd.read_csv(ruta_csv)

# Convertir fecha
df["fecha"] = pd.to_datetime(df["fecha"])

datos_sinteticos = []

MULTIPLICADOR = 15

# ===========================
# Función franja horaria
# ===========================

def obtener_franja(hora):

    if hora < 12:
        return 0      # MAÑANA

    elif hora < 18:
        return 1      # TARDE

    else:
        return 2      # NOCHE


for _, fila in df.iterrows():

    for _ in range(MULTIPLICADOR):

        nueva_fecha = fila["fecha"] + pd.Timedelta(
            days=random.randint(-30, 30)
        )

        nueva_hora = int(fila["hora"]) + random.choice([-1, 0, 1])

        nueva_hora = max(6, min(22, nueva_hora))

        capacidad = max(
            1,
            int(fila["capacidad"]) + random.randint(-5, 5)
        )

        area_id = int(fila["area_id"])

        dia_semana = nueva_fecha.weekday()

        mes = nueva_fecha.month

        franja = obtener_franja(nueva_hora)

        # Demanda simulada
        if dia_semana >= 5 and 15 <= nueva_hora <= 20:
            demanda = "ALTA"
        elif 12 <= nueva_hora <= 18:
            demanda = "MEDIA"
        else:
            demanda = "BAJA"

        datos_sinteticos.append({
            "fecha": nueva_fecha.date(),
            "hora": nueva_hora,
            "franja": franja,
            "dia_semana": dia_semana,
            "mes": mes,
            "area_id": area_id,
            "capacidad": capacidad,
            "demanda": demanda
        })

# ===========================
# Guardar dataset
# ===========================

df_final = pd.DataFrame(datos_sinteticos)

salida = os.path.join(
    BASE_DIR,
    "datos",
    "dataset_ia.csv"
)

df_final.to_csv(salida, index=False)

print(df_final.head())

print(f"Dataset generado correctamente: {len(df_final)} registros")