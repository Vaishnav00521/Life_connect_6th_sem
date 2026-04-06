package com.lifeconnect.LifeConnect;

import java.util.List;

public class OrganPledgeRequest {
    private String donorName;
    private List<String> organsPledged;
    private String familyContact;

    public OrganPledgeRequest() {
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public List<String> getOrgansPledged() {
        return organsPledged;
    }

    public void setOrgansPledged(List<String> organsPledged) {
        this.organsPledged = organsPledged;
    }

    public String getFamilyContact() {
        return familyContact;
    }

    public void setFamilyContact(String familyContact) {
        this.familyContact = familyContact;
    }
}
