/**
 * Web Component para el formulario de registro
 */
class RegisterForm extends HTMLElement {
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
                <h2>Crear Cuenta</h2>
                
                <div id="error-message" class="error" style="display: none;"></div>
                
                <form id="register-form">
                    <div class="form-group">
                        <label for="name">Nombre completo</label>
                        <input type="text" id="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Correo electrónico</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" required minlength="6">
                    </div>
                    
                    <div class="form-group">
                        <label for="confirm-password">Confirmar contraseña</label>
                        <input type="password" id="confirm-password" required minlength="6">
                    </div>
                    
                    <div class="buttons">
                        <button type="submit" id="submit-btn">Registrarse</button>
                        <button type="button" class="secondary" id="login-btn">Ya tengo cuenta</button>
                    </div>
                </form>
            </div>
        `;
        
        // Agregar event listeners
        this.shadowRoot.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        this.shadowRoot.getElementById('login-btn').addEventListener('click', () => {
            window.router.navigate('/login');
        });
    }
    
    handleRegister() {
        const name = this.shadowRoot.getElementById('name').value;
        const email = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        const confirmPassword = this.shadowRoot.getElementById('confirm-password').value;
        const errorMessage = this.shadowRoot.getElementById('error-message');
        const submitBtn = this.shadowRoot.getElementById('submit-btn');
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Verificar si el correo ya está registrado
        if (window.appState.isUserRegistered(email)) {
            errorMessage.textContent = 'Este correo ya está registrado. Por favor, inicia sesión.';
            errorMessage.style.display = 'block';
            return;
        }
        
        // Mostrar estado de carga
        submitBtn.innerHTML = '<span class="loading"></span> Registrando...';
        submitBtn.disabled = true;
        
        // Registrar usuario
        window.appState.register({
            name,
            email,
            password
        }).then(() => {
            // Resetear el formulario
            this.shadowRoot.getElementById('register-form').reset();
            errorMessage.style.display = 'none';
            
            // Restaurar el botón
            submitBtn.innerHTML = 'Registrarse';
            submitBtn.disabled = false;
        });
    }
}

// Registrar el componente
customElements.define('register-form', RegisterForm);