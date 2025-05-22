package middleware

import (
	"context"
	"net/http"

	"github.com/golang-jwt/jwt"
)

// JWTConfig contiene la configuración para el middleware JWT
type JWTConfig struct {
	SigningKey    []byte
	SigningMethod jwt.SigningMethod
	TokenLookup   string // Formato: "header:Authorization,cookie:auth_token"
	TokenHeadName string // Por ejemplo: "Bearer"
	SendJSONFunc  func(w http.ResponseWriter, data interface{}, statusCode int)
}

// JWTClaims define los datos que se incluirán en el token JWT
type JWTClaims struct {
	UserID int    `json:"userId"`
	Email  string `json:"email"`
	Name   string `json:"name"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

// DefaultJWTConfig devuelve una configuración por defecto para JWT
func DefaultJWTConfig() JWTConfig {
	return JWTConfig{
		SigningMethod: jwt.SigningMethodHS256,
		TokenLookup:   "header:Authorization,cookie:auth_token",
		TokenHeadName: "Bearer",
	}
}

// JWTAuth crea un middleware para autenticación JWT con la configuración dada
func JWTAuth(config JWTConfig) Middleware {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			// Obtener token
			tokenStr := extractToken(r, config)
			if tokenStr == "" {
				sendUnauthorizedResponse(w, "No autorizado: token no proporcionado", config)
				return
			}

			// Parsear token
			claims := &JWTClaims{}
			token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
				// Validar método de firma
				if token.Method.Alg() != config.SigningMethod.Alg() {
					return nil, jwt.ErrSignatureInvalid
				}
				return config.SigningKey, nil
			})

			if err != nil || !token.Valid {
				sendUnauthorizedResponse(w, "No autorizado: token inválido", config)
				return
			}

			// Agregar información del usuario al contexto
			ctx := context.WithValue(r.Context(), "userId", claims.UserID)
			ctx = context.WithValue(ctx, "userEmail", claims.Email)
			ctx = context.WithValue(ctx, "userName", claims.Name)
			ctx = context.WithValue(ctx, "userRole", claims.Role)

			// Continuar con el siguiente handler
			next(w, r.WithContext(ctx))
		}
	}
}

// extractToken extrae el token JWT de la petición
func extractToken(r *http.Request, config JWTConfig) string {
	// Extraer de encabezado Authorization
	tokenStr := r.Header.Get("Authorization")
	if tokenStr != "" {
		// Si el token está en el encabezado, quitar el prefijo "Bearer "
		if len(tokenStr) > len(config.TokenHeadName)+1 && tokenStr[:len(config.TokenHeadName)] == config.TokenHeadName {
			return tokenStr[len(config.TokenHeadName)+1:]
		}
		return tokenStr
	}

	// Extraer de cookie
	cookie, err := r.Cookie("auth_token")
	if err == nil {
		return cookie.Value
	}

	return ""
}

// sendUnauthorizedResponse envía una respuesta de error de autorización
func sendUnauthorizedResponse(w http.ResponseWriter, message string, config JWTConfig) {
	if config.SendJSONFunc != nil {
		config.SendJSONFunc(w, map[string]string{"error": message}, http.StatusUnauthorized)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"` + message + `"}`))
	}
}

// GetUserID obtiene el ID del usuario del contexto
func GetUserID(r *http.Request) (int, bool) {
	userID, ok := r.Context().Value("userId").(int)
	return userID, ok
}

// GetUserEmail obtiene el email del usuario del contexto
func GetUserEmail(r *http.Request) (string, bool) {
	email, ok := r.Context().Value("userEmail").(string)
	return email, ok
}

// GetUserName obtiene el nombre del usuario del contexto
func GetUserName(r *http.Request) (string, bool) {
	name, ok := r.Context().Value("userName").(string)
	return name, ok
}

// GetUserRole obtiene el rol del usuario del contexto
func GetUserRole(r *http.Request) (string, bool) {
	role, ok := r.Context().Value("userRole").(string)
	return role, ok
}
