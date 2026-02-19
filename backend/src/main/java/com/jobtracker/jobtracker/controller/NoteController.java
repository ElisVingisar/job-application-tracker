package com.jobtracker.jobtracker.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.jobtracker.jobtracker.dto.NoteRequest;
import com.jobtracker.jobtracker.dto.NoteResponse;
import com.jobtracker.jobtracker.service.NoteService;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/applications/{applicationId}/notes")
public class NoteController {
    
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAll(@PathVariable Long applicationId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(noteService.getAllNotes(applicationId, email));
    }
    
    @PostMapping
    public ResponseEntity<NoteResponse> create(@PathVariable Long applicationId, @Valid @RequestBody NoteRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(applicationId, request, email));
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<NoteResponse> update(
                @PathVariable Long applicationId, @PathVariable Long noteId, @Valid @RequestBody NoteRequest request, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(noteService.updateNote(applicationId, noteId, request, email));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> delete(@PathVariable Long applicationId, @PathVariable Long noteId, Authentication authentication) {
        String email = authentication.getName();
        noteService.deleteNote(applicationId, noteId, email);
        return ResponseEntity.noContent().build();
    }

}
