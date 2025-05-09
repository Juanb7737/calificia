/**
 * Router simple para SPA
 * Gestiona la navegación entre diferentes vistas sin recargar la página
 */
class Router {
    constructor() {
        this.routes = {
            '': 'inicio',
            '/': 'inicio',
            '/login': 'login',
            '/register': 'register',
            '/auth-email': 'auth-email',
            '/main-view': 'main-view'
        };
        
        // Inicializar el router
        this.init();
    }
    
    init() {
        // Cargar la ruta inicial
        this.loadRoute();
        
        // Escuchar los cambios en el hash
        window.addEventListener('hashchange', () => this.loadRoute());
    }
    
    loadRoute() {
        // Obtener el hash actual (sin el símbolo #)
        const hash = window.location.hash.slice(1);
        
        // Obtener el id de la sección a mostrar
        const sectionId = this.routes[hash] || 'inicio';
        
        // Ocultar todas las rutas
        const allRoutes = document.querySelectorAll('.route');
        allRoutes.forEach(route => {
            route.classList.remove('active');
            route.classList.remove('fade-in');
        });
        
        // Mostrar la ruta actual
        const currentRoute = document.getElementById(sectionId);
        if (currentRoute) {
            currentRoute.classList.add('active');
            currentRoute.classList.add('fade-in');
            
            // Emitir un evento personalizado para la ruta
            const routeEvent = new CustomEvent('routeChanged', {
                detail: { route: sectionId }
            });
            document.dispatchEvent(routeEvent);
        }
    }
    
    navigate(path) {
        window.location.hash = path;
    }
}

// Inicializar el router
const router = new Router();

// Exportar la instancia del router para que pueda ser usada en otros módulos
window.router = router;