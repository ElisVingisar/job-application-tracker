package com.jobtracker.jobtracker.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.jobtracker.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long>{
    List<Note> findByApplicationIdAndApplicationUserEmail(Long applicationId, String email);
    Optional<Note> findByIdAndApplicationUserEmail(Long id, String email);
}
