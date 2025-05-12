package com.example.demo.Student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByEmail(String email);
    Student findByEmailAndPassword(String email, String password); // for testing login
    
    Optional<Student> findByEmail(String email);

}
