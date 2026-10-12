
package com.example.online_examination.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.online_examination.entity.User;
import com.example.online_examination.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Registration API
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);

        return ResponseEntity.ok(
                "Registration successful. User ID: " + savedUser.getId()
        );
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        return ResponseEntity.ok(
                "Login successful. Welcome, " + loggedInUser.getName()
        );
    }
}
