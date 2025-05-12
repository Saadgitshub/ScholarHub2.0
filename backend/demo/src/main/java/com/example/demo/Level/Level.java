package com.example.demo.Level;

import com.example.demo.Student.*;
import com.example.demo.Group.Group;
import com.example.demo.Subject.Subject;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "levels")
public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "level")
    @JsonIgnoreProperties({"level", "students", "groups"})
    private Set<Student> students;  // Bidirectional relationship to Student

    @OneToMany(mappedBy = "level")
    @JsonIgnoreProperties({"level"})
    private Set<Group> groups;  // Bidirectional relationship to Group

    @OneToMany(mappedBy = "level")
    @JsonIgnoreProperties({"level"})
    private Set<Subject> subjects;  // Relationships to Subjects

    // Constructors
    public Level() {}

    public Level(String name) {
        this.name = name;
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

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

    public Set<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(Set<Subject> subjects) {
        this.subjects = subjects;
    }
}
