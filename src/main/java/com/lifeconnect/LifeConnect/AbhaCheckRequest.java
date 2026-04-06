package com.lifeconnect.LifeConnect;

/**
 * This class holds the data we want to send to the government when checking an ABHA ID.
 * ABHA stands for "Ayushman Bharat Health Account" - it's like an Indian ID card for health.
 */
public class AbhaCheckRequest {
    private String abhaNumber;

    public AbhaCheckRequest() {
    }

    public String getAbhaNumber() {
        return abhaNumber;
    }

    public void setAbhaNumber(String abhaNumber) {
        this.abhaNumber = abhaNumber;
    }
}
