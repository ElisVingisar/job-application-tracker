package com.jobtracker.jobtracker.service;

import com.jobtracker.jobtracker.dto.NoteRequest;
import com.jobtracker.jobtracker.dto.NoteResponse;
import com.jobtracker.jobtracker.exception.ApplicationNotFoundException;
import com.jobtracker.jobtracker.exception.NoteNotFoundException;
import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.Note;
import com.jobtracker.jobtracker.repository.ApplicationRepository;
import com.jobtracker.jobtracker.repository.NoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final ApplicationRepository applicationRepository;

    public NoteService(NoteRepository noteRepository, ApplicationRepository applicationRepository) {
        this.noteRepository = noteRepository;
        this.applicationRepository = applicationRepository;
    }

    // -- Public API ----------------------------------------------------

    @Transactional(readOnly = true)
    public List<NoteResponse> getAllNotes(Long applicationId, String email) {
        verifyApplicationOwnership(applicationId, email);
        return noteRepository.findByApplicationIdAndApplicationUserEmail(applicationId, email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public NoteResponse createNote(Long applicationId, NoteRequest request, String email) {
        Application application = findApplicationByIdAndEmail(applicationId, email);
        Note note = new Note();
        note.setApplication(application);
        note.setContent(request.getContent());
        return mapToResponse(noteRepository.save(note));
    }

    @Transactional
    public NoteResponse updateNote(Long applicationId, Long noteId, NoteRequest request, String email) {
        verifyApplicationOwnership(applicationId, email);
        Note note = findNoteByIdAndEmail(noteId, email);
        note.setContent(request.getContent());
        return mapToResponse(noteRepository.save(note));
    }

    @Transactional
    public void deleteNote(Long applicationId, Long noteId, String email) {
        verifyApplicationOwnership(applicationId, email);
        Note note = findNoteByIdAndEmail(noteId, email);
        noteRepository.delete(note);
    }

    // -- Private helpers -----------------------------------------------

    private void verifyApplicationOwnership(Long applicationId, String email) {
        applicationRepository.findByIdAndUserEmail(applicationId, email)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));
    }

    private Application findApplicationByIdAndEmail(Long applicationId, String email) {
        return applicationRepository.findByIdAndUserEmail(applicationId, email)
                .orElseThrow(() -> new ApplicationNotFoundException(applicationId));
    }

    private Note findNoteByIdAndEmail(Long noteId, String email) {
        return noteRepository.findByIdAndApplicationUserEmail(noteId, email)
                .orElseThrow(() -> new NoteNotFoundException(noteId));
    }

    private NoteResponse mapToResponse(Note note) {
        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setContent(note.getContent());
        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());
        return response;
    }
}
