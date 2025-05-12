package com.example.schoolapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    EditText passwordField;
    Button loginButton;
    Intent intent;
    Intent intent2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);
        passwordField = findViewById(R.id.passwordField);
        loginButton = findViewById(R.id.loginButton);
        intent = new Intent(this, SignUpActivity.class);
        intent2 = new Intent(this,dashboardActivityAdmin.class);
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String password = passwordField.getText().toString();

                // Now you can use the password value!
                if(password.isEmpty()) {
                    Toast.makeText(LoginActivity.this, "Please enter your password", Toast.LENGTH_SHORT).show();
                } else if(password.equals("admin")) {

                    startActivity(intent2);
                }
            }
        });

    }
    public void onTextClick(View view)
    {

        startActivity(intent);
    }


}