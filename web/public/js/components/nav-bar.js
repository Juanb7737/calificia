/**
 * Web Component para la barra de navegación
 */
class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentUser = null;
    }
    
    connectedCallback() {
        // Renderizar el componente
        this.render();
        
        // Escuchar el evento de cambio de usuario
        document.addEventListener('userChanged', (e) => {
            this.currentUser = e.detail.user;
            this.render();
        });
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background-color: var(--primary-color, #6200ea);
                    color: white;
                }
                
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-decoration: none;
                    color: white;
                }
                
                ul {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                
                li {
                    margin-left: 1.5rem;
                }
                
                a {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    transition: opacity 0.3s ease;
                }
                
                a:hover {
                    opacity: 0.8;
                }
                
                .user-info {
                    display: flex;
                    align-items: center;
                }
                
                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: white;
                    margin-right: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: var(--primary-color, #6200ea);
                }
                
                .logout-btn {
                    background: none;
                    border: none;
                    color: white;
                    margin-left: 1rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .logout-btn:hover {
                    opacity: 1;
                    text-decoration: underline;
                }
            </style>
            
            <nav>
                <a href="#/" class="logo">Sistema de Exámenes</a>
                
                ${this.currentUser 
                    ? `
                        <div class="user-info">
                            <ul>
                                <li><a href="#/main-view">Inicio</a></li>
                                <li><a href="#/db-status">Estado DB</a></li>
                            </ul>
                            <div class="avatar">${this.getInitials(this.currentUser.name)}</div>
                            <span>${this.currentUser.name}</span>
                            <button class="logout-btn" id="logout-btn">Cerrar sesión</button>
                        </div>
                    `
                    : `
                        <ul>
                            <li><a href="#/login">Iniciar Sesión</a></li>
                            <li><a href="#/register">Registrarse</a></li>
                        </ul>
                    `
                }
            </nav>
        `;
        
        // Agregar event listener para el botón de cerrar sesión
        if (this.currentUser) {
            this.shadowRoot.getElementById('logout-btn').addEventListener('click', () => {
                window.appState.logout();
            });
        }
    }
    
    // Obtener las iniciales del nombre del usuario
    getInitials(name) {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
}

// Registrar el componente
customElements.define('nav-bar', NavBar);