/**
 * Web Component para mostrar el estado de la conexión a la base de datos
 */
class DbStatus extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isLoading = true;
        this.connectionStatus = null;
        this.dbDetails = null;
        this.error = null;
    }
    
    connectedCallback() {
        this.render();
        this.testConnection();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 1rem;
                }
                
                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: var(--primary-dark, #3700b3);
                }
                
                .card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                
                .status {
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 1.5rem;
                }
                
                .success {
                    background-color: rgba(76, 175, 80, 0.1);
                    color: var(--success, #4caf50);
                    border-left: 4px solid var(--success, #4caf50);
                }
                
                .error {
                    background-color: rgba(176, 0, 32, 0.1);
                    color: var(--error, #b00020);
                    border-left: 4px solid var(--error, #b00020);
                }
                
                .loading {
                    background-color: rgba(33, 150, 243, 0.1);
                    color: #2196f3;
                    border-left: 4px solid #2196f3;
                }
                
                .spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(33, 150, 243, 0.3);
                    border-radius: 50%;
                    border-top-color: #2196f3;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                button {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: var(--primary-color, #6200ea);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s ease;
                }
                
                button:hover {
                    background-color: var(--primary-dark, #3700b3);
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                
                table, th, td {
                    border: 1px solid #ddd;
                }
                
                th, td {
                    padding: 10px;
                    text-align: left;
                }
                
                th {
                    background-color: #f2f2f2;
                }
                
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
            </style>
            
            <div class="card">
                <h2>Estado de la Conexión a la Base de Datos</h2>
                
                ${this.renderStatus()}
                
                <button id="test-btn" ?disabled="${this.isLoading}">
                    ${this.isLoading ? '<span class="spinner"></span> Probando...' : 'Probar Conexión'}
                </button>
                
                ${this.connectionStatus && !this.error ? this.renderDetails() : ''}
            </div>
        `;
        
        // Agregar event listeners
        const testBtn = this.shadowRoot.getElementById('test-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testConnection());
        }
    }
    
    renderStatus() {
        if (this.isLoading) {
            return `<div class="status loading">
                <span class="spinner"></span> Verificando la conexión a la base de datos...
            </div>`;
        }
        
        if (this.error) {
            return `<div class="status error">
                ❌ Error: ${this.error}
            </div>`;
        }
        
        if (this.connectionStatus) {
            return `<div class="status success">
                ✅ Conexión exitosa a la base de datos.
            </div>`;
        }
        
        return '';
    }
    
    renderDetails() {
        if (!this.dbDetails) return '';
        
        return `
            <div>
                <h3>Detalles de la Base de Datos</h3>
                <p><strong>Versión:</strong> ${this.dbDetails.version || 'No disponible'}</p>
                
                <h3>Tablas Disponibles (${this.dbDetails.tables?.length || 0})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre de la Tabla</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderTableRows()}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderTableRows() {
        if (!this.dbDetails?.tables?.length) {
            return '<tr><td colspan="2">No se encontraron tablas</td></tr>';
        }
        
        return this.dbDetails.tables.map((table, index) => {
            return `<tr>
                <td>${index + 1}</td>
                <td>${table}</td>
            </tr>`;
        }).join('');
    }
    
    async testConnection() {
        this.isLoading = true;
        this.connectionStatus = null;
        this.dbDetails = null;
        this.error = null;
        this.render();
        
        try {
            // Obtener token de autenticación si está disponible
            const token = localStorage.getItem('auth_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
            const response = await fetch('/api/db-status', { headers });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al conectar con la base de datos');
            }
            
            this.connectionStatus = data.connected;
            
            if (data.connected) {
                this.dbDetails = {
                    version: data.version,
                    tables: data.tables
                };
            }
        } catch (error) {
            this.error = error.message;
        } finally {
            this.isLoading = false;
            this.render();
        }
    }
}

// Registrar el componente
customElements.define('db-status', DbStatus);

// Dentro del método render o template de tu nav-bar.js, añade un enlace al menú:
// <li><a href="#/db-status">Estado DB</a></li>