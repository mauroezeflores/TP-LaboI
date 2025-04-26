CREATE TABLE "Empleado" (
  "id_empleado" integer PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "apellido" varchar NOT NULL,
  "fecha_de_nacimiento" date NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "estado_civil" varchar NOT NULL,
  "tiene_hijos" boolean NOT NULL,
  "nivel_educativo" varchar NOT NULL,
  "telefono" varchar NOT NULL,
  "direccion" varchar NOT NULL,
  "id_puesto" integer,
  "id_departamento" integer,
  "id_contratacion" integer,
  "genero" varchar NOT NULL,
  "sueldo" float NOT NULL,
  "ultima_evaluacion" float,
  "id_proyecto" integer,
  "desempeño_actual" integer
);

CREATE TABLE "proyecto" (
  "id_proyecto" integer PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "cantidad_de_integrantes" integer NOT NULL,
  "peso" integer NOT NULL,
  "id_departamento" integer
);

CREATE TABLE "proyectos_por_empleados" (
  "id_empleado" integer,
  "id_proyecto" integer,
  primary key(id_empleado,id_proyecto)
);

CREATE TABLE "extra" (
  "id_extra" integer PRIMARY KEY
  "nombre" varchar
);

CREATE TABLE "extras_por_puestos" (
  "id_puesto" integer,
  "id_extra" integer,
  primary key(id_puesto,id_extra)
);

CREATE TABLE "extras_por_empleados" (
  "id_empleado" integer,
  "id_extra" integer,
  primary key(id_extra,id_empleado)
);

CREATE TABLE "certificaciones_por_empleados" (
  "id_empleado" integer,
  "id_certificacion" integer,
  primary key(id_empleado,id_certificacion)
);

CREATE TABLE "certificaciones_validas_por_puestos" (
  "id_puesto" integer,
  "id_certificacion" integer,
  primary key(id_puesto,id_certificacion)
);

CREATE TABLE "habilidades_por_empleados" (
  "id_empleado" integer,
  "id_habilidad" integer,
  primary key(id_empleado,id_habilidad)
);

CREATE TABLE "habilidades_validas_por_puestos" (
  "id_puesto" integer,
  "id_habilidad" integer,
  primary key(id_puesto,id_habilidad)
);

CREATE TABLE "habilidad" (
  "id_habilidad" integer PRIMARY KEY,
  "nombre" varchar
  "peso" integer NOT NULL
);

CREATE TABLE "contratacion" (
  "id_contratacion" integer PRIMARY KEY,
  "nombre" varchar NOT NULL
);

CREATE TABLE "Fichada" (
  "id_empleado" integer,
  "fecha_de_entrada" date NOT NULL,
  "hora_de_entrada" time NOT NULL,
  "fecha_de_salida" date,
  "hora_de_salida" time
);

CREATE TABLE "puesto_de_trabajo" (
  "id_puesto" integer PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "sueldo_base" float NOT NULL,
  "id_departamento" integer
);

CREATE TABLE "departamento" (
  "id_departamento" integer PRIMARY KEY,
  "nombre" varchar NOT NULL
);

CREATE TABLE "beneficio" (
  "id_beneficio" integer PRIMARY KEY,
  "nombre" varchar NOT NULL
);

CREATE TABLE "beneficios_por_contrataciones" (
  "id_contratacion" integer,
  "id_beneficio" integer,
  primary key(id_contratacion,id_beneficio)
);

CREATE TABLE "certificacion" (
  "id_certificacion" integer PRIMARY KEY,
  "nombre" varchar NOT NULL,
  "peso" integer NOT NULL
);

CREATE TABLE "calculo_de_desempeno" (
  "id_empleado" integer,
  "fecha_de_evaluacion" date,
  "nivel_de_presentismo" varchar,
  "nivel_de_certificacion" varchar,
  "nivel_de_habilidades" integer,
  "presencia_en_proyectos" integer,
  "horas_extras" integer,
  "desempeño" float,
  primary key(id_empleado,fecha_de_evaluacion)
);

CREATE TABLE "calendario_laboral" (
  "fecha" date PRIMARY KEY
);

ALTER TABLE "Empleado" ADD FOREIGN KEY ("id_puesto") REFERENCES "puesto_de_trabajo" ("id_puesto");

ALTER TABLE "Empleado" ADD FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id_departamento");

ALTER TABLE "Empleado" ADD FOREIGN KEY ("id_contratacion") REFERENCES "contratacion" ("id_contratacion");

ALTER TABLE "Empleado" ADD FOREIGN KEY ("id_proyecto") REFERENCES "proyecto" ("id_proyecto");

ALTER TABLE "proyecto" ADD FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id_departamento");

ALTER TABLE "proyectos_por_empleados" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "proyectos_por_empleados" ADD FOREIGN KEY ("id_proyecto") REFERENCES "proyecto" ("id_proyecto");

ALTER TABLE "extras_por_puestos" ADD FOREIGN KEY ("id_puesto") REFERENCES "puesto_de_trabajo" ("id_puesto");

ALTER TABLE "extras_por_puestos" ADD FOREIGN KEY ("id_extra") REFERENCES "extra" ("id_extra");

ALTER TABLE "extras_por_empleados" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "extras_por_empleados" ADD FOREIGN KEY ("id_extra") REFERENCES "extra" ("id_extra");

ALTER TABLE "certificaciones_por_empleados" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "certificaciones_por_empleados" ADD FOREIGN KEY ("id_certificacion") REFERENCES "certificacion" ("id_certificacion");

ALTER TABLE "certificaciones_validas_por_puestos" ADD FOREIGN KEY ("id_puesto") REFERENCES "puesto_de_trabajo" ("id_puesto");

ALTER TABLE "certificaciones_validas_por_puestos" ADD FOREIGN KEY ("id_certificacion") REFERENCES "certificacion" ("id_certificacion");

ALTER TABLE "habilidades_por_empleados" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "habilidades_por_empleados" ADD FOREIGN KEY ("id_habilidad") REFERENCES "habilidad" ("id_habilidad");

ALTER TABLE "habilidades_validas_por_puestos" ADD FOREIGN KEY ("id_puesto") REFERENCES "puesto_de_trabajo" ("id_puesto");

ALTER TABLE "habilidades_validas_por_puestos" ADD FOREIGN KEY ("id_habilidad") REFERENCES "habilidad" ("id_habilidad");

ALTER TABLE "habilidad" ADD FOREIGN KEY ("id_puesto") REFERENCES "puesto_de_trabajo" ("id_puesto");

ALTER TABLE "Fichada" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "puesto_de_trabajo" ADD FOREIGN KEY ("id_departamento") REFERENCES "departamento" ("id_departamento");

ALTER TABLE "beneficios_por_contrataciones" ADD FOREIGN KEY ("id_contratacion") REFERENCES "contratacion" ("id_contratacion");

ALTER TABLE "beneficios_por_contrataciones" ADD FOREIGN KEY ("id_beneficio") REFERENCES "beneficio" ("id_beneficio");

ALTER TABLE "calculo_de_desempeno" ADD FOREIGN KEY ("id_empleado") REFERENCES "Empleado" ("id_empleado");

ALTER TABLE "habilidades_por_empleados" ADD FOREIGN KEY ("id_habilidad") REFERENCES "habilidad" ("id_habilidad");