# Modelado de Clases Y POO

**breve descripción**

<!--- 
Representa la estructura estática del sistema, mostrando las clases principales:

Usuario: Clase padre para Profesor y Estudiante
Profesor: Puede crear y calificar exámenes
Estudiante: Puede realizar exámenes y ver calificaciones
Examen: Contiene la estructura del examen y métodos para generación y evaluación
Pregunta: Representa los diferentes tipos de preguntas
Grupo: Permite agrupar estudiantes
Calificación: Almacena las notas y resultados
AnalizadorIA: Procesa documentos PDF para generar preguntas 
--->

## Diagramas de clase

### Diagrama de calse Sistema CalficIA

![Diagrama de Clases Sistema Calificia](diagrams/class/ClassDiagram-SistemaCalificia.svg)

## Implementación de *structs* en Go

### Autenticación

**`modules/auth/auth.go`**
````go
package auth

````

### Cliente

**`modules/cliente/cliente.go`**
````go
package Cliente

type Cliente struct {
	id         int
	Correo     string
	nombre     string
	Pass       string
	tipoCuenta string
}
````

### Curso

**`modules/curso/curso.go`**
````go
package curso

type Curso struct {
	id             int
	nombre         string
	nivelEducativo string
}
````

### Documento

**`modules/documento/documento.go`**
````go
package documento

type Documento struct {
	id                int
	texto             string
	tipoPregunta      string
	opciones          string
	respuestaCorrecta string
	puntaje           float32
}
````

### Estudiante

**`modules/estudiantes/estudiantes.go`**
````go
package estudiante
````

### Examen

**`modules/examen/examen.go`**
````go
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
````

### Gestor de Calificaciones

**`modules/gestorCalificaciones/gestorCalificaciones.go`**
````go
package gestorcalificaciones

````

### Grupo

**`modules/grupo/grupo.go`**
````go
package grupo

type Grupo struct {
	id          int
	nombre      string
	estudiantes []string
}
````

### IA

**`modules/ia/ia.go`**
````go
package ia
````

### Pregunta

**`modules/pregunta/pregunta.go`**
````go
package pregunta

type Pregunta struct {
	id                int
	texto             string
	tipoPregunta      []string
	opciones          []string
	respuestaCorrecta string
	puntaje           float32
}
````

### Profesor

**`modules/profesor/profesor.go`**
````go
package profesor
````

### Resultado

**`modules/resultado/resultado.go`**
````go
package resultado

import "time"

type Resultado struct {
	id               int
	calificacion     float32
	fechaRealizacion time.Time
}
````
