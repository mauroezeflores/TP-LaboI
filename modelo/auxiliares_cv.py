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

    return nombre

def obtener_cv(id_usuario): #obtener el cv de la base de datos para volver a analizarlo si agregamos alguna etiqueta
    return "1" #archivos


def extraer_texto(file,formato): #extraer texto del cv #falta actualizar tabla cv
    texto = ""

    contenido = file.file.read()
    print(f"DEBUG: Contenido leído del archivo, longitud: {len(contenido)}")


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
        query = "SELECT nivel_estudios FROM candidato WHERE id_candidato = %s"
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
        query = "UPDATE evaluacion_cv SET nivel_estudio = %s WHERE id_cv = %s"
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
    print(f"DEBUG: postular_candidato -> id_usuario: {id_usuario}, id_cv: {id_cv}, id_convocatoria: {id_convocatoria}, experiencia: {experiencia}") # Asegúrate que id_convocatoria y experiencia también son correctos

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

def obtener_experiencia_candidato_convocatoria(conexion, id_candidato, id_convocatoria):
    """
    Obtiene los años de experiencia del candidato para una convocatoria específica,
    leyendo desde la tabla 'evaluacion_cv'.
    """
    id_usuario = obtener_id_usuario_de_id_candidato(conexion, id_candidato)
    if not id_usuario:
        print(f"Advertencia: No se pudo obtener id_usuario para id_candidato {id_candidato}.")
        return 0 # O manejar como error/None según prefieras

    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    if not id_cv:
        print(f"Advertencia: No se pudo obtener id_cv para id_usuario {id_usuario} (candidato {id_candidato}).")
        return 0

    cursor = conexion.cursor()
    query = """
        SELECT experiencia 
        FROM evaluacion_cv 
        WHERE id_cv = %s AND id_convocatoria = %s
    """
    try:
        cursor.execute(query, (id_cv, id_convocatoria))
        result = cursor.fetchone()
        if result and result[0] is not None:
            return result[0]
        else:
            # Esto puede ocurrir si el candidato se listó pero 'set_experiencia' no se llamó o falló,
            # o si no hay registro en evaluacion_cv para esa combinación.
            # La función postular_candidato llama a set_experiencia, por lo que debería existir.
            print(f"Advertencia: No se encontró registro de experiencia en 'evaluacion_cv' para id_cv {id_cv} (candidato {id_candidato}) y convocatoria {id_convocatoria}. Usando 0.")
            return 0
    except Exception as e:
        print(f"Error al obtener experiencia de evaluacion_cv para id_cv {id_cv}, convocatoria {id_convocatoria}: {e}")
        return 0 # Retornar 0 o None en caso de error, y manejarlo en la función que llama.
    finally:
        cursor.close()

def calcular_skills_deseables_ratio(conexion, id_candidato, id_convocatoria):
    id_usuario = obtener_id_usuario_de_id_candidato(conexion, id_candidato)
    if not id_usuario: return 0.0
    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    if not id_cv: return 0.0
    
    etiquetas_cv_raw = obtener_etiquetas_cv(conexion, id_cv) 
    etiquetas_cv = {e[0] for e in etiquetas_cv_raw} if etiquetas_cv_raw else set()

    _, etiquetas_deseables_conv_raw = obtener_etiquetas_de_convocatoria(conexion, id_convocatoria)
    etiquetas_deseables_conv = set(etiquetas_deseables_conv_raw) if etiquetas_deseables_conv_raw else set()

    if not etiquetas_deseables_conv:
        # Si no hay skills deseables, se considera que cumple con todas (0 de 0) o ninguna.
        # El script de entrenamiento asume 0.0 si no hay deseables y el candidato tampoco tiene.
        # Si el candidato tiene alguna skill pero la convocatoria no pide ninguna, podría ser 1.0.
        # Para ser conservador y alineado con el dataset de entrenamiento (donde ratio > 0 implica match):
        return 0.0 # O 1.0 si es más apropiado para tu lógica de negocio.

    matching_deseables = len(etiquetas_cv.intersection(etiquetas_deseables_conv))
    
    return matching_deseables / len(etiquetas_deseables_conv) if len(etiquetas_deseables_conv) > 0 else 0.0

def calcular_peso_certificaciones_candidato(conexion, id_candidato, id_convocatoria):
    cursor = conexion.cursor()
    # 1. Obtener id_puesto de la convocatoria
    query_puesto = "SELECT id_puesto FROM convocatoria WHERE id_convocatoria = %s"
    cursor.execute(query_puesto, (id_convocatoria,))
    puesto_result = cursor.fetchone()
    if not puesto_result:
        cursor.close()
        return 0
    id_puesto_trabajo = puesto_result[0]

    # 2. Sumar pesos de certificaciones del candidato válidas para el puesto
    # Esto asume una tabla 'certificaciones_por_candidato' similar a 'certificaciones_por_empleado'
    # y que la tabla 'certificacion' tiene 'peso'.
    # Si no existe 'certificaciones_por_candidato', este valor será 0.
    # DEBES CREAR ESTA TABLA Y LÓGICA SI LOS CANDIDATOS PUEDEN TENER CERTIFICACIONES
    query_cert_peso = """
        SELECT SUM(cert.peso)
        FROM certificaciones_por_candidato cpc 
        JOIN certificacion cert ON cpc.id_certificacion = cert.id_certificacion
        JOIN certificaciones_validas_por_puesto cvp ON cert.id_certificacion = cvp.id_certificacion
                                                    AND cvp.id_puesto_trabajo = %s
        WHERE cpc.id_candidato = %s;
    """
    # Si 'certificaciones_por_candidato' no existe, puedes retornar 0 directamente.
    # Por ahora, retornamos 0 como placeholder si la tabla no está implementada.
    try:
        cursor.execute(query_cert_peso, (id_puesto_trabajo, id_candidato))
        result = cursor.fetchone()
        peso = result[0] if result and result[0] is not None else 0
    except Exception as e: # Captura error si la tabla no existe
        print(f"Nota: No se pudo calcular peso de certificaciones (posiblemente tabla 'certificaciones_por_candidato' no existe): {e}")
        peso = 0
        
    cursor.close()
    return peso


def preparar_datos_candidato_para_modelo(conexion, id_candidato, id_convocatoria):
    cursor = conexion.cursor()
    
    anios_experiencia = obtener_experiencia_candidato_convocatoria(conexion, id_candidato, id_convocatoria)

    nivel_educativo_query = "SELECT nivel_estudios FROM candidato WHERE id_candidato = %s"
    cursor.execute(nivel_educativo_query, (id_candidato,))
    nivel_educativo_res = cursor.fetchone()
    # Asegúrate que los valores coincidan con los de entrenamiento: 'universitario', 'terciario', 'secundario'
    nivel_educativo = nivel_educativo_res[0] if nivel_educativo_res else "desconocido" 
    # El modelo fue entrenado con drop_first=True en get_dummies. Las categorías eran 'secundario', 'terciario', 'universitario'.
    # Si 'desconocido' no fue una categoría en el entrenamiento, el one-hot encoding lo manejará como todas las dummies en 0
    # si 'desconocido' se mapea a una de las categorías originales o si se usa reindex.

    cursor.close() 

    skills_ratio = calcular_skills_deseables_ratio(conexion, id_candidato, id_convocatoria)
    peso_certs = calcular_peso_certificaciones_candidato(conexion, id_candidato, id_convocatoria)
            
    return {
        "anios_experiencia": anios_experiencia,
        "nivel_educativo": nivel_educativo, # Será one-hot encoded después
        "skills_deseables_ratio": skills_ratio,
        "peso_certificaciones": peso_certs
    }        

