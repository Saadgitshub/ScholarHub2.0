package com.example.schoolapp;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DataManager {
    private static DataManager instance;
    private List<Subject> subjects;

    // Private constructor to prevent instantiation
    private DataManager() {
        subjects = new ArrayList<>();
        Subject mathSubject = new Subject("Mathematics");
        Subject scienceSubject = new Subject("Physics");

        // Add homework to subjects
        Homework mathHomework1 = new Homework(new Date(2025, 4, 15), "Math Homework 1");
        Homework mathHomework2 = new Homework(new Date(2025, 4, 23), "Math 2");
        Homework scienceHomework1 = new Homework(new Date(2025, 4, 15), "Physics 1");
        Homework scienceHomework2 = new Homework(new Date(2025, 4, 15), "Physics 2");

        mathSubject.AddHomework(mathHomework1);
        mathSubject.AddHomework(mathHomework2);
        scienceSubject.AddHomework(scienceHomework1);
        scienceSubject.AddHomework(scienceHomework2);

        // Add subjects to the subjects list
        subjects.add(mathSubject);
        subjects.add(scienceSubject);

        // Add some grades to the subjects
        Grade mathGrade1 = new Grade(90, "Test 1");
        Grade mathGrade2 = new Grade(85, "Test 2");
        Grade scienceGrade1 = new Grade(88, "Physics Midterm");
        Grade scienceGrade2 = new Grade(92, "Physics Final");

        // Add grades to respective subjects
        mathSubject.AddGrade(mathGrade1);
        mathSubject.AddGrade(mathGrade2);
        scienceSubject.AddGrade(scienceGrade1);
        scienceSubject.AddGrade(scienceGrade2);
    }

    public static DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    // Method to add a grade to a specific subject
    public void addGradeToSubject(String subjectName, Grade grade) {
        for (Subject subject : subjects) {
            if (subject.getName().equals(subjectName)) {
                subject.AddGrade(grade);
                break;
            }
        }
    }
}

