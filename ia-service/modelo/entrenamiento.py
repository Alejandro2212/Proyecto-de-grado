import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ==========================
# Rutas
# ==========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

dataset_path = os.path.join(BASE_DIR, "datos", "dataset_ia.csv")
modelo_path = os.path.join(BASE_DIR, "modelo", "random_forest.pkl")

# ==========================
# Cargar dataset
# ==========================

df = pd.read_csv(dataset_path)

# ==========================
# Generar franja horaria
# ==========================

def obtener_franja(hora):
    if hora < 12:
        return 0      # MAÑANA
    elif hora < 18:
        return 1      # TARDE
    else:
        return 2      # NOCHE

df["franja"] = df["hora"].apply(obtener_franja)

# ==========================
# Convertir demanda a valores numéricos
# ==========================

mapeo = {
    "BAJA": 0,
    "MEDIA": 1,
    "ALTA": 2
}

df["demanda"] = df["demanda"].map(mapeo)

# ==========================
# Variables de entrada
# ==========================

X = df[
    [
        "area_id",
        "hora",
        "franja",
        "dia_semana",
        "mes",
        "capacidad"
    ]
]

y = df["demanda"]

# ==========================
# División entrenamiento/prueba
# ==========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ==========================
# Crear modelo
# ==========================

modelo = RandomForestClassifier(
    n_estimators=150,
    max_depth=10,
    random_state=42
)

# ==========================
# Entrenar
# ==========================

modelo.fit(X_train, y_train)

# ==========================
# Evaluar
# ==========================

predicciones = modelo.predict(X_test)

precision = accuracy_score(y_test, predicciones)

print(f"Precisión del modelo: {precision:.4f}")

# ==========================
# Guardar modelo
# ==========================

joblib.dump(modelo, modelo_path)

print("Modelo Random Forest guardado correctamente.")