package com.example.schoolapp;

import java.util.Date;

public class Homework{
    Date dueDate;
    String description;
    public Homework(Date due, String desc)
    {
        dueDate = due;
        desc = description;
    }

    public Homework(Homework hw)
    {
        dueDate = hw.dueDate;
        description = hw.description;
    }
    public Date getDueDate() {
        return dueDate;
    }



}
