## Requerimientos Funcionales: ##
- **RF01 - Generación y evaluación automatizada de exámenes:**
  - Los profesores podrán crear exámenes personalizados seleccionando:
    - Nivel educativo (desde 1° Básico hasta 4° Medio).
    - Tipo de preguntas (opción múltiple, verdadero/falso, ensayo, etc.).
  - El sistema utilizará IA para:
    - Analizar documentos PDF proporcionados por el profesor para identificar el contenido y contexto del examen.
    - Generar preguntas basadas en el contenido del documento.
  - Los exámenes generados estarán enfocados exclusivamente en la asignatura de Matemáticas.
  - Los exámenes podrán ser exportados en formatos PDF o digitales.
  - El sistema evaluará automáticamente las respuestas de los estudiantes (excepto preguntas abiertas, que requerirán revisión manual).

- **RF02 - Cálculo y gestión de notas y promedios:**
  - La plataforma calculará automáticamente las calificaciones de cada examen según los criterios establecidos por el profesor (ponderación, penalizaciones, etc.).
  - Guardará un historial de todas las evaluaciones realizadas.
  - Calculará promedios por:
    - Estudiante.
    - Curso.
  - Permitirá la edición manual de calificaciones por parte del profesor.

- **RF03 - Almacenamiento y visualización de notas y promedios:**
  - El sistema guardará las notas evaluadas en una base de datos segura.
  - Permitirá a los usuarios (profesores y estudiantes) visualizar:
    - Notas individuales por examen.
    - Promedios acumulativos.
    - Historial de evaluaciones.
  - Incluirá gráficos y reportes descargables para facilitar el análisis de resultados.

- **RF04 - Registro y autenticación de usuarios:**
  - El sistema permitirá a los usuarios registrarse con:
    - Nombre completo.
    - Correo electrónico.
    - Contraseña segura.
    - Rol (profesor o estudiante).
  - Implementará un sistema de inicio de sesión con validación de credenciales.
  - Permitirá la recuperación de contraseñas mediante correo electrónico.

- **RF05 - Gestión de usuarios y roles:**
  - Los profesores podrán:
    - Crear y gestionar grupos de estudiantes.
    - Asignar exámenes a grupos específicos.
  - Los estudiantes podrán:
    - Acceder a sus exámenes asignados.
    - Consultar sus calificaciones y promedios.

---

## Requerimientos No Funcionales: ##

- **RN01 - Interfaz intuitiva y amigable:**
  - El sistema debe ser fácil de usar para usuarios con distintos niveles de habilidad tecnológica.
  - Seguirá principios de diseño centrado en el usuario, con una navegación clara y accesible.
  - Incluirá tutoriales o guías rápidas para nuevos usuarios.

- **RN02 - Rendimiento y velocidad óptimos:**
  - El sistema debe responder en menos de 2 segundos para la mayoría de las operaciones (como cargar exámenes o mostrar calificaciones).
  - Escalará eficientemente para manejar hasta 1,000 usuarios concurrentes.

- **RN03 - Seguridad de datos:**
  - Toda la información sensible (como contraseñas y calificaciones) será almacenada de forma encriptada.
  - Implementará medidas de protección contra accesos no autorizados, como autenticación de dos factores (opcional).

- **RN04 - Compatibilidad multiplataforma:**
  - El sistema será accesible desde navegadores modernos (Chrome, Firefox, Edge) y dispositivos móviles (responsivo).

- **RN05 - Mantenimiento y escalabilidad:**
  - El sistema debe ser fácil de mantener, con un código modular y bien documentado.
  - Permitirá la adición de nuevas funcionalidades sin afectar las existentes.

---
