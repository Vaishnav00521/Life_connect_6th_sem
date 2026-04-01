package com.lifeconnect.LifeConnect;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "donation_records")
public class DonationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long donorId; // Links back to the Donor

    @Column(nullable = false)
    private String resourceType; // "Blood", "Plasma", "Kidney", "Lungs"

    @Column(nullable = false)
    private String journeyStatus; // "Collected", "Lab Tested", "In Transport", "Transfused"

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime collectedAt;

    // Specifically for Organ/Plasma Node (Cold Ischemia Time)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime viabilityDeadline;

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getJourneyStatus() { return journeyStatus; }
    public void setJourneyStatus(String journeyStatus) { this.journeyStatus = journeyStatus; }
    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }
    public LocalDateTime getViabilityDeadline() { return viabilityDeadline; }
    public void setViabilityDeadline(LocalDateTime viabilityDeadline) { this.viabilityDeadline = viabilityDeadline; }
}