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
        // Simulación de inicio de sesión
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
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
        localStorage.removeItem('currentUser');
        
        // Emitir evento de cambio de usuario
        const event = new CustomEvent('userChanged', {
            detail: { user: null }
        });
        document.dispatchEvent(event);
        
        // Navegar a inicio
        window.router.navigate('/');
    },
    
    // Método para registrar un nuevo usuario
    register(userData) {
        // Simulación de registro (en una aplicación real, esto sería una llamada a la API)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Guardar usuario en localStorage (simulación de base de datos)
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                users.push(userData);
                localStorage.setItem('users', JSON.stringify(users));
                
                resolve(true);
                
                // Navegar a la página de verificación de correo
                window.router.navigate('/auth-email');
            }, 1000);
        });
    },
    
    // Verificar si un usuario está registrado
    isUserRegistered(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => user.email === email);
    },
    
    // Verificar credenciales
    verifyCredentials(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Iniciar sesión si las credenciales son correctas
            this.login(user);
            return true;
        }
        
        return false;
    },
    
    // Inicializar la aplicación
    init() {
        // Verificar si hay un usuario en localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            
            // Emitir evento de cambio de usuario
            const event = new CustomEvent('userChanged', {
                detail: { user: this.currentUser }
            });
            document.dispatchEvent(event);
        }
        
        // Escuchar el evento de cambio de ruta
        document.addEventListener('routeChanged', (e) => {
            const { route } = e.detail;
            
            // Rutas protegidas que requieren autenticación
            if (route === 'main-view' && !this.currentUser) {
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