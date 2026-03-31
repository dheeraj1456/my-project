package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class usercontroller {

    @GetMapping("/home")
    public String m2() {
        return "hi";
    }

    @GetMapping("/morn")
    public String m3() {
        return "greet";
    }

    @GetMapping("/register")
    public String m4() {
        return "register";	
    }

    @PostMapping("/success")   
    
    public String m5() {
        return "success";
    }
}
