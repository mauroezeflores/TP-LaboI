from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import pandas as pd
import auxiliares as aux
import db
from fastapi import  HTTPException
from pydantic import BaseModel
from typing import Optional
import auxiliares as aux

app = FastAPI()

class EmpleadoInput(BaseModel):
    nombre: str
    apellido: str
    fecha_de_nacimiento: str
    email_personal: str
    estado_civil: str
    tiene_hijos: bool
    nivel_educativo: str

    direccion: str
    pais: str
    provincia: str
    ciudad: str
    cod_postal: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None

    codigo_pais: str
    codigo_area: str
    numero_telefono: str
    tipo_telefono: str

    id_puesto_trabajo: int
    id_jornada: int
    estado: str
    hace_horas_extra: bool
    tiene_movilidad_propia: bool

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
@app.post("/empleado")
async def registrar_empleado(data: EmpleadoInput):
    conexion = db.abrir_conexion()
    try:
        id_empleado = aux.nuevo_empleado(
            conexion,
            data.nombre, data.apellido, data.fecha_de_nacimiento, data.email_personal,
            data.estado_civil, data.tiene_hijos, data.nivel_educativo,
            data.direccion, data.pais, data.provincia, data.ciudad, data.cod_postal, data.latitud, data.longitud,
            data.codigo_pais, data.codigo_area, data.numero_telefono, data.tipo_telefono,
            data.id_puesto_trabajo, data.id_jornada, data.estado,
            data.hace_horas_extra, data.tiene_movilidad_propia
        )
        if id_empleado is None:
            raise HTTPException(status_code=400, detail="No se pudo crear el empleado")
        return {"mensaje": "Empleado registrado con éxito", "id_empleado": id_empleado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.cerrar_conexion(conexion)


@app.get("/empleados")
async def listar_empleados():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM empleados")
        empleados = cursor.fetchall()
        return empleados
    finally:
        db.cerrar_conexion(conn)