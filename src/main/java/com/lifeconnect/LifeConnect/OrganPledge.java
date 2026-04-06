package com.lifeconnect.LifeConnect;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organ_pledges")
public class OrganPledge {

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

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "guardian_name")
    private String guardianName;

    @Column(nullable = false)
    private String address;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    private String email;

    // ──── "Your ID Card" ────
    @Column(name = "govt_id_type", nullable = false)
    private String govtIdType;

    @Column(name = "govt_id_number", nullable = false)
    private String govtIdNumber;

    // ──── "What Do You Want to Donate?" ────
    @Column(name = "pledge_selection", columnDefinition = "TEXT")
    private String pledgeSelection;

    // ──── "Closest Family Member" ────
    @Column(name = "nok_name", nullable = false)
    private String nokName;

    @Column(name = "nok_relationship", nullable = false)
    private String nokRelationship;

    @Column(name = "nok_address")
    private String nokAddress;

    @Column(name = "nok_contact", nullable = false)
    private String nokContact;

    // ──── "Witnesses" ────
    @Column(name = "witness_1_name", nullable = false)
    private String witness1Name;

    @Column(name = "witness_1_signature_ref")
    private String witness1SignatureRef;

    @Column(name = "witness_2_name", nullable = false)
    private String witness2Name;

    @Column(name = "witness_2_signature_ref")
    private String witness2SignatureRef;

    @Column(name = "is_witness_1_relative")
    private Boolean isWitness1Relative = false;

    // ──── "Your Promises" ────
    @Column(name = "altruistic_consent", nullable = false)
    private Boolean altruisticConsent = false;

    @Column(name = "unpledge_acknowledgement", nullable = false)
    private Boolean unpledgeAcknowledgement = false;

    @Column(name = "nok_consent_acknowledgement", nullable = false)
    private Boolean nokConsentAcknowledgement = false;

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
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGovtIdType() { return govtIdType; }
    public void setGovtIdType(String govtIdType) { this.govtIdType = govtIdType; }
    public String getGovtIdNumber() { return govtIdNumber; }
    public void setGovtIdNumber(String govtIdNumber) { this.govtIdNumber = govtIdNumber; }
    public String getPledgeSelection() { return pledgeSelection; }
    public void setPledgeSelection(String pledgeSelection) { this.pledgeSelection = pledgeSelection; }
    public String getNokName() { return nokName; }
    public void setNokName(String nokName) { this.nokName = nokName; }
    public String getNokRelationship() { return nokRelationship; }
    public void setNokRelationship(String nokRelationship) { this.nokRelationship = nokRelationship; }
    public String getNokAddress() { return nokAddress; }
    public void setNokAddress(String nokAddress) { this.nokAddress = nokAddress; }
    public String getNokContact() { return nokContact; }
    public void setNokContact(String nokContact) { this.nokContact = nokContact; }
    public String getWitness1Name() { return witness1Name; }
    public void setWitness1Name(String v) { this.witness1Name = v; }
    public String getWitness1SignatureRef() { return witness1SignatureRef; }
    public void setWitness1SignatureRef(String v) { this.witness1SignatureRef = v; }
    public String getWitness2Name() { return witness2Name; }
    public void setWitness2Name(String v) { this.witness2Name = v; }
    public String getWitness2SignatureRef() { return witness2SignatureRef; }
    public void setWitness2SignatureRef(String v) { this.witness2SignatureRef = v; }
    public Boolean getIsWitness1Relative() { return isWitness1Relative; }
    public void setIsWitness1Relative(Boolean v) { this.isWitness1Relative = v; }
    public Boolean getAltruisticConsent() { return altruisticConsent; }
    public void setAltruisticConsent(Boolean v) { this.altruisticConsent = v; }
    public Boolean getUnpledgeAcknowledgement() { return unpledgeAcknowledgement; }
    public void setUnpledgeAcknowledgement(Boolean v) { this.unpledgeAcknowledgement = v; }
    public Boolean getNokConsentAcknowledgement() { return nokConsentAcknowledgement; }
    public void setNokConsentAcknowledgement(Boolean v) { this.nokConsentAcknowledgement = v; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double v) { this.latitude = v; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double v) { this.longitude = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
