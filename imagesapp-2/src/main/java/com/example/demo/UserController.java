package com.example.demo;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
@RestController
@CrossOrigin("*")
public class UserController {
      @Autowired 
	  public JwtService jwtService;
      
    @Autowired
    private UserService service;

    UserController(UserRepo userRepo) {
    }

    @PostMapping("/register")
    public User saveNewUser(@RequestBody User user) {
        return service.saveNewUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return service.authUserEmailAndPassword(user);
    }
    @GetMapping("/allUsers")
    public List<User> getUsers(){
		return service.getAllUsers();
    	
    }
    
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
    	service.deleteUserById(id);
    }
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id,@RequestBody User user) {
		return service.updateUser(id, user);
    	
    }
    @GetMapping("/verify")
    public  ResponseEntity<String> validateToken( String token){
    	try {
    		jwtService.validateToken(token);
    		return ResponseEntity.ok("token is valid for Next 30 sec ...");
    	}
    	catch(Exception e){
    		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("token expired");
    	}
    }
     @PostMapping("/uploads/images")
     public ResponseEntity<?> uploadImages(@RequestParam MultipartFile file){
    	 Map<String ,Object> response = new HashMap<String,Object>();
    	 service.uploadImages(file);
    	 response.put("result","success");
    	 response.put("message","image Uploaded SuccessFully");
    	 return ResponseEntity.ok(response);
     }
    
    
}