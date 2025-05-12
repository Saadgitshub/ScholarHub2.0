package com.example.demo.Authentication;


public class LoginResponse {
    private String role;
    private Long id;
    private String email;

    public LoginResponse(String role, Long id, String email) {
        this.role = role;
        this.id = id;
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}

