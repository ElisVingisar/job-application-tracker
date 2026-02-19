package com.jobtracker.jobtracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.jobtracker.dto.ApplicationRequest;
import com.jobtracker.jobtracker.dto.ApplicationResponse;
import com.jobtracker.jobtracker.service.ApplicationService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAll(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getAllApplications(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationById(id, email));
    }

    @PostMapping
    public ResponseEntity<ApplicationResponse> create(@Valid @RequestBody ApplicationRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.createApplication(request, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> update(@PathVariable Long id, @Valid @RequestBody ApplicationRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationService.updateApplication(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        applicationService.deleteApplication(id, email);
        return ResponseEntity.noContent().build();
    }
}
