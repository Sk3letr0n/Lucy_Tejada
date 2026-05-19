package com.lucytejada.api.controller;

import com.lucytejada.api.model.Estudiante;
import com.lucytejada.api.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // <-- LE DICE A SPRING: "Esta clase publicará URLs en internet que devuelven JSON"
@RequestMapping("/api/estudiantes") // <-- La URL base para esta sección será http://localhost:8080/api/estudiantes
// CORS ya está configurado globalmente en SecurityConfig — no hace falta @CrossOrigin aquí
public class EstudianteController {

    @Autowired // <-- "Inyección de dependencias". Trae el Repositorio automáticamente sin hacer un 'new'
    private EstudianteRepository estudianteRepository;

    // 1. MÉTODO GET (Para listar)
    // Cuando Angular consulte por GET a http://localhost:8080/api/estudiantes, se activa esto:
    @GetMapping
    public List<Estudiante> listarEstudiantes() {
        return estudianteRepository.findAll(); // Llama al repositorio, saca todo de la BD y lo manda al Front como texto JSON
    }

    // 2. MÉTODO POST (Para guardar el formulario)
    // Cuando Angular envíe los datos de un formulario a http://localhost:8080/api/estudiantes, se activa esto:
    @PostMapping
    public Estudiante registrarEstudiante(@RequestBody Estudiante estudiante) {
        // @RequestBody agarra el JSON que mandó Angular y lo transforma mágicamente en un objeto Estudiante de Java
        return estudianteRepository.save(estudiante); // Lo guarda en la base de datos H2 y le responde a Angular "¡Guardado con éxito!"
    }
}