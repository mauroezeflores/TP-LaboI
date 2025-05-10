import db

def obtener_evaluacion_de_desempeño(conexion,id_empleado):
    row = db.realizar_consulta(conexion, "SELECT evaluacion_de_desempeño " \
    "FROM historial_de_evaluaciones " \
    "WHERE id_empleado = %s " \
    "ORDER BY fecha_evaluacion DESC " \
    "LIMIT 1;",
     (id_empleado,) )
    if not row:
        return 0
    Evaluación_Desempeño = row[0][0]
    if Evaluación_Desempeño == None:
        Evaluación_Desempeño=0
    return Evaluación_Desempeño

def obtener_ultima_evaluacion_del_superior(conexion,id_empleado):
    row = db.realizar_consulta(conexion, "SELECT evaluacion_del_superior " \
    "FROM historial_de_evaluaciones " \
    "WHERE id_empleado = %s " \
    "ORDER BY fecha_evaluacion DESC " \
    "LIMIT 1;",
     (id_empleado,) )
    if not row:
        return 0
    Ultima_Evaluacion_Superior = row[0][0]
    if Ultima_Evaluacion_Superior == None:
       Ultima_Evaluacion_Superior = 0
    return Ultima_Evaluacion_Superior

def obtener_edad(conexion,id_empleado):
    row = db.realizar_consulta(conexion,"SELECT " \
    "EXTRACT(" \
    "YEAR FROM " \
    "age(current_date, fecha_de_nacimiento)" \
    "))::int AS edad " \
    "FROM empleado " \
    "WHERE id_empleado = %s;",
    (id_empleado,))
    if not row:
        return 0
    Edad= row[0][0]
    if Edad == None:
        Edad = 0    
    return Edad

def obtener_estado_civil(conexion,id_empleado):
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

def obtener_ausencias(conexion,id_empleado):
    row = db.realizar_consulta(conexion, "SELECT " \
    "  COUNT(*) AS ausencias_90d " \
    "FROM fichada AS f " \
    "JOIN detalles_fichada AS d " \
    "ON d.id_fichada = f.id_fichada " \
    "WHERE " \
    "f.id_empleado = %s " \
    "AND d.es_ausencia = TRUE " \
    "AND f.fecha >= CURRENT_DATE - INTERVAL '90 days';" (id_empleado,))
    if not row:
        return 0
    Ausencias_90d = row[0][0]
    if Ausencias_90d == None:
        Ausencias_90d = 0    
    return Ausencias_90d
def obtener_llegadas_tarde(conexion,id_empleado):
    row = db.realizar_consulta(conexion, "SELECT " \
    "  COUNT(*) AS llegadas_tarde_90d " \
    "FROM fichada AS f " \
    "JOIN detalles_fichada AS d " \
    "ON d.id_fichada = f.id_fichada " \
    "WHERE " \
    "f.id_empleado = %s" \
    "AND d.es_llegada_tarde = TRUE " \
    "AND f.fecha >= CURRENT_DATE - INTERVAL '90 days';"(id_empleado,))
    if not row:
        return 0
    Tardanzas_90d = row[0][0]
    if Tardanzas_90d == None:
        Tardanzas_90d = 0    
    return Tardanzas_90d

def obtener_salidas(conexion,id_empleado):#no se encuentra como campo
    row = db.realizar_consulta(conexion,"SELECT " \
    "  COUNT(*) AS salidas_tempranas_90d " \
    "FROM fichada AS f " \
    "JOIN detalles_fichada AS d " \
    "ON d.id_fichada = f.id_fichada " \
    "WHERE " \
    "f.id_empleado = %s" \
    "AND d.es_salida_temprana = TRUE " \
    "AND f.fecha >= CURRENT_DATE - INTERVAL '90 days';"(id_empleado,) )
    if not row:
        return 0
    Salidas_Tempranas_90d = row[0][0]
    if Salidas_Tempranas_90d == None:
        Salidas_Tempranas_90d = 0    
    return Salidas_Tempranas_90d

def obtener_horas_extras(conexion,id_empleado):#no encuentro donde quedan registradas las horas extras
    row = db.realizar_consulta(conexion, "SELECT "
                                         "COALESCE(SUM(cant_horas_extras), 0) AS Horas_Extras_90d "
                                         "FROM "
                                         "fichadas "
                                         "WHERE "
                                         "id_empleado = %s "
                                         "AND "
                                         "fecha_entrada >= CURRENT_DATE - INTERVAL '90 days';", (id_empleado,))
    if not row:
        return 0
    Horas_Extras_90d= row[0][0]
    if Horas_Extras_90d == None:
        Horas_Extras_90d = 0
    return Horas_Extras_90d

def obtener_antiguedad(conexion,id_empleado):#la fecha de ingreso estaria en historial laboral?
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
    if satisfaccion_laboral== None:
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