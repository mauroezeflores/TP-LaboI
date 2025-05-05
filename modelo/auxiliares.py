import db
#convierte el total de los pesos en un nivel-no va a servir para presentismo


#obtener habilidades, certificacion y presencia en proyectos, devuelve un numero del 1 al 5
def obtener_nivel_habilidad(id_empleado,conexion):
    habilidades = db.realizar_consulta(conexion,"SELECT SUM(h.peso) AS suma_pesos FROM habilidades_por_empleado hpe JOIN empleado e ON e.id_empleado = hpe.id_empleado JOIN habilidades_validas_por_puesto hvp ON hvp.id_puesto = e.id_puesto AND hvp.id_habilidad = hpe.id_habilidad JOIN habilidad h ON h.id_habilidad = hpe.id_habilidad WHERE e.id_empleado =  %s", (id_empleado,))
    #valor_habilidades = sum(r[1] for r in habilidades) #obtiene el peso total, 1 seria la columna donde estan los pesos
    #nivel = obtener_nivel(valor_habilidades) #obtenemos el nivel para el modelo
    nivel =  habilidades [0][0]  #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else: return nivel


def obtener_nivel_certificacion(id_empleado,conexion):
    certificaciones = db.realizar_consulta(conexion,"SELECT SUM(c.peso) AS suma_pesos_certificaciones FROM certificaciones_por_empleado cpe JOIN empleado e ON e.id_empleado = cpe.id_empleado JOIN certificaciones_validas_por_puesto cvp ON cvp.id_puesto = e.id_puesto AND cvp.id_certificacion = cpe.id_certificacion JOIN certificacion c ON c.id_certificacion = cpe.id_certificacion WHERE e.id_empleado =  %s", (id_empleado,))
    nivel = certificaciones [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else: return nivel

def obtener_nivel_presencia_en_proyectos(id_empleado,conexion):
    presencias = db.realizar_consulta(conexion,"SELECT SUM(p.peso) AS suma_pesos FROM proyectos_por_empleados ppe JOIN proyecto p ON p.id_proyecto = ppe.id_proyecto WHERE ppe.id_empleado = %s", (id_empleado,))
    nivel = presencias [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else: return nivel

def obtener_presentismo(id_empleado,conexion):
    presentismo = db.realizar_consulta(conexion,"SELECT tiene_presentismo FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = presentismo [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel == True:
        return 1
    else: return 0

def obtener_horas_extras(id_empleado,conexion):
    horas_extras = db.realizar_consulta(conexion,"SELECT realiza_horas_extra FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = horas_extras [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel == True:
        return 1
    else: return 0

def obtener_ultima_evaluacion_desempeño(id_empleado,conexion):
    ultima_evaluacion_desempeño = db.realizar_consulta(conexion,"SELECT ultima_evaluacion_de_desempeno FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = ultima_evaluacion_desempeño [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 100:
        return 100
    else: return nivel

def obtener_evaluacion_del_superior(id_empleado,conexion):
    evaluacion_del_superior = db.realizar_consulta(conexion,"SELECT evaluacion_del_superior FROM empleado WHERE id_empleado = %s", (id_empleado,))
    nivel = evaluacion_del_superior [0][0] #obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 100:
        return 100
    else: return nivel

def nueva_direccion(conexion,direccion, pais, provincia, ciudad, cod_postal, latitud, longitud):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO direccion(direccion, pais, provincia, ciudad, cod_postal, latitud, longitud) " \
            "VALUES (%s,%s,%s,%s,%s,%s,%s) " \
            "RETURNING id_direccion"

        cursor.execute(query, (direccion, pais, provincia, ciudad, cod_postal, latitud, longitud))

        id_direccion = cursor.fetchone()[0]
        cursor.close()
        
        return id_direccion
    except Exception as e:
        print("Error al insertar datos: {e}")
        return None

def nuevo_telefono(conexion, codigo_pais, codigo_area, numero_telefono,id_empleado, tipo_telefono):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO telefono(codigo_pais, codigo_area, numero_telefono,id_empleado,tipo_telefono) " \
            "VALUES (%s,%s,%s,%s,%s) " \
            "RETURNING id_telefono"

        cursor.execute(query, (codigo_pais, codigo_area, numero_telefono,id_empleado, tipo_telefono))

        id_telefono = cursor.fetchone()[0]
        cursor.close()
        
        return id_telefono
    except Exception as e:
        print("Error al insertar datos: {e}")
        return None
    
#crea el nuevo usuario, la direccion, y el telefono
#utiliza unicamente los datos personales del usuario, no guarda puesto ni jornada ni ningun dato relacionado a lo laboral
#tendriamos que mopdificar la base de datos
def nuevo_usuario(conexion,nombre, apellido, fecha_de_nacimiento, email_personal, estado_civil, tiene_hijos, nivel_educativo, direccion, pais, provincia, ciudad, cod_postal, latitud, longitud, codigo_pais, codigo_area, numero_telefono, tipo_telefono):
    id_direccion= nueva_direccion(conexion,direccion, pais, provincia, ciudad, cod_postal, latitud, longitud)
    if id_direccion is None:
        raise Exception("No se pudo crear la dirección")
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO usuario(nombre, apellido, fecha_de_nacimiento, email_personal, estado_civil, tiene_hijos, nivel_educativo,id_direccion) " \
            "VALUES (%s,%s,%s,%s,%s,%s,%s,%s) " \
            "RETURNING id"

        cursor.execute(query, (nombre, apellido, fecha_de_nacimiento, email_personal, estado_civil, tiene_hijos, nivel_educativo,id_direccion))

        id_usuario = cursor.fetchone()[0]
        cursor.close()
        #como telefono utiliza el id del usuario tengo que crearlo despues de crear al empleado
        id_telefono = nuevo_telefono(conexion,codigo_pais, codigo_area, numero_telefono,id_usuario, tipo_telefono)
        if id_telefono is None:
            raise Exception("No se pudo crear la dirección")
        conexion.commit()
        return id_usuario
    except Exception as e:
        conexion.rollback()
        print(f"Error al insertar datos: {e}")
        return None

def nuevo_empleado(conexion, id_usuario, id_puesto, id_jornada, estado_empleado):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO empleado(id_usuario, id_puesto, id_jornada, estado_empleado) " \
            "VALUES (%s,%s,%s,%s) " \
            "RETURNING id"

        cursor.execute(query, (id_usuario, id_puesto, id_jornada, estado_empleado))

        id_empleado = cursor.fetchone()[0]
        cursor.close()
        conexion.commit()
        return id_empleado
    except Exception as e:
        conexion.rollback()
        print(f"Error al insertar datos: {e}")
        return None
    