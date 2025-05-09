/**
 * Web Component para la vista principal del sistema
 * Esta es la vista que se muestra cuando el usuario inicia sesión
 */
class MainView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.user = window.appState?.currentUser || null;
    }
    
    connectedCallback() {
        // Escuchar el evento de cambio de usuario
        document.addEventListener('userChanged', (e) => {
            this.user = e.detail.user;
            this.render();
        });
        
        this.render();
    }
    
    render() {
        // Si no hay usuario autenticado, redirigir a login
        if (!this.user) {
            window.router.navigate('/login');
            return;
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    padding: 1rem;
                }
                
                .dashboard {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                h1 {
                    margin-bottom: 2rem;
                    color: var(--primary-dark, #3700b3);
                }
                
                .welcome-card {
                    background-color: var(--primary-color, #6200ea);
                    color: white;
                    border-radius: 8px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .welcome-card h2 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: white;
                }
                
                .welcome-card p {
                    margin-bottom: 0;
                    opacity: 0.9;
                }
                
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .card {
                    background-color: white;
                    border-radius: 8px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .card h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: var(--primary-dark, #3700b3);
                }
                
                .card p {
                    margin-bottom: 1rem;
                    color: var(--text-secondary, #666666);
                }
                
                .card-icon {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: var(--primary-color, #6200ea);
                }
                
                .action-btn {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background-color: var(--primary-color, #6200ea);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background-color 0.3s ease;
                    text-decoration: none;
                }
                
                .action-btn:hover {
                    background-color: var(--primary-dark, #3700b3);
                }
            </style>
            
            <div class="dashboard">
                <div class="welcome-card">
                    <h2>¡Bienvenido, ${this.user.name}!</h2>
                    <p>Este es el panel principal del Sistema de Gestión de Exámenes.</p>
                </div>
                
                <h1>Funcionalidades</h1>
                
                <div class="cards-grid">
                    <!-- Tarjeta para Generar Exámenes -->
                    <div class="card" id="create-exam-card">
                        <div class="card-icon">📝</div>
                        <h3>Generar Exámenes</h3>
                        <p>Crea exámenes con IA a partir de documentos PDF, seleccionando nivel educativo y tipos de preguntas.</p>
                        <button class="action-btn">Crear examen</button>
                    </div>
                    
                    <!-- Tarjeta para Gestionar Calificaciones -->
                    <div class="card" id="manage-grades-card">
                        <div class="card-icon">📊</div>
                        <h3>Gestionar Calificaciones</h3>
                        <p>Evalúa automáticamente preguntas cerradas y califica manualmente las preguntas abiertas.</p>
                        <button class="action-btn">Ver calificaciones</button>
                    </div>
                    
                    <!-- Tarjeta para Visualizar Resultados -->
                    <div class="card" id="view-results-card">
                        <div class="card-icon">📈</div>
                        <h3>Visualizar Resultados</h3>
                        <p>Consulta notas individuales, promedios acumulativos y genera reportes de rendimiento.</p>
                        <button class="action-btn">Ver resultados</button>
                    </div>
                    
                    <!-- Tarjeta para Gestionar Grupos -->
                    <div class="card" id="manage-groups-card">
                        <div class="card-icon">👥</div>
                        <h3>Gestionar Grupos</h3>
                        <p>Crea y administra grupos de estudiantes, asigna exámenes y gestiona permisos de acceso.</p>
                        <button class="action-btn">Administrar grupos</button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar event listeners para las tarjetas
        this.addCardListeners();
    }
    
    addCardListeners() {
        // En una aplicación real, estos botones navegarían a las respectivas vistas
        // Por ahora, mostraremos un mensaje indicando que la funcionalidad está en desarrollo
        const cards = this.shadowRoot.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                alert('Esta funcionalidad está en desarrollo. Próximamente disponible.');
            });
        });
    }
}

// Registrar el componente
customElements.define('main-view', MainView);