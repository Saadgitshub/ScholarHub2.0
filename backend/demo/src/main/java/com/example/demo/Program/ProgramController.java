package com.example.demo.Program;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    @Autowired
    private ProgramRepository programRepo;

    // Get all Programs
    @GetMapping
    public List<Program> getAllPrograms() {
        return programRepo.findAll();
    }

    // Get Program by ID
    @GetMapping("/{id}")
    public ResponseEntity<Program> getProgramById(@PathVariable Long id) {
        Optional<Program> program = programRepo.findById(id);
        return program.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new Program
    @PostMapping
    public ResponseEntity<Program> createProgram(@RequestBody Program program) {
        Program savedProgram = programRepo.save(program);
        return new ResponseEntity<>(savedProgram, HttpStatus.CREATED);
    }

    // Update a Program
    @PutMapping("/{id}")
    public ResponseEntity<Program> updateProgram(@PathVariable Long id, @RequestBody Program program) {
        if (!programRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        program.setId(id);
        Program updatedProgram = programRepo.save(program);
        return ResponseEntity.ok(updatedProgram);
    }

    // Delete a Program
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable Long id) {
        if (!programRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        programRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
