package com.lifeconnect.LifeConnect;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrganPledgeRepository extends JpaRepository<OrganPledge, UUID> {
    List<OrganPledge> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
