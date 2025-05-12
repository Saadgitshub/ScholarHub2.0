package com.example.demo.WorkReturn;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkReturnRepository extends JpaRepository<WorkReturn, Long> {
    // You can add custom query methods if needed
}
