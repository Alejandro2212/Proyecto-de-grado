import json
import pandas as pd
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestClassifier

# =========================
# CONEXION MYSQL
# =========================

usuario = "root"
password = "12345"
host = "localhost"
puerto = "3306"
bd = "condominio_horizonte"

conexion = create_engine(
    f"mysql+pymysql://{usuario}:{password}@{host}:{puerto}/{bd}"
)

# =========================
# LEER TABLA RESERVAS
# =========================

query = """
SELECT
    DAYOFWEEK(fecha) as dia,
    HOUR(hora_inicio) as hora,
    area_id as area
FROM reservas
WHERE estado = 'APROBADA'
"""

df = pd.read_sql(query, conexion)

# =========================
# VALIDAR DATOS
# =========================

if df.empty:

    resultado = {

        "areaMasUsada": "Sin datos",

        "horarioMasUsado": "Sin datos",

        "diaMasReservado": "Sin datos",

        "recomendacion":
            "No existen suficientes reservas aprobadas"
    }

    print(json.dumps(resultado))
    exit()

# =========================
# MACHINE LEARNING
# =========================

X = df[["dia", "hora"]]

y = df["area"]

modelo = RandomForestClassifier()

modelo.fit(X, y)

# =========================
# PREDICCION
# =========================

entrada = pd.DataFrame({

    "dia": [5],
    "hora": [18]
})

prediccion = modelo.predict(entrada)

area_predicha = int(prediccion[0])

# =========================
# ESTADISTICAS
# =========================

hora_top = int(
    df["hora"].mode()[0]
)

dia_top = int(
    df["dia"].mode()[0]
)

# =========================
# CONVERTIR DIA
# =========================

dias = {

    1: "Domingo",
    2: "Lunes",
    3: "Martes",
    4: "Miércoles",
    5: "Jueves",
    6: "Viernes",
    7: "Sábado"
}

dia_texto = dias.get(
    dia_top,
    "Desconocido"
)

# =========================
# RESPUESTA FINAL
# =========================

resultado = {

    "areaMasUsada":
        f"Área ID {area_predicha}",

    "horarioMasUsado":
        f"{hora_top}:00",

    "diaMasReservado":
        dia_texto,

    "recomendacion":
        "IA detectó alta demanda basada en datos reales"
}

print(json.dumps(resultado))