package com.example.demo.Subject;

public class SubjectDTO {
    private Long id;
    private String name;
    private String levelName; // Just the level name as a string

    // Constructor, getters, setters

    public SubjectDTO(Long id, String name, String levelName) {
        this.id = id;
        this.name = name;
        this.levelName = levelName;
    }

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

    public String getLevelName() {
        return levelName;
    }

    public void setLevelName(String levelName) {
        this.levelName = levelName;
    }
}