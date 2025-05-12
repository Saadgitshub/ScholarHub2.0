package com.example.demo.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/levels")
public class LevelController {

    @Autowired
    private LevelRepository levelRepository;

    // Create a new Level
    @PostMapping
    public ResponseEntity<Level> createLevel(@RequestBody Level level) {
        Level savedLevel = levelRepository.save(level);
        return new ResponseEntity<>(savedLevel, HttpStatus.CREATED);
    }

    // Get all Levels
    @GetMapping
    public List<Level> getAllLevels() {
        return levelRepository.findAll();
    }

    // Get Level by ID
    @GetMapping("/{id}")
    public ResponseEntity<Level> getLevelById(@PathVariable Long id) {
        Optional<Level> level = levelRepository.findById(id);
        if (level.isPresent()) {
            return new ResponseEntity<>(level.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update Level by ID
    @PutMapping("/{id}")
    public ResponseEntity<Level> updateLevel(@PathVariable Long id, @RequestBody Level updatedLevel) {
        Optional<Level> level = levelRepository.findById(id);
        if (level.isPresent()) {
            updatedLevel.setId(id); // Set the ID to ensure the correct level is updated
            Level savedLevel = levelRepository.save(updatedLevel);
            return new ResponseEntity<>(savedLevel, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete Level by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        Optional<Level> level = levelRepository.findById(id);
        if (level.isPresent()) {
            levelRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
