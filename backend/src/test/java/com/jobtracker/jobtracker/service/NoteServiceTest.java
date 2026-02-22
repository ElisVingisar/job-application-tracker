package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.dto.NoteRequest;
import com.jobtracker.jobtracker.dto.NoteResponse;
import com.jobtracker.jobtracker.exception.ApplicationNotFoundException;
import com.jobtracker.jobtracker.exception.NoteNotFoundException;
import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.ApplicationStatus;
import com.jobtracker.jobtracker.model.Note;
import com.jobtracker.jobtracker.model.User;
import com.jobtracker.jobtracker.repository.ApplicationRepository;
import com.jobtracker.jobtracker.repository.NoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceTest {
    
    @Mock
    private NoteRepository noteRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private NoteService noteService;

    @Test
    void shouldCreateNote() {
        // Given
        Long applicationId = 1L;
        String userEmail = "user@example.com";
        
        NoteRequest request = new NoteRequest();
        request.setContent("Great interview!");

        User user = new User();
        user.setId(1L);
        user.setEmail(userEmail);

        Application app = new Application();
        app.setId(applicationId);
        app.setUser(user);
        app.setCompanyName("Google");
        app.setPositionTitle("Engineer");
        app.setApplicationDate(LocalDate.now());
        app.setStatus(ApplicationStatus.APPLIED);

        Note savedNote = new Note();
        savedNote.setId(1L);
        savedNote.setApplication(app);
        savedNote.setContent("Great interview!");
        savedNote.setCreatedAt(LocalDateTime.now());
        savedNote.setUpdatedAt(LocalDateTime.now());

        // Mock behavior
        when(applicationRepository.findByIdAndUserEmail(applicationId, userEmail))
            .thenReturn(Optional.of(app));
        when(noteRepository.save(any(Note.class)))
            .thenReturn(savedNote);

        // When
        NoteResponse response = noteService.createNote(applicationId, request, userEmail);

        // Then
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getContent()).isEqualTo("Great interview!");
        verify(applicationRepository).findByIdAndUserEmail(applicationId, userEmail);
        verify(noteRepository).save(any(Note.class));
    }

    @Test
    void shouldThrowExceptionWhenApplicationNotFound() {
        // Given
        Long applicationId = 999L;
        String userEmail = "user@example.com";
        NoteRequest request = new NoteRequest();
        request.setContent("Note content");

        when(applicationRepository.findByIdAndUserEmail(applicationId, userEmail))
            .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> noteService.createNote(applicationId, request, userEmail))
            .isInstanceOf(ApplicationNotFoundException.class);
        
        verify(noteRepository, never()).save(any());
    }

    @Test
    void shouldGetAllNotes() {
        // Given
        Long applicationId = 1L;
        String userEmail = "user@example.com";

        User user = new User();
        user.setEmail(userEmail);

        Application app = new Application();
        app.setId(applicationId);
        app.setUser(user);

        Note note1 = new Note();
        note1.setId(1L);
        note1.setContent("First note");
        note1.setCreatedAt(LocalDateTime.now());
        note1.setUpdatedAt(LocalDateTime.now());

        Note note2 = new Note();
        note2.setId(2L);
        note2.setContent("Second note");
        note2.setCreatedAt(LocalDateTime.now());
        note2.setUpdatedAt(LocalDateTime.now());

        when(applicationRepository.findByIdAndUserEmail(applicationId, userEmail))
            .thenReturn(Optional.of(app));
        when(noteRepository.findByApplicationIdAndApplicationUserEmail(applicationId, userEmail))
            .thenReturn(List.of(note1, note2));

        // When
        List<NoteResponse> notes = noteService.getAllNotes(applicationId, userEmail);

        // Then
        assertThat(notes).hasSize(2);
        assertThat(notes.get(0).getContent()).isEqualTo("First note");
        assertThat(notes.get(1).getContent()).isEqualTo("Second note");
    }

    @Test
    void shouldDeleteNote() {
        // Given
        Long applicationId = 1L;
        Long noteId = 1L;
        String userEmail = "user@example.com";

        User user = new User();
        user.setEmail(userEmail);

        Application app = new Application();
        app.setId(applicationId);
        app.setUser(user);

        Note note = new Note();
        note.setId(noteId);
        note.setApplication(app);

        when(applicationRepository.findByIdAndUserEmail(applicationId, userEmail))
            .thenReturn(Optional.of(app));
        when(noteRepository.findByIdAndApplicationUserEmail(noteId, userEmail))
            .thenReturn(Optional.of(note));

        // When
        noteService.deleteNote(applicationId, noteId, userEmail);

        // Then
        verify(noteRepository).delete(note);
    }

    @Test
    void shouldThrowExceptionWhenNoteNotFound() {
        // Given
        Long applicationId = 1L;
        Long noteId = 999L;
        String userEmail = "user@example.com";

        User user = new User();
        user.setEmail(userEmail);

        Application app = new Application();
        app.setId(applicationId);
        app.setUser(user);

        NoteRequest request = new NoteRequest();
        request.setContent("Updated content");

        when(applicationRepository.findByIdAndUserEmail(applicationId, userEmail))
            .thenReturn(Optional.of(app));
        when(noteRepository.findByIdAndApplicationUserEmail(noteId, userEmail))
            .thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> noteService.updateNote(applicationId, noteId, request, userEmail))
            .isInstanceOf(NoteNotFoundException.class);
        
        verify(noteRepository, never()).save(any());
    }
}
