Propuesta de Simulación del Proceso de Práctica Pedagógica

Esta simulación guiará el uso de la aplicación para recrear un ciclo de práctica
pedagógica, involucrando a los diferentes roles y funcionalidades del sistema.

---

Fase 1: Configuración Inicial del Sistema (Rol: Administrador)

Esta fase se centra en la preparación del entorno de la aplicación, creando los
usuarios, instituciones y la estructura base de protocolos y formularios.

1.  Creación de Usuarios:
    - Acceder al panel de administración (/admin).
    - Navegar a "Gestionar Usuarios" (/admin/users).
    - Crear los siguientes usuarios con nombres genéricos:
      - Administradores (2): Admin1, Admin2 (rol: admin)
      - Docentes (10): Docente1 a Docente10 (rol: teacher_directive)
      - Estudiantes (10): Estudiante1 a Estudiante10 (rol: student)
      - Familiares (5): Padre_Estudiante1, Madre_Estudiante2,
        Padre_Estudiante3, Madre_Estudiante4, Padre_Estudiante5 (rol: family).
        Estos usuarios se vincularán conceptualmente a los estudiantes
        correspondientes.

2.  Creación de Instituciones Educativas:
    - Acceder al panel de administración (/admin).
    - Navegar a "Gestionar Instituciones" (/admin/institutions).
    - Crear 4 instituciones educativas con nombres genéricos: IE_Alfa, IE_Beta,
      IE_Gamma, IE_Delta.

3.  Creación de Protocolos y Asociación de Formularios:
    - Acceder al panel de administración (/admin).
    - Navegar a "Gestionar Protocolos" (/admin/protocols).
    - Crear los siguientes protocolos, asociando los formularios relevantes (se
      asume que los formularios ya existen o se crearán previamente en el editor
      de formularios):
      - Protocolo: PPI1 - Lectura del Contexto Sociocultural
        - Formularios asociados:
          - Formato de Control de Asistencia y Actividades Curriculares
          - Formato de Observación de Clase del Docente en Formación
            (Simple)
          - Formato Horario Asignado
          - Formato de Informe de Actividad Extracurricular
          - Formato Plan de Clase
          - Guía de Observación del Maestro en Formación en el Aula
            (Primeras Semanas)
          - Formato de Evaluación Semestral del Proceso de Práctica Docente
          - Formato de Evaluación del Ejercicio de Práctica del Docente en
            Formación (Cuantitativa)
          - Formato de Evaluación de la Clase del Docente en Formación
            (Docente Tutor)

      - Protocolo: PPI2 - Lectura del Contexto Pedagógico
        - Formularios asociados:
          - Protocolo 1: Análisis Documental del PEI
          - Protocolo 2: Análisis Documental del Modelo Pedagógico
          - Protocolo 3: Observación de Clases

      - Protocolo: PPI3 - Lectura del Contexto Curricular
        - Formularios asociados:
          - Protocolo 1: Currículo y PEI
          - Protocolo 2: Entrevista Coordinador
          - Protocolo 3: Estudio de la Malla Curricular

      - Protocolo: PPI4 - Laboratorio de Gestión Educativa
        - Formularios asociados:
          - Protocolo 1: Autoevaluación Institucional
          - Protocolo 2: Plan de Mejoramiento Institucional
          - Protocolo 4: Diario de Campo
          - Protocolo 5: Matriz DOFA de las Áreas de Gestión Escolar

      - Protocolo: PPI5 - Enseñanza de la Programación
        - Formularios asociados:
          - Plan de Clase (Enseñanza de la Programación)
          - Registro de Datos y Seguimiento (Enseñanza de la Programación)
          - Informe de Evidencias de Aplicación (Enseñanza de la
            Programación)

      - Protocolo: PPI6 - Audiovisuales
        - Formularios asociados:
          - Formato de Propuesta de Solución (Audiovisuales)
          - Formato de Cronograma de Actividades (Audiovisuales)
          - Formato Carta de Aceptación (Audiovisuales)

      - Protocolo: Práctica Docente I y II
        - Formularios asociados:
          - Diario de Campo (Práctica Docente)
          - Registro de Evidencias Fotográficas (Práctica Docente)
          - Propuesta de Investigación Pedagógica (Práctica Docente)
          - Portafolio Físico (Práctica Docente)
          - Artículo de Experiencia (Práctica Docente)

Fase 2: Asignación de Prácticas y Simulación de Procesos

Esta fase simula el inicio de las prácticas y la interacción de los estudiantes
y docentes con los formularios y protocolos.

1.  Asignación de Prácticas (Rol: Administrador/Coordinador):
    - Asignar a cada EstudianteX un DocenteY como asesor y una IE_Z.
    - Vincular a cada práctica los protocolos relevantes (ej. PPI1, Práctica
      Docente I y II).

2.  Simulación de Llenado de Formularios (Rol: Estudiante):
    - Estudiante1 (hombre) y Estudiante2 (mujer) inician su práctica en IE_Alfa
      con Docente1.
    - Estudiante1 accede a su práctica y llena el Formato de Control de
      Asistencia y Actividades Curriculares para una semana.
    - Estudiante2 llena el Formato de Observación de Clase del Docente en
      Formación (Simple).
    - Estudiante3 (hombre) y Estudiante4 (mujer) inician su práctica en IE_Beta
      con Docente2.
    - Estudiante3 llena el Protocolo 1: Análisis Documental del PEI.
    - Estudiante4 llena el Protocolo 3: Observación de Clases.
    - Continuar con los 6 estudiantes restantes, asignándolos a Docente3 a
      Docente5 y a IE_Gamma e IE_Delta, y haciendo que llenen al menos un
      formulario de diferentes protocolos (ej. Diario de Campo, Formato Plan de
      Clase, Protocolo 4: Diario de Campo).

3.  Simulación de Revisión y Evaluación (Rol: Docente):
    - Docente1 revisa y evalúa el Formato de Control de Asistencia de
      Estudiante1.
    - Docente1 revisa y evalúa el Formato de Observación de Clase de Estudiante2.
    - Docente2 revisa y evalúa el Protocolo 1: Análisis Documental del PEI de
      Estudiante3.
    - Docente2 revisa y evalúa el Protocolo 3: Observación de Clases de
      Estudiante4.
    - Los Docente3 a Docente5 revisan los formularios llenados por sus
      estudiantes asignados.

4.  Simulación de Interacción Familiar (Rol: Familiar):
    - Padre_Estudiante1 (o Madre_Estudiante2) inicia sesión y consulta el
      progreso de Estudiante1 (o Estudiante2) a través de los formularios
      completados (si la funcionalidad de visualización para familiares está
      implementada).

Fase 3: Monitoreo y Reportes (Roles: Administrador, Coordinador)

Esta fase se enfoca en la supervisión y el análisis del progreso de las prácticas.

1.  Monitoreo General:
    - Admin1 o Coordinador1 (si se crea un usuario coordinador) accede al panel
      de administración para ver un resumen de las prácticas activas, el número
      de formularios completados, etc.
    - Consultar la lista de protocolos y formularios para verificar su estado.

2.  Generación de Reportes:
    - Simular la necesidad de generar un reporte de asistencia o de evaluación de
      un grupo de estudiantes, utilizando la información de los formularios
      completados.

---

Próximo Paso:

Una vez que apruebes esta propuesta, crearé un archivo Markdown
(simulacion_practica_pedagogica.md) con el paso a paso detallado para ejecutar
esta simulación en la aplicación.
