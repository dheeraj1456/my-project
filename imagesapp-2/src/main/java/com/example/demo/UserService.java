package com.example.demo;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    private static final long ALLOWED_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String ALLOWED_PATH = "uploads/";

    // Register User
    public User saveNewUser(User user) {
        return repo.save(user);
    }

    // Login
    public User authUserEmailAndPassword(User user) {

        User user2 = repo.findByEmailAndPassword(
                user.getEmail(),
                user.getPassword()
        );

        if (user2 == null) {
            throw new RuntimeException("Invalid Details");
        }

        return user2;
    }

    // Get All Users
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // Delete User
    public void deleteUserById(Long id) {
        repo.deleteById(id);
    }

    // Update User
    public User updateUser(Long id, User updatedUser) {

        User existingUser = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());

        return repo.save(existingUser);
    }

    // Upload Image
    public void uploadImages(MultipartFile file) {

        try {

            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileType = StringUtils.getFilenameExtension(filename);

            String[] allowedTypes = {"png", "jpg", "jpeg"};

            boolean isAllowed = Arrays.stream(allowedTypes)
                    .anyMatch(type -> type.equalsIgnoreCase(fileType));

            if (!isAllowed) {
                throw new RuntimeException(fileType + " is not allowed");
            }

            if (file.getSize() > ALLOWED_IMAGE_SIZE) {
                throw new RuntimeException("Allowed only 5 MB file size");
            }

            String newChangedName = UUID.randomUUID().toString() + "." + fileType;

            System.out.println(newChangedName);
            System.out.println(ALLOWED_PATH);

            Path uploading = Paths.get(ALLOWED_PATH + newChangedName);

            System.out.println(uploading);

            Files.copy(file.getInputStream(), uploading);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
}