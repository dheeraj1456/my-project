package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecController {

    @GetMapping("/greet")
    public String greet() {
        return "Hello! Spring Security is working ✅";
    }
}
