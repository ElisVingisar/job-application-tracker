package com.jobtracker.jobtracker.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.jobtracker.model.Note;
import com.jobtracker.jobtracker.model.Application;

public interface NoteRepository extends JpaRepository<Note, Long>{
    List<Note> findByApplication(Application application);
}
