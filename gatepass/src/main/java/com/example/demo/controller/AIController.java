package com.example.demo.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {

@PostMapping("/chat")
public String chat(@RequestBody Map<String,String> req){

String msg = req.get("message").toLowerCase();

if(msg.contains("sick") || msg.contains("medical") || msg.contains("hospital")){
return "Possibly Approved: Medical or sickness reason.";
}

if(msg.contains("marriage") || msg.contains("wedding")){
return "Possibly Approved: Marriage event.";
}

if(msg.contains("emergency")){
return "Possibly Approved: Emergency case.";
}

if(msg.contains("family")){
return "Possibly Approved: Family related reason.";
}

return "Reason unclear. Faculty approval required.";

}

}