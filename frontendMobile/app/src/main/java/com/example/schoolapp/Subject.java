package com.example.schoolapp;

import android.util.Log;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;
public class Subject
{
    String name;
    boolean emergency;

    List<Homework> homeworks;
    List<Grade> grades;


    public Subject()
    {
        emergency = false;
    }
    public Subject(String n)
    {
        name = n;
        emergency = false;
        this.homeworks = new ArrayList<>();
        this.grades = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public boolean getEmergency()
    {
        return emergency;
    }

    public void CheckEmergency()
    {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1; // Note: 0 = January
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        Date now = new Date(year,month,day);
        for(Homework homework: homeworks)
        {
            boolean areEqual = homework.getDueDate().equals(now);

            if (areEqual)
            {

                emergency = true;
            }
        }

    }

    public void AddHomework(Homework hw)
    {
        homeworks.add(new Homework(hw));
    }
    public void AddGrade(Grade grade) {
        grades.add(grade);
    }
}

