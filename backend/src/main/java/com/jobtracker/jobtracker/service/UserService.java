package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.model.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jobtracker.jobtracker.dto.AuthResponse;
import com.jobtracker.jobtracker.dto.LoginRequest;
import com.jobtracker.jobtracker.dto.RegisterRequest;
import com.jobtracker.jobtracker.dto.UserResponse;
import com.jobtracker.jobtracker.exception.EmailAlreadyExistsException;
import com.jobtracker.jobtracker.exception.InvalidCredentialsException;
import com.jobtracker.jobtracker.repository.UserRepository;

@Service
public class UserService {

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // -- Public API ----------------------------------------------------

    public UserResponse registerUser(RegisterRequest request) {
        validateEmailNotTaken(request.getEmail());
        User savedUser = userRepository.save(createUserFromRequest(request));
        return mapToResponse(savedUser);
    }

    public AuthResponse loginUser(LoginRequest request) {
        User user = findUserByEmail(request.getEmail());
        validatePassword(request.getPassword(), user.getPassword());
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFullName());
    }

    // -- Validation ----------------------------------------------------

    private void validateEmailNotTaken(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException(email);
        }
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);
    }

    private void validatePassword(String rawPassword, String encodedPassword) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new InvalidCredentialsException();
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
