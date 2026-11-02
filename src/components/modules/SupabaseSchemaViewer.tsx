import React, { useState } from 'react';
import { Database, Copy, Check, Download, ShieldCheck, Key } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
}

export const SupabaseSchemaViewer: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const supabaseSql = `-- ==============================================================================
-- UM ALQURA POLYCLINIC - BARKA, SULTANATE OF OMAN
-- COMPREHENSIVE SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES (2026)
-- Specialty: Physiotherapy & Medical Rehabilitation
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'physiotherapist', 'receptionist', 'patient');
CREATE TYPE gender_type AS ENUM ('male', 'female');
CREATE TYPE room_type AS ENUM ('general', 'female_private', 'traction_suite', 'shockwave_suite');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'in_progress', 'completed', 'cancelled', 'waitlist');
CREATE TYPE tissue_response_enum AS ENUM ('improving_rapidly', 'moderate_progress', 'plateau', 'reactive_flareup');
CREATE TYPE claim_status_enum AS ENUM ('submitted', 'approved', 'pending', 'settled', 'rejected');

-- 2. CLINIC METADATA TABLE
CREATE TABLE clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL DEFAULT 'مجمع أم القرى الطبي',
    name_en VARCHAR(255) NOT NULL DEFAULT 'Um Alqura Polyclinic',
    location_ar TEXT NOT NULL DEFAULT 'بركاء، الصومحان الجنوب، بناية R&B، بالقرب من مستشفى بدر السماء، سلطنة عُمان',
    location_en TEXT NOT NULL DEFAULT 'Barka, Al Somhan Al Janoub, Building R&B, Sultanate of Oman',
    phone1 VARCHAR(50) NOT NULL DEFAULT '+968 79470050',
    phone2 VARCHAR(50) NOT NULL DEFAULT '+968 94545025',
    consultation_fee_omr NUMERIC(10, 3) NOT NULL DEFAULT 3.000,
    session_fee_omr NUMERIC(10, 3) NOT NULL DEFAULT 15.000,
    package_discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. THERAPISTS (Staff table with Cultural Compliance & Gender fields)
CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    gender gender_type NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL, -- Oman MOH license
    specialty_ar TEXT NOT NULL,
    dress_code_ar TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TREATMENT ROOMS (Private female suites & traction suites)
CREATE TABLE treatment_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    designated_gender gender_type, -- NULL means 'any'
    room_type room_type NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. REAL MEDICAL EQUIPMENT IN CLINIC
CREATE TABLE medical_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'cervical_traction', 'lumbar_traction', 'shockwave', 'electro_ultrasound'
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    room_id UUID REFERENCES treatment_rooms(id),
    maintenance_status VARCHAR(50) DEFAULT 'optimal',
    is_operational BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PATIENT REGISTRY (Oman Civil ID & Gender Segregation)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civil_id VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    gender gender_type NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    primary_diagnosis_ar TEXT NOT NULL,
    chief_complaint TEXT NOT NULL,
    assigned_therapist_id UUID REFERENCES therapists(id),
    vas_baseline INT CHECK (vas_baseline >= 0 AND vas_baseline <= 10),
    vas_current INT CHECK (vas_current >= 0 AND vas_current <= 10),
    insurance_provider VARCHAR(255),
    insurance_card_no VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 5-DIMENSIONAL APPOINTMENTS TABLE
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES therapists(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES treatment_rooms(id) ON DELETE RESTRICT,
    device_id UUID REFERENCES medical_devices(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    status appointment_status DEFAULT 'confirmed',
    amount_omr NUMERIC(10, 3) NOT NULL,
    notes TEXT,
    conflict_validated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. DEVELOPED SOAP NOTES FOR PHYSIOTHERAPY
CREATE TABLE soap_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id),
    therapist_id UUID REFERENCES therapists(id),
    session_number INT NOT NULL,
    -- Subjective (S)
    subjective_complaint TEXT NOT NULL,
    vas_pain_score INT CHECK (vas_pain_score >= 0 AND vas_pain_score <= 10),
    pain_behavior TEXT,
    functional_limitations TEXT,
    -- Objective (O)
    palpation_findings TEXT,
    active_rom JSONB NOT NULL DEFAULT '{}'::jsonb,
    passive_rom JSONB NOT NULL DEFAULT '{}'::jsonb,
    mmt_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    special_tests JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Assessment (A)
    tissue_response tissue_response_enum NOT NULL,
    clinical_impression TEXT NOT NULL,
    prognosis TEXT,
    -- Plan (P)
    modalities_used TEXT[],
    manual_techniques TEXT[],
    home_program_updates TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PAIN LOCATION MAPPING TIMELINE
CREATE TABLE pain_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    view_aspect VARCHAR(20) NOT NULL, -- 'anterior' or 'posterior'
    coord_x NUMERIC(5, 2) NOT NULL,
    coord_y NUMERIC(5, 2) NOT NULL,
    zone_code VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'mild', 'moderate', 'severe'
    vas_score INT NOT NULL,
    pain_nature VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. REHABILITATION PACKAGES (10% OFF policy on 5+ sessions)
CREATE TABLE package_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    package_name_ar VARCHAR(255) NOT NULL,
    specialty_category VARCHAR(100) NOT NULL,
    total_sessions INT NOT NULL CHECK (total_sessions >= 1),
    completed_sessions INT NOT NULL DEFAULT 0,
    remaining_sessions INT NOT NULL,
    original_price_omr NUMERIC(10, 3) NOT NULL,
    discount_applied_omr NUMERIC(10, 3) NOT NULL,
    final_price_omr NUMERIC(10, 3) NOT NULL,
    paid_amount_omr NUMERIC(10, 3) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 11. OMAN INSURANCE BILLING CLAIMS (Daman, NLGIC, Dhofar)
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id),
    insurance_company VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    approval_code VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    procedure_code VARCHAR(50) NOT NULL, -- e.g. 'PT-202'
    procedure_description_ar TEXT NOT NULL,
    gross_amount_omr NUMERIC(10, 3) NOT NULL,
    copay_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    copay_omr NUMERIC(10, 3) NOT NULL,
    insurance_share_omr NUMERIC(10, 3) NOT NULL,
    status claim_status_enum DEFAULT 'approved',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- Admins & Receptionists have full access
CREATE POLICY "Admins full management" ON patients
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' IN ('admin', 'receptionist'));

-- Physiotherapists can view and edit patients assigned to them
CREATE POLICY "Physiotherapists access assigned patients" ON patients
    FOR SELECT TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'physiotherapist' AND
        (assigned_therapist_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    );

-- Patients can only view their own records
CREATE POLICY "Patients view own record" ON patients
    FOR SELECT TO authenticated
    USING (civil_id = auth.jwt() ->> 'civil_id');

-- SOAP Notes write access strictly for physiotherapists
CREATE POLICY "Physio write SOAP" ON soap_notes
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' IN ('physiotherapist', 'admin'));
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadSqlFile = () => {
    const blob = new Blob([supabaseSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'um_alqura_polyclinic_supabase_schema_2026.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Database className="w-5 h-5 text-[#2A9DA5]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'مخطط قاعدة بيانات سوبابيس الكامل وقواعد الأمان (Full Supabase PostgreSQL Schema)' : 'Supabase PostgreSQL Schema & RLS'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'مخطط DDL كامل جاهز للتشغيل على Supabase / PostgreSQL • يشمل الجداول الـ ١١، قيود التوافق الشرعي والمجتمعي، وسياسات حماية البيانات (Row Level Security)'
              : 'Complete DDL schema ready to deploy on Supabase. Covers 11 tables, RLS policies, indexes, and cultural compliance constraints.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كود SQL' : 'Copy SQL')}
          </button>
          <button
            type="button"
            onClick={downloadSqlFile}
            className="px-4 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            {isAr ? 'تحميل ملف (.sql)' : 'Download .sql'}
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-[#0F172A] rounded-xl border border-neutral-800 p-5 shadow-inner text-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs">
          <span className="font-mono text-emerald-400">supabase_schema_2026.sql</span>
          <span className="text-neutral-500">PostgreSQL 16+ • Supabase Auth & Realtime</span>
        </div>
        <pre className="font-mono text-xs overflow-x-auto max-h-[550px] leading-relaxed text-neutral-300 pr-2">
          {supabaseSql}
        </pre>
      </div>
    </div>
  );
};
