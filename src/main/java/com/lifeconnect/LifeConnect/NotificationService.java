package com.lifeconnect.LifeConnect;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 1. Email the OTP for Identity Verification
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("LifeConnect: Identity Verification");
        message.setText("Your highly secure verification code is: " + otp + "\n\nDo not share this with anyone.");
        mailSender.send(message);
    }

    // 2. Dispatch Emergency Email to Donor
    public void sendEmergencyDispatch(String toEmail, String bloodGroup, String city, Double distance) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("CRITICAL ALERT: " + bloodGroup + " Needed");
        message.setText("EMERGENCY DISPATCH\n\nA critical patient requires " + bloodGroup + " blood.\nLocation: " + city + " (~" + distance + "km away).\n\nPlease log into the LifeConnect console immediately.");
        mailSender.send(message);
    }

    // 3. Broadcast Real-Time Geo-Fence Alert via WebSockets
    public void broadcastGeoFenceAlert(String bloodGroup, String city) {
        String alertMessage = "CRITICAL: " + bloodGroup + " urgently requested in " + city + "!";
        messagingTemplate.convertAndSend("/topic/alerts", alertMessage);
    }
}