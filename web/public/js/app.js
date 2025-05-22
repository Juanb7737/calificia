/**
 * Archivo principal de la aplicación
 * Inicializa los componentes y gestiona el estado global
 */

// Estado global de la aplicación
const appState = {
    // Usuario actual
    currentUser: null,
    
    // Método para iniciar sesión
    login(userData) {
        this.currentUser = userData;
        
        // Emitir evento de cambio de usuario
        const event = new CustomEvent('userChanged', {
            detail: { user: userData }
        });
        document.dispatchEvent(event);
        
        // Navegar a la vista principal
        window.router.navigate('/main-view');
        
        return true;
    },
    
    // Método para cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        
        // Emitir evento de cambio de usuario
        const event = new CustomEvent('userChanged', {
            detail: { user: null }
        });
        document.dispatchEvent(event);
        
        // Navegar a inicio
        window.router.navigate('/');
    },
    
    // Verificar sesión actual con el token almacenado
    async verifySession() {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        
        try {
            // Aquí podrías hacer una petición al servidor para verificar el token
            // Por ahora, asumiremos que el token es válido
            // En una implementación real, verificarías el token con el servidor
            
            // Para implementación real:
            /*
            const response = await fetch('/api/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Token inválido');
            }
            
            const data = await response.json();
            this.login(data.user);
            */
            
            return !!this.currentUser;
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            this.logout();
            return false;
        }
    },
    
    // Inicializar la aplicación
    async init() {
        // Verificar si hay un token almacenado
        await this.verifySession();
        
        // Escuchar el evento de cambio de ruta
        document.addEventListener('routeChanged', (e) => {
            const { route } = e.detail;
            
            // Rutas protegidas que requieren autenticación
            if ((route === 'main-view' || route === 'db-status') && !this.currentUser) {
                window.router.navigate('/login');
            }
        });
    }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    appState.init();
});

// Exportar el estado global para que pueda ser usado en otros módulos
window.appState = appState;