package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"time"

	"github.com/Juanb7737/calificia/modules/database"
	"golang.org/x/crypto/bcrypt"
)

// User representa un usuario autenticado en el sistema
type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	UserType int    `json:"userType"` // 1: Profesor, 2: Estudiante
}

// Credenciales para el login
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthService maneja la autenticación de usuarios
type AuthService struct {
	DB *database.Connection
}

// NewAuthService crea un nuevo servicio de autenticación
func NewAuthService(db *database.Connection) *AuthService {
	return &AuthService{
		DB: db,
	}
}

// Register registra un nuevo usuario en el sistema
func (s *AuthService) Register(name, email, password string, userType int) (int, error) {
	// Verificar si el usuario ya existe
	var exists bool
	err := s.DB.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM cliente WHERE correo = $1)", email).Scan(&exists)
	if err != nil {
		return 0, err
	}

	if exists {
		return 0, errors.New("el correo electrónico ya está registrado")
	}

	// Hash de la contraseña
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return 0, err
	}

	// Insertar usuario en la base de datos
	var userID int
	err = s.DB.DB.QueryRow(
		"INSERT INTO cliente (correo, nombre, pass, tipoCuenta) VALUES ($1, $2, $3, $4) RETURNING id",
		email, name, hashedPassword, userType,
	).Scan(&userID)

	if err != nil {
		return 0, err
	}

	// Si el usuario es un profesor, insertarlo en la tabla PROFESOR
	if userType == 1 {
		_, err = s.DB.DB.Exec("INSERT INTO profesor (id_cliente) VALUES ($1)", userID)
		if err != nil {
			return 0, err
		}
	} else if userType == 2 {
		// Para estudiantes necesitaríamos un curso por defecto o uno proporcionado
		// Por ahora, asumimos que hay un curso con ID=1
		_, err = s.DB.DB.Exec("INSERT INTO estudiante (id_cliente, id_curso) VALUES ($1, 1)", userID)
		if err != nil {
			return 0, err
		}
	}

	return userID, nil
}

// Login verifica las credenciales del usuario y devuelve información si son correctas
func (s *AuthService) Login(email, password string) (*User, error) {
	var user User
	var hashedPassword string

	// Obtener información del usuario
	err := s.DB.DB.QueryRow(
		"SELECT id, correo, nombre, tipoCuenta, pass FROM cliente WHERE correo = $1",
		email,
	).Scan(&user.ID, &user.Email, &user.Name, &user.UserType, &hashedPassword)

	if err != nil {
		return nil, errors.New("usuario no encontrado")
	}

	// Verificar contraseña
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return nil, errors.New("contraseña incorrecta")
	}

	// Determinar rol
	if user.UserType == 1 {
		user.Role = "profesor"
	} else {
		user.Role = "estudiante"
	}

	return &user, nil
}

// GetUserByID obtiene un usuario por su ID
func (s *AuthService) GetUserByID(id int) (*User, error) {
	var user User

	err := s.DB.DB.QueryRow(
		"SELECT id, correo, nombre, tipoCuenta FROM cliente WHERE id = $1",
		id,
	).Scan(&user.ID, &user.Email, &user.Name, &user.UserType)

	if err != nil {
		return nil, err
	}

	// Determinar rol
	if user.UserType == 1 {
		user.Role = "profesor"
	} else {
		user.Role = "estudiante"
	}

	return &user, nil
}

// RefreshToken renueva el token de acceso del usuario
func (s *AuthService) RefreshToken(userID int, oldToken string) (string, error) {
	var token string

	// Verificar si el token antiguo es válido (no expirado y pertenece al usuario)
	err := s.DB.DB.QueryRow(
		`SELECT t.token
		FROM cliente c
		JOIN token t ON c.id = t.id_cliente
		WHERE c.id = $1 AND t.token = $2 AND t.expiraEn > $3`,
		userID, oldToken, time.Now(),
	).Scan(&token)

	if err != nil {
		return "", errors.New("token inválido o expirado")
	}

	// Generar un nuevo token
	newToken, err := generateToken(userID)
	if err != nil {
		return "", err
	}

	// Actualizar el token en la base de datos
	_, err = s.DB.DB.Exec(
		"UPDATE token SET token = $1, expiraEn = $2 WHERE id_cliente = $3",
		newToken, time.Now().Add(24*time.Hour), userID,
	)
	if err != nil {
		return "", err
	}

	return newToken, nil
}

// RevocarToken revoca el token de acceso del usuario
func (s *AuthService) RevocarToken(userID int) error {
	_, err := s.DB.DB.Exec(
		"DELETE FROM token WHERE id_cliente = $1",
		userID,
	)
	return err
}

// generateToken creates a new authentication token for a user
func generateToken(userID int) (string, error) {
	// Create a random token with 32 bytes of entropy
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	// Encode as base64
	token := base64.StdEncoding.EncodeToString(randomBytes)

	return token, nil
}
