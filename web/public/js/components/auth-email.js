/**
 * Web Component para la verificación de correo electrónico
 */
class AuthEmail extends HTMLElement {
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
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                    text-align: center;
                }
                
                .icon {
                    font-size: 5rem;
                    color: var(--primary-color, #6200ea);
                    margin-bottom: 1.5rem;
                }
                
                h2 {
                    margin-bottom: 1rem;
                    color: var(--primary-dark, #3700b3);
                }
                
                p {
                    margin-bottom: 2rem;
                    color: var(--text-secondary, #666666);
                    line-height: 1.6;
                }
                
                .verify-btn {
                    display: inline-block;
                    padding: 0.75rem 1.5rem;
                    background-color: var(--primary-color, #6200ea);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s ease;
                    margin-top: 1rem;
                }
                
                .verify-btn:hover {
                    background-color: var(--primary-dark, #3700b3);
                }
                
                .login-link {
                    display: inline-block;
                    margin-top: 1.5rem;
                    color: var(--primary-color, #6200ea);
                    text-decoration: none;
                }
                
                .login-link:hover {
                    text-decoration: underline;
                }
            </style>
            
            <div class="card">
                <div class="icon">✉️</div>
                <h2>Verifica tu correo electrónico</h2>
                <p>
                    Hemos enviado un correo de verificación a tu dirección de correo electrónico.
                    Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar tu registro.
                </p>
                
                <!-- En una aplicación real, este botón enviaría un nuevo correo de verificación -->
                <button class="verify-btn" id="resend-btn">Reenviar correo de verificación</button>
                
                <!-- En esta simulación, este enlace permite al usuario "verificar" su cuenta -->
                <a href="#" id="verify-now-btn" class="verify-btn">Verificar ahora (Simulación)</a>
                
                <a href="#/login" class="login-link">Volver a iniciar sesión</a>
            </div>
        `;
        
        // Agregar event listeners
        this.shadowRoot.getElementById('resend-btn').addEventListener('click', () => {
            alert('Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.');
        });
        
        this.shadowRoot.getElementById('verify-now-btn').addEventListener('click', (e) => {
            e.preventDefault();
            alert('¡Cuenta verificada con éxito! Ahora puedes iniciar sesión.');
            window.router.navigate('/login');
        });
    }
}

// Registrar el componente
customElements.define('auth-email', AuthEmail);