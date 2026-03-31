package com.example.demo;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    public SecretKey secret = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(String email) {

        return Jwt.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 30 * 1000))
                .signWith(secret)
                .compact();
    }

    public void validateToken(String token) {

        Jwt.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token);

    }
}