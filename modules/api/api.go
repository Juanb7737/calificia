package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/Juanb7737/calificia/modules/auth"
	"github.com/Juanb7737/calificia/modules/middleware"
	"github.com/golang-jwt/jwt"
)

// Configuración para JWT
var JWTKey = []byte("clave_secreta_muy_segura_para_jwt") // En producción usar variable de entorno

// RegisterRequest representa la solicitud de registro
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	UserType int    `json:"userType"` // 1: Profesor, 2: Estudiante
}

// LoginRequest representa la solicitud de login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse representa la respuesta de autenticación
type AuthResponse struct {
	Token string     `json:"token,omitempty"`
	User  *auth.User `json:"user,omitempty"`
	Error string     `json:"error,omitempty"`
}

// RegisterHandler maneja las solicitudes de registro
func (s *Server) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: "Error al leer la solicitud"}, http.StatusBadRequest)
		return
	}

	// Validar datos (puedes agregar más validaciones)
	if req.Name == "" || req.Email == "" || req.Password == "" {
		s.sendJSONResponse(w, AuthResponse{Error: "Todos los campos son obligatorios"}, http.StatusBadRequest)
		return
	}

	// Registrar usuario
	userID, err := s.AuthService.Register(req.Name, req.Email, req.Password, req.UserType)
	if err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: err.Error()}, http.StatusBadRequest)
		return
	}

	// Obtener el usuario creado
	user, err := s.AuthService.GetUserByID(userID)
	if err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: "Usuario registrado pero no se pudo obtener información"}, http.StatusInternalServerError)
		return
	}

	// Generar token JWT
	token, err := s.generateToken(user)
	if err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: "Error al generar el token"}, http.StatusInternalServerError)
		return
	}

	// Enviar respuesta
	s.sendJSONResponse(w, AuthResponse{
		Token: token,
		User:  user,
	}, http.StatusCreated)
}

// LoginHandler maneja las solicitudes de inicio de sesión
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: "Error al leer la solicitud"}, http.StatusBadRequest)
		return
	}

	// Validar credenciales
	user, err := s.AuthService.Login(req.Email, req.Password)
	if err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: err.Error()}, http.StatusUnauthorized)
		return
	}

	// Generar token JWT
	token, err := s.generateToken(user)
	if err != nil {
		s.sendJSONResponse(w, AuthResponse{Error: "Error al generar el token"}, http.StatusInternalServerError)
		return
	}

	// Enviar respuesta
	s.sendJSONResponse(w, AuthResponse{
		Token: token,
		User:  user,
	}, http.StatusOK)
}

// generateToken genera un token JWT para un usuario
func (s *Server) generateToken(user *auth.User) (string, error) {
	// Establecer tiempo de expiración (24 horas)
	expirationTime := time.Now().Add(24 * time.Hour)

	// Crear claims
	claims := &middleware.JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		Name:   user.Name,
		Role:   user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Crear token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar token
	tokenString, err := token.SignedString(JWTKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// sendJSONResponse envía una respuesta JSON al cliente
func (s *Server) sendJSONResponse(w http.ResponseWriter, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}
