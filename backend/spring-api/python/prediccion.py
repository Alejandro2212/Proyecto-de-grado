import json
import pandas as pd
from sqlalchemy import create_engine
from sklearn.ensemble import RandomForestClassifier

# =====================================
# CONEXIÓN A MYSQL
# =====================================

usuario = "root"
password = "12345"
host = "localhost"
puerto = "3306"
bd = "condominio_horizonte"

conexion = create_engine(
    f"mysql+pymysql://{usuario}:{password}@{host}:{puerto}/{bd}"
)

# =====================================
# OBTENER DATOS REALES
# =====================================

query = """
SELECT
    DAYOFWEEK(r.fecha) AS dia,
    HOUR(r.hora_inicio) AS hora,
    r.area_id AS area,
    ac.nombre AS nombre_area
FROM reservas r
INNER JOIN areas_comunes ac
    ON r.area_id = ac.id
WHERE r.estado = 'APROBADA'
"""

df = pd.read_sql(query, conexion)

# =====================================
# VALIDAR EXISTENCIA DE DATOS
# =====================================

if df.empty:

    resultado = {
        "areaMasUsada": "Sin datos",
        "horarioMasUsado": "Sin datos",
        "diaMasReservado": "Sin datos",
        "recomendacion": "Todavía no existen reservas aprobadas suficientes para realizar una predicción."
    }

    print(json.dumps(resultado, ensure_ascii=False))
    exit()

# =====================================
# ENTRENAMIENTO DEL MODELO
# =====================================

X = df[["dia", "hora"]]
y = df["area"]

modelo = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

modelo.fit(X, y)

# =====================================
# ÁREA REAL MÁS UTILIZADA
# =====================================

area_top = (
    df.groupby(["area", "nombre_area"])
      .size()
      .reset_index(name="cantidad")
      .sort_values("cantidad", ascending=False)
      .iloc[0]
)

area_predicha = int(area_top["area"])
nombre_area = area_top["nombre_area"]
cantidad_area = int(area_top["cantidad"])

# =====================================
# ESTADÍSTICAS REALES
# =====================================

hora_top = int(df["hora"].mode()[0])

dia_top = int(df["dia"].mode()[0])

dias = {
    1: "Domingo",
    2: "Lunes",
    3: "Martes",
    4: "Miércoles",
    5: "Jueves",
    6: "Viernes",
    7: "Sabado"
}

dia_texto = dias.get(dia_top, "Desconocido")

# =====================================
# RECOMENDACIÓN GENERADA
# =====================================

recomendacion = (
    f"Segun el historial de reservas, el area mas utilizada es "
    f"'{nombre_area}', con {cantidad_area} reservas aprobadas. "
    f"El horario con mayor demanda es aproximadamente las {hora_top:02d}:00 "
    f"y el dia con mas actividad es {dia_texto}. "
    f"Se recomienda realizar reservas con anticipacion o considerar horarios alternativos."
)

# =====================================
# TOTAL DE RESERVAS ANALIZADAS
# =====================================

total_reservas = len(df)

# =====================================
# RESPUESTA FINAL
# =====================================

resultado = {
    "areaMasUsada": nombre_area,
    "horarioMasUsado": f"{hora_top:02d}:00",
    "diaMasReservado": dia_texto,
    "recomendacion": recomendacion,
    "totalReservas": total_reservas
}

print(json.dumps(resultado, ensure_ascii=False))