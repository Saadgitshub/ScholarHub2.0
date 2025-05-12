package com.example.demo.Program;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    // You can add custom queries if necessary, e.g., find programs by teacher or group
}
