package com.jobtracker.jobtracker.repository;

import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.ApplicationStatus;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.model.WorkMode;
import java.util.List;
import java.util.Optional;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ApplicationRepositoryTest {
    
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndRetrieveApplication() {
        // Given: Create a user and application
        User user = new User();
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPassword("hashedPassword123");
        user = userRepository.save(user);

        Application app = new Application();
        app.setUser(user);
        app.setCompanyName("Google");
        app.setPositionTitle("Software Engineer");
        app.setApplicationDate(LocalDate.now());
        app.setStatus(ApplicationStatus.APPLIED);
        app.setWorkMode(WorkMode.REMOTE);
        app.setSalaryMin(100000);
        app.setSalaryMax(150000);

        // When: Save the application
        Application savedApp = applicationRepository.save(app);

        // Then: Verify it was saved correctly
        assertThat(savedApp.getId()).isNotNull();
        assertThat(savedApp.getCompanyName()).isEqualTo("Google");
        assertThat(savedApp.getPositionTitle()).isEqualTo("Software Engineer");
        assertThat(savedApp.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
        assertThat(savedApp.getWorkMode()).isEqualTo(WorkMode.REMOTE);
        assertThat(savedApp.getSalaryMin()).isEqualTo(100000);
        assertThat(savedApp.getSalaryMax()).isEqualTo(150000);
        assertThat(savedApp.getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    void shouldFindApplicationsByUserEmail() {
        // Given: Create a user with multiple applications
        User user = new User();
        user.setEmail("user@example.com");
        user.setFullName("Test User");
        user.setPassword("password123");
        user = userRepository.save(user);

        Application app1 = new Application();
        app1.setUser(user);
        app1.setCompanyName("Google");
        app1.setPositionTitle("Backend Developer");
        app1.setApplicationDate(LocalDate.now());
        app1.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app1);

        Application app2 = new Application();
        app2.setUser(user);
        app2.setCompanyName("Amazon");
        app2.setPositionTitle("Frontend Developer");
        app2.setApplicationDate(LocalDate.now());
        app2.setStatus(ApplicationStatus.INTERVIEWING);
        applicationRepository.save(app2);

        // When: Find applications by user email
        List<Application> applications = applicationRepository.findByUserEmail("user@example.com");

        // Then: Should find both applications
        assertThat(applications).hasSize(2);
        assertThat(applications).extracting(Application::getCompanyName)
                .containsExactlyInAnyOrder("Google", "Amazon");
    }

    @Test
    void shouldNotFindApplicationsForDifferentUser() {
        // Given: Create two users with their own applications
        User user1 = new User();
        user1.setEmail("user1@example.com");
        user1.setFullName("User One");
        user1.setPassword("password123");
        user1 = userRepository.save(user1);

        User user2 = new User();
        user2.setEmail("user2@example.com");
        user2.setFullName("User Two");
        user2.setPassword("password456");
        user2 = userRepository.save(user2);

        Application app1 = new Application();
        app1.setUser(user1);
        app1.setCompanyName("Google");
        app1.setPositionTitle("Engineer");
        app1.setApplicationDate(LocalDate.now());
        app1.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app1);

        Application app2 = new Application();
        app2.setUser(user2);
        app2.setCompanyName("Amazon");
        app2.setPositionTitle("Developer");
        app2.setApplicationDate(LocalDate.now());
        app2.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app2);

        // When: Find applications for user1
        List<Application> user1Apps = applicationRepository.findByUserEmail("user1@example.com");

        // Then: Should only find user1's applications, not user2's
        assertThat(user1Apps).hasSize(1);
        assertThat(user1Apps.get(0).getCompanyName()).isEqualTo("Google");
        assertThat(user1Apps.get(0).getUser().getEmail()).isEqualTo("user1@example.com");
    }

    @Test
    void shouldFindApplicationByIdAndUserEmail() {
        // Given: Create a user and application
        User user = new User();
        user.setEmail("owner@example.com");
        user.setFullName("Owner");
        user.setPassword("password123");
        user = userRepository.save(user);

        Application app = new Application();
        app.setUser(user);
        app.setCompanyName("Microsoft");
        app.setPositionTitle("Cloud Engineer");
        app.setApplicationDate(LocalDate.now());
        app.setStatus(ApplicationStatus.APPLIED);
        app = applicationRepository.save(app);

        // When: Find by ID and user email
        Optional<Application> found = applicationRepository.findByIdAndUserEmail(
            app.getId(),
            "owner@example.com"
        );

        // Then: Should find the application
        assertThat(found).isPresent();
        assertThat(found.get().getCompanyName()).isEqualTo("Microsoft");
    }

    @Test
    void shouldNotFindApplicationWhenUserEmailDoesNotMatch() {
        // Given: Create a user and application
        User owner = new User();
        owner.setEmail("owner@example.com");
        owner.setFullName("Owner");
        owner.setPassword("password123");
        owner = userRepository.save(owner);

        Application app = new Application();
        app.setUser(owner);
        app.setCompanyName("Tesla");
        app.setPositionTitle("Engineer");
        app.setApplicationDate(LocalDate.now());
        app.setStatus(ApplicationStatus.APPLIED);
        app = applicationRepository.save(app);

        // When: Try to find with different user email
        Optional<Application> found = applicationRepository.findByIdAndUserEmail(
            app.getId(),
            "hacker@example.com"
        );

        // Then: Should NOT find the application (security check)
        assertThat(found).isEmpty();
    }
}
