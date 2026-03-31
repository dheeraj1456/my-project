		
		package com.example.demo;
		
	
		import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
		
		@RestController
		@CrossOrigin("http://localhost:5174/")
		
		public class UserController {
			@Autowired
			public UserService service;
			@PostMapping("/register")
			public User SaveNewUser(@RequestBody User user) {
				return service.savingNewUser(user);
				
			}
		   @PostMapping("/login")	
			public User AuthEmailAndPass(@RequestBody User user)
			{
				return service.authEmailAndPassword(user);
				
			}
			
			
		}
		