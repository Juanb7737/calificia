package api

import (
	"net/http"

	"github.com/Juanb7737/calificia/modules/auth"
	"github.com/Juanb7737/calificia/modules/database"
	"github.com/Juanb7737/calificia/modules/middleware"
)

// Server representa el servidor web de la API
type Server struct {
	DB          *database.Connection
	AuthService *auth.AuthService
	Router      *http.ServeMux
	JWTConfig   middleware.JWTConfig
}

// NewServer crea una nueva instancia del servidor
func NewServer(db *database.Connection) *Server {
	// Crear configuración JWT
	jwtConfig := middleware.DefaultJWTConfig()
	jwtConfig.SigningKey = JWTKey // Usar la clave de firma definida en api.go

	server := &Server{
		DB:          db,
		AuthService: auth.NewAuthService(db),
		Router:      http.NewServeMux(),
		JWTConfig:   jwtConfig,
	}

	// Configurar la función para enviar respuestas JSON
	server.JWTConfig.SendJSONFunc = server.sendJSONResponse

	server.setupRoutes()
	return server
}

// setupRoutes configura las rutas del servidor
func (s *Server) setupRoutes() {
	// Rutas públicas sin middleware de autenticación
	s.Router.HandleFunc("/api/register", s.RegisterHandler)
	s.Router.HandleFunc("/api/login", s.LoginHandler)

	// Rutas protegidas con middleware de autenticación
	s.Router.HandleFunc("/api/db-status", middleware.Chain(
		s.DBStatusHandler,
		middleware.CORS,
		middleware.JWTAuth(s.JWTConfig),
	))

	// Puedes añadir más rutas protegidas aquí
	// Por ejemplo:
	// s.Router.HandleFunc("/api/perfil", middleware.Chain(
	//     s.ProfileHandler,
	//     middleware.CORS,
	//     middleware.JWTAuth(s.JWTConfig),
	// ))

	// Servir archivos estáticos
	fs := http.FileServer(http.Dir("./web"))
	s.Router.Handle("/", fs)
}

// Start inicia el servidor en el puerto especificado
func (s *Server) Start(port string) error {
	return http.ListenAndServe(port, s.Router)
}
