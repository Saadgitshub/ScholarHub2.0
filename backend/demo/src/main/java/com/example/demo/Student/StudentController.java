package com.example.demo.Student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.Group.*;
import com.example.demo.Level.*;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private LevelRepository levelRepository;




    // Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        return optionalStudent.map(ResponseEntity::ok)
                              .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new student
    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody StudentDTO dto) {
    Optional<Group> groupOpt = groupRepository.findById(dto.groupId);
    Optional<Level> levelOpt = levelRepository.findById(dto.levelId);

    if (groupOpt.isEmpty() || levelOpt.isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    Student student = new Student(
        dto.email,
        dto.password,
        dto.firstname,
        dto.lastname,
        levelOpt.get(),
        groupOpt.get()
    );

    Student savedStudent = studentRepository.save(student);
    return ResponseEntity.ok(savedStudent);
    }


  @PutMapping("/{id}")
public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody StudentDTO dto) {
    Optional<Student> optionalStudent = studentRepository.findById(id);
    if (optionalStudent.isPresent()) {
        Student student = optionalStudent.get();
        student.setEmail(dto.email);
        student.setPassword(dto.password);
        student.setFirstname(dto.firstname);
        student.setLastname(dto.lastname);

        // Get and set Group
        groupRepository.findById(dto.groupId).ifPresent(student::setGroup);

        // Get and set Level
        levelRepository.findById(dto.levelId).ifPresent(student::setLevel);

        return ResponseEntity.ok(studentRepository.save(student));
    } else {
        return ResponseEntity.notFound().build();
    }
}


    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            studentRepository.delete(optionalStudent.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
     @GetMapping("/{studentId}/group")
    public ResponseEntity<Map<String, Long>> getStudentGroupId(@PathVariable Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            Group group = student.getGroup();
            if (group != null) {
                return ResponseEntity.ok(Map.of("groupId", group.getId()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
