package com.lucytejada.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Asistencia — Registro de asistencia de un estudiante a una clase.
 * Estado posible: "presente", "ausente", "tarde"
 */
@Entity
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long      estudianteId;
    private LocalDate fecha;
    private String    estado;  // "presente", "ausente", "tarde"
    private String    materia;

    public Asistencia() {}

    public Asistencia(Long estudianteId, LocalDate fecha, String estado, String materia) {
        this.estudianteId = estudianteId;
        this.fecha        = fecha;
        this.estado       = estado;
        this.materia      = materia;
    }

    public Long getId()                            { return id; }
    public void setId(Long id)                     { this.id = id; }
    public Long getEstudianteId()                  { return estudianteId; }
    public void setEstudianteId(Long id)           { this.estudianteId = id; }
    public LocalDate getFecha()                    { return fecha; }
    public void setFecha(LocalDate fecha)          { this.fecha = fecha; }
    public String getEstado()                      { return estado; }
    public void setEstado(String estado)           { this.estado = estado; }
    public String getMateria()                     { return materia; }
    public void setMateria(String materia)         { this.materia = materia; }
}
