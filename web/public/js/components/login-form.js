/**
 * Web Component para el formulario de inicio de sesión
 */
class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
                        <button type="submit">Iniciar Sesión</button>
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
    
    handleLogin() {
        const email = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        const errorMessage = this.shadowRoot.getElementById('error-message');
        
        // Verificar si el usuario está registrado
        if (!window.appState.isUserRegistered(email)) {
            errorMessage.textContent = 'Este correo no está registrado. Por favor, regístrate primero.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Verificar credenciales
        const success = window.appState.verifyCredentials(email, password);
        
        if (!success) {
            errorMessage.textContent = 'Correo o contraseña incorrectos. Por favor, intenta de nuevo.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Resetear el formulario
        this.shadowRoot.getElementById('login-form').reset();
        errorMessage.style.display = 'none';
    }
}

// Registrar el componente
customElements.define('login-form', LoginForm);