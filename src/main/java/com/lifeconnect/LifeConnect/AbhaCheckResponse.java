package com.lifeconnect.LifeConnect;

public class AbhaCheckResponse {
    private boolean isValid;
    private String patientName;
    private String message;

    public AbhaCheckResponse() {
    }

    public AbhaCheckResponse(boolean isValid, String patientName, String message) {
        this.isValid = isValid;
        this.patientName = patientName;
        this.message = message;
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
