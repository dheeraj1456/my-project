package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User register(User user) {
        return userRepo.save(user);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public User updateUser(Long id, User newUser) {
        User user = userRepo.findById(id).orElseThrow();
        user.setEmail(newUser.getEmail());
        return userRepo.save(user);
    }
}
