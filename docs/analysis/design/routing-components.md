# Sistema de Gestión de Exámenes

## Descripción del Proyecto
Este proyecto implementa una aplicación web para la generación y gestión de exámenes, utilizando arquitecturas web modernas y Web Components nativos. La aplicación permite a los usuarios crear exámenes a partir de documentos PDF, gestionar calificaciones, visualizar resultados y administrar grupos de estudiantes.

## Tecnologías Utilizadas
- HTML5, CSS3 y JavaScript vanilla
- Web Components nativos (Custom Elements, Shadow DOM)
- Arquitectura SPA (Single-Page Application)
- Ruteo del lado del cliente mediante manipulación del hash
- Almacenamiento local con localStorage (simulando una base de datos)

## Conceptos Implementados

### Arquitecturas Web Modernas
- **SPA (Single-Page Application)**: La aplicación carga una sola página HTML y actualiza el contenido dinámicamente sin necesidad de recargar la página completa.
- **Web Components**: Componentes reutilizables encapsulados con Shadow DOM.
- **Client-Side Routing**: Sistema de ruteo basado en el cliente que utiliza el hash para navegar entre diferentes vistas.

### Web Components
- **Custom Elements**: Se han creado elementos HTML personalizados como `<login-form>`, `<register-form>`, `<auth-email>`, `<main-view>` y `<nav-bar>`.
- **Shadow DOM**: Encapsula el estilo y la estructura de cada componente para evitar conflictos.
- **Ciclo de vida**: Utilización de métodos como `constructor()`, `connectedCallback()` y `disconnectedCallback()`.

## Estructura del Proyecto

```
web/
├── public/
│   ├── css/
│   │   ├── styles.css               # Estilos globales
│   │   └── router.css               # Estilos para el enrutador
│   └── js/
│       ├── components/
│       │    ├── login-form.js            # Componente de inicio de sesión
│       │    ├── register-form.js         # Componente de registro
│       │    ├── auth-email.js            # Componente de verificación de correo
│       │    ├── main-view.js             # Vista principal de la aplicación
│       │    └── nav-bar.js               # Barra de navegación
│       ├── router.js                # Sistema de ruteo
│       └── app.js                   # Lógica principal de la aplicación
└── index.html                   # Punto de entrada de la aplicación     

```

## Flujo de la Aplicación

1. **Inicio**: El usuario ingresa a la aplicación y se muestra la pantalla de bienvenida.
2. **Autenticación**: El usuario puede iniciar sesión o registrarse.
   - Si el usuario se registra, se le redirige a la página de verificación de correo.
   - Si el usuario inicia sesión correctamente, se le redirige a la vista principal.
3. **Vista Principal**: Muestra las diferentes funcionalidades disponibles para el usuario:
   - Generación de exámenes
   - Gestión de calificaciones
   - Visualización de resultados
   - Administración de grupos

## Funcionalidades Implementadas

- **Autenticación de Usuarios**: Registro e inicio de sesión de usuarios.
- **Verificación de Correo**: Simulación de verificación de correo electrónico.
- **Navegación entre Vistas**: Sistema de ruteo para navegar entre diferentes secciones.
- **Panel Principal**: Visualización de las principales funcionalidades.

## Cómo Usar la Aplicación

1. **Iniciar la Aplicación**: Abrir el archivo `index.html` en un navegador moderno.
2. **Registrarse**: Crear una cuenta con nombre, correo electrónico y contraseña.
3. **Verificar Correo**: Simular la verificación de correo electrónico.
4. **Iniciar Sesión**: Ingresar con el correo electrónico y contraseña registrados.
5. **Explorar el Panel**: Acceder a las diferentes funcionalidades disponibles.

## Próximos Pasos

- Implementar la funcionalidad de generación de exámenes con IA.
- Desarrollar el sistema de calificación automática y manual.
- Crear un sistema de reportes y visualización de resultados.
- Implementar la gestión de grupos y estudiantes.
- Integrar con un backend real para almacenamiento persistente.

## Consideraciones Técnicas

- La aplicación utiliza localStorage para simular una base de datos, lo que significa que los datos se almacenan localmente en el navegador del usuario.
- El sistema de ruteo es básico y utiliza el hash (#) para navegar entre diferentes vistas.
- La autenticación es simulada y no incluye características de seguridad robustas que serían necesarias en un entorno de producción.