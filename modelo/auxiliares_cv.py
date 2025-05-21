import pdfplumber #leer texto de pdf
from docx import Document #leer texto de word
import unicodedata #para eliminar caracteres especiales del texto del cv
import re #para eliminar caracteres especiales del texto del cv






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
            cursor.execute(query, id_cv, id_etiqueta)
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
    return "url"

def obtener_cv(id_usuario): #obtener el cv de la base de datos para volver a analizarlo si agregamos alguna etiqueta
    return "1" #archivo


def extraer_texto(file,formato): #extraer texto del cv #falta actualizar tabla cv
    texto = ""
    if formato == "pdf":
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                texto += page.extract_text()
    if formato == "docx":
        texto = "/n".join(p.text for p in file.paragraphs)
    texto = normalizar_texto(texto)
    return texto

def normalizar_texto(texto):
    texto = texto.lower()
    texto = unicodedata.normalize("NFKD", texto)
    texto = texto.encode("ascii", "ignore").decode("utf-8")
    texto = re.sub(r"[^\w\s\+#", " ", texto) #no elimina los caracteres + o #
    texto = re.sub(r"\s+", " ", texto)
    return texto

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
        return etiquetas
    except Exception as e:
        print(f"Error al obtener etiquetas de la convocatoria: {e}")


def cerrar_convocatoria(conexion, id_convocatoria):
    try:
        cursor = conexion.cursor()
        query = "UPDATE convocatoria SET estado = 'cerrada' WHERE id_convocatoria = %s"
        cursor.execute(query, (id_convocatoria,))
        cursor.close()
    except Exception as e:
        print(f"Error al cerrar la convocatoria: {e}")


def obtener_candidatos(conexion, id_convocatoria):
    try:
        cursor = conexion.cursor()
        query = "SELECT id_candidato FROM candidatos_por_convocatorias WHERE id_convocatoria = %s"
        cursor.execute(query, (id_convocatoria,))
        candidatos = cursor.fetchall()
        cursor.close()
        return candidatos
    except Exception as e:
        print(f"Error al obtener los candidatos: {e}")



def evaluar_cv(conexion, id_candidato, etiquetas):
    obtener_etiquetas_de_cv(conexion, id_candidato)
    etiquetas_excluyentes =
    pass


def finalizar_convocatoria(conexion, id_convocatoria):
    cerrar_convocatoria(conexion, id_convocatoria)
    etiquetas_de_convocatoria =obtener_etiquetas_de_convocatoria(conexion,id_convocatoria)
    candidatos = obtener_candidatos(conexion, id_convocatoria)
    candidatos_aptos = [c for c in candidatos if evaluar_cv(conexion,c, etiquetas_de_convocatoria)]



def verificar_etiquetas_excluyentes(): #verifica que las etiquetas excluyentes de la convocatoria esten en el cv
    return


def cantidad_etiquetas_opcionales(): #obtiene la cantidad de etiquetas opcionales en el cv(de las incluidas en la convocatoria)
    return

def transformar_experiencia_en_etiqueta(): #transforma la experiencia en una/s etiqueta/s
    return

def analizar_cv(): #actualiza la tabla evaluacion_cv
    return

def evaluar_candidato(): #lo detecta como apto o no apto a partir de la tabla evaluacion_cv
    return

def crear_convocatoria(): #actualiza la tabla de convocatoria, la tabla etiquetas_por_convocatoria
    return

def postular_candidato(): #actualiza la tabla candidatos_por_convocatorias
    return

def verificar_postulacion(): #por si el candidato ya se postulo
    return

def obtener_candidatos_aptos(): #obtiene los candidatos aptos por convocatoria para analizar con machine learning
    return

def obtener_nivel_educativo():
    return

def obtener_cantidad_de_certificaciones():
    return



