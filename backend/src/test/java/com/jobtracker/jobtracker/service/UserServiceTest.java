package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.dto.AuthResponse;
import com.jobtracker.jobtracker.dto.LoginRequest;
import com.jobtracker.jobtracker.dto.RegisterRequest;
import com.jobtracker.jobtracker.exception.EmailAlreadyExistsException;
import com.jobtracker.jobtracker.exception.InvalidCredentialsException;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterUser() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setFullName("New User");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setFullName("New User");
        savedUser.setPassword("encodedPassword");
        savedUser.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(anyString())).thenReturn("jwt-token");

        // When
        AuthResponse response = userService.registerUser(request);

        // Then
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("newuser@example.com");
        assertThat(response.getFullName()).isEqualTo("New User");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken("newuser@example.com");
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        User existingUser = new User();
        existingUser.setEmail("existing@example.com");

        when(userRepository.findByEmail("existing@example.com"))
            .thenReturn(Optional.of(existingUser));

        // When/Then
        assertThatThrownBy(() -> userService.registerUser(request))
            .isInstanceOf(EmailAlreadyExistsException.class);
        
        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldLoginUser() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("user@example.com");
        user.setFullName("Test User");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com"))
            .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword"))
            .thenReturn(true);
        when(jwtService.generateToken("user@example.com"))
            .thenReturn("jwt-token");

        // When
        AuthResponse response = userService.loginUser(request);

        // Then
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("user@example.com");
        assertThat(response.getFullName()).isEqualTo("Test User");
        verify(passwordEncoder).matches("password123", "encodedPassword");
        verify(jwtService).generateToken("user@example.com");
    }

    @Test
    void shouldThrowExceptionForInvalidPassword() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("user@example.com"))
            .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword"))
            .thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> userService.loginUser(request))
            .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void shouldThrowExceptionForNonExistentUser() {
        // Given
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("nonexistent@example.com"))
            .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> userService.loginUser(request))
            .isInstanceOf(InvalidCredentialsException.class);
    }
}
