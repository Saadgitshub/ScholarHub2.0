package com.example.demo.Student;

import com.example.demo.Group.Group;
import com.example.demo.Level.Level;
import com.example.demo.WorkReturn.WorkReturn;
import com.example.demo.Grade.Grade;
import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "students")
@JsonIgnoreProperties({
    "password", "workReturns", "grades"
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstname;
    private String lastname;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonIgnoreProperties("students")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "level_id")
    @JsonIgnoreProperties("students")
    private Level level;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("student")
    private List<WorkReturn> workReturns;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("student")
    private List<Grade> grades;

    // Constructors
    public Student() {}

    public Student(String email, String password, String firstname, String lastname) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }
    public Student(String email, String password, String firstname, String lastname, Level level, Group group) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.level = level;
        this.group = group;
    }
    
    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Level getLevel() {
        return level;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public List<WorkReturn> getWorkReturns() {
        return workReturns;
    }

    public void setWorkReturns(List<WorkReturn> workReturns) {
        this.workReturns = workReturns;
    }

    public List<Grade> getGrades() {
        return grades;
    }

    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }
}
