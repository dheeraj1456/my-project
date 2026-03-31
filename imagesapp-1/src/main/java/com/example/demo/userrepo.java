package com.example.demo;
	
	import java.util.Optional;
	
	import org.springframework.data.jpa.repository.JpaRepository;
	
	public interface UserRepo extends JpaRepository<User, Long> {
	
	  
	    User findByEmailAndPassword(String email, String password);
	}