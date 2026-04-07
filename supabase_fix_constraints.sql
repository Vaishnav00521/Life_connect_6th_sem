-- Raw SQL script to run in the Supabase SQL Editor
-- This script removes the strict NOT NULL constraints from optional doctor section fields.

ALTER TABLE blood_donations ALTER COLUMN weight_kg DROP NOT NULL;
ALTER TABLE blood_donations ALTER COLUMN blood_pressure DROP NOT NULL;
ALTER TABLE blood_donations ALTER COLUMN pulse_rate DROP NOT NULL;
ALTER TABLE blood_donations ALTER COLUMN hemoglobin_level DROP NOT NULL;
ALTER TABLE blood_donations ALTER COLUMN body_temp DROP NOT NULL;
