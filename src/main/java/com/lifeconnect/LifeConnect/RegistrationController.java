package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.Map;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {

    @Autowired
    private BloodDonationRepository bloodDonationRepository;

    @Autowired
    private OrganPledgeRepository organPledgeRepository;

    // ────────────────────────────────────────────────────────
    // POST /api/registration/blood — Blood Donation Registration
    // ────────────────────────────────────────────────────────
    @PostMapping("/blood")
    public ResponseEntity<?> registerBloodDonation(@RequestBody Map<String, Object> payload) {
        try {
            // Server-side validation
            String dobStr = (String) payload.get("dob");
            if (dobStr == null || dobStr.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Please enter your date of birth."));
            }

            LocalDate dob = LocalDate.parse(dobStr);
            int age = Period.between(dob, LocalDate.now()).getYears();

            if (age < 18 || age > 65) {
                return ResponseEntity.badRequest().body(Map.of("message", "You must be between 18 and 65 years old to donate blood."));
            }

            Boolean donatedRecently = (Boolean) payload.getOrDefault("donatedLast90Days", false);
            if (Boolean.TRUE.equals(donatedRecently)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Thank you for being a hero! But for your safety, you must rest for 90 days before donating blood again."
                ));
            }

            Boolean testingConsent = (Boolean) payload.getOrDefault("diseaseTestingConsent", false);
            Boolean privacyConsent = (Boolean) payload.getOrDefault("privacyConsent", false);
            if (!Boolean.TRUE.equals(testingConsent) || !Boolean.TRUE.equals(privacyConsent)) {
                return ResponseEntity.badRequest().body(Map.of("message", "You must agree to all the promises to continue."));
            }

            // Build entity
            BloodDonation donation = new BloodDonation();
            donation.setFullName((String) payload.get("fullName"));
            donation.setDob(dob);
            donation.setGender((String) payload.get("gender"));
            donation.setGuardianName((String) payload.get("guardianName"));
            donation.setAddress((String) payload.get("address"));
            donation.setContactNumber((String) payload.get("contactNumber"));
            donation.setEmail((String) payload.get("email"));
            donation.setOccupation((String) payload.get("occupation"));
            donation.setBloodGroup((String) payload.get("bloodGroup"));

            donation.setHadMealLast4Hours((Boolean) payload.getOrDefault("hadMealLast4Hours", false));
            donation.setDonatedLast90Days(false);
            donation.setTattooPiercingLast12Months((Boolean) payload.getOrDefault("tattooPiercingLast12Months", false));
            donation.setRecentSurgeriesOrTransfusions((Boolean) payload.getOrDefault("recentSurgeriesOrTransfusions", false));
            donation.setHistoryChronicDiseases((Boolean) payload.getOrDefault("historyChronicDiseases", false));
            donation.setHighRiskBehavior((Boolean) payload.getOrDefault("highRiskBehavior", false));
            donation.setCurrentlyOnMedication((Boolean) payload.getOrDefault("currentlyOnMedication", false));

            donation.setDiseaseTestingConsent(true);
            donation.setPrivacyConsent(true);

            if (payload.get("latitude") != null) donation.setLatitude(((Number) payload.get("latitude")).doubleValue());
            if (payload.get("longitude") != null) donation.setLongitude(((Number) payload.get("longitude")).doubleValue());

            BloodDonation saved = bloodDonationRepository.save(donation);

            return ResponseEntity.ok(Map.of(
                "message", "You're registered! A doctor will complete the checkup. Thank you!",
                "id", saved.getId().toString()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Something went wrong: " + e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    // POST /api/registration/organ — Organ Pledge Registration
    // ────────────────────────────────────────────────────────
    @PostMapping("/organ")
    public ResponseEntity<?> registerOrganPledge(@RequestBody Map<String, Object> payload) {
        try {
            // Server-side validation
            String dobStr = (String) payload.get("dob");
            if (dobStr == null || dobStr.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Please enter your date of birth."));
            }

            LocalDate dob = LocalDate.parse(dobStr);
            int age = Period.between(dob, LocalDate.now()).getYears();

            if (age < 18 || age > 65) {
                return ResponseEntity.badRequest().body(Map.of("message", "You must be between 18 and 65 years old to pledge your organs."));
            }

            Boolean altruistic = (Boolean) payload.getOrDefault("altruisticConsent", false);
            Boolean unpledge = (Boolean) payload.getOrDefault("unpledgeAcknowledgement", false);
            Boolean nokConsent = (Boolean) payload.getOrDefault("nokConsentAcknowledgement", false);
            if (!Boolean.TRUE.equals(altruistic) || !Boolean.TRUE.equals(unpledge) || !Boolean.TRUE.equals(nokConsent)) {
                return ResponseEntity.badRequest().body(Map.of("message", "You must agree to all the promises to continue."));
            }

            // Build entity
            OrganPledge pledge = new OrganPledge();
            pledge.setFullName((String) payload.get("fullName"));
            pledge.setDob(dob);
            pledge.setGender((String) payload.get("gender"));
            pledge.setBloodGroup((String) payload.get("bloodGroup"));
            pledge.setGuardianName((String) payload.get("guardianName"));
            pledge.setAddress((String) payload.get("address"));
            pledge.setContactNumber((String) payload.get("contactNumber"));
            pledge.setEmail((String) payload.get("email"));

            pledge.setGovtIdType((String) payload.get("govtIdType"));
            pledge.setGovtIdNumber((String) payload.get("govtIdNumber"));
            pledge.setPledgeSelection((String) payload.get("pledgeSelection"));

            pledge.setNokName((String) payload.get("nokName"));
            pledge.setNokRelationship((String) payload.get("nokRelationship"));
            pledge.setNokAddress((String) payload.get("nokAddress"));
            pledge.setNokContact((String) payload.get("nokContact"));

            pledge.setWitness1Name((String) payload.get("witness1Name"));
            pledge.setWitness1SignatureRef((String) payload.get("witness1SignatureRef"));
            pledge.setWitness2Name((String) payload.get("witness2Name"));
            pledge.setWitness2SignatureRef((String) payload.get("witness2SignatureRef"));
            pledge.setIsWitness1Relative((Boolean) payload.getOrDefault("isWitness1Relative", false));

            pledge.setAltruisticConsent(true);
            pledge.setUnpledgeAcknowledgement(true);
            pledge.setNokConsentAcknowledgement(true);

            if (payload.get("latitude") != null) pledge.setLatitude(((Number) payload.get("latitude")).doubleValue());
            if (payload.get("longitude") != null) pledge.setLongitude(((Number) payload.get("longitude")).doubleValue());

            OrganPledge saved = organPledgeRepository.save(pledge);

            return ResponseEntity.ok(Map.of(
                "message", "Your organ pledge is registered! You are a hero!",
                "id", saved.getId().toString()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Something went wrong: " + e.getMessage()));
        }
    }
}
