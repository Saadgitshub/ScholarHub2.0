package com.example.demo.Teacher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    // Get all teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    // Get teacher by ID
    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        return optionalTeacher.map(ResponseEntity::ok)
                              .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new teacher
    @PostMapping
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    @PutMapping("/{id}")
public ResponseEntity<Teacher> updateTeacher(@PathVariable Long id, @RequestBody Teacher teacherDetails) {
    Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
    if (optionalTeacher.isPresent()) {
        Teacher teacher = optionalTeacher.get();
        teacher.setEmail(teacherDetails.getEmail());
        teacher.setPassword(teacherDetails.getPassword());
        teacher.setFirstname(teacherDetails.getFirstname());
        teacher.setLastname(teacherDetails.getLastname());
        // DO NOT set teacher.setPrograms(...) here
        return ResponseEntity.ok(teacherRepository.save(teacher));
    } else {
        return ResponseEntity.notFound().build();
    }
}


    // Delete a teacher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isPresent()) {
            teacherRepository.delete(optionalTeacher.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
