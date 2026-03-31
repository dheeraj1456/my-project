package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.User;

public interface UserRepo extends JpaRepository<User, Long> {

    User findByEmailAndPassword(String email, String password);
}
