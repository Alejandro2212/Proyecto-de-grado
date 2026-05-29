package com.horizonte.config;

import com.horizonte.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // =========================
    // PASSWORD ENCODER
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================
    // SECURITY FILTER
    // =========================
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // CSRF
            .csrf(csrf -> csrf.disable())

            // CORS
            .cors(cors -> {})

            // SESSIONLESS
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // AUTHORIZATION
            .authorizeHttpRequests(auth -> auth

                // LOGIN
                .requestMatchers(

                        "/api/auth/**",

                        "/api/reservas/**"

                ).permitAll()

                // WEBSOCKET
                .requestMatchers(
                        "/ws/**"
                ).permitAll()

                // ADMIN
                .requestMatchers(
                        "/api/usuarios/**"
                ).hasRole("ADMIN")

                // USUARIOS AUTENTICADOS
                .requestMatchers(
                        "/api/reservas/**"
                ).authenticated()

                .requestMatchers(
                        "/api/areas/**"
                ).authenticated()

                .requestMatchers(
                        "/api/reportes/**"
                ).authenticated()

                // RESTO
                .anyRequest()
                .authenticated()
            )

            // JWT FILTER
            .addFilterBefore(
                    jwtAuthFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}