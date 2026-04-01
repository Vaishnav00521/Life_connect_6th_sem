package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DonationRecordRepository recordRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if the table is currently empty
        if (recordRepository.count() == 0) {

            // 1. Create a System Dummy Donor to attach records to
            Donor dummy = new Donor();
            dummy.setName("System Genesis");
            dummy.setBloodGroup("O+");
            dummy.setCity("Mumbai");
            dummy.setCountry("India");
            dummy.setState("MH");
            dummy.setPhone("0000000000");
            dummy.setLatitude(19.0760);
            dummy.setLongitude(72.8777);
            dummy.setVerified(true);
            donorRepository.save(dummy);

            // 2. Inject Kidney (48 Hr Viability)
            DonationRecord kidney = new DonationRecord();
            kidney.setDonorId(dummy.getId());
            kidney.setResourceType("Kidney");
            kidney.setJourneyStatus("TRANSIT -> MIAMI GEN");
            kidney.setCollectedAt(LocalDateTime.now().minusHours(30)); // 30 hours elapsed
            kidney.setViabilityDeadline(LocalDateTime.now().plusHours(18)); // 18 hours left
            recordRepository.save(kidney);

            // 3. Inject Liver (12 Hr Viability)
            DonationRecord liver = new DonationRecord();
            liver.setDonorId(dummy.getId());
            liver.setResourceType("Liver");
            liver.setJourneyStatus("LAB A -> HOLDING");
            liver.setCollectedAt(LocalDateTime.now().minusHours(8)); // 8 hours elapsed
            liver.setViabilityDeadline(LocalDateTime.now().plusHours(4)); // 4 hours left
            recordRepository.save(liver);

            // 4. Inject Heart (6 Hr Viability)
            DonationRecord heart = new DonationRecord();
            heart.setDonorId(dummy.getId());
            heart.setResourceType("Heart");
            heart.setJourneyStatus("AIR-LIFT 09");
            heart.setCollectedAt(LocalDateTime.now().minusHours(4).minusMinutes(30));
            heart.setViabilityDeadline(LocalDateTime.now().plusHours(1).plusMinutes(30));
            recordRepository.save(heart);

            // 5. Inject Lungs (8 Hr Viability)
            DonationRecord lungs = new DonationRecord();
            lungs.setDonorId(dummy.getId());
            lungs.setResourceType("Lungs");
            lungs.setJourneyStatus("DONOR WARD 4");
            lungs.setCollectedAt(LocalDateTime.now().minusHours(3));
            lungs.setViabilityDeadline(LocalDateTime.now().plusHours(5));
            recordRepository.save(lungs);

            System.out.println("✅ ORGAN & PLASMA LOGISTICS SEEDED SUCCESSFULLY");
        }
    }
}