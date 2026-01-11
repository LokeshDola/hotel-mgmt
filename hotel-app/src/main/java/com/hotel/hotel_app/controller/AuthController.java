package com.hotel.hotel_app.controller;

import com.hotel.hotel_app.model.ChangePasswordRequest;
import com.hotel.hotel_app.model.Manager;
import com.hotel.hotel_app.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ManagerRepository managerRepository;

    // --- MANAGER LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Manager loginRequest) {
        // 1. Check if the username exists in the database
        return managerRepository.findById(loginRequest.getUsername())
                .map(manager -> {
                    // 2. Check if the password matches
                    if (manager.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.ok(Map.of("message", "Login Successful"));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found"));
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return managerRepository.findById(request.getUsername())
                .map(manager -> {
                    // 1. Check if Current Password matches DB
                    if (!manager.getPassword().equals(request.getCurrentPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
                    }
                    
                    // 2. Update to New Password
                    manager.setPassword(request.getNewPassword());
                    managerRepository.save(manager);
                    
                    return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }
}