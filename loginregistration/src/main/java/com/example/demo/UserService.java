	package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


	@Service
	public class UserService {
	@Autowired
	public UserRepo repo;
	
	
	public User savingNewUser(User user) {
		return repo.save(user);
	
		
	}
	public User authEmailAndPassword(User user) {
		User user2= repo.findByEmailAndPassword(
				user.getEmail(),
				user.getPassword());
		if(user2==null) {
			throw new RuntimeException("Invalid Details");
		}
		 
		 return user2;
		
	}
		
		
	
		
		
	  
	}

