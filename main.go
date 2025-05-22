package main

import (
	"log"
	"os"

	"github.com/Juanb7737/calificia/modules/api"
	"github.com/Juanb7737/calificia/modules/database"
)

func main() {
	// Configuración de la base de datos
	config := database.Config{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     5432, // Puerto por defecto
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "1"), // Cambia esto
		DBName:   getEnv("DB_NAME", "calificiadb"),
		SSLMode:  "disable", // Usar "require" en producción
	}

	// Inicializar conexión a la base de datos
	db, err := database.NewConnection(config)
	if err != nil {
		log.Fatalf("Error al conectar a la base de datos: %v", err)
	}
	defer db.Close()

	log.Println("✅ Conexión establecida con la base de datos PostgreSQL")

	// Crear servidor web
	server := api.NewServer(db)

	// Iniciar servidor
	port := getEnv("PORT", ":8080")
	if port[0] != ':' {
		port = ":" + port
	}

	log.Printf("Servidor iniciado en http://localhost%s", port)
	log.Fatal(server.Start(port))
}

// getEnv retorna el valor de la variable de entorno o un valor por defecto
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
