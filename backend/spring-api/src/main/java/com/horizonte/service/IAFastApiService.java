package com.horizonte.service;

import com.horizonte.dto.PrediccionRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IAFastApiService {

    private final RestTemplate restTemplate = new RestTemplate();

        private static final String URL = "http://127.0.0.1:8000/predecir";

    public String obtenerPrediccion(
            PrediccionRequest request
    ) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PrediccionRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        URL,
                        entity,
                        String.class
                );

        return response.getBody();
    }
}