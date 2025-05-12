package com.example.demo.Subject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.demo.Level.Level;
import com.example.demo.Level.LevelRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LevelRepository levelRepository;

    // DTO for input
    public static class SubjectInputDTO {
        private String name;
        private Long levelId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getLevelId() {
            return levelId;
        }

        public void setLevelId(Long levelId) {
            this.levelId = levelId;
        }
    }

    // Create a new Subject
    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody SubjectInputDTO input) {
        try {
            Subject subject = new Subject();
            subject.setName(input.getName());
            if (input.getLevelId() != null) {
                Level level = levelRepository.findById(input.getLevelId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid level ID: " + input.getLevelId()));
                subject.setLevel(level);
            }
            Subject savedSubject = subjectRepository.save(subject);
            return new ResponseEntity<>(savedSubject, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    private SubjectDTO convertToDTO(Subject subject) {
        String levelName = subject.getLevel() != null ? subject.getLevel().getName() : "N/A";
        return new SubjectDTO(subject.getId(), subject.getName(), levelName);
    }

    // Get all Subjects
    @GetMapping
    public List<SubjectDTO> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        List<SubjectDTO> subjectDTOs = new ArrayList<>();
        for (Subject subject : subjects) {
            subjectDTOs.add(convertToDTO(subject));
        }
        return subjectDTOs;
    }

    // Get Subject by ID
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            return new ResponseEntity<>(subject.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update Subject by ID
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody SubjectInputDTO input) {
        try {
            Optional<Subject> subjectOpt = subjectRepository.findById(id);
            if (subjectOpt.isPresent()) {
                Subject subject = subjectOpt.get();
                subject.setName(input.getName());
                if (input.getLevelId() != null) {
                    Level level = levelRepository.findById(input.getLevelId())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid level ID: " + input.getLevelId()));
                    subject.setLevel(level);
                } else {
                    subject.setLevel(null);
                }
                Subject savedSubject = subjectRepository.save(subject);
                return new ResponseEntity<>(savedSubject, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete Subject by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        if (subject.isPresent()) {
            subjectRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}