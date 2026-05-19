package com.lucytejada.api.controller;

import com.lucytejada.api.model.Asistencia;
import com.lucytejada.api.repository.AsistenciaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AsistenciaController — CRUD de asistencia.
 *
 * GET    /api/asistencias                        → listar todas
 * GET    /api/asistencias/estudiante/{id}        → asistencias de un estudiante
 * POST   /api/asistencias                        → registrar asistencia
 * PUT    /api/asistencias/{id}                   → actualizar estado
 * DELETE /api/asistencias/{id}                   → eliminar registro
 */
@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaRepository asistenciaRepository;

    public AsistenciaController(AsistenciaRepository asistenciaRepository) {
        this.asistenciaRepository = asistenciaRepository;
    }

    @GetMapping
    public List<Asistencia> listar() {
        return asistenciaRepository.findAll();
    }

    @GetMapping("/estudiante/{estudianteId}")
    public List<Asistencia> porEstudiante(@PathVariable Long estudianteId) {
        return asistenciaRepository.findByEstudianteId(estudianteId);
    }

    @PostMapping
    public Asistencia registrar(@RequestBody Asistencia asistencia) {
        return asistenciaRepository.save(asistencia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asistencia> actualizar(@PathVariable Long id,
                                                  @RequestBody Asistencia datos) {
        return asistenciaRepository.findById(id)
                .map(existente -> {
                    existente.setFecha(datos.getFecha());
                    existente.setEstado(datos.getEstado());
                    existente.setMateria(datos.getMateria());
                    return ResponseEntity.ok(asistenciaRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!asistenciaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        asistenciaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
