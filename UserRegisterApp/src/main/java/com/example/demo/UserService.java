package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JwtService jwtService;

    public User saveNewUser(User user) {
        return repo.save(user);
    }

    public ResponseEntity<?> authEMailANdPassword(User user) {

        User user2 = repo.findByEmailAndPassword(
                user.getEmail(),
                user.getPassword()
        );

        if (user2 == null) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User Not FOund0");
        }

        String token = jwtService.generateToken(user2.getEmail());

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(token);
    }

 

    public List<User> getAllUsers() {
        return repo.findAll();
    }
}