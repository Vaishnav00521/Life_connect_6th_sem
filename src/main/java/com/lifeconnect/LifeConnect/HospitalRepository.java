package com.lifeconnect.LifeConnect;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    // Custom method to find a hospital by its username
    Optional<Hospital> findByUsername(String username);
}