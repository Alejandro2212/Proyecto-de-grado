package com.horizonte.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // =========================
    // KEY
    // =========================
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes()
        );
    }

    // =========================
    // GENERAR TOKEN
    // =========================
    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // =========================
    // EXTRAER EMAIL
    // =========================
    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // =========================
    // VALIDAR TOKEN
    // =========================
    public boolean isTokenValid(
            String token,
            String email
    ) {

        final String extractedEmail =
                extractEmail(token);

        return (
                extractedEmail.equals(email)
                        &&
                !isTokenExpired(token)
        );
    }

    // =========================
    // TOKEN EXPIRADO
    // =========================
    private boolean isTokenExpired(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // =========================
    // CLAIMS
    // =========================
    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parserBuilder()

                .setSigningKey(
                        getSigningKey()
                )

                .build()

                .parseClaimsJws(token)

                .getBody();
    }
}