package com.jobtracker.jobtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.jobtracker.model.Application;
import com.jobtracker.jobtracker.model.User;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long>{
    List<Application> findByUser(User user);
}
