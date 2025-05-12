package com.example.demo.Grade;

public class GradeDTO {
    private Long id;
    private Double score;
    private Long studentId;
    private Long subjectId;
    private Long assignmentId;

    private String studentName;
    private String subjectName;
    private String assignmentName;

    // Default constructor
    public GradeDTO() {}

    // Constructor to build DTO from Grade entity
    public GradeDTO(Grade grade) {
        this.id = grade.getId();
        this.score = grade.getScore();

        if (grade.getStudent() != null) {
            this.studentId = grade.getStudent().getId();
            this.studentName = grade.getStudent().getFirstname() + " " + grade.getStudent().getLastname();
        }

        if (grade.getSubject() != null) {
            this.subjectId = grade.getSubject().getId();
            this.subjectName = grade.getSubject().getName(); // Use getName() if applicable
        }

        if (grade.getAssignment() != null) {
            this.assignmentId = grade.getAssignment().getId();
            this.assignmentName = grade.getAssignment().getTitle(); // Use getName() if applicable
        }
    }

    // Getters and Setters
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getAssignmentName() {
        return assignmentName;
    }

    public void setAssignmentName(String assignmentName) {
        this.assignmentName = assignmentName;
    }
}
