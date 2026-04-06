package com.lifeconnect.LifeConnect;

import org.springframework.stereotype.Service;

@Service
public class MockGovService {

    public AbhaCheckResponse verifyAbhaId(String abhaNumber) {
        if ("1234-5678-9012-3456".equals(abhaNumber)) {
            return new AbhaCheckResponse(true, "Ramesh Kumar", "Identity Verified: Ramesh Kumar");
        } else {
            return new AbhaCheckResponse(false, null, "Fake ID - Verification Failed");
        }
    }

    public GovResponse registerOrganPledge(OrganPledgeRequest request) {
        System.out.println("=== Sending to NOTTO Government Database ===");
        System.out.println("Donor Name: " + request.getDonorName());
        System.out.println("Organs Pledged: " + request.getOrgansPledged());
        System.out.println("Family Contact: " + request.getFamilyContact());
        System.out.println("===========================================");
        
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        return new GovResponse(true, "Official Government Record Updated. Pledge ID: #NOTTO-8832");
    }
}
