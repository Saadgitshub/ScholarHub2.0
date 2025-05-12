package com.example.demo.Subject;

import com.example.demo.Level.Level;
import com.example.demo.Grade.Grade;
import com.example.demo.Assignment.Assignment;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "subjects")
@JsonIgnoreProperties({"teachers", "grades", "assignments", "level"}) // Avoid recursion
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne// Ensure this is set to EAGER to fetch the level data
    @JoinColumn(name = "level_id")
    @JsonIgnoreProperties({"subjects", "groups", "students"})
    private Level level;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("subject")
    private List<Grade> grades;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("subject")
    private List<Assignment> assignments;
    public Subject() {}

    public Subject(String name, Level level) {
        this.name = name;
        this.level = level;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id; 
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }
}
