package com.jobtracker.jobtracker.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobtracker.jobtracker.model.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email);
}
