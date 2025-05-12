package com.example.demo.Grade;

import com.example.demo.Student.*;
import com.example.demo.Subject.Subject;
import com.example.demo.Assignment.Assignment;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double score;

   

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"grades", "workReturns", "level", "groups"})
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    @JsonIgnoreProperties({"grades", "teachers", "assignments", "level"})
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    @JsonIgnoreProperties({"workReturns", "subject", "group"})
    private Assignment assignment;

    // Constructors
    public Grade() {}

    public Grade(Double score, Student student, Subject subject) {
        this.score = score;
        this.student = student;
        this.subject = subject;
    }

    public Grade(Double score, Student student, Assignment assignment) {
        this.score = score;
        this.student = student;
        this.assignment = assignment;
        this.subject = assignment.getSubject();  // Assign subject from assignment
    }
    

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Double getScore() {
        return score;
    }
    public void setScore(Double score) {
        this.score = score;
    }

    
   

    public Student getStudent() {
        return student;
    }
    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }
    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Assignment getAssignment() {
        return assignment;
    }
    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }
}
