from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import pandas as pd
import auxiliares as aux
import auxiliares_cv as aux_cv
import db
from fastapi import  HTTPException
from pydantic import BaseModel
from typing import Optional, List
from psycopg2.extras import RealDictCursor  # Agrega esta importación al inicio
import datetime
from pydantic import BaseModel
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from datetime import date, datetime
from pydantic.networks import EmailStr


app = FastAPI()

class EmpleadoCreateInput(BaseModel):
    nombre: str
    apellido: str
    fecha_de_nacimiento: date
    email_personal: EmailStr
    estado_civil: str
    tiene_hijos: bool
    nivel_educativo: str
    id_direccion: int
    id_puesto_trabajo: int
    id_jornada: int
    estado: str  # Estado laboral, ej: "Contratado", "Activo"
    hace_horas_extra: Optional[bool] = False
    tiene_movilidad_propia: Optional[bool] = False
    dni: Optional[str] = None
    tiene_presentismo: Optional[bool] = False

class EncuestaInput(BaseModel):
    id_empleado: int
    satisfaccion_laboral: int
    satisfaccion_ambiente_laboral: int

class LoginInput(BaseModel):
    email: str
    password: str

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
    

class ConvocatoriaInput(BaseModel):
    id_sede: int
    id_puesto: int
    descripcion: str
    fecha_de_finalizacion: datetime
    experiencia_requerida: int
    etiquetas_deseables: List[int]         
    etiquetas_excluyentes: List[int] 

class ConvocatoriaInfoOutput(BaseModel):
    id: int
    titulo: str
    fecha: datetime
    estado: str
    aptos: int

class ConvocatoriaInfoBasicaOutput(BaseModel):
    id: int
    titulo: str

class CandidatoParaConvocatoriaOutput(BaseModel):
    id: int # id_candidato
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None # Descomentar si tienes esta info y la añades a la query
    ubicacion: Optional[str] = None # Descomentar si tienes esta info y la añades a la query
    cvUrl: Optional[str] = None

class ConvocatoriaDisponibleOutput(BaseModel):
    id: int
    title: str
    company: Optional[str] # Nombre de la sede o empresa
    desc: str
    location: Optional[str] # Ej: "Ciudad, Provincia"
    modality: str # Ej: "Presencial", "Remoto", "Híbrido"
    fecha_publicacion: datetime # Será fecha_de_finalizacion
    skillTags: List[str] = []
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

#Evaluación de CVs
modelo_evaluacion_cv = load("../modelo/modelo_evaluacion_cv.joblib")
scaler_evaluacion_cv = load("../modelo/scaler_evaluacion_cv.joblib")
fetures_evaluacion_cv = load("../modelo/features_evaluacion_cv.joblib")
threshold_evaluacion_cv = load("../modelo/threshold_evaluacion_cv.joblib")

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
       
       aux.insertar_en_historial(conexion, id_empleado, datetime.datetime.now(), pred)

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
        prediccion = int(modelo_rotacion.predict(empleado_escalado)[0])
        proba = float(modelo_rotacion.predict_proba(empleado_escalado)[0][1])

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
@app.post("/empleado", summary="Registrar un nuevo empleado", tags=["Empleados"])
async def endpoint_registrar_empleado_nuevo(empleado_data: EmpleadoCreateInput):
    """
    Endpoint para registrar un nuevo empleado en el sistema.
    Se esperan los datos del empleado según el modelo EmpleadoCreateInput.
    Los campos como `id_direccion` y `id_usuario` deben ser IDs válidos
    de registros existentes en sus respectivas tablas.
    """
    conexion = None
    try:
        conexion = db.abrir_conexion()
        
        datos_para_db = empleado_data.model_dump()
        
        id_nuevo_empleado = aux.crear_nuevo_empleado_directo(conexion, datos_para_db)
        
        return {
            "mensaje": "Empleado registrado con éxito.",
            "id_empleado": id_nuevo_empleado,
            "datos_registrados": empleado_data.model_dump() # Devuelve lo que se registró
        }
    except Exception as e:
        print(f"Error detallado en endpoint_registrar_empleado_nuevo: {type(e).__name__} - {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno del servidor al intentar registrar el empleado: {str(e)}"
        )
    finally:
        if conexion:
            db.cerrar_conexion(conexion)

@app.get("/empleado/{id_empleado}", summary="Obtener detalle de un empleado", tags=["Empleados"])
async def endpoint_obtener_empleado(id_empleado: int):
    # Implementa la lógica para buscar en DB usando el id_empleado
    # y devolver los datos o un 404 si no se encuentra.
    # Ejemplo (necesitas la función aux.obtener_empleado_por_id):
    conexion = None
    try:
        conexion = db.abrir_conexion()
        # Asume que tienes una función que retorna un diccionario o un objeto compatible con Pydantic
        empleado = aux.obtener_empleado_por_id(conexion, id_empleado) 
        if not empleado:
                 raise HTTPException(status_code=404, detail="Empleado no encontrado")
        return empleado 
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conexion:
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

@app.get("/historial/desempeno/{empleado_id}")
async def historial_desempeno(empleado_id: int):
   conn = db.abrir_conexion()
   try:
         cursor = conn.cursor(cursor_factory=RealDictCursor)
         cursor.execute("""
             SELECT
                 fecha_prediccion,
                 prediccion,
                 id_empleado
             FROM historial_prediccion_desempeno
             WHERE id_empleado = %s
             ORDER BY fecha_prediccion ASC
         """, (empleado_id,))
         historial = cursor.fetchall()
         return historial
   finally:
         db.cerrar_conexion(conn)

class NuevaEvaluacionInput(BaseModel):
    id_empleado: int
    evaluacion_del_superior: float


@app.post("/historial/evaluacion")
async def insertar_evaluacion(data: NuevaEvaluacionInput):
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO historial_evaluacion (fecha_evaluacion, evaluacion_desempeño, evaluacion_del_superior, id_empleado) VALUES (NOW(), %s, %s, %s)",
            (100, data.evaluacion_del_superior, data.id_empleado)
        )
        conn.commit()
        return {"mensaje": "Evaluación insertada correctamente"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.cerrar_conexion(conn)

@app.get("/empleados/detalle-rotacion/{empleado_id}")
async def detalle_rotacion_empleado(empleado_id: int):
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id_empleado, ausencias_90d, llegadas_tardes_90d, salidas_tempranas_90d, hs_extras_trabajadas_90d
            FROM deteccion_rotacion
            WHERE id_empleado = %s
            LIMIT 1
            """,
            (empleado_id,)
        )
        row = cursor.fetchone()
        if not row:
            return {"error": "No hay datos de rotación para este empleado"}
        return {
            "id_empleado": row[0],
            "ausencias_90d": row[1],
            "llegadas_tarde_90d": row[2],
            "salidas_tempranas_90d": row[3],
            "hs_extras_trabajadas_90d": row[4]
        }
    finally:
        db.cerrar_conexion(conn)


@app.post("/cv")
async def subir_cv(
        id_usuario: int = Form(...),
        file: UploadFile = File(...)
):
    try:
        conexion = db.abrir_conexion()
        formato = aux_cv.detectar_formato_archivo(file)
        if formato == "archivo invalido":
            raise HTTPException(status_code = 400, detail ="formato erroneo")
        await file.seek(0)
        url = aux_cv.procesar_cv(conexion, file, id_usuario)
        db.cerrar_conexion(conexion)
        return JSONResponse(content={"mensaje": "CV cargado correctamente","url": url})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/convocatoria")
def crear_nueva_convocatoria(data: ConvocatoriaInput):
    try:
        conexion = db.abrir_conexion()
        id_convocatoria = aux_cv.crear_convocatoria(conexion=conexion,
                                                    etiquetas_deseables = data.etiquetas_deseables,
                                                    etiquetas_excluyentes = data.etiquetas_excluyentes,
                                                    id_sede = data.id_sede,
                                                    id_puesto = data.id_puesto,
                                                    descripcion = data.descripcion,
                                                    fecha_de_finalizacion = data.fecha_de_finalizacion,
                                                    experiencia_requerida = data.experiencia_requerida)
        db.cerrar_conexion(conexion)
        return {"mensaje": "Convocatoria creada correctamente", "id_convocatoria": id_convocatoria}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/convocatoria/{id_convocatoria}/postularse")
async def postularse(
        id_convocatoria: int,
        id_usuario: int = Form(...),
        experiencia: int = Form(...)
        ,certificaciones = list()

):
    
    try:
        conexion = db.abrir_conexion()
        id_candidato = aux_cv.obtener_id_candidato_de_id_usuario(conexion, id_usuario)
        if aux_cv.verificar_postulacion(conexion, id_candidato, id_convocatoria):  
            raise Exception("Ya te has postulado anteriormente a esta convocatoria.")


        aux_cv.postular_candidato(conexion,
                                  id_usuario = id_usuario,
                                  id_convocatoria = id_convocatoria,
                                  experiencia = experiencia,
                                  certificaciones = certificaciones)

        db.cerrar_conexion(conexion)
        return {"mensaje": "Candidato postulado correctamente"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
@app.get("/convocatorias", response_model=List[ConvocatoriaInfoOutput])
async def listar_convocatorias_publicadas():
    conn = None
    try:
        conn = db.abrir_conexion()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                c.id_convocatoria as id, 
                c.descripcion as titulo, 
                c.fecha_de_finalizacion as fecha,
                c.estado,
                COALESCE(
                    (SELECT COUNT(DISTINCT cpc.id_candidato) 
                     FROM candidatos_por_convocatoria cpc 
                     WHERE cpc.id_convocatoria = c.id_convocatoria), 
                    0
                ) as aptos
            FROM convocatoria c
            ORDER BY c.id_convocatoria DESC;
        """
        cursor.execute(query)
        convocatorias_db = cursor.fetchall()
        
        return convocatorias_db
    except Exception as e:
        print(f"Error en GET /convocatorias: {e}")
        raise HTTPException(status_code=500, detail="Error interno al obtener convocatorias.")
    finally:
        if conn:
            db.cerrar_conexion(conn)

@app.get("/convocatoria/{convocatoria_id}/info", response_model=ConvocatoriaInfoBasicaOutput)
async def obtener_info_convocatoria(convocatoria_id: int):
    conn = None
    try:
        conn = db.abrir_conexion()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            "SELECT id_convocatoria as id, descripcion as titulo FROM convocatoria WHERE id_convocatoria = %s",
            (convocatoria_id,)
        )
        convocatoria = cursor.fetchone()
        if not convocatoria:
            raise HTTPException(status_code=404, detail="Convocatoria no encontrada")
        return convocatoria
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en GET /convocatoria/{convocatoria_id}/info: {e}")
        raise HTTPException(status_code=500, detail="Error interno al obtener información de la convocatoria.")
    finally:
        if conn:
            db.cerrar_conexion(conn)

# --- Endpoint para listar candidatos de una convocatoria todavia no funcioan. ---
@app.get("/convocatoria/{convocatoria_id}/candidatos", response_model=List[CandidatoParaConvocatoriaOutput])
async def listar_candidatos_por_convocatoria(convocatoria_id: int):
    conn = None
    try:
        conn = db.abrir_conexion()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
      
        query = """
            SELECT DISTINCT ON (cand.id_candidato)
                cand.id_candidato as id,
                cand.nombre,
                cand.apellido,
                cand.email,
                cv.url as cvUrl
            FROM candidatos_por_convocatoria cpc
            JOIN candidato cand ON cpc.id_candidato = cand.id_candidato
            LEFT JOIN cv ON cand.id_usuario = cv.id_usuario
            WHERE cpc.id_convocatoria = %s
            ORDER BY cand.id_candidato, cand.apellido, cand.nombre; 
        """
        
        cursor.execute(query, (convocatoria_id,))
        candidatos = cursor.fetchall()
        return candidatos
    except Exception as e:
        print(f"Error en GET /convocatoria/{convocatoria_id}/candidatos: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error interno al obtener candidatos de la convocatoria.")
    finally:
        if conn:
            db.cerrar_conexion(conn)

@app.get("/convocatorias/disponibles", response_model=List[ConvocatoriaDisponibleOutput])
async def listar_convocatorias_para_candidatos():
    conn = None
    try:
        conn = db.abrir_conexion()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                c.id_convocatoria as id, 
                COALESCE(pt.nombre, c.descripcion) as title,
                COALESCE(s.nombre, 'Empresa Confidencial') as company, 
                c.descripcion as desc, 
                c.fecha_de_finalizacion as fecha_publicacion,
                
                -- Construyendo location desde la tabla 'direccion'
                -- Fallback al nombre de la sede si ciudad o provincia_estado son NULL
                COALESCE(d.ciudad || ', ' || d.provincia_estado, s.nombre, 'Ubicación no especificada') as location,
                
                CASE 
                    WHEN pt.presencial = 1 AND pt.remoto = 1 THEN 'Híbrido'
                    WHEN pt.presencial = 1 THEN 'Presencial'
                    WHEN pt.remoto = 1 THEN 'Remoto'
                    ELSE 'Modalidad no especificada'
                END as modality,
                
                COALESCE(
                    (SELECT ARRAY_AGG(e.nombre ORDER BY e.nombre)
                     FROM etiquetas_por_convocatoria epc
                     JOIN etiqueta e ON epc.id_etiqueta = e.id_etiqueta
                     WHERE epc.id_convocatoria = c.id_convocatoria),
                    ARRAY[]::VARCHAR[]
                ) as "skillTags"
            FROM convocatoria c
            LEFT JOIN puesto_trabajo pt ON c.id_puesto = pt.id_puesto_trabajo
            LEFT JOIN sede s ON c.id_sede = s.id_sede
            LEFT JOIN direccion d ON s.id_direccion = d.id_direccion -- JOIN a la tabla direccion
            WHERE c.estado = 'abierto' 
            ORDER BY c.fecha_de_finalizacion DESC, c.id_convocatoria DESC;
        """
        
        cursor.execute(query)
        convocatorias_db = cursor.fetchall()
        
        return convocatorias_db
    except Exception as e:
        print(f"Error en GET /convocatorias/disponibles: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error interno al obtener convocatorias disponibles.")
    finally:
        if conn:
            db.cerrar_conexion(conn)

@app.get("/etiquetas")
async def listar_etiquetas():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id_etiqueta, nombre FROM etiqueta ORDER BY nombre ASC;")
        etiquetas = cursor.fetchall()
        return etiquetas
    finally:
        db.cerrar_conexion(conn)

@app.get("/puestos")
async def listar_puestos():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT id_puesto_trabajo, nombre, seniority, sueldo, presencial, remoto
            FROM puesto_trabajo
            ORDER BY nombre ASC
        """)
        puestos = cursor.fetchall()
        return puestos
    finally:
        db.cerrar_conexion(conn)

@app.get("/sedes")
async def listar_sedes():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT id_sede, nombre
            FROM sede
            ORDER BY nombre ASC
        """)
        sedes = cursor.fetchall()
        return sedes
    finally:
        db.cerrar_conexion(conn)

@app.post("/login")
def login(data: LoginInput):
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.id_usuario, u.email, u.contraseña, u.id_rol, r.descripcion as rol
            FROM usuario u
            JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.email = %s AND r.estado_activo = TRUE
        """, (data.email,))
        user = cursor.fetchone()
        if not user or user[2] != data.password:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        
        user_data = {
            "id_usuario": user[0],
            "email": user[1],
            "rol": user[4],
            "id_rol": user[3]
        }

        # Si es candidato, trae datos de candidato
        if user[3] == 4:  # 4 = candidato
            cursor.execute("SELECT * FROM candidato WHERE id_usuario = %s", (user[0],))
            candidato = cursor.fetchone()
            if candidato:
                user_data["candidato"] = dict(zip([desc[0] for desc in cursor.description], candidato))
        # Si es empleado, trae datos de empleado
        elif user[3] == 3:  # 3 = empleado
            cursor.execute("SELECT * FROM empleado WHERE id_usuario = %s", (user[0],))
            empleado = cursor.fetchone()
            if empleado:
                user_data["empleado"] = dict(zip([desc[0] for desc in cursor.description], empleado))

        return user_data
    finally:
        db.cerrar_conexion(conn)

@app.post("/encuesta")
def crear_encuesta(encuesta: EncuestaInput):
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO encuesta (id_empleado, fecha_de_realizacion, satisfaccion_laboral, satisfaccion_ambiente_laboral)
            VALUES (%s, %s, %s, %s)
        """, (
            encuesta.id_empleado,
            datetime.now(),
            encuesta.satisfaccion_laboral,
            encuesta.satisfaccion_ambiente_laboral
        ))
        conn.commit()
        return {"mensaje": "Encuesta enviada correctamente"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.cerrar_conexion(conn)

@app.get("/puestos")
def listar_puestos_trabajo():
    conn = db.abrir_conexion()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT id_puesto_trabajo, nombre FROM puesto_trabajo ORDER BY nombre ASC;")
        puestos = cursor.fetchall()
        return puestos
    finally:
        db.cerrar_conexion(conn)

   ####faltaria que los candidatos aptos pasen por el modelo ml y los devuelva ordenados
@app.post("/convocatoria/{id_convocatoria}/cerrar")
def cerrar_convocatoria(id_convocatoria: int):
    try:
        conexion = db.abrir_conexion()
        candidatos_aptos = aux_cv.finalizar_convocatoria(conexion, id_convocatoria)
        db.cerrar_conexion(conexion)
        return {"mensaje": "Convocatoria cerrada correctamente", "candidatos_aptos": [c[0] for c in candidatos_aptos]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        

def obtener_datos_ml_para_candidato(conexion, id_candidato, id_convocatoria):

    id_usuario = obtener_id_usuario_de_id_candidato(conexion, id_candidato)
    if not id_usuario:
        #print(f"No se encontró el id_usuario para el id_candidato: {id_candidato}")
        return None

    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    if not id_cv:
        #print(f"No se encontró el id_cv para el id_usuario: {id_usuario}")
        return None


    try:
        cursor = conexion.cursor()
        query = """
            SELECT
                    experiencia,
                    nivel_estudio,
                    etiquetas_deseables_encontradas,
                    cant_etiquetas_deseables,
                    nivel_certificacion
            FROM
                    evaluacion_cv
            WHERE
                    id_cv = %s AND id_convocatoria = %s AND es_apto = TRUE;
                """
        cursor.execute(query, (id_cv,id_convocatoria))
        datos = cursor.fetchone()

        features = None
        if datos:
            anios_experiencia = float(datos[0]) if datos[0] is not None else 0.0 
            nivel_educativo = str(datos[1]).lower() if datos[1] is not None else "secundario"

            etiquetas_deseables_encontradas = int(datos[2]) if datos[2] is not None else 0
            cant_total_deseables = int(datos[3]) if datos[3] is not None and datos[3] > 0 else 1 #para evitar division por cero

            skill_deseables_ratio = etiquetas_deseables_encontradas / cant_total_deseables if cant_total_deseables > 0 else 0.0
            peso_certificaciones = int(datos[4]) if datos[4] is not None else 0

            features={
                "id_candidato_original": id_candidato, 
                "anios_experiencia": anios_experiencia,
                "nivel_educativo": nivel_educativo,
                "skills_deseables_ratio": skill_deseables_ratio,
                "peso_certificaciones": peso_certificaciones
            }
            print(f"  Features para ML obtenidas para candidato {id_candidato}: {features}")
        else:
            print(f"No se encontraron datos de evaluación (o no es apto) para id_cv {id_cv}, convocatoria {id_convocatoria}")

        cursor.close()
        return features
    except Exception as e:
        print(f"Error al obtener los datos para el modelo de ML: {e}")
        return None

def finalizar_convocatoria_y_preparar_para_ml(conexion, id_convocatoria):
    #Falta hacer cierre de convocatoria 
    #print(f"Preparando datos para ML de convocatoria {id_convocatoria}...")
    # No cerramos la convocatoria aquí, eso lo hace el endpoint

    # Obtener IDs de candidatos que YA fueron marcados como aptos en evaluacion_cv
    cursor = conexion.cursor()
    query_aptos = """
        SELECT DISTINCT cand.id_candidato
        FROM evaluacion_cv ecv
        JOIN cv ON ecv.id_cv = cv.id_cv
        JOIN candidato cand ON cv.id_usuario = cand.id_usuario
        WHERE ecv.id_convocatoria = %s AND ecv.es_apto = TRUE;
    """
    cursor.execute(query_aptos, (id_convocatoria,))
    candidatos_aptos_tuplas = cursor.fetchall()
    cursor.close()

    if not candidatos_aptos_tuplas:
        print(f"No hay candidatos marcados como 'aptos' en la BD para la convocatoria {id_convocatoria} para enviar al ML.")
        return []

    candidatos_aptos_ids = [c[0] for c in candidatos_aptos_tuplas]
    #print(f"Candidatos aptos (de BD) para ML en conv {id_convocatoria}: {candidatos_aptos_ids}")

    candidatos_features_para_ml = []
    for id_candidato in candidatos_aptos_ids:
        features_candidato = obtener_datos_ml_para_candidato(conexion, id_candidato, id_convocatoria)
        if features_candidato:
            candidatos_features_para_ml.append(features_candidato)

    #print(f"Se han preparado features para {len(candidatos_features_para_ml)} candidatos para el modelo de ML.")
    return candidatos_features_para_ml

def guardar_score_ml_candidato(conexion, id_candidato, id_convocatoria, score_ml, decision_ml):
    id_usuario = obtener_id_usuario_de_id_candidato(conexion, id_candidato)
    if not id_usuario: return
    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    if not id_cv: return

    try:
        cursor = conexion.cursor()
        query = """
            UPDATE evaluacion_cv 
            SET score_ml = %s, decision_ml = %s
            WHERE id_cv = %s AND id_convocatoria = %s
        """
        cursor.execute(query, (score_ml, decision_ml, id_cv, id_convocatoria))
        conexion.commit()
        print(f"  Score ML para candidato {id_candidato} en conv {id_convocatoria} guardado en BD.")
    except Exception as e:
        print(f"  Error al guardar score ML para candidato {id_candidato}: {e}")
    finally:
        if cursor: cursor.close()
    

