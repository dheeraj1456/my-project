package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

@Autowired
private UserRepository repository;

@PostMapping("/register")
public User register(@RequestBody User user){

return repository.save(user);

}

@PostMapping("/login")
public User login(@RequestBody User user){

return repository.findByUsernameAndPassword(
user.getUsername(),
user.getPassword()
);

}

}