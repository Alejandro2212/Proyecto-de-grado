from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
import pandas as pd

app = FastAPI(
    title="IA Predictiva - Condominio Horizonte",
    version="2.0"
)

# ==========================
# Cargar modelo entrenado
# ==========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

modelo_path = os.path.join(
    BASE_DIR,
    "modelo",
    "random_forest.pkl"
)

modelo = joblib.load(modelo_path)

# ==========================
# Modelo de entrada
# ==========================

class PrediccionRequest(BaseModel):
    area_id: int
    hora: int
    dia_semana: int
    mes: int
    capacidad: int


# ==========================
# Función para calcular
# la franja horaria
# ==========================

def obtener_franja(hora: int):

    if hora < 12:
        return 0      # MAÑANA

    elif hora < 18:
        return 1      # TARDE

    else:
        return 2      # NOCHE


# ==========================
# Endpoint de prueba
# ==========================

@app.get("/")
def inicio():

    return {
        "mensaje": "Microservicio IA funcionando correctamente"
    }


# ==========================
# Endpoint de predicción
# ==========================

@app.post("/predecir")
def predecir(datos: PrediccionRequest):

    # Calcular automáticamente la franja
    franja = obtener_franja(datos.hora)

    # Construir DataFrame exactamente
    # igual al utilizado en el entrenamiento
    entrada = pd.DataFrame([{
        "area_id": datos.area_id,
        "hora": datos.hora,
        "franja": franja,
        "dia_semana": datos.dia_semana,
        "mes": datos.mes,
        "capacidad": datos.capacidad
    }])

    # Predicción
    resultado = int(modelo.predict(entrada)[0])

    etiquetas = {
        0: "BAJA",
        1: "MEDIA",
        2: "ALTA"
    }

    nombres_franja = {
        0: "MAÑANA",
        1: "TARDE",
        2: "NOCHE"
    }

    return {

        "prediccion": etiquetas[resultado],

        "codigo": resultado,

        "franja": nombres_franja[franja],

        "detalle": (
            f"La reserva pertenece a la franja "
            f"{nombres_franja[franja]} y la IA "
            f"estima una demanda {etiquetas[resultado]}."
        )

    }