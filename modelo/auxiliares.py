import db
#convierte el total de los pesos en un nivel-no va a servir para presentismo


#obtener habilidades, certificacion y presencia en proyectos, devuelve un numero del 1 al 5
def obtener_nivel_habilidad(id_empleado,conexion):
    habilidades = db.realizar_consulta(conexion,"SELECT SUM(h.peso) AS suma_pesos FROM habilidades_por_empleado hpe JOIN empleado e ON e.id_empleado = hpe.id_empleado JOIN habilidades_validas_por_puesto hvp ON hvp.id_puesto = e.id_puesto AND hvp.id_habilidad = hpe.id_habilidad JOIN habilidad h ON h.id_habilidad = hpe.id_habilidad WHERE e.id_empleado =  %s", (id_empleado,))
    #valor_habilidades = sum(r[1] for r in habilidades) #obtiene el peso total, 1 seria la columna donde estan los pesos
    #nivel = obtener_nivel(valor_habilidades) #obtenemos el nivel para el modelo
    nivel =  habilidades [0][0]  #obtenemos el nivel para el modelo
    if nivel >= 25:
        return 25
    else: return nivel


def obtener_nivel_certificacion(id_empleado,conexion):
    certificaciones = db.realizar_consulta(conexion,"SELECT SUM(c.peso) AS suma_pesos_certificaciones FROM certificaciones_por_empleado cpe JOIN empleado e ON e.id_empleado = cpe.id_empleado JOIN certificaciones_validas_por_puesto cvp ON cvp.id_puesto = e.id_puesto AND cvp.id_certificacion = cpe.id_certificacion JOIN certificacion c ON c.id_certificacion = cpe.id_certificacion WHERE e.id_empleado =  %s", (id_empleado,))
    nivel = certificaciones [0][0] #obtenemos el nivel para el modelo
    if nivel >= 25:
        return 25
    else: return nivel

def obtener_nivel_presencia_en_proyectos(id_empleado,conexion):
    presencias = db.realizar_consulta(conexion,"SELECT SUM(p.peso) AS suma_pesos FROM proyectos_por_empleados ppe JOIN proyecto p ON p.id_proyecto = ppe.id_proyecto WHERE ppe.id_empleado = %s", (id_empleado,))
    nivel = presencias [0][0] #obtenemos el nivel para el modelo
    if nivel >= 25:
        return 25
    else: return nivel

def obtener_presentismo(id_empleado,conexion):
    presentismo = db.realizar_consulta(conexion,"SELECT tiene_presentismo FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = presentismo [0][0] #obtenemos el nivel para el modelo
    if nivel == True:
        return 1
    else: return 0

def obtener_horas_extras(id_empleado,conexion):
    horas_extras = db.realizar_consulta(conexion,"SELECT realiza_horas_extra FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = horas_extras [0][0] #obtenemos el nivel para el modelo
    if nivel == True:
        return 1
    else: return 0

def obtener_ultima_evaluacion_desempeño(id_empleado,conexion):
    ultima_evaluacion_desempeño = db.realizar_consulta(conexion,"SELECT ultima_evaluacion_de_desempeno FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = ultima_evaluacion_desempeño [0][0] #obtenemos el nivel para el modelo
    if nivel >= 100:
        return 100
    else: return nivel

def obtener_evaluacion_del_superior(id_empleado,conexion):
    evaluacion_del_superior = db.realizar_consulta(conexion,"SELECT evaluacion_del_superior FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = evaluacion_del_superior [0][0] #obtenemos el nivel para el modelo
    if nivel >= 100:
        return 100
    else: return nivel