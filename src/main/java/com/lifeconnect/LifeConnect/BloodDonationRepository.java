package com.lifeconnect.LifeConnect;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BloodDonationRepository extends JpaRepository<BloodDonation, UUID> {
    List<BloodDonation> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<BloodDonation> findByBloodGroupOrderByCreatedAtDesc(String bloodGroup);
}
