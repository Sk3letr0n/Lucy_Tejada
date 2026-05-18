package com.lucytejada.api.model;

import jakarta.persistence.*; // Importa las herramientas para conectar con bases de datos

@Entity // <-- LE DICE A SPRING: "Esto no es una clase común, es una tabla de base de datos"
@Table(name = "estudiantes") // <-- Configura el nombre físico de la tabla en SQL
public class Estudiante {

    @Id // <-- LE DICE A SPRING: "Este campo será la Llave Primaria (ID único)"
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- El ID se sumará solo (1, 2, 3...)
    private Long id;
    
    private String nombre;
    private String email;
    private String programa; // Almacenará si es de "Música", "Danza", etc.

    // CONSTRUCTOR VACÍO: Obligatorio para que Spring Boot pueda crear objetos desde la base de datos
    public Estudiante() {}

    // CONSTRUCTOR CON DATOS: Te sirve para crear estudiantes rápidamente en tu código
    public Estudiante(String nombre, String email, String programa) {
        this.nombre = nombre;
        this.email = email;
        this.programa = programa;
    }

    // GETTERS Y SETTERS: Funciones obligatorias para que Angular pueda leer (Get) o modificar (Set) las variables privadas superiores.
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPrograma() { return programa; }
    public void setPrograma(String programa) { this.programa = programa; }
}