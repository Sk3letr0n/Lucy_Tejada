package com.lucytejada.api.repository;

import com.lucytejada.api.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // <-- LE DICE A SPRING: "Esta clase se encarga de hablar con la base de datos"
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    // ¡Ojo! Está vacía a propósito.
    // Al heredar (extends) de JpaRepository<Estudiante, Long>, heredamos gratis métodos como:
    // .save() -> Para guardar o actualizar
    // .findAll() -> Para listar todo
    // .findById() -> Para buscar por ID
    // .deleteById() -> Para borrar
}