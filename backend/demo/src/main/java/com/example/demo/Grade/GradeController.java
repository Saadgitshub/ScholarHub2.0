package com.example.demo.Grade;

import com.example.demo.Assignment.Assignment;
import com.example.demo.Assignment.AssignmentRepository;
import com.example.demo.Student.Student;
import com.example.demo.Student.StudentRepository;
import com.example.demo.Subject.Subject;
import com.example.demo.Subject.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    // Get all grades
    @GetMapping
    public List<Grade> getAllGrades() {
        List<Grade> grades = gradeRepository.findAll();
        System.out.println("Grades returned: " + grades.size());
        return grades;
    }

    // Get a specific grade by ID
    @GetMapping("/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        Optional<Grade> grade = gradeRepository.findById(id);
        return grade.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new grade
    @PostMapping
    public ResponseEntity<Grade> createGrade(@RequestBody GradeDTO gradeDTO) {
        // Convert DTO to entity and save it
        Grade grade = new Grade();
        grade.setScore(gradeDTO.getScore());

        // Fetch and set relationships
        Student student = studentRepository.findById(gradeDTO.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        grade.setStudent(student);

        Subject subject = subjectRepository.findById(gradeDTO.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        grade.setSubject(subject);

        Assignment assignment = assignmentRepository.findById(gradeDTO.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        grade.setAssignment(assignment);

        // Save the grade to the database
        gradeRepository.save(grade);

        return ResponseEntity.ok(grade);  // Return the saved grade
    }

    // Update an existing grade
    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody GradeDTO gradeDTO) {
        if (!gradeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Fetch the existing grade
        Optional<Grade> existingGrade = gradeRepository.findById(id);
        if (existingGrade.isPresent()) {
            Grade grade = existingGrade.get();
            grade.setScore(gradeDTO.getScore());

            // Fetch and set relationships
            Student student = studentRepository.findById(gradeDTO.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            grade.setStudent(student);

            Subject subject = subjectRepository.findById(gradeDTO.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
            grade.setSubject(subject);

            Assignment assignment = assignmentRepository.findById(gradeDTO.getAssignmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
            grade.setAssignment(assignment);

            gradeRepository.save(grade);  // Save the updated grade
            return ResponseEntity.ok(grade);
        }

        return ResponseEntity.notFound().build();
    }

    // Delete a grade
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        if (!gradeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        gradeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
