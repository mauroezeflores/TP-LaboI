INSERT INTO departamento (id_departamento, nombre) VALUES
(1, 'Desarrollo de Software'),
(2, 'Recursos Humanos'),
(3, 'Ventas y Comercialización'),
(4, 'Atención al Cliente');

INSERT INTO puesto_de_trabajo (id_puesto, nombre, sueldo_base, id_departamento) VALUES
(1, 'Desarrollador Backend', 700000, 1),
(2, 'Desarrollador Frontend', 700000, 1),
(3, 'Analista de Recursos Humanos', 600000, 2),
(4, 'Ejecutivo de Ventas', 500000, 3),
(5, 'Contador', 650000, 3),
(6, 'Especialista en Marketing Digital', 620000, 3),
(7, 'Representante de Atención al Cliente', 480000, 4),
(8, 'Recruiter', 500000, 2);

INSERT INTO certificacion (id_certificacion, nombre, peso) VALUES
(1, 'Certificacion Scrum Master', 5),
(2, 'Certificacion Azure Fundamentals', 4),
(3, 'Certificación en Bases de Datos SQL', 4),
(4, 'Certificacion en seguridad informatica', 4),
(5, 'Certificacion en Desarrollo Web Full Stack', 3),
(6, 'AWS Certified Solutions Architect', 5),
(7, 'Certificado en Recursos Humanos Estratégicos', 4);
(8, 'Certificacion Cloud Engineer', 3),
(9, 'Certificacion en desarrollo movil', 3);

INSERT INTO habilidad (id_habilidad, nombre, peso) VALUES
(1, 'Python', 5),
(2, 'Java', 5),
(3, 'Desarrollo web', 5),
(4, 'React', 5),
(5, 'Angular', 5),
(6, 'Bases de datos relacionales', 5),
(7, 'Bases de datos NoSQL', 5),
(8, 'Unit testing, Selenium', 5),
(9, 'ciberseguridad', 5);

INSERT INTO beneficio (id_beneficio, nombre) VALUES
(1, 'Obra Social'),
(2, 'Capacitacion continua'),
(4, 'Flexibilidad Horaria'),
(5, 'Trabajo Remoto Parcial');

INSERT INTO proyecto (id_proyecto, nombre, cantidad_de_integrantes, peso, id_departamento) VALUES
(1, 'Implementación Sistema de Gestión', 10, 5, 1),
(3, 'Campaña Publicitaria 2025', 6, 4, 5),
(3, 'Expansión de Ventas Regionales', 8, 5, 3),
(4, 'Optimización de Costos Financieros', 4, 3, 4),
(5, 'Nuevo Portal de Empleos', 5, 4, 2);
