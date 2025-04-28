import db
#convierte el total de los pesos en un nivel-no va a servir para presentismo
def obtener_nivel(x):
    x = max(x, min(25)) #25 si el peso va de 1 a 5, 15 si va de 1 a 3 esto esta mal
    nivel = (x * 5) // 26 +1 #3 y 16 si el peso y el nivel cambian
    return int(nivel)

#obtener habilidades, certificacion y presencia en proyectos, devuelve un numero del 1 al 5
def obtener_nivel_habilidad(id_empleado,conexion):
    habilidades = db.realizar_consulta(conexion,"query para obtener pesos de habilidades de empleado %s", (id_empleado,))
    #valor_habilidades = sum(r[1] for r in habilidades) #obtiene el peso total, 1 seria la columna donde estan los pesos
    #nivel = obtener_nivel(valor_habilidades) #obtenemos el nivel para el modelo
    nivel = obtener_nivel( habilidades [0])
    return nivel


def obtener_nivel_certificacion(id_empleado,conexion):
    certificaciones = db.realizar_consulta(conexion,"query para obtener pesos de certificaciones de empleado %s", (id_empleado,))
    valor_certificaciones = sum(r[1] for r in certificaciones) #obtiene el peso total, 1 seria la columna donde estan los pesos
    nivel = obtener_nivel(valor_certificaciones) #obtenemos el nivel para el modelo
    return nivel

def obtener_nivel_presencia_en_proyectos(id_empleado,conexion):
    presencias = db.realizar_consulta(conexion,"query para obtener pesos de proyectos de empleado %s", (id_empleado,))
    valor_presencias = sum(r[1] for r in presencias) #obtiene el peso total, 1 seria la columna donde estan los pesos
    nivel = obtener_nivel(valor_presencias) #obtenemos el nivel para el modelo
    return nivel

