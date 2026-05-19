package com.lucytejada.api.controller;

import com.lucytejada.api.dto.AuthResponse;
import com.lucytejada.api.dto.LoginRequest;
import com.lucytejada.api.dto.RegisterRequest;
import com.lucytejada.api.model.Usuario;
import com.lucytejada.api.repository.UsuarioRepository;
import com.lucytejada.api.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — Endpoints públicos de autenticación.
 *
 * POST /api/auth/login    → recibe email + password, devuelve JWT
 * POST /api/auth/register → crea un usuario nuevo, devuelve JWT
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil           jwtUtil;
    private final PasswordEncoder   passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil           = jwtUtil;
        this.passwordEncoder   = passwordEncoder;
    }

    /**
     * LOGIN
     * El frontend envía: { "email": "...", "password": "..." }
     * El servidor responde con el token JWT y los datos básicos del usuario.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return usuarioRepository.findByEmail(request.getEmail())
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .map(u -> {
                    String token = jwtUtil.generarToken(u.getEmail(), u.getRol());
                    return ResponseEntity.ok(
                            new AuthResponse(token, u.getId(), u.getEmail(), u.getNombre(), u.getRol()));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    /**
     * REGISTRO
     * El frontend envía: { "email": "...", "password": "...", "nombre": "...", "rol": "student" }
     * El servidor guarda el usuario con contraseña cifrada y devuelve el token.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El email ya está registrado");
        }

        String rol = (request.getRol() != null && !request.getRol().isBlank())
                ? request.getRol()
                : "student";

        Usuario nuevo = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()), // BCrypt, nunca texto plano
                request.getNombre(),
                rol
        );
        usuarioRepository.save(nuevo);

        String token = jwtUtil.generarToken(nuevo.getEmail(), nuevo.getRol());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, nuevo.getId(), nuevo.getEmail(), nuevo.getNombre(), nuevo.getRol()));
    }
}
