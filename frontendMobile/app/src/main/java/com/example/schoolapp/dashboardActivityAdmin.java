package com.example.schoolapp;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.w3c.dom.Text;

public class dashboardActivityAdmin extends AppCompatActivity {
    Button button_addTeach;
    Button button_addClass;
    Button button_Subject;
    Button button_Student;
    TextView button_totalTeacher;
    TextView button_totalStudent;
    TextView button_totalGroups;
    TextView button_TotalLevels;

    Intent intentAddT,intentAddC,intentAddSbj,intentAddStu,intentTotalTeachers,intentTotalStu,intentTotalGroup,intentTotalLevels;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_dashboard_admin);
        button_totalStudent = findViewById(R.id.totalStudents);
        button_totalGroups = findViewById(R.id.totalGroups);
        button_TotalLevels = findViewById(R.id.totalLevels);
        button_totalTeacher = findViewById(R.id.totalTeachers);
        button_Student = findViewById(R.id.addStudentButton);
        button_addClass = findViewById(R.id.addClassButton);
        button_Subject = findViewById(R.id.addSubjectButton);
        button_addTeach = findViewById(R.id.addTeacherButton);

        intentAddC = new Intent(this,AddClassActivity.class);
        intentAddT = new Intent(this,AddTeacherActivity.class);
        intentAddSbj = new Intent(this, AddSubject.class);
        intentAddStu = new Intent(this, AddStudentActivity.class);
                /*
        intentTotalTeachers = new Intent(this,)
        intentTotalStu = new Intent(this,)
        intentTotalGroup = new Intent(this,)
        intentTotalLevels = new Intent(this,)*/
        button_Student.setOnClickListener(v -> {

            startActivity(intentAddStu);
        });

        button_addClass.setOnClickListener(v -> {
            // assuming "Class" == "Grade"
            startActivity(intentAddC);
        });

        button_Subject.setOnClickListener(v -> {
             // if you have a subject activity
            startActivity(intentAddSbj);
        });

        button_addTeach.setOnClickListener(v -> {

            startActivity(intentAddT);
        });

    }

}