package com.lifeconnect.LifeConnect;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Generates a cryptographically secure 256-bit secret key automatically
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token validity: 24 Hours (in milliseconds)
    private static final long EXPIRATION_TIME = 86400000;

    // 1. GENERATE TOKEN (When a hospital logs in successfully)
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // 2. EXTRACT USERNAME (To see who is making the request)
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 3. VALIDATE TOKEN (Check if someone tampered with it or if it expired)
    public boolean validateToken(String token) {
        try {
            return !getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false; // Token is invalid, tampered, or expired
        }
    }

    // Helper method to open the encrypted token
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}