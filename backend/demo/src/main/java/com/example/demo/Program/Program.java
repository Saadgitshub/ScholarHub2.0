package com.example.demo.Program;

import com.example.demo.Teacher.Teacher;
import com.example.demo.Group.Group;
import com.example.demo.Subject.Subject;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "teacher_id")
    @JsonIgnoreProperties("programs")
    private Teacher teacher;

    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id")
    @JsonIgnoreProperties("programs")
    private Group group;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subject_id")
    @JsonIgnoreProperties("programs")
    private Subject subject;

    // Optional: additional fields like semester, schedule, etc.

    // Constructors
    public Program() {}

    public Program(Teacher teacher, Group group, Subject subject) {
        this.teacher = teacher;
        this.group = group;
        this.subject = subject;
    }
    

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }
}
