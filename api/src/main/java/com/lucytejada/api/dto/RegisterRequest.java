package com.lucytejada.api.dto;

/** Datos que el frontend envía al registrar un usuario nuevo */
public class RegisterRequest {
    private String email;
    private String password;
    private String nombre;
    private String rol; // opcional; si no llega, se asigna "student" por defecto

    public RegisterRequest() {}

    public String getEmail()              { return email; }
    public void setEmail(String email)    { this.email = email; }
    public String getPassword()           { return password; }
    public void setPassword(String pass)  { this.password = pass; }
    public String getNombre()             { return nombre; }
    public void setNombre(String nombre)  { this.nombre = nombre; }
    public String getRol()                { return rol; }
    public void setRol(String rol)        { this.rol = rol; }
}
