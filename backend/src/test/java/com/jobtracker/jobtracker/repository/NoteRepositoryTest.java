package com.jobtracker.jobtracker.repository;

import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.ApplicationStatus;
import com.jobtracker.jobtracker.model.Note;
import com.jobtracker.jobtracker.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class NoteRepositoryTest {
    
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Test
    void shouldSaveAndRetrieveNote() {
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
        app = applicationRepository.save(app);

        // When: Create and save a note
        Note note = new Note();
        note.setApplication(app);
        note.setContent("Great interview!");
        Note savedNote = noteRepository.save(note);

        // Then: Verify it was saved
        assertThat(savedNote.getId()).isNotNull();
        assertThat(savedNote.getContent()).isEqualTo("Great interview!");
        assertThat(savedNote.getApplication().getId()).isEqualTo(app.getId());
    }
}
