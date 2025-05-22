/**
 * Web Component para el formulario de inicio de sesión
 */
class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isLoading = false;
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                
                h2 {
                    text-align: center;
                    margin-bottom: 2rem;
                    color: var(--primary-dark, #3700b3);
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                
                input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                
                input:focus {
                    outline: none;
                    border-color: var(--primary-color, #6200ea);
                    box-shadow: 0 0 0 2px rgba(98, 0, 234, 0.2);
                }
                
                .buttons {
                    display: flex;
                    gap: 1rem;
                }
                
                button {
                    flex: 1;
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
                
                button.secondary {
                    background-color: transparent;
                    border: 1px solid var(--primary-color, #6200ea);
                    color: var(--primary-color, #6200ea);
                }
                
                button.secondary:hover {
                    background-color: rgba(98, 0, 234, 0.1);
                }
                
                .error {
                    color: var(--error, #b00020);
                    padding: 1rem;
                    background-color: rgba(176, 0, 32, 0.1);
                    border-left: 4px solid var(--error, #b00020);
                    margin-bottom: 1rem;
                }

                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255,255,255,.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            
            <div class="card">
                <h2>Iniciar Sesión</h2>
                
                <div id="error-message" class="error" style="display: none;"></div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Correo electrónico</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" required>
                    </div>
                    
                    <div class="buttons">
                        <button type="submit" id="login-btn">${this.isLoading ? '<span class="loading"></span> Iniciando sesión...' : 'Iniciar Sesión'}</button>
                        <button type="button" class="secondary" id="register-btn">Registrarse</button>
                    </div>
                </form>
            </div>
        `;
        
        // Agregar event listeners
        this.shadowRoot.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        this.shadowRoot.getElementById('register-btn').addEventListener('click', () => {
            window.router.navigate('/register');
        });
    }
    
    async handleLogin() {
        if (this.isLoading) return;
        
        const email = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        const errorMessage = this.shadowRoot.getElementById('error-message');
        
        // Mostrar estado de carga
        this.isLoading = true;
        this.render();
        
        try {
            // Hacer solicitud a la API
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }
            
            // Guardar token en localStorage
            localStorage.setItem('auth_token', data.token);
            
            // Iniciar sesión en el estado global
            window.appState.login(data.user);
            
            // Resetear el formulario
            this.shadowRoot.getElementById('login-form').reset();
            errorMessage.style.display = 'none';
            
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            this.isLoading = false;
            this.render();
        }
    }
}

// Registrar el componente
customElements.define('login-form', LoginForm);