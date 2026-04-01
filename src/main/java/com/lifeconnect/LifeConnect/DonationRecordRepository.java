package com.lifeconnect.LifeConnect;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DonationRecordRepository extends JpaRepository<DonationRecord, Long> {
    List<DonationRecord> findByDonorIdOrderByCollectedAtDesc(Long donorId);
    List<DonationRecord> findByJourneyStatus(String status);
}