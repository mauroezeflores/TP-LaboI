import db


# obtener habilidades, certificacion y presencia en proyectos, devuelve un numero del 1 al 5
def obtener_nivel_habilidad(conexion, id_empleado):
    habilidades = db.realizar_consulta(conexion,
                                       "SELECT SUM(h.peso) AS suma_pesos FROM habilidades_por_empleado hpe JOIN empleado e ON e.id_empleado = hpe.id_empleado JOIN habilidades_validas_por_puesto hvp ON hvp.id_puesto = e.id_puesto_trabajo AND hvp.id_habilidad = hpe.id_habilidad JOIN habilidad h ON h.id_habilidad = hpe.id_habilidad WHERE e.id_empleado =  %s",
                                       (id_empleado,))
    # valor_habilidades = sum(r[1] for r in habilidades) #obtiene el peso total, 1 seria la columna donde estan los pesos
    # nivel = obtener_nivel(valor_habilidades) #obtenemos el nivel para el modelo
    nivel = habilidades[0][0]  # obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else:
        return nivel


def obtener_nivel_certificacion(conexion, id_empleado):
    certificaciones = db.realizar_consulta(conexion,
                                           "SELECT SUM(c.peso) AS suma_pesos_certificaciones FROM certificaciones_por_empleado cpe JOIN empleado e ON e.id_empleado = cpe.id_empleado JOIN certificaciones_validas_por_puesto cvp ON cvp.id_puesto_trabajo = e.id_puesto_trabajo AND cvp.id_certificacion = cpe.id_certificacion JOIN certificacion c ON c.id_certificacion = cpe.id_certificacion WHERE e.id_empleado =  %s",
                                           (id_empleado,))
    nivel = certificaciones[0][0]  # obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else:
        return nivel


def obtener_nivel_presencia_en_proyectos(conexion, id_empleado):
    presencias = db.realizar_consulta(conexion,
                                      "SELECT SUM(p.peso) AS suma_pesos FROM proyectos_por_empleados ppe JOIN proyecto p ON p.id_proyecto = ppe.id_proyecto WHERE ppe.id_empleado = %s",
                                      (id_empleado,))
    nivel = presencias[0][0]  # obtenemos el nivel para el modelo
    nivel = nivel if nivel is not None else 0
    if nivel >= 25:
        return 25
    else:
        return nivel


def obtener_presentismo(conexion, id_empleado):
    presentismo = db.realizar_consulta(conexion, "SELECT tiene_presentismo FROM empleado WHERE id_empleado = %s", (id_empleado,))
    if not presentismo or presentismo[0][0] is None:
        return 0
    nivel = presentismo[0][0]
    return 1 if nivel else 0

# si el empleado realizo mas de 5 horas extras en los ultimos 30 dias, se considera que tiene horas extras
def obtener_horas_extras(conexion, id_empleado):
    horas_extras = db.realizar_consulta(conexion, "SELECT realiza_horas_extra FROM empleado WHERE id_empleado = %s",
                                        (id_empleado,))
    row = db.realizar_consulta(conexion, "SELECT "
                                         "COALESCE(SUM(cant_horas_extras), 0) AS Horas_Extras_90d "
                                         "FROM "
                                         "fichada"
                                         "WHERE "
                                         "id_empleado = %s "
                                         "AND "
                                         "fecha_entrada >= CURRENT_DATE - INTERVAL '30 days';", (id_empleado,))
    if not row:
        return 0
    Horas_Extras = row[0][0]
    if Horas_Extras < 5:
        return 0
    if Horas_Extras == None:
        return 0
    return 1


def obtener_ultima_evaluacion_de_desempeño(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT evaluacion_desempeño " \
                                         "FROM historial_evaluacion " \
                                         "WHERE id_empleado = %s " \
                                         "ORDER BY fecha_evaluacion DESC " \
                                         "LIMIT 1;",
                               (id_empleado,))
    if not row:
        return 0
    Evaluación_Desempeño = row[0][0]
    if Evaluación_Desempeño == None:
        Evaluación_Desempeño = 0
    return Evaluación_Desempeño


def obtener_ultima_evaluacion_del_superior(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT evaluacion_del_superior " \
                                         "FROM historial_evaluacion " \
                                         "WHERE id_empleado = %s " \
                                         "ORDER BY fecha_evaluacion DESC " \
                                         "LIMIT 1;",
                               (id_empleado,))
    if not row:
        return 0
    Ultima_Evaluacion_Superior = row[0][0]
    if Ultima_Evaluacion_Superior == None:
        Ultima_Evaluacion_Superior = 0
    return Ultima_Evaluacion_Superior


def nueva_direccion(conexion, direccion, pais, provincia, ciudad, cod_postal, latitud, longitud):
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


def nuevo_telefono(conexion, codigo_pais, codigo_area, numero_telefono, id_empleado, tipo_telefono):
    try:
        cursor = conexion.cursor()
        query = "INSERT INTO telefono(codigo_pais, codigo_area, numero_telefono,id_empleado,tipo_telefono) " \
                "VALUES (%s,%s,%s,%s,%s) " \
                "RETURNING id_telefono"

        cursor.execute(query, (codigo_pais, codigo_area, numero_telefono, id_empleado, tipo_telefono))

        id_telefono = cursor.fetchone()[0]
        cursor.close()

        return id_telefono
    except Exception as e:
        print("Error al insertar datos: {e}")
        return None


def nuevo_empleado(
        conexion,
        nombre, apellido, fecha_de_nacimiento, email_personal,
        estado_civil, tiene_hijos, nivel_educativo,
        direccion, pais, provincia, ciudad, cod_postal, latitud, longitud,
        codigo_pais, codigo_area, numero_telefono, tipo_telefono,
        id_puesto_trabajo, id_jornada, estado,
        hace_horas_extra, tiene_movilidad_propia
):
    id_direccion = nueva_direccion(conexion, direccion, pais, provincia, ciudad, cod_postal, latitud, longitud)
    if id_direccion is None:
        raise Exception("No se pudo crear la dirección")

    try:
        cursor = conexion.cursor()
        query = """
                INSERT INTO empleado (nombre, apellido, fecha_de_nacimiento, email_personal,
                                      estado_civil, tiene_hijos, nivel_educativo,
                                      id_direccion, id_puesto_trabajo, id_jornada, estado,
                                      hace_horas_extra, tiene_movilidad_propia)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id_empleado \
                """
        cursor.execute(query, (
            nombre, apellido, fecha_de_nacimiento, email_personal,
            estado_civil, tiene_hijos, nivel_educativo,
            id_direccion, id_puesto_trabajo, id_jornada, estado,
            hace_horas_extra, tiene_movilidad_propia
        ))

        id_empleado = cursor.fetchone()[0]
        id_telefono = nuevo_telefono(conexion, codigo_pais, codigo_area, numero_telefono, id_empleado, tipo_telefono)

        if id_telefono is None:
            raise Exception("No se pudo crear el teléfono")

        conexion.commit()
        return id_empleado
    except Exception as e:
        conexion.rollback()
        print(f"Error al insertar empleado: {e}")
        return None


def obtener_edad(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT " \
                                         "EXTRACT(" \
                                         "YEAR FROM " \
                                         "age(current_date, fecha_de_nacimiento)" \
                                         "))::int AS edad " \
                                         "FROM empleado " \
                                         "WHERE id_empleado = %s;",
                               (id_empleado,))
    if not row:
        return 0
    Edad = row[0][0]
    if Edad == None:
        Edad = 0
    return Edad


def obtener_estado_civil(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT estado_civil " \
                                         "FROM empleado " \
                                         "where id_empleado = %s;",
                               (id_empleado,))
    if not row:
        return 0
    Estado_Civil = row[0][0]
    if Estado_Civil == None:
        Estado_Civil = 0
    return Estado_Civil


# revisar, de aca sacamos el presentismo tambien
def obtener_ausencias(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT ausencias_90d FROM deteccion_rotacion WHERE id_empleado = %s;", (id_empleado, ))
    if not row:
        return 0
    Ausencias_90d = row[0][0]
    if Ausencias_90d == None:
        Ausencias_90d = 0
    return Ausencias_90d


def obtener_llegadas_tarde(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT llegadas_tardes_90d FROM deteccion_rotacion WHERE id_empleado = %s;", (id_empleado, ))
    if not row:
        return 0
    Tardanzas_90d = row[0][0]
    if Tardanzas_90d == None:
        Tardanzas_90d = 0
    return Tardanzas_90d


def obtener_salidas(conexion, id_empleado):  # no se encuentra como campo
    row = db.realizar_consulta(conexion, "SELECT salidas_tempranas_90d FROM deteccion_rotacion WHERE id_empleado = %s;", (id_empleado, ))
    if not row:
        return 0
    Salidas_Tempranas_90d = row[0][0]
    if Salidas_Tempranas_90d == None:
        Salidas_Tempranas_90d = 0
    return Salidas_Tempranas_90d



def obtener_horas_extras(conexion, id_empleado):  # no encuentro donde quedan registradas las horas extras
    row = db.realizar_consulta(conexion, "SELECT "
                                         "COALESCE(SUM(cant_horas_extra), 0) AS Horas_Extras_90d "
                                         "FROM "
                                         "fichada "
                                         "WHERE "
                                         "id_empleado = %s "
                                         "AND "
                                         "fecha_entrada >= CURRENT_DATE - INTERVAL '90 days';", (id_empleado,))
    if not row:
        return 0
    Horas_Extras_90d = row[0][0]
    if Horas_Extras_90d == None:
        Horas_Extras_90d = 0
    return Horas_Extras_90d


def obtener_antiguedad(conexion, id_empleado):  # la fecha de ingreso estaria en historial laboral?
    row = db.realizar_consulta(conexion, "SELECT "
                                         "COALESCE( "
                                         "EXTRACT( "
                                         "YEAR "
                                         "FROM age(CURRENT_DATE, MIN(fecha_de_cambio)) "
                                         "), "
                                         "0 "
                                         ") AS Antiguedad "
                                         "FROM "
                                         "historial_laboral "
                                         "WHERE "
                                         "id_empleado = %s "
                                         "AND estado = 'alta de empleado';", (id_empleado,))
    if not row:
        return 0
    Antiguedad = row[0][0]
    if Antiguedad == None:
        Antiguedad = 0
    return Antiguedad


def obtener_satisfaccion_laboral(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT "
                                         "satisfaccion_laboral "
                                         "FROM "
                                         "encuesta "
                                         "WHERE "
                                         "id_empleado = %s "
                                         "ORDER BY "
                                         "fecha_de_realizacion DESC "
                                         "LIMIT 1;", (id_empleado,))
    if not row:
        return 0
    satisfaccion_laboral = row[0][0]
    if satisfaccion_laboral == None:
        satisfaccion_laboral = 0
    return satisfaccion_laboral


def obtener_satisfaccion_ambiente(conexion, id_empleado):
    row = db.realizar_consulta(conexion, "SELECT "
                                         "satisfaccion_ambiente_laboral "
                                         "FROM "
                                         "encuesta "
                                         "WHERE "
                                         "id_empleado = %s "
                                         "ORDER BY "
                                         "fecha_de_realizacion DESC "
                                         "LIMIT 1;", (id_empleado,))
    if not row:
        return 0
    satisfaccion_ambiente = row[0][0]
    if (satisfaccion_ambiente is None):
        satisfaccion_ambiente = 0
    return satisfaccion_ambiente


def obtener_horas_trabajadas(conexion, id_empleado):
    """row = db.realizar_consulta(conexion, "", (id_empleado,))
    if not row:
        return 0
    horas_trabajadas = row[0][0]
    if horas_trabajadas is None:
        horas_trabajadas = 0
    return horas_trabajadas"""
    return 160

def insertar_en_historial(conexion, id_empleado, fecha, evaluacion_desempeno):
    try:
        print("Intentando insertar en historial_prediccion_desempeno")
        cursor = conexion.cursor()
        # Convierte a float nativo de Python
        valor = float(evaluacion_desempeno)
        cursor.execute(
            "INSERT INTO public.historial_prediccion_desempeno (id_empleado, fecha_prediccion, prediccion) VALUES (%s, %s, %s)",
            (id_empleado, fecha, valor)
        )
        conexion.commit()
        print("Insert exitoso")
    except Exception as e:
        print(f"Error al insertar en historial: {e}")
