package com.jobtracker.jobtracker.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobtracker.jobtracker.dto.ApplicationRequest;
import com.jobtracker.jobtracker.dto.ApplicationResponse;
import com.jobtracker.jobtracker.exception.ApplicationNotFoundException;
import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.ApplicationRepository;
import com.jobtracker.jobtracker.repository.UserRepository;
import java.util.List;

@Service
public class ApplicationService {
    
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    // -- Public API ----------------------------------------------------

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplications(String email) {
        return applicationRepository.findByUserEmail(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id, String email) {
        Application application = findByIdAndEmail(id, email);
        return mapToResponse(application);
    }

    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));
        Application application = mapToEntity(request, user);
        return mapToResponse(applicationRepository.save(application));
    }
    
    @Transactional
    public ApplicationResponse updateApplication(Long id, ApplicationRequest request, String email) {
        Application application = findByIdAndEmail(id, email);
        applyUpdates(application, request);
        return mapToResponse(applicationRepository.save(application));
    }

    @Transactional
    public void deleteApplication(Long id, String email) {
        Application application = findByIdAndEmail(id, email);
        applicationRepository.delete(application);
    }

    // -- Private helpers -----------------------------------------------

    private Application findByIdAndEmail(Long id, String email) {
        return applicationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new ApplicationNotFoundException(id));
    }

    private void applyUpdates(Application application, ApplicationRequest request) {
        application.setCompanyName(request.getCompanyName());
        application.setPositionTitle(request.getPositionTitle());
        application.setLocation(request.getLocation());
        application.setWorkMode(request.getWorkMode());
        application.setApplicationSource(request.getApplicationSource());
        application.setJobPostingUrl(request.getJobPostingUrl());
        application.setSalaryMin(request.getSalaryMin());
        application.setSalaryMax(request.getSalaryMax());
        application.setStatus(request.getStatus());
        application.setApplicationDate(request.getApplicationDate());
        application.setNextStepDate(request.getNextStepDate());
    }

    private Application mapToEntity(ApplicationRequest request, User user) {
        Application application = new Application();
        application.setUser(user);
        applyUpdates(application, request);
        return application;
    }

    private ApplicationResponse mapToResponse(Application application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setCompanyName(application.getCompanyName());
        response.setPositionTitle(application.getPositionTitle());
        response.setLocation(application.getLocation());
        response.setWorkMode(application.getWorkMode());
        response.setApplicationSource(application.getApplicationSource());
        response.setJobPostingUrl(application.getJobPostingUrl());
        response.setSalaryMin(application.getSalaryMin());
        response.setSalaryMax(application.getSalaryMax());
        response.setStatus(application.getStatus());
        response.setApplicationDate(application.getApplicationDate());
        response.setNextStepDate(application.getNextStepDate());
        response.setCreatedAt(application.getCreatedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        return response;
    }
}
