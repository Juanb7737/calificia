// Package middleware contiene los middlewares utilizados por la aplicación
package middleware

import (
	"net/http"
)

// Middleware define un tipo de función para los middlewares
type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chain aplica una serie de middlewares a un handler
func Chain(handler http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	for _, m := range middlewares {
		handler = m(handler)
	}
	return handler
}

// Logger es un middleware que registra información sobre las solicitudes HTTP
func Logger(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Log de la petición
		// log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)

		// Llamar al siguiente handler
		next(w, r)
	}
}

// CORS es un middleware que maneja las cabeceras CORS
func CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Configurar cabeceras CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Manejar la solicitud OPTIONS del preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Llamar al siguiente handler
		next(w, r)
	}
}
