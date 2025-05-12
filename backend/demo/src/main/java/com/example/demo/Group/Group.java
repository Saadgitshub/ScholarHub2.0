package com.example.demo.Group;

import com.example.demo.Student.Student;
import com.example.demo.Level.Level;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "level_id")
    @JsonIgnoreProperties({"groups", "students", "subjects"})
    private Level level;

    @OneToMany(mappedBy = "group")
    @JsonIgnoreProperties({"group", "level", "grades", "workReturns"})
    private Set<Student> students;  // Bidirectional relationship to Student

    // Constructors
    public Group() {
        this.students = new HashSet<>(); // Initialize students with a HashSet
    }

    public Group(String name, Level level) {
        this.name = name;
        this.level = level;
        this.students = new HashSet<>(); // Initialize students with a HashSet
    }

    // Getters & Setters
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

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }
}
