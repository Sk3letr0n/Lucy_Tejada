package com.lucytejada.api;

import com.lucytejada.api.model.Usuario;
import com.lucytejada.api.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer — Crea los usuarios de demo al arrancar la aplicación.
 *
 * Solo los crea si no existen todavía (idempotente).
 * Contraseña de todos: "password"
 *
 *   juan@example.com    → Alumno
 *   maria@example.com   → Alumno
 *   carlos@example.com  → Docente
 *   laura@example.com   → Docente
 *   admin@example.com   → Administrador
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crear("juan@example.com",    "Juan Pérez",         "student");
        crear("maria@example.com",   "María García",       "student");
        crear("carlos@example.com",  "Ricardo Arbeláez",   "teacher");
        crear("laura@example.com",   "Elena Valencia",     "teacher");
        crear("admin@example.com",   "Administrador",      "admin");
    }

    private void crear(String email, String nombre, String rol) {
        if (usuarioRepository.findByEmail(email).isEmpty()) {
            usuarioRepository.save(
                new Usuario(email, passwordEncoder.encode("password"), nombre, rol)
            );
            System.out.println("✅ Usuario demo creado: " + email + " (" + rol + ")");
        }
    }
}
