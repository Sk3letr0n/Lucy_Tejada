package com.lucytejada.api.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JwtUtil — Genera y valida los tokens JWT.
 * Cada token lleva el email del usuario y su rol, firmado con HMAC-SHA256.
 */
@Component
public class JwtUtil {

    // La clave viene de application.properties (jwt.secret)
    @Value("${jwt.secret}")
    private String secret;

    private static final long EXPIRACION_MS = 86_400_000L; // 24 horas

    // Construye la clave criptográfica a partir del texto en application.properties
    private SecretKey getClave() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Genera un token firmado para el usuario dado */
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRACION_MS))
                .signWith(getClave())
                .compact();
    }

    /** Extrae el email del token */
    public String extraerEmail(String token) {
        return obtenerClaims(token).getSubject();
    }

    /** Extrae el rol del token */
    public String extraerRol(String token) {
        return obtenerClaims(token).get("rol", String.class);
    }

    /** Devuelve true si el token está bien formado y no venció */
    public boolean esValido(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(getClave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
