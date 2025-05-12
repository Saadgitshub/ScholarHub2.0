package com.example.demo.Authentication;

import com.example.demo.Admin.Admin;
import com.example.demo.Admin.AdminRepository;
import com.example.demo.Student.Student;
import com.example.demo.Student.StudentRepository;
import com.example.demo.Teacher.Teacher;
import com.example.demo.Teacher.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AdminRepository adminRepository;

   @PostMapping("/login")
@CrossOrigin(origins = "http://localhost:3000")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    String email = request.getEmail();
    String password = request.getPassword();

    // Check Student
    Optional<Student> student = studentRepository.findByEmail(email);
    if (student.isPresent()) {
        String dbPassword = student.get().getPassword();
        if (dbPassword != null && dbPassword.equals(password)) {
            return ResponseEntity.ok(
                new LoginResponse("student", student.get().getId(), student.get().getEmail())
            );
        }
    }

    // Check Teacher
    Optional<Teacher> teacher = teacherRepository.findByEmail(email);
    if (teacher.isPresent()) {
        String dbPassword = teacher.get().getPassword();
        if (dbPassword != null && dbPassword.equals(password)) {
            return ResponseEntity.ok(
                new LoginResponse("teacher", teacher.get().getId(), teacher.get().getEmail())
            );
        }
    }

    // Check Admin
    Optional<Admin> admin = adminRepository.findByEmail(email);
    if (admin.isPresent()) {
        String dbPassword = admin.get().getPassword();
        if (dbPassword != null && dbPassword.equals(password)) {
            return ResponseEntity.ok(
                new LoginResponse("admin", admin.get().getId(), admin.get().getEmail())
            );
        }
    }

    // If no match
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
}

}
