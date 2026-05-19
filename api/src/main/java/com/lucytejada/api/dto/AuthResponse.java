package com.lucytejada.api.dto;

/** Respuesta que el servidor devuelve tras un login o registro exitoso */
public class AuthResponse {
    private String token;
    private Long   id;
    private String email;
    private String nombre;
    private String rol;

    public AuthResponse(String token, Long id, String email, String nombre, String rol) {
        this.token  = token;
        this.id     = id;
        this.email  = email;
        this.nombre = nombre;
        this.rol    = rol;
    }

    public String getToken()    { return token; }
    public Long   getId()       { return id; }
    public String getEmail()    { return email; }
    public String getNombre()   { return nombre; }
    public String getRol()      { return rol; }
}
