from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import pandas as pd
import auxiliares as aux
import db



app = FastAPI()


# CORS para conectar con React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo
model = load("modelo_prediccion_de_rotacion.joblib")
scaler = load("scaler.joblib")


#Endpoint Prediccion de rotacion
@app.get("/predecir/rotacion/{empleado_id}")
async def predecir(empleado_id: int) -> dict:
    conexion = db.abrir_conexion()
    try:
        promedio_horas_mensuales = (aux.obtener_horas_extras(conexion, empleado_id)/3 + aux.obtener_horas_trabajadas(conexion, empleado_id))/2
        llegadas_tarde_90d = aux.obtener_llegadas_tarde(conexion, empleado_id)
        salidas_tempranas_90d = aux.obtener_salidas(conexion, empleado_id)
        ausencias_90d = aux.obtener_ausencias(conexion, empleado_id)
        desempeno = (aux.obtener_evaluacion_de_desempeño(conexion, empleado_id) + aux.obtener_ultima_evaluacion_del_superior(conexion, empleado_id))/2
        satisfaccion_laboral = (aux.obtener_satisfaccion_laboral(conexion, empleado_id) + aux.obtener_satisfaccion_ambiente(conexion, empleado_id))/2

        empleado = pd.DataFrame([{
            'promedio_horas_mensuales': promedio_horas_mensuales,
            "llegadas_tarde_90d": llegadas_tarde_90d,
            "salidas_tempranas_90d": salidas_tempranas_90d,
            "ausencias_90d": ausencias_90d,
            "desempeno": desempeno,
            "satisfaccion_laboral": satisfaccion_laboral
        }])

        empleado_escalado = scaler.transform(empleado)
        prediccion = model.predict(empleado_escalado)[0]
        proba = model.predict_proba(empleado_escalado)[0][1]

        return {"prediccion": prediccion, "probabilidad": proba}

    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conexion)


