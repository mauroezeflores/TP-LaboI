import pdfplumber #leer texto de pdf
from docx import Document #leer texto de word
import unicodedata #para eliminar caracteres especiales del texto del cv
import re #para eliminar caracteres especiales del texto del cv
import tempfile
from pathlib import Path
import os
import uuid


###################################CARGA DE CV###########################
def procesar_cv(conexion,file, id_usuario): #actualiza la tabla cv
    formato = detectar_formato_archivo(file)
    texto = extraer_texto(file, formato)
    url = almacenar_cv(file)
    id_cv = cargar_cv_a_bd(conexion, id_usuario, formato, texto, url)
    etiquetas_detectadas = buscar_etiquetas_en_cv(conexion, texto)
    actualizar_etiquetas_por_cv(conexion,id_cv,etiquetas_detectadas)

    return url

def actualizar_etiquetas_por_cv(conexion, id_cv, etiquetas_detectadas):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO etiquetas_por_cv(id_cv, id_etiqueta) VALUES (%s,%s) ON CONFLICT DO NOTHING"
        for id_etiqueta in etiquetas_detectadas:
            cursor.execute(query, (id_cv, id_etiqueta))
        conexion.commit()
        cursor.close()

    except Exception as e:
        print("error al actualizar tabla")

def cargar_cv_a_bd(conexion, id_usuario,formato, texto,url):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO cv(id_usuario, formato, texto, url) VALUES (%s,%s,%s,%s) RETURNING id_cv"
        cursor.execute(query, (id_usuario, formato, texto, url))
        id_cv = cursor.fetchone()[0]
        conexion.commit()
        cursor.close()
        return id_cv
    except Exception as e:
        print(f"Error al insertar cv: {e}")
        return None


def detectar_formato_archivo(file): # esto tambien habria que usarlo para rechazar un cv
    mime = file.content_type
    if mime == "application/pdf":
        return "pdf"
    elif mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "docx"
    else:
        return "archivo invalido"

def almacenar_cv(file):#subir el archivo a la base de datos
    directorio= Path("cvs")
    os.makedirs(directorio, exist_ok=True)
    file.file.seek(0)
    contenido = file.file.read()
    _, ext = os.path.splitext(file.filename)
    nombre = f"{uuid.uuid4().hex}{ext}"
    ruta = os.path.join(directorio, nombre)
    with open(ruta, "wb") as f:
        f.write(contenido)

    return "url"

def obtener_cv(id_usuario): #obtener el cv de la base de datos para volver a analizarlo si agregamos alguna etiqueta
    return "1" #archivos


def extraer_texto(file,formato): #extraer texto del cv #falta actualizar tabla cv
    texto = ""

    contenido = file.file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{formato}") as temp:
        temp.write(contenido)
        temp_path = temp.name

    if formato == "pdf":
        with pdfplumber.open(temp_path) as pdf:
            for page in pdf.pages:
                texto += page.extract_text()
    if formato == "docx":
        doc = Document(temp_path)
        texto = "\n".join(p.text for p in doc.paragraphs)
    texto = normalizar_texto(texto)

    Path(temp_path).unlink(missing_ok=True)

    return texto

def normalizar_texto(texto):
    texto = texto.lower()
    texto = unicodedata.normalize("NFKD", texto)
    texto = texto.encode("ascii", "ignore").decode("utf-8")
    texto = re.sub(r"[^\w\s\+#]", " ", texto) #no elimina los caracteres + o #
    texto = re.sub(r"\s+", " ", texto)
    return texto
#################################################################################################







def obtener_todas_las_etiquetas(conexion):
    cursor = conexion.cursor()
    query = "SELECT id_etiqueta, nombre FROM etiqueta"
    cursor.execute(query)
    etiquetas = cursor.fetchall()
    cursor.close()
    return [(id_etiqueta, nombre) for id_etiqueta, nombre in etiquetas]

def buscar_etiquetas_en_cv(conexion, texto): #obtiene una lista de todas las etiquetas contenidas en el cv
    etiquetas = obtener_todas_las_etiquetas(conexion)
    etiquetas_detectadas = []
    for id_etiqueta, nombre in etiquetas:
        if nombre in texto:
            etiquetas_detectadas.append(id_etiqueta)
    return etiquetas_detectadas

def obtener_etiquetas_de_convocatoria(conexion, id_convocatoria): #obtiene una lista de todas las etiquetas de la convocatoria
    try:
        cursor = conexion.cursor()
        query = "SELECT id_etiqueta, es_obligatoria FROM etiquetas_por_convocatoria WHERE id_convocatoria = %s"
        cursor.execute(query, (id_convocatoria,))
        etiquetas = cursor.fetchall()
        cursor.close()
        etiquetas_excluyentes = []
        etiquetas_deseables = []

        for id_etiqueta, es_obligatoria in etiquetas:
            if es_obligatoria:
                etiquetas_excluyentes.append(id_etiqueta)
            else:
                etiquetas_deseables.append(id_etiqueta)

        return etiquetas_excluyentes, etiquetas_deseables
    except Exception as e:
        print(f"Error al obtener etiquetas de la convocatoria: {e}")


def cerrar_convocatoria(conexion, id_convocatoria):
    try:
        cursor = conexion.cursor()
        query = "UPDATE convocatoria SET estado = 'cerrada' WHERE id_convocatoria = %s"
        cursor.execute(query, (id_convocatoria,))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al cerrar la convocatoria: {e}")


def obtener_candidatos(conexion, id_convocatoria):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_candidato FROM candidatos_por_convocatoria WHERE id_convocatoria = %s"
        cursor.execute(query, (id_convocatoria,))
        candidatos = cursor.fetchall()
        cursor.close()
        return candidatos
    except Exception as e:
        print(f"Error al obtener los candidatos: {e}")


def obtener_id_cv_de_id_usuario(conexion, id_usuario):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_cv FROM cv WHERE id_usuario = %s"
        cursor.execute(query, (id_usuario,))
        id_cv = cursor.fetchone()[0]
        return id_cv
    except Exception as e:
        print(f"Error al obtener el id_cv: {e}")


def obtener_etiquetas_cv(conexion, id_cv):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_etiqueta FROM etiquetas_por_cv WHERE id_cv = %s"
        cursor.execute(query, (id_cv,))
        etiquetas = cursor.fetchall()
        cursor.close()
        return etiquetas
    except Exception as e:
        print(f"Error al obtener las etiquetas: {e}")



def set_no_apto(conexion, id_cv, id_convocatoria):
    try:
        cursor = conexion.cursor()
        query = "UPDATE evaluacion_cv SET es_apto = FALSE WHERE id_cv = %s AND id_convocatoria = %s"
        cursor.execute(query, (id_cv,id_convocatoria))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al marcar el candidato como no apto: {e}")


def set_cantidad_etiquetas_deseables(conexion, id_cv,id_convocatoria, cantidad_etiquetas_deseables):
    try:
        cursor = conexion.cursor()
        query = "UPDATE evaluacion_cv SET cantidad_etiquetas_deseables = %s WHERE id_cv = %s AND id_convocatoria = %s"
        cursor.execute(query, (cantidad_etiquetas_deseables, id_cv, id_convocatoria))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al marcar la cantidad de etiquetas deseables: {e}")


def set_etiquetas_detectadas(conexion, id_cv,id_convocatoria, etiquetas_detectadas):
    try:
        cursor = conexion.cursor()
        query = "UPDATE evaluacion_cv SET etiquetas_detectadas = %s WHERE id_cv = %s AND id_convocatoria = %s"
        cursor.execute(query, (etiquetas_detectadas, id_cv, id_convocatoria))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al marcar las etiquetas detectadas: {e}")


def obtener_nivel_educativo(conexion,id_candidato):
    try:
        cursor = conexion.cursor()
        query = "SELECT nivel_educativo FROM candidato WHERE id_candidato = %s"
        cursor.execute(query, (id_candidato,))
        cursor.close()
        return cursor.fetchone()[0]
    except Exception as e:
        print(f"Error al obtener el nivel educativo: {e}")

def evaluar_cv(conexion, id_candidato, id_convocatoria, etiquetas_excluyentes, etiquetas_deseables):
    id_usuario = obtener_id_usuario_de_id_candidato(conexion, id_candidato)
    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    etiquetas_cv = obtener_etiquetas_cv(conexion, id_cv)
    es_apto, etiquetas_detectadas_excluyentes = verificar_etiquetas_excluyentes(etiquetas_cv, etiquetas_excluyentes)
    if not es_apto:
        set_no_apto(conexion, id_cv, id_convocatoria)
        return es_apto
    etiquetas_detectadas_deseables, cantidad_etiquetas_deseables= verificar_etiquetas_deseables(etiquetas_cv, etiquetas_deseables)
    etiquetas_detectadas = etiquetas_detectadas_deseables + etiquetas_detectadas_excluyentes
    set_cantidad_etiquetas_deseables(conexion, id_cv, cantidad_etiquetas_deseables)
    set_etiquetas_detectadas(conexion, id_cv, etiquetas_detectadas)
    nivel_educativo = obtener_nivel_educativo(id_candidato)
    set_nivel_educativo(conexion, id_cv, nivel_educativo)
    return es_apto

def verificar_etiquetas_excluyentes(etiquetas_cv, etiquetas_excluyentes):
    etiquetas_detectadas_excluyentes = []
    for id_etiqueta, in etiquetas_excluyentes:
        if id_etiqueta not in etiquetas_cv:
            return False, etiquetas_detectadas_excluyentes
        else:
            etiquetas_detectadas_excluyentes.append(id_etiqueta)
    return True, etiquetas_detectadas_excluyentes

def verificar_etiquetas_deseables(etiquetas_cv, etiquetas_deseables):
    cantidad_etiquetas_deseables = 0
    etiquetas_detectadas_deseables = []
    for id_etiqueta, in etiquetas_deseables:
        if id_etiqueta in etiquetas_cv:
            etiquetas_detectadas_deseables.append(id_etiqueta)
            cantidad_etiquetas_deseables += 1
    return etiquetas_detectadas_deseables, cantidad_etiquetas_deseables

def obtener_id_usuario_de_id_candidato(conexion, id_candidato):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_usuario FROM candidato WHERE id_candidato = %s"
        cursor.execute(query, (id_candidato,))
        id_usuario = cursor.fetchone()[0]
        return id_usuario
    except Exception as e:
        print(f"Error al obtener el id_usuario: {e}")

def finalizar_convocatoria(conexion, id_convocatoria):
    cerrar_convocatoria(conexion, id_convocatoria)
    etiquetas_excluyentes, etiquetas_deseables =obtener_etiquetas_de_convocatoria(conexion,id_convocatoria)
    candidatos = obtener_candidatos(conexion, id_convocatoria)
    candidatos_aptos = [c for c in candidatos if evaluar_cv(conexion,c, id_convocatoria, etiquetas_excluyentes, etiquetas_deseables)]
    return candidatos_aptos #devuelve los id_candidatos de los aptos,
                            # sobre estos candidatos tendriamos que aplicar el modelo de machine learning


def transformar_experiencia_en_etiqueta(conexion, experiencia):#transforma la experiencia en una/s etiqueta/s
    #necesitamos cargar las etiquetas
    return 1



def crear_convocatoria(conexion, etiquetas_deseables, etiquetas_excluyentes, id_sede, id_puesto, descripcion, fecha_de_finalizacion, experiencia_requerida): #actualiza la tabla de convocatoria, la tabla etiquetas_por_convocatoria
    experiencia = transformar_experiencia_en_etiqueta(conexion, experiencia_requerida)
    etiquetas_excluyentes.append(experiencia)
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO convocatoria(id_sede, id_puesto, descripcion, fecha_de_finalizacion, estado) VALUES (%s,%s,%s,%s,'abierto') RETURNING id_convocatoria"
        cursor.execute(query, (id_sede, id_puesto, descripcion, fecha_de_finalizacion,))
        id_convocatoria = cursor.fetchone()[0]
        for id_etiqueta in etiquetas_deseables:
            cursor.execute("INSERT INTO etiquetas_por_convocatoria(id_convocatoria, id_etiqueta, es_obligatoria) VALUES (%s,%s,FALSE)", (id_convocatoria, id_etiqueta))
        for id_etiqueta in etiquetas_excluyentes:
            cursor.execute("INSERT INTO etiquetas_por_convocatoria(id_convocatoria, id_etiqueta, es_obligatoria) VALUES (%s,%s,TRUE)", (id_convocatoria, id_etiqueta))
        conexion.commit()
        cursor.close()
        return id_convocatoria
    except Exception as e:
        print(f"Error al crear la c  returnonvocatoria: {e}")


def set_nivel_educativo(conexion, id_cv, nivel_educativo):
    try:
        cursor = conexion.cursor()
        query = "UPDATE evaluacion_cv SET nivel_educativo = %s WHERE id_cv = %s"
        cursor.execute(query, (nivel_educativo, id_cv))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al marcar el nivel educativo: {e}")



def set_experiencia(conexion, id_cv, id_convocatoria, experiencia):
    try:
        cursor = conexion.cursor()
        query = "UPDATE evaluacion_cv SET experiencia = %s WHERE id_cv = %s AND id_convocatoria = %s"
        cursor.execute(query, (experiencia, id_cv, id_convocatoria))
        conexion.commit()
        cursor.close()
    except Exception as e:
        print(f"Error al marcar la experiencia: {e}")


def obtener_id_candidato_de_id_usuario(conexion, id_usuario):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_candidato FROM candidato WHERE id_usuario = %s"
        cursor.execute(query, (id_usuario,))
        id_candidato = cursor.fetchone()[0]
        return id_candidato
    except Exception as e:
        print(f"Error al obtener el id_candidato: {e}")


##faltaria tener en cuenta las certificaciones
def postular_candidato(conexion, id_usuario,id_convocatoria, experiencia): #actualiza la tabla candidatos_por_convocatorias
    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    set_experiencia(conexion, id_cv,id_convocatoria, experiencia)
    id_candidato = obtener_id_candidato_de_id_usuario(conexion, id_usuario)
    if not verificar_postulacion(conexion, id_candidato, id_convocatoria):
        try:
            cursor = conexion.cursor()
            query = "INSERT INTO candidatos_por_convocatoria(id_convocatoria, id_candidato) VALUES (%s,%s)"
            cursor.execute(query, (id_convocatoria, id_candidato))
            conexion.commit()
            cursor.close()
        except Exception as e:
            print(f"Error al postular el candidato: {e}")

def verificar_postulacion(conexion, id_candidato, id_convocatoria):#por si el candidato ya se postulo
    try:
        cursor = conexion.cursor()
        query = "SELECT id_candidato FROM candidatos_por_convocatoria WHERE id_convocatoria = %s AND id_candidato = %s"
        cursor.execute(query, (id_convocatoria, id_candidato))
        existe = cursor.fetchone() is not None
        cursor.close()
        return existe
    except Exception as e:
        print(f"error al verificar si el candidato ya se postulo: {e}")

def obtener_cantidad_de_certificaciones():
    return

###################

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

