package com.lucytejada.api.dto;

/** Datos que el frontend envía al hacer login */
public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {}

    public String getEmail()              { return email; }
    public void setEmail(String email)    { this.email = email; }
    public String getPassword()           { return password; }
    public void setPassword(String pass)  { this.password = pass; }
}
