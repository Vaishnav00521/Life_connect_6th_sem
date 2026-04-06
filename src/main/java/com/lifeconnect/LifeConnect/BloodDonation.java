package com.lifeconnect.LifeConnect;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blood_donations")
public class BloodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    // ──── "Your Details" ────
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String gender;

    @Column(name = "guardian_name")
    private String guardianName;

    @Column(nullable = false)
    private String address;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    private String email;
    private String occupation;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    // ──── "Simple Health Questions" ────
    @Column(name = "had_meal_last_4_hours")
    private Boolean hadMealLast4Hours;

    @Column(name = "donated_last_90_days")
    private Boolean donatedLast90Days;

    @Column(name = "tattoo_piercing_last_12_months")
    private Boolean tattooPiercingLast12Months;

    @Column(name = "recent_surgeries_or_transfusions")
    private Boolean recentSurgeriesOrTransfusions;

    @Column(name = "history_chronic_diseases")
    private Boolean historyChronicDiseases;

    @Column(name = "high_risk_behavior")
    private Boolean highRiskBehavior;

    @Column(name = "currently_on_medication")
    private Boolean currentlyOnMedication;

    // ──── "For the Doctor Only" ────
    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "pulse_rate")
    private Integer pulseRate;

    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel;

    @Column(name = "body_temp")
    private Double bodyTemp;

    // ──── Consents ────
    @Column(name = "disease_testing_consent", nullable = false)
    private Boolean diseaseTestingConsent = false;

    @Column(name = "privacy_consent", nullable = false)
    private Boolean privacyConsent = false;

    // ──── Location ────
    private Double latitude;
    private Double longitude;

    // ──── Timestamps ────
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ──── Getters & Setters ────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public Boolean getHadMealLast4Hours() { return hadMealLast4Hours; }
    public void setHadMealLast4Hours(Boolean v) { this.hadMealLast4Hours = v; }
    public Boolean getDonatedLast90Days() { return donatedLast90Days; }
    public void setDonatedLast90Days(Boolean v) { this.donatedLast90Days = v; }
    public Boolean getTattooPiercingLast12Months() { return tattooPiercingLast12Months; }
    public void setTattooPiercingLast12Months(Boolean v) { this.tattooPiercingLast12Months = v; }
    public Boolean getRecentSurgeriesOrTransfusions() { return recentSurgeriesOrTransfusions; }
    public void setRecentSurgeriesOrTransfusions(Boolean v) { this.recentSurgeriesOrTransfusions = v; }
    public Boolean getHistoryChronicDiseases() { return historyChronicDiseases; }
    public void setHistoryChronicDiseases(Boolean v) { this.historyChronicDiseases = v; }
    public Boolean getHighRiskBehavior() { return highRiskBehavior; }
    public void setHighRiskBehavior(Boolean v) { this.highRiskBehavior = v; }
    public Boolean getCurrentlyOnMedication() { return currentlyOnMedication; }
    public void setCurrentlyOnMedication(Boolean v) { this.currentlyOnMedication = v; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double v) { this.weightKg = v; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String v) { this.bloodPressure = v; }
    public Integer getPulseRate() { return pulseRate; }
    public void setPulseRate(Integer v) { this.pulseRate = v; }
    public Double getHemoglobinLevel() { return hemoglobinLevel; }
    public void setHemoglobinLevel(Double v) { this.hemoglobinLevel = v; }
    public Double getBodyTemp() { return bodyTemp; }
    public void setBodyTemp(Double v) { this.bodyTemp = v; }
    public Boolean getDiseaseTestingConsent() { return diseaseTestingConsent; }
    public void setDiseaseTestingConsent(Boolean v) { this.diseaseTestingConsent = v; }
    public Boolean getPrivacyConsent() { return privacyConsent; }
    public void setPrivacyConsent(Boolean v) { this.privacyConsent = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
