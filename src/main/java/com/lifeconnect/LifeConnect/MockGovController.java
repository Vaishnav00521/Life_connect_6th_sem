package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/pretend-gov")
@CrossOrigin(origins = "*")
public class MockGovController {

    @Autowired
    private MockGovService mockGovService;

    @PostMapping("/check-id")
    public ResponseEntity<AbhaCheckResponse> checkAbhaId(@RequestBody AbhaCheckRequest request) {
        AbhaCheckResponse response = mockGovService.verifyAbhaId(request.getAbhaNumber());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register-pledge")
    public ResponseEntity<GovResponse> registerPledge(@RequestBody OrganPledgeRequest request) {
        GovResponse response = mockGovService.registerOrganPledge(request);
        return ResponseEntity.ok(response);
    }
}
