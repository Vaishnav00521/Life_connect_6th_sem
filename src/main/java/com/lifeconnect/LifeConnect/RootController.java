package com.lifeconnect.LifeConnect;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<String> welcome() {
        return ResponseEntity.ok("LifeConnect API is Live and Operational. Please use authorized /api endpoints.");
    }
}
