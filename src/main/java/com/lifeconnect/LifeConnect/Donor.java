package com.lifeconnect.LifeConnect;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String city;

    // APPLYING AES ENCRYPTION TO PHONE NUMBER
    @Convert(converter = EncryptionConverter.class)
    @Column(nullable = false)
    private String phone;

    // Verification and Email fields
    private String email;
    private boolean isVerified = false;
    private String otp; // Temporary code

    private String status = "Pending Verification";

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Transient // Not saved to database, just used for math
    private Double distance;

    // --- NEW: Premium Donor Dashboard Fields ---
    private LocalDate lastDonationDate;

    private Integer totalGallonsDonated = 0;

    private String badges = "Newcomer"; // Comma separated list of achievements

    private String nodeType = "Blood"; // "Blood", "Plasma", "Organ"


    // --- GETTERS & SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { this.isVerified = verified; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    // --- NEW GETTERS & SETTERS ---

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }

    public Integer getTotalGallonsDonated() { return totalGallonsDonated; }
    public void setTotalGallonsDonated(Integer totalGallonsDonated) { this.totalGallonsDonated = totalGallonsDonated; }

    public String getBadges() { return badges; }
    public void setBadges(String badges) { this.badges = badges; }

    public String getNodeType() { return nodeType; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }
}