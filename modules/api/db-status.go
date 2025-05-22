package api

import (
	"net/http"
	//"github.com/juan7/calificia/modules/middleware"
)

// DBStatusHandler maneja la solicitud para verificar el estado de la base de datos
func (s *Server) DBStatusHandler(w http.ResponseWriter, r *http.Request) {
	// Estructura para la respuesta
	type DBStatus struct {
		Connected bool     `json:"connected"`
		Version   string   `json:"version,omitempty"`
		Tables    []string `json:"tables,omitempty"`
		Error     string   `json:"error,omitempty"`
	}

	status := DBStatus{
		Connected: false,
	}

	// Puedes obtener información del usuario autenticado
	//UserID, _ := middleware.GetUserID(r)
	//UserName, _ := middleware.GetUserName(r)

	// Verificar la conexión
	if err := s.DB.DB.Ping(); err != nil {
		status.Error = "Error de conexión a la base de datos: " + err.Error()
		s.sendJSONResponse(w, status, http.StatusInternalServerError)
		return
	}

	status.Connected = true

	// Obtener versión de PostgreSQL
	var version string
	if err := s.DB.DB.QueryRow("SELECT version()").Scan(&version); err == nil {
		status.Version = version
	}

	// Obtener lista de tablas
	rows, err := s.DB.DB.Query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    `)
	if err == nil {
		defer rows.Close()

		tables := []string{}
		for rows.Next() {
			var tableName string
			if err := rows.Scan(&tableName); err == nil {
				tables = append(tables, tableName)
			}
		}
		status.Tables = tables
	}

	s.sendJSONResponse(w, status, http.StatusOK)
}
