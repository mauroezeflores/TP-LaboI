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
def postular_candidato(conexion, id_usuario,id_convocatoria, experiencia, certificaciones): #actualiza la tabla candidatos_por_convocatorias
    id_cv = obtener_id_cv_de_id_usuario(conexion, id_usuario)
    set_experiencia(conexion, id_cv,id_convocatoria, experiencia)
    id_candidato = obtener_id_candidato_de_id_usuario(conexion, id_usuario)
    set_certificaciones_por_candidato(conexion,id_candidato, certificaciones)
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

def obtener_nivel_certificacion_candidato(conexion, id_candidato, id_puesto):
    try:
        cursor = conexion.cursor()
        query = "SELECT SUM(cert.peso) AS total_peso FROM certificaciones_por_candidato cpc INNER JOIN certificaciones_validas_por_puesto cvp ON cpc.id_certificaciones = cvp.id_certificacion INNER JOIN certificacion cert ON cert.id_certificacion = cpc.id_certificaciones WHERE cpc.id_candidato = %s AND cvp.id_puesto   = %s;"
        cursor.execute(query, (id_candidato, id_puesto))
        peso = cursor.fetchone()[0]
        cursor.close()
        if peso is None:
            return 0
        else:
            return peso
    except Exception as e:
        print(f"Error al obtener el nivel de certificacion del candidato: {e}")

def set_certificaciones_por_candidato(conexion, id_candidato, certificaciones):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO certificaciones_por_candidato(id_candidato,  id_certificacion) VALUES (%s,%s)"
        for id_certificacion in certificaciones:
            cursor.execute(query, (id_candidato, id_certificacion))
        conexion.commit()
        cursor.close()

    except Exception as e:
        print(f"Error al setear las certificaciones: {e}")



