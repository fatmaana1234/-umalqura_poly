export type Role = 'admin' | 'physio' | 'reception' | 'patient';

export type Language = 'ar' | 'en';

export type Gender = 'male' | 'female';

export interface ClinicInfo {
  nameAr: string;
  nameEn: string;
  sloganAr: string;
  sloganEn: string;
  locationAr: string;
  locationEn: string;
  phone1: string;
  phone2: string;
  email: string;
  workingHoursAr: string;
  workingHoursEn: string;
  pricing: {
    consultation: number; // 3 OMR
    session: number; // 15 OMR
    packageDiscountPercent: number; // 10%
  };
}

export interface Therapist {
  id: string;
  nameAr: string;
  nameEn: string;
  gender: Gender;
  titleAr: string;
  titleEn: string;
  specialtyAr: string;
  specialtyEn: string;
  dressCodeAr: string; // Omani Dishdasha & Kuma for male, modest Abaya for female
  dressCodeEn: string;
  availableDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  shiftHours: string;
  avatar: string;
  licenseNumber: string;
}

export interface TreatmentRoom {
  id: string;
  nameAr: string;
  nameEn: string;
  designatedGender: 'male' | 'female' | 'any';
  type: 'general' | 'female_private' | 'traction_suite' | 'shockwave_suite';
  capacity: number;
}

export interface MedicalDevice {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'cervical_traction' | 'lumbar_traction' | 'shockwave' | 'electro_ultrasound';
  serialNumber: string;
  isAvailable: boolean;
  maintenanceStatus: 'optimal' | 'due_check';
  roomAssigned: string;
}

export interface Patient {
  id: string;
  civilId: string; // Omani Civil ID e.g. 10482910
  nameAr: string;
  nameEn: string;
  gender: Gender;
  age: number;
  phone: string;
  address: string;
  diagnosisAr: string;
  diagnosisEn: string;
  chiefComplaint: string;
  assignedTherapistId: string;
  assignedRoomId: string;
  preferredRoomId?: string;
  registrationDate: string;
  totalSessionsAttended: number;
  totalSessionsPrescribed?: number;
  activePackageId?: string;
  insuranceProvider?: string;
  insuranceCardNo?: string;
  policyNumber?: string;
  copayPercentage?: number;
  vasBaseline: number; // 0-10
  vasCurrent: number; // 0-10
  status?: 'active' | 'completed' | 'on_hold';
  createdAt?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: Gender;
  therapistId: string;
  therapistName: string;
  roomId: string;
  roomName: string;
  deviceId?: string;
  deviceName?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  durationMinutes: number; // 30, 45, 60
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'waitlist';
  sessionType: 'consultation' | 'session' | 'package_session';
  amountOmr: number;
  notes?: string;
  conflictCheckPassed: boolean;
}

export interface SoapNote {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  sessionNumber: number;
  therapistId: string;
  // S - Subjective
  subjective: {
    patientComplaint: string;
    painLocation: string[];
    vasPainScore: number; // 0-10
    painBehavior: string; // Morning stiffness, Aggravated by sitting, etc.
    functionalLimitations: string;
  };
  // O - Objective
  objective: {
    postureFindings: string;
    palpationSpasm: string;
    activeRom: Record<string, { baseline: number; current: number; normal: number; unit: string }>;
    passiveRom: Record<string, { baseline: number; current: number; normal: number; unit: string }>;
    manualMuscleTesting: Record<string, string>; // e.g. Quadriceps: 4/5
    specialTests: Record<string, 'positive' | 'negative'>;
    neurologicalCheck: string;
  };
  // A - Assessment
  assessment: {
    tissueResponse: 'improving_rapidly' | 'moderate_progress' | 'plateau' | 'reactive_flareup';
    clinicalImpression: string;
    shortTermGoalProgress: string;
    prognosis: string;
  };
  // P - Plan
  plan: {
    modalityUsed: string[];
    manualTherapyTechniques: string[];
    exercisePrescription: string[];
    homeProgramUpdates: string;
    precautions: string;
    nextAppointmentDate: string;
  };
}

export interface PainPoint {
  id: string;
  x: number; // SVG percentage 0-100
  y: number; // SVG percentage 0-100
  view: 'anterior' | 'posterior';
  zone: 'cervical' | 'thoracic' | 'lumbar' | 'shoulder_r' | 'shoulder_l' | 'elbow_r' | 'elbow_l' | 'wrist_r' | 'wrist_l' | 'hip_r' | 'hip_l' | 'knee_r' | 'knee_l' | 'ankle_r' | 'ankle_l';
  zoneNameAr: string;
  zoneNameEn: string;
  severity: 'mild' | 'moderate' | 'severe'; // 1-4, 5-7, 8-10
  score: number; // 1-10
  nature: 'dull' | 'sharp' | 'burning' | 'radiating' | 'aching';
  dateAdded: string;
}

export interface PackageCourse {
  id: string;
  patientId: string;
  patientName: string;
  packageNameAr: string;
  packageNameEn: string;
  specialtyCategory: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  originalPriceOmr: number;
  discountAppliedOmr: number;
  finalPriceOmr: number;
  paidAmountOmr: number;
  remainingPaymentOmr: number;
  startDate: string;
  status: 'active' | 'completed' | 'on_hold';
  devicesIncluded: string[];
}

export interface HomeExercise {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'cervical' | 'lumbar' | 'knee' | 'shoulder' | 'posture' | 'balance';
  targetMuscleAr: string;
  repsAndSets: string;
  holdTimeSeconds: number;
  frequency: string;
  instructionsAr: string[];
  precautionsAr: string;
  modestyNoticeAr: string;
  thumbnailUrl: string;
  videoDurationSec: number;
}

export interface InsuranceClaim {
  id: string;
  patientCivilId: string;
  patientName: string;
  insuranceCompany: string; // Daman Health, Dhofar Insurance, Oman United, etc.
  policyNumber: string;
  approvalCode: string;
  serviceDate: string;
  procedureCode: string;
  procedureDescriptionAr: string;
  grossAmountOmr: number;
  patientCopayPercent: number;
  patientCopayOmr: number;
  insuranceClaimOmr: number;
  status: 'approved' | 'pending' | 'submitted' | 'settled';
}
