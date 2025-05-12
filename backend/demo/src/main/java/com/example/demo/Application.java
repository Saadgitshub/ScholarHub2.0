package com.example.demo;

import com.example.demo.Level.Level;
import com.example.demo.Subject.Subject;
import com.example.demo.Teacher.Teacher;
import com.example.demo.Admin.*;
import com.example.demo.Assignment.*;
import com.example.demo.Admin.AdminRepository;
import com.example.demo.Assignment.AssignmentRepository;
import com.example.demo.Grade.Grade;
import com.example.demo.Grade.GradeRepository;
import com.example.demo.Group.Group;
import com.example.demo.Program.Program;
import com.example.demo.Program.ProgramRepository;
import com.example.demo.Student.Student;
import com.example.demo.Student.StudentRepository;
import com.example.demo.Level.LevelRepository;
import com.example.demo.Subject.SubjectRepository;
import com.example.demo.Teacher.TeacherRepository;
import com.example.demo.WorkReturn.WorkReturn;
import com.example.demo.WorkReturn.WorkReturnRepository;
import com.example.demo.Group.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
@EntityScan(basePackages = "com.example.demo")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

 @Bean
CommandLineRunner testEverything(LevelRepository levelRepo,
                                 SubjectRepository subjectRepo,
                                 TeacherRepository teacherRepo,
                                 GroupRepository groupRepo,
                                 ProgramRepository programRepo,
                                 AdminRepository adminRepo,
                                 StudentRepository studentRepo,
                                 AssignmentRepository assignmentRepo,
                                 GradeRepository gradeRepo,
                                 WorkReturnRepository workReturnRepo) {
    return args -> {
        // 1. Create a Level
        Level level = new Level("First Level");
        levelRepo.save(level);

        // 2. Create a Subject and link it to the Level
        Subject math = new Subject("Math", level);
        subjectRepo.save(math);

        // 3. Create a Teacher
        Teacher teacher = new Teacher("teacher1@example.com", "pass123", "John", "Doe");
        teacherRepo.save(teacher);

        // 4. Create a Group and link it to the Level
        Group group = new Group("Group A", level);
        groupRepo.save(group);

        // 5. Create a Program (linking Teacher, Subject, Group)
        Program program = new Program(teacher, group, math);
        programRepo.save(program);

        // 6. Create an Admin
        Admin admin = new Admin("admin@example.com", "adminpass", "Alice","Chihab", "Adminson");
        adminRepo.save(admin);

        // 7. Create a Student
        Student student = new Student("student@example.com", "studpass", "Jane", "Smith", level, group);
        studentRepo.save(student);

        // 8. Create an Assignment for the Program
        Assignment assignment = new Assignment("Assignment 1", "Solve math problems", program);
        assignmentRepo.save(assignment);

        // 9. Create a Grade for the student and assignment
        Grade grade = new Grade(95.0, student, assignment);
        gradeRepo.save(grade);

      

        System.out.println("✅ All entities created and saved successfully!");
    };
}

}
