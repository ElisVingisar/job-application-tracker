package com.jobtracker.jobtracker.exception;

public class NoteNotFoundException extends RuntimeException{
    public NoteNotFoundException(Long id) {
        super("Note not found with id: " + id);
    }
}
