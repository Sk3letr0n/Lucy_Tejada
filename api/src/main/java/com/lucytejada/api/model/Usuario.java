package com.lucytejada.api.model;

import jakarta.persistence.*;

/**
 * Usuario — Tabla de usuarios del sistema.
 * Roles posibles: "student", "teacher", "admin"
 * La contraseña se guarda SIEMPRE cifrada con BCrypt (nunca en texto plano).
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash; // Cifrada con BCrypt

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String rol; // "student", "teacher", "admin"

    public Usuario() {}

    public Usuario(String email, String passwordHash, String nombre, String rol) {
        this.email        = email;
        this.passwordHash = passwordHash;
        this.nombre       = nombre;
        this.rol          = rol;
    }

    public Long getId()                        { return id; }
    public void setId(Long id)                 { this.id = id; }
    public String getEmail()                   { return email; }
    public void setEmail(String email)         { this.email = email; }
    public String getPasswordHash()            { return passwordHash; }
    public void setPasswordHash(String hash)   { this.passwordHash = hash; }
    public String getNombre()                  { return nombre; }
    public void setNombre(String nombre)       { this.nombre = nombre; }
    public String getRol()                     { return rol; }
    public void setRol(String rol)             { this.rol = rol; }
}
