package com.example.demo.Teacher;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    boolean existsByEmail(String email);
    Teacher findByEmailAndPassword(String email, String password); // For login or testing
    
    Optional<Teacher> findByEmail(String email);

}
