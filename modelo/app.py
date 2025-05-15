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
from psycopg2.extras import RealDictCursor  # Agrega esta importación al inicio

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

# Cargar modelos
modelo_desempeno = load("modelo_prediccion_de_desempeno.joblib")
modelo_rotacion = load("../modelo/modelo_prediccion_de_rotacion.joblib")
scaler_rotacion = load("../modelo/scaler.joblib")

# Endpoint 1: Predicción individual de datos
@app.get("/predecir/desempeno/{id_empleado}")
async def predecir(id_empleado: int):
    conexion = db.abrir_conexion()
    try:
       nivel_de_presentismo = aux.obtener_presentismo(conexion,id_empleado)
       print(f"nivel presentismo: {nivel_de_presentismo}")
       nivel_certificacion = aux.obtener_nivel_certificacion(conexion,id_empleado)
       print(f"nivel certificacion: {nivel_certificacion}")
       nivel_habilidades = aux.obtener_nivel_habilidad(conexion,id_empleado)
       print(f"nivel habilidades: {nivel_habilidades}")
       presencia_en_proyectos = aux.obtener_nivel_presencia_en_proyectos(conexion,id_empleado)
       print(f"presencia en proyectos: {presencia_en_proyectos}")
       horas_extras= aux.obtener_horas_extras(conexion,id_empleado)
       print(f"horas extras: {horas_extras}")
       ultima_evaluacion_desempeño= aux.obtener_ultima_evaluacion_de_desempeño(conexion,id_empleado)
       print(f"ultima evaluacion desempeño: {ultima_evaluacion_desempeño}")
       evaluacion_del_superior= aux.obtener_ultima_evaluacion_del_superior(conexion,id_empleado)
       print(f"evaluacion del superior: {evaluacion_del_superior}")
       
       pred = modelo_desempeno.predict([[nivel_de_presentismo, nivel_certificacion, nivel_habilidades, presencia_en_proyectos, horas_extras, ultima_evaluacion_desempeño, evaluacion_del_superior]])[0]
       print("prediccion: " + str(pred))
       return {"prediccion": round(pred, 2)}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conexion)

#Endpoint Prediccion de rotacion
@app.get("/predecir/rotacion/{empleado_id}")
async def predecir(empleado_id: int) -> dict:
    conexion = db.abrir_conexion()
    try:
        promedio_horas_mensuales = (aux.obtener_horas_extras(conexion, empleado_id)/3 + aux.obtener_horas_trabajadas(conexion, empleado_id))/2
        llegadas_tarde_90d = aux.obtener_llegadas_tarde(conexion, empleado_id)
        salidas_tempranas_90d = aux.obtener_salidas(conexion, empleado_id)
        ausencias_90d = aux.obtener_ausencias(conexion, empleado_id)
        desempeno = (aux.obtener_ultima_evaluacion_de_desempeño(conexion, empleado_id) + aux.obtener_ultima_evaluacion_del_superior(conexion, empleado_id))/2
        satisfaccion_laboral = (aux.obtener_satisfaccion_laboral(conexion, empleado_id) + aux.obtener_satisfaccion_ambiente(conexion, empleado_id))/2

        empleado = pd.DataFrame([{
            'promedio_horas_mensuales': promedio_horas_mensuales,
            "llegadas_tarde_90d": llegadas_tarde_90d,
            "salidas_tempranas_90d": salidas_tempranas_90d,
            "ausencias_90d": ausencias_90d,
            "desempeno": desempeno,
            "satisfaccion_laboral": satisfaccion_laboral
        }])

        empleado_escalado = scaler_rotacion.transform(empleado)
        prediccion = modelo_rotacion.predict(empleado_escalado)[0]
        proba = modelo_rotacion.predict_proba(empleado_escalado)[0][1]

        return {"prediccion": prediccion, "probabilidad": proba}

    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conexion)




@app.get("/presentismo/{empleado_id}")
async def presentismo(empleado_id: int):
    conexion = db.abrir_conexion()
    try:
        presentismo = aux.obtener_presentismo(conexion,empleado_id)
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
        cursor = conn.cursor(cursor_factory=RealDictCursor)  # <-- Cambia aquí
        cursor.execute("SELECT * FROM empleado")
        empleados = cursor.fetchall()
        return empleados
    finally:
        db.cerrar_conexion(conn)

@app.get("/empleados/detalle")
async def empleados_detalle():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT
                e.id_empleado,
                e.nombre, 
                e.apellido, 
                e.email_personal, 
                e.nivel_educativo, 
                pt.nombre AS puesto_trabajo, 
                e.dni
            FROM empleado e
            JOIN puesto_trabajo pt ON e.id_puesto_trabajo = pt.id_puesto_trabajo
        """)
        empleados = cursor.fetchall()
        return empleados
    finally:
        db.cerrar_conexion(conn)