package com.jobtracker.jobtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.jobtracker.model.Application;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long>{
    List<Application> findByUserEmail(String email);
    Optional<Application> findByIdAndUserEmail(Long id, String email);
}
