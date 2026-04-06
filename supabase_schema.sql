-- ============================================================================
-- LifeConnect: Donor Registration Module — Supabase PostgreSQL Schema
-- Compliance: NBTC/NACO (Blood) + THOTA/NOTTO Form-7 (Organ Pledging)
-- Language: All user-facing text is plain English. Variable names are technical.
-- ============================================================================

-- ─────────────────────────── CUSTOM ENUM TYPES ──────────────────────────────

CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');

CREATE TYPE blood_group_type AS ENUM (
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
);

CREATE TYPE govt_id_type AS ENUM ('Aadhaar', 'VoterID');


-- ─────────────────────── USER ROLES (for RLS) ───────────────────────────────

CREATE TABLE IF NOT EXISTS user_roles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('donor', 'medical_admin', 'super_admin')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only super_admins can manage roles"
  ON user_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 1: BLOOD DONATIONS (NBTC / NACO Compliant)
-- UI Section: "Donate Blood"
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE blood_donations (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- ──── "Your Details" Section ────
  full_name                       TEXT NOT NULL,
  dob                             DATE NOT NULL,
  gender                          gender_type NOT NULL,
  guardian_name                   TEXT,                    -- Father / Husband name
  address                         TEXT NOT NULL,
  contact_number                  TEXT NOT NULL,
  email                           TEXT,
  occupation                      TEXT,
  blood_group                     blood_group_type NOT NULL,

  -- ──── "Simple Health Questions" Section (Booleans) ────
  had_meal_last_4_hours           BOOLEAN NOT NULL DEFAULT false,
  donated_last_90_days            BOOLEAN NOT NULL DEFAULT false,
  tattoo_piercing_last_12_months  BOOLEAN NOT NULL DEFAULT false,
  recent_surgeries_or_transfusions BOOLEAN NOT NULL DEFAULT false,
  history_chronic_diseases        BOOLEAN NOT NULL DEFAULT false,
  high_risk_behavior              BOOLEAN NOT NULL DEFAULT false,
  currently_on_medication         BOOLEAN NOT NULL DEFAULT false,

  -- ──── "For the Doctor Only" Section (Nullable) ────
  weight_kg                       DECIMAL(5,2),
  blood_pressure                  TEXT,           -- e.g. "120/80"
  pulse_rate                      INTEGER,        -- bpm
  hemoglobin_level                DECIMAL(4,1),   -- g/dL
  body_temp                       DECIMAL(4,1),   -- °C

  -- ──── "Your Promises" / Consent Declarations ────
  disease_testing_consent         BOOLEAN NOT NULL DEFAULT false,
  privacy_consent                 BOOLEAN NOT NULL DEFAULT false,

  -- ──── Location ────
  latitude                        DOUBLE PRECISION,
  longitude                       DOUBLE PRECISION,

  -- ──── Timestamps ────
  created_at                      TIMESTAMPTZ DEFAULT now(),
  updated_at                      TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_blood_donations_updated
  BEFORE UPDATE ON blood_donations FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- ──── RLS ────
ALTER TABLE blood_donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blood donations"
  ON blood_donations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create blood donations"
  ON blood_donations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blood donations"
  ON blood_donations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Medical admins can update physical parameters"
  ON blood_donations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'medical_admin')
  );

CREATE POLICY "Medical admins can view all blood donations"
  ON blood_donations FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'medical_admin')
  );


-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 2: ORGAN PLEDGES (NOTTO / THOTA Form-7 Compliant)
-- UI Section: "Pledge Your Organs"
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE organ_pledges (
  id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                         UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- ──── "Your Details" Section ────
  full_name                       TEXT NOT NULL,
  dob                             DATE NOT NULL,
  gender                          gender_type NOT NULL,
  blood_group                     blood_group_type NOT NULL,
  guardian_name                   TEXT,
  address                         TEXT NOT NULL,
  contact_number                  TEXT NOT NULL,
  email                           TEXT,

  -- ──── "Your ID Card" Section ────
  govt_id_type                    govt_id_type NOT NULL,
  govt_id_number                  TEXT NOT NULL,

  -- ──── "What Do You Want to Donate?" Section (JSONB) ────
  pledge_selection                JSONB NOT NULL DEFAULT '{"organs":[],"tissues":[],"all":false}'::jsonb,

  -- ──── "Closest Family Member" Section ────
  nok_name                        TEXT NOT NULL,
  nok_relationship                TEXT NOT NULL,
  nok_address                     TEXT,
  nok_contact                     TEXT NOT NULL,

  -- ──── "Witnesses" Section ────
  witness_1_name                  TEXT NOT NULL,
  witness_1_signature_ref         TEXT,
  witness_2_name                  TEXT NOT NULL,
  witness_2_signature_ref         TEXT,
  is_witness_1_relative           BOOLEAN NOT NULL DEFAULT false,

  -- ──── "Your Promises" / Consent Declarations ────
  altruistic_consent              BOOLEAN NOT NULL DEFAULT false,
  unpledge_acknowledgement        BOOLEAN NOT NULL DEFAULT false,
  nok_consent_acknowledgement     BOOLEAN NOT NULL DEFAULT false,

  -- ──── Location ────
  latitude                        DOUBLE PRECISION,
  longitude                       DOUBLE PRECISION,

  -- ──── Timestamps ────
  created_at                      TIMESTAMPTZ DEFAULT now(),
  updated_at                      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_organ_pledges_updated
  BEFORE UPDATE ON organ_pledges FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- ──── RLS ────
ALTER TABLE organ_pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own organ pledges"
  ON organ_pledges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create organ pledges"
  ON organ_pledges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own organ pledges"
  ON organ_pledges FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Medical admins can view all organ pledges"
  ON organ_pledges FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'medical_admin')
  );

-- ──── Performance Indices ────
CREATE INDEX idx_blood_donations_user     ON blood_donations(user_id);
CREATE INDEX idx_blood_donations_group    ON blood_donations(blood_group);
CREATE INDEX idx_blood_donations_created  ON blood_donations(created_at DESC);
CREATE INDEX idx_organ_pledges_user       ON organ_pledges(user_id);
CREATE INDEX idx_organ_pledges_created    ON organ_pledges(created_at DESC);
