package com.example.demo.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    // Get all admins
    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get admin by ID
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        return admin.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Create new admin
    @PostMapping
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminRepository.save(admin);
    }

    // Update admin
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        return adminRepository.findById(id).map(admin -> {
            admin.setEmail(adminDetails.getEmail());
            admin.setPassword(adminDetails.getPassword());
            admin.setFirstname(adminDetails.getFirstname());
            admin.setLastname(adminDetails.getLastname());
            admin.setInstitutionName(adminDetails.getInstitutionName());
            adminRepository.save(admin);
            return ResponseEntity.ok(admin);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isPresent()) {
            adminRepository.delete(optionalAdmin.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
