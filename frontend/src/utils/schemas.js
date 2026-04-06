import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// Helper: Calculate age from date string
// ═══════════════════════════════════════════════════════════════
const calculateAge = (dateStr) => {
  const dob = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};


// ═══════════════════════════════════════════════════════════════
// BLOOD DONATION SCHEMA
// All error messages are written for a 12-year-old to understand
// ═══════════════════════════════════════════════════════════════

export const bloodDonationSchema = z.object({
  // ──── Your Details ────
  fullName: z.string().min(2, "Please enter your full name (at least 2 letters)."),
  dob: z.string().min(1, "Please enter your date of birth.")
    .refine((val) => calculateAge(val) >= 18, {
      message: "You must be at least 18 years old to donate blood."
    })
    .refine((val) => calculateAge(val) <= 65, {
      message: "You must be 65 years old or younger to donate blood."
    }),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select your gender." })
  }),
  guardianName: z.string().optional(),
  address: z.string().min(5, "Please enter your full address."),
  contactNumber: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  occupation: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select your blood group." })
  }),

  // ──── Simple Health Questions ────
  hadMealLast4Hours: z.boolean(),
  donatedLast90Days: z.boolean(),
  tattooPiercingLast12Months: z.boolean(),
  recentSurgeriesOrTransfusions: z.boolean(),
  historyChronicDiseases: z.boolean(),
  highRiskBehavior: z.boolean(),
  currentlyOnMedication: z.boolean(),

  // ──── Your Promises (Consent) ────
  diseaseTestingConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to let the hospital test your blood before you can submit."
  }),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to let us store your information safely."
  }),
}).refine((data) => {
  return !data.donatedLast90Days;
}, {
  message: "Thank you for being a hero! But for your safety, you must rest for 90 days before donating blood again.",
  path: ["donatedLast90Days"],
});


// ═══════════════════════════════════════════════════════════════
// ORGAN PLEDGE SCHEMA
// All error messages are written for a 12-year-old to understand
// ═══════════════════════════════════════════════════════════════

export const organPledgeSchema = z.object({
  // ──── Your Details ────
  fullName: z.string().min(2, "Please enter your full name (at least 2 letters)."),
  dob: z.string().min(1, "Please enter your date of birth.")
    .refine((val) => calculateAge(val) >= 18, {
      message: "You must be at least 18 years old to pledge your organs."
    })
    .refine((val) => calculateAge(val) <= 65, {
      message: "You must be 65 years old or younger to pledge your organs."
    }),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select your gender." })
  }),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select your blood group." })
  }),
  guardianName: z.string().optional(),
  address: z.string().min(5, "Please enter your full address."),
  contactNumber: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),

  // ──── Your ID Card ────
  govtIdType: z.enum(["Aadhaar", "VoterID"], {
    errorMap: () => ({ message: "Please select what type of ID you have." })
  }),
  govtIdNumber: z.string().min(1, "Please enter your ID number."),

  // ──── What Do You Want to Donate? ────
  pledgeOrgans: z.array(z.string()).default([]),
  pledgeTissues: z.array(z.string()).default([]),
  pledgeAll: z.boolean().default(false),

  // ──── Closest Family Member ────
  nokName: z.string().min(2, "Please tell us who to contact in your family."),
  nokRelationship: z.string().min(1, "How are they related to you?"),
  nokAddress: z.string().optional(),
  nokContact: z.string().regex(/^\d{10}$/, "Please enter your family member's 10-digit phone number."),

  // ──── Witnesses ────
  witness1Name: z.string().min(2, "Please enter Witness 1's full name."),
  witness1SignatureRef: z.string().optional(),
  witness2Name: z.string().min(2, "Please enter Witness 2's full name."),
  witness2SignatureRef: z.string().optional(),
  isWitness1Relative: z.boolean().default(false),

  // ──── Your Promises (Consent) ────
  nokConsentAcknowledgement: z.boolean().refine(val => val === true, {
    message: "You must check this box to continue."
  }),
  altruisticConsent: z.boolean().refine(val => val === true, {
    message: "You must check this box to continue."
  }),
  unpledgeAcknowledgement: z.boolean().refine(val => val === true, {
    message: "You must check this box to continue."
  }),
}).refine((data) => {
  // Validate ID format
  if (data.govtIdType === "Aadhaar") {
    return /^\d{12}$/.test(data.govtIdNumber);
  }
  if (data.govtIdType === "VoterID") {
    return /^[A-Z]{3}\d{7}$/.test(data.govtIdNumber);
  }
  return true;
}, {
  message: "Please check your ID number. Aadhaar should be 12 numbers. Voter ID should be like ABC1234567.",
  path: ["govtIdNumber"],
}).refine((data) => {
  return data.pledgeAll || data.pledgeOrgans.length > 0 || data.pledgeTissues.length > 0;
}, {
  message: "Please pick at least one organ or tissue you'd like to donate, or choose 'Donate Everything'.",
  path: ["pledgeOrgans"],
});


// ──── Options for the forms ────

export const ORGAN_OPTIONS = [
  'Heart', 'Lungs', 'Kidneys', 'Liver', 'Pancreas', 'Intestine'
];

export const TISSUE_OPTIONS = [
  'Eyes / Corneas', 'Skin', 'Bones', 'Heart Valves'
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
