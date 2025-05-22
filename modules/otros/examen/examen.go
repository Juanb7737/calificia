package examen

import (
	"time"
)

type Examen struct {
	id             int
	fechaCreacion  time.Time
	nivelEducativo string
	objetivos      []string
	preguntas      []string
}
