package com.example.demo;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    public JwtService jwtService;
   
    public User saveNewUser(User user) {
        return repo.save(user);
    }

   
    public ResponseEntity<?> authUserEmailAndPassword(User user) {
        User user2 = repo.findByEmailAndPassword(
                user.getEmail(),
                user.getPassword()
        );

        if (user2 == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User Failed");
        }
       String token=   jwtService.generateToken(user2.getEmail());
        return ResponseEntity.ok(token);
    }
    
    public List<User> getAllUsers() {
		return repo.findAll();
    	
    
    }
    
    public void deleteUserById(Long id) {
    	 repo.deleteById(id);
    }
    
    public User updateUser(Long id,User updatedUser) {
    	
    	User existingUser=repo.findById(id)
    			.orElseThrow(()->new RuntimeException("User NOt Found"));
    	
    	existingUser.setEmail(updatedUser.getEmail());
    	
    	return repo.save(existingUser);
    	
    }
    public void uploadImages(MultipartFile file) {
    	String fileName = StringUtils.cleanPath(file.getOriginalFilename());
    	String fileType = StringUtils.getFilenameExtension(fileName);
    	String[] allowedTypes = {"png","jpg","jpeg","pdf"};
    	 
    	boolean isallowed = Arrays.stream(allowedTypes).anyMatch(fileType:: equals);
    	System.out.println(isallowed);
    	
    	if(isallowed == false) {
    		throw new RuntimeException(fileType+"is not allowed");
    	}
    }
  
    
    
    
}
