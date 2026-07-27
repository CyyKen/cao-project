-- PostgreSQL table-only schema converted from pgceap_cao_db.sql
-- Data INSERT statements intentionally excluded.
-- MySQL enum values are represented as TEXT for flexible PostgreSQL application use.

CREATE TABLE activity_logs (
  id BIGINT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id INTEGER NOT NULL,
  action varchar(100) NOT NULL,
  target_table varchar(100) DEFAULT NULL,
  target_id INTEGER DEFAULT NULL,
  description text DEFAULT NULL,
  ip_address varchar(45) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE admins (
  id INTEGER NOT NULL,
  full_name varchar(150) NOT NULL,
  email varchar(150) NOT NULL,
  password_hash varchar(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  role TEXT NOT NULL DEFAULT 'admin',
  last_login_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE announcements (
  id INTEGER NOT NULL,
  title varchar(255) NOT NULL,
  body text NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE announcement_scholars (
  id INTEGER NOT NULL,
  announcement_id INTEGER NOT NULL,
  scholar_id INTEGER NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE applicants (
  id INTEGER NOT NULL,
  id_number varchar(30) DEFAULT NULL,
  entry_date date DEFAULT NULL,
  first_name varchar(100) NOT NULL,
  middle_name varchar(100) DEFAULT NULL,
  last_name varchar(100) NOT NULL,
  name_ext varchar(10) DEFAULT NULL,
  email varchar(150) NOT NULL,
  phone varchar(20) DEFAULT NULL,
  street varchar(255) DEFAULT NULL,
  barangay varchar(100) DEFAULT NULL,
  municipality varchar(100) DEFAULT NULL,
  school_id INTEGER DEFAULT NULL,
  gender varchar(30) DEFAULT NULL,
  date_of_birth date DEFAULT NULL,
  birthplace varchar(255) DEFAULT NULL,
  civil_status TEXT DEFAULT 'Single',
  family_income varchar(20) DEFAULT NULL,
  gwa NUMERIC(3,2) DEFAULT NULL,
  entry_method varchar(50) DEFAULT NULL,
  guardians text DEFAULT NULL,
  siblings_boys INTEGER NOT NULL DEFAULT 0,
  siblings_girls INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  school_year varchar(20) DEFAULT '2025-2026',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE billing_official_lists (
  id INTEGER NOT NULL,
  school_year varchar(20) NOT NULL,
  semester TEXT NOT NULL,
  applicant_id INTEGER NOT NULL,
  added_by INTEGER DEFAULT NULL,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes text DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE billing_periods (
  id INTEGER NOT NULL,
  label varchar(100) NOT NULL,
  batch_number varchar(30) DEFAULT NULL,
  school_year varchar(20) NOT NULL,
  semester TEXT NOT NULL,
  date_prepared date DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  remarks text DEFAULT NULL,
  created_by INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE billing_sessions (
  id INTEGER NOT NULL,
  batch_number varchar(50) NOT NULL,
  billing_period_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL,
  scholar_count INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'finalized',
  remarks text DEFAULT NULL,
  date_prepared date DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE billing_statements (
  id INTEGER NOT NULL,
  billing_period_id INTEGER NOT NULL,
  school_id INTEGER NOT NULL,
  submitted_at TIMESTAMP DEFAULT NULL,
  received_by INTEGER DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE billing_statement_scholars (
  id INTEGER NOT NULL,
  billing_statement_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  amount NUMERIC(10,2) DEFAULT NULL,
  allowance NUMERIC(10,2) DEFAULT NULL,
  paid_amount NUMERIC(10,2) DEFAULT NULL,
  payroll_amount NUMERIC(10,2) DEFAULT NULL,
  tuition_fee NUMERIC(10,2) DEFAULT NULL,
  billing_status TEXT NOT NULL DEFAULT 'not_yet_billed',
  date_billed TIMESTAMP DEFAULT NULL,
  billing_reference varchar(50) DEFAULT NULL,
  is_eligible BOOLEAN NOT NULL DEFAULT TRUE,
  eligibility_notes varchar(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE control_accounts (
  id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  control_number varchar(20) NOT NULL,
  username varchar(100) NOT NULL,
  password_hash varchar(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE disbursements (
  id INTEGER NOT NULL,
  payroll_claim_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  payroll_batch_id INTEGER NOT NULL,
  disbursement_date date NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'check',
  transaction_reference varchar(100) DEFAULT NULL,
  recipient_name varchar(150) DEFAULT NULL,
  processed_by INTEGER DEFAULT NULL,
  remarks text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE document_scans (
  id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  image_path varchar(255) NOT NULL,
  extracted_id varchar(50) DEFAULT NULL,
  expected_id varchar(50) DEFAULT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  message varchar(500) DEFAULT NULL,
  raw_text text DEFAULT NULL,
  anti_spoof_data TEXT DEFAULT NULL,
  reviewed_by INTEGER DEFAULT NULL,
  reviewed_at TIMESTAMP DEFAULT NULL,
  review_notes varchar(500) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE exams (
  id INTEGER NOT NULL,
  created_by INTEGER NOT NULL,
  title varchar(200) NOT NULL,
  exam_date TIMESTAMP NOT NULL,
  venue varchar(255) DEFAULT NULL,
  municipality varchar(100) DEFAULT NULL,
  academic_year varchar(20) DEFAULT NULL,
  instructions text DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE exam_slots (
  id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  appeared BOOLEAN DEFAULT NULL,
  appeared_at TIMESTAMP DEFAULT NULL,
  forfeited_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE obr_records (
  id INTEGER NOT NULL,
  billing_period_id INTEGER NOT NULL,
  obr_number varchar(50) DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'eligibility_check',
  eligibility_checked_at TIMESTAMP DEFAULT NULL,
  names_verified_at TIMESTAMP DEFAULT NULL,
  obr_prepared_at TIMESTAMP DEFAULT NULL,
  names_certified_at TIMESTAMP DEFAULT NULL,
  consolidated_at TIMESTAMP DEFAULT NULL,
  submitted_to_budget_at TIMESTAMP DEFAULT NULL,
  prepared_by INTEGER DEFAULT NULL,
  certified_by INTEGER DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE password_resets (
  id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  token_hash varchar(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE payroll_batches (
  id INTEGER NOT NULL,
  batch_number varchar(50) NOT NULL,
  billing_period_id INTEGER NOT NULL,
  school_id INTEGER DEFAULT NULL,
  total_scholars INTEGER NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'draft',
  prepared_by INTEGER DEFAULT NULL,
  approved_by INTEGER DEFAULT NULL,
  released_by INTEGER DEFAULT NULL,
  prepared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP DEFAULT NULL,
  released_at TIMESTAMP DEFAULT NULL,
  remarks text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE payroll_claims (
  id INTEGER NOT NULL,
  payroll_batch_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  billing_statement_scholar_id INTEGER DEFAULT NULL,
  claim_amount NUMERIC(10,2) NOT NULL,
  claim_status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason text DEFAULT NULL,
  notes text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  claimed_date timestamp NULL DEFAULT NULL,
  claimed_notes text DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE results (
  id INTEGER NOT NULL,
  exam_slot_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  exam_id INTEGER NOT NULL,
  score NUMERIC(6,2) DEFAULT NULL,
  passing_score NUMERIC(6,2) DEFAULT NULL,
  passed BOOLEAN NOT NULL,
  remarks text DEFAULT NULL,
  recorded_by INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE scholar_accounts (
  id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  result_id INTEGER DEFAULT NULL,
  scholar_id varchar(30) DEFAULT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  issued_by INTEGER DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes text DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE scholar_requirements (
  id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  billing_period_id INTEGER NOT NULL,
  school_id INTEGER DEFAULT NULL,
  year_level varchar(20) DEFAULT NULL,
  course varchar(150) DEFAULT NULL,
  major varchar(150) DEFAULT NULL,
  cert_of_registration BOOLEAN NOT NULL DEFAULT FALSE,
  cor_file varchar(255) DEFAULT NULL,
  cor_uploaded_at TIMESTAMP DEFAULT NULL,
  cor_review_status TEXT DEFAULT 'pending',
  cor_admin_comment text DEFAULT NULL,
  cert_tax_exemption_file varchar(255) DEFAULT NULL,
  cert_tax_exemption_uploaded_at TIMESTAMP DEFAULT NULL,
  cert_tax_exemption_review_status TEXT DEFAULT 'pending',
  cert_tax_exemption_admin_comment text DEFAULT NULL,
  barangay_indigency_file varchar(255) DEFAULT NULL,
  barangay_indigency_uploaded_at TIMESTAMP DEFAULT NULL,
  barangay_indigency_review_status TEXT DEFAULT 'pending',
  barangay_indigency_admin_comment text DEFAULT NULL,
  valid_id_photocopy_file varchar(255) DEFAULT NULL,
  valid_id_photocopy_uploaded_at TIMESTAMP DEFAULT NULL,
  valid_id_photocopy_review_status TEXT DEFAULT 'pending',
  valid_id_photocopy_admin_comment text DEFAULT NULL,
  registration_form_file varchar(255) DEFAULT NULL,
  registration_form_uploaded_at TIMESTAMP DEFAULT NULL,
  registration_form_review_status TEXT DEFAULT 'pending',
  registration_form_admin_comment text DEFAULT NULL,
  tuition_fee_receipt_file varchar(255) DEFAULT NULL,
  tuition_fee_receipt_uploaded_at TIMESTAMP DEFAULT NULL,
  tuition_fee_receipt_review_status TEXT DEFAULT 'pending',
  tuition_fee_receipt_admin_comment text DEFAULT NULL,
  folder_physical_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  folder_physical_submitted_at TIMESTAMP DEFAULT NULL,
  grade_report_card BOOLEAN NOT NULL DEFAULT FALSE,
  grade_report_file varchar(255) DEFAULT NULL,
  grade_report_uploaded_at TIMESTAMP DEFAULT NULL,
  grade_report_review_status TEXT DEFAULT 'pending',
  grade_report_admin_comment text DEFAULT NULL,
  enrollment_form BOOLEAN NOT NULL DEFAULT FALSE,
  enrollment_form_file varchar(255) DEFAULT NULL,
  enrollment_form_uploaded_at TIMESTAMP DEFAULT NULL,
  enrollment_form_review_status TEXT DEFAULT 'pending',
  enrollment_form_admin_comment text DEFAULT NULL,
  cert_printed BOOLEAN NOT NULL DEFAULT FALSE,
  cert_printed_at TIMESTAMP DEFAULT NULL,
  cert_signed BOOLEAN NOT NULL DEFAULT FALSE,
  cert_signed_at TIMESTAMP DEFAULT NULL,
  submitted_to_school BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_to_school_at TIMESTAMP DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE schools (
  id INTEGER NOT NULL,
  name varchar(255) NOT NULL,
  school_type TEXT NOT NULL DEFAULT 'public',
  address varchar(255) DEFAULT NULL,
  contact_person varchar(150) DEFAULT NULL,
  contact_email varchar(150) DEFAULT NULL,
  contact_phone varchar(20) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE staff (
  id INTEGER NOT NULL,
  full_name varchar(150) NOT NULL,
  email varchar(150) NOT NULL,
  password_hash varchar(255) NOT NULL,
  position varchar(100) NOT NULL DEFAULT 'Staff',
  department varchar(100) DEFAULT NULL,
  phone varchar(20) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMP DEFAULT NULL,
  created_by INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE system_settings (
  id INTEGER NOT NULL,
  setting_key varchar(100) NOT NULL,
  setting_value varchar(255) NOT NULL DEFAULT '',
  description varchar(255) DEFAULT NULL,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
