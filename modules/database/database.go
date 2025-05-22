package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq" // Driver de PostgreSQL
)

// Config contiene la configuración para conectarse a la base de datos
type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// Connection mantiene la conexión a la base de datos
type Connection struct {
	DB     *sql.DB
	Config Config
}

// NewConnection crea una nueva conexión a la base de datos con la configuración dada
func NewConnection(config Config) (*Connection, error) {
	// Valores predeterminados
	if config.Port == 0 {
		config.Port = 5432
	}

	if config.SSLMode == "" {
		config.SSLMode = "disable" // Cambia a "require" en producción
	}

	// Cadena de conexión
	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		config.Host, config.Port, config.User, config.Password, config.DBName, config.SSLMode,
	)

	// Abrir conexión
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("error al abrir conexión: %w", err)
	}

	// Configurar parámetros de conexión
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verificar conexión
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("error al conectar a la base de datos: %w", err)
	}

	return &Connection{
		DB:     db,
		Config: config,
	}, nil
}

// Close cierra la conexión a la base de datos
func (c *Connection) Close() error {
	return c.DB.Close()
}

// TestConnection prueba la conexión y muestra información de la base de datos
func (c *Connection) TestConnection() error {
	// Verificar conexión
	if err := c.DB.Ping(); err != nil {
		return err
	}

	// Obtener versión de PostgreSQL
	var version string
	if err := c.DB.QueryRow("SELECT version()").Scan(&version); err == nil {
		log.Printf("Versión de PostgreSQL: %s", version)
	}

	log.Println("Conexión exitosa a la base de datos")
	return nil
}
