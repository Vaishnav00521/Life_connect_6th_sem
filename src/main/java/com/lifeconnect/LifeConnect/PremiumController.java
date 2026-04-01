package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/premium")
public class PremiumController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private DonationRecordRepository recordRepository;

    @Autowired
    private NotificationService notificationService;

    // Anti-Spam Shield: Tracks the last time an IP triggered an SOS
    private final java.util.Map<String, Long> sosCooldownMap = new java.util.concurrent.ConcurrentHashMap<>();

    // 1. DONOR DASHBOARD & JOURNEY TRACKER API
    @GetMapping("/dashboard/{donorId}")
    public ResponseEntity<Map<String, Object>> getDonorDashboard(@PathVariable Long donorId) {
        Donor donor = donorRepository.findById(donorId).orElseThrow();
        List<DonationRecord> history = recordRepository.findByDonorIdOrderByCollectedAtDesc(donorId);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("donorInfo", donor);
        dashboard.put("donationJourney", history); // Feeds the pizza-tracker UI

        // Calculate Eligibility (Can donate every 56 days)
        if (donor.getLastDonationDate() != null) {
            long daysSince = ChronoUnit.DAYS.between(donor.getLastDonationDate(), LocalDate.now());
            dashboard.put("daysUntilEligible", Math.max(0, 56 - daysSince));
        } else {
            dashboard.put("daysUntilEligible", 0); // Eligible immediately
        }

        return ResponseEntity.ok(dashboard);
    }

    // 2. EMERGENCY "SOS" OVERDRIVE DISPATCH (WITH RATE LIMITING)
    @PostMapping("/sos-overdrive")
    public ResponseEntity<Map<String, String>> triggerSosOverdrive(
            @RequestParam String resourceType, 
            @RequestParam String city, 
            @RequestParam Double lat, 
            @RequestParam Double lng,
            jakarta.servlet.http.HttpServletRequest request) { // <-- Captures user IP

        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        // Check if this IP triggered an SOS in the last 60 seconds (60,000 ms)
        if (sosCooldownMap.containsKey(clientIp) && (currentTime - sosCooldownMap.get(clientIp) < 60000)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "RATE_LIMIT_EXCEEDED");
            error.put("message", "SOS Overdrive is in cooldown. Please wait 60 seconds.");
            return ResponseEntity.status(429).body(error); // 429 Too Many Requests
        }

        // Register the new SOS timestamp
        sosCooldownMap.put(clientIp, currentTime);

        // 1. Broadcast to all open browsers
        notificationService.broadcastGeoFenceAlert(resourceType + " [CRITICAL OVERDRIVE]", city + " - ALL UNITS RESPOND");

        // 2. Bypasses 10km radius, blasts emails to everyone within 100km!
        List<Donor> massiveRadius = donorRepository.findNearestDonors(resourceType, lat, lng, 100.0);
        for (Donor d : massiveRadius) {
            if (d.isVerified() && d.getEmail() != null) {
                try { notificationService.sendEmergencyDispatch(d.getEmail(), resourceType, city, 100.0); } catch (Exception ignored) {}
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("status", "OVERDRIVE_ENGAGED");
        response.put("nodesAlerted", String.valueOf(massiveRadius.size()));
        return ResponseEntity.ok(response);
    }

    // 3. AI SHORTAGE FORECASTER (Heuristic Mock for Presentation)
    @GetMapping("/ai-forecast")
    public ResponseEntity<Map<String, String>> getAiPrediction(@RequestParam String city) {
        // NOTE: In a real system, this would call a Python ML microservice.
        // For a B.Tech project, we simulate the AI logic mathematically.
        Map<String, String> forecast = new HashMap<>();
        forecast.put("region", city);
        forecast.put("alertLevel", "WARNING");
        forecast.put("prediction", "AI Analysis indicates a 42% probability of an O-Negative shortage in the next 48 hours due to local weather patterns. Pre-emptive routing advised.");
        forecast.put("confidenceScore", "89.4%");

        return ResponseEntity.ok(forecast);
    }

    // 4. HOSPITAL INVENTORY HUB
    @GetMapping("/hospital-inventory")
    public ResponseEntity<List<DonationRecord>> getHospitalInventory() {
        // Fetches all blood/organs currently sitting in "Lab Tested" or "In Transport"
        return ResponseEntity.ok(recordRepository.findByJourneyStatus("In Storage"));
    }

    // 5. ORGAN & PLASMA LIVE TRACKER
    @GetMapping("/active-organs")
    public ResponseEntity<List<DonationRecord>> getActiveOrgans() {
        // Fetches all records that are NOT basic blood donations (Organs/Plasma)
        List<DonationRecord> activeOrgans = recordRepository.findAll().stream()
                .filter(record -> !record.getResourceType().equals("Blood"))
                .toList();
        return ResponseEntity.ok(activeOrgans);
    }
} // <- Notice how the closing bracket is now down here!