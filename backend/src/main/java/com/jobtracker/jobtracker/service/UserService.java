package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jobtracker.jobtracker.dto.RegisterRequest;
import com.jobtracker.jobtracker.dto.UserResponse;
import com.jobtracker.jobtracker.exception.EmailAlreadyExistsException;
import com.jobtracker.jobtracker.repository.UserRepository;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // -- Public API ----------------------------------------------------

    public UserResponse registerUser(RegisterRequest request) {
        validateEmailNotTaken(request.getEmail());
        User savedUser = userRepository.save(createUserFromRequest(request));
        return mapToResponse(savedUser);
    }

    // -- Validation ----------------------------------------------------

    private void validateEmailNotTaken(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(email);
        }
    }

    // -- Mapping -------------------------------------------------------

    private User createUserFromRequest(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        return user;
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
