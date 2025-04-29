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
model = load("modelo_regresion_lineal.joblib")


# Endpoint 1: Predicción individual de datos
@app.get("/predecir/{empleado_id}")
async def predecir(empleado_id: int):
    conexion = db.abrir_conexion()
    try:
       nivel_de_presentismo = aux.obtener_presentismo(empleado_id,conexion)
       nivel_certificacion = aux.obtener_nivel_certificacion(empleado_id,conexion)
       nivel_habilidades = aux.obtener_nivel_habilidad(empleado_id,conexion)
       presencia_en_proyectos = aux.obtener_nivel_presencia_en_proyectos(empleado_id,conexion)
       horas_extras= aux.obtener_horas_extras(empleado_id,conexion)
       ultima_evaluacion_desempeño= aux.obtener_ultima_evaluacion_desempeño(empleado_id,conexion)
       evaluacion_del_superior= aux.obtener_evaluacion_del_superior(empleado_id,conexion)
       
       pred = model.predict([[nivel_de_presentismo, nivel_certificacion, nivel_habilidades, presencia_en_proyectos, horas_extras, ultima_evaluacion_desempeño, evaluacion_del_superior]])[0]

       return {"prediccion": round(pred, 2)}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conexion)



@app.get("/presentismo/{empleado_id}")
async def presentismo(empleado_id: int):
    conexion = db.abrir_conexion()
    try:
        presentismo = aux.obtener_presentismo(empleado_id,conexion)
        return {"presentismo": presentismo}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conexion)

## escribir endpoints de todos los datos y luego conectarlos con el frontend