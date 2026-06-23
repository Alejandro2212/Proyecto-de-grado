import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

import pandas as pd
from database import engine

query = """
SELECT
    r.fecha,
    HOUR(r.hora_inicio) AS hora,
    a.id AS area_id,
    a.capacidad,
    r.estado
FROM reservas r
INNER JOIN areas_comunes a
    ON r.area_id = a.id
WHERE r.estado = 'APROBADA'
AND r.fecha IS NOT NULL
AND r.hora_inicio IS NOT NULL
"""

df = pd.read_sql(query, engine)

# Eliminar cualquier fila incompleta por seguridad
df = df.dropna()

# Convertir hora a entero
df["hora"] = df["hora"].astype(int)

# Guardar CSV limpio
df.to_csv("datos/reservas.csv", index=False)

print(df)
print("Datos exportados correctamente.")