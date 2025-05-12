package com.example.demo.Assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findById(Long id);
    List<Assignment> findByGroupId(Long groupId);
}