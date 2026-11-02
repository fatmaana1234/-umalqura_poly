import React, { useState } from 'react';
import { Role, Language, Patient, Appointment, PackageCourse, InsuranceClaim, HomeExercise } from './types/clinic';
import {
  CLINIC_INFO,
  THERAPISTS,
  TREATMENT_ROOMS,
  MEDICAL_DEVICES,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_PACKAGES,
  HOME_EXERCISES,
  INSURANCE_CLAIMS,
} from './data/mockData';
import { Header } from './components/Header';
import { ResourceConflictManager } from './components/modules/ResourceConflictManager';
import { SoapNotesModule } from './components/modules/SoapNotesModule';
import { InteractiveBodyMap } from './components/modules/InteractiveBodyMap';
import { ClinicalCalculators } from './components/modules/ClinicalCalculators';
import { PackagesCoursesModule } from './components/modules/PackagesCoursesModule';
import { HomeExerciseLibrary } from './components/modules/HomeExerciseLibrary';
import { ProgressChartsModule } from './components/modules/ProgressChartsModule';
import { OmanInsuranceModule } from './components/modules/OmanInsuranceModule';
import { WhatsAppIntegration } from './components/modules/WhatsAppIntegration';
import { DischargeReportModal } from './components/modules/DischargeReportModal';
import { AiScribeModule } from './components/modules/AiScribeModule';
import { CameraMotionAnalysis } from './components/modules/CameraMotionAnalysis';
import { AiHomeTrainer } from './components/modules/AiHomeTrainer';
import { OmaniVoiceBot } from './components/modules/OmaniVoiceBot';
import { PredictiveOutcomeAnalytics } from './components/modules/PredictiveOutcomeAnalytics';
import { SpecializedClinics } from './components/modules/SpecializedClinics';
import { SupabaseSchemaViewer } from './components/modules/SupabaseSchemaViewer';
import { FlutterAppViewer } from './components/modules/FlutterAppViewer';
import { ClinicOverview } from './components/modules/ClinicOverview';
import { PatientsManagement } from './components/modules/PatientsManagement';
import { FinancialLedger } from './components/modules/FinancialLedger';
import { ClinicEquipmentShowcase } from './components/modules/ClinicEquipmentShowcase';
import { DevOpsDeployment } from './components/modules/DevOpsDeployment';
import {
  Award,
  Shield,
  FileText,
  Video,
  TrendingUp,
  Brain,
  Camera,
  Bot,
  MessageCircle,
  Database,
  Smartphone,
  Server,
  Layers,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [aiSubTab, setAiSubTab] = useState<'scribe' | 'motion' | 'trainer' | 'voice' | 'predictive'>('scribe');

  // Shared Data State
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [packages, setPackages] = useState<PackageCourse[]>(INITIAL_PACKAGES);
  const [claims, setClaims] = useState<InsuranceClaim[]>(INSURANCE_CLAIMS);

  // Discharge Modal State
  const [selectedDischargePatient, setSelectedDischargePatient] = useState<Patient | null>(null);

  const isAr = lang === 'ar';

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);
  };

  const handleAddClaim = (newClaim: InsuranceClaim) => {
    setClaims([newClaim, ...claims]);
  };

  const handleOpenDischarge = (pat: Patient) => {
    setSelectedDischargePatient(pat);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F1] text-[#24383B] flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        lang={lang}
        setLang={setLang}
        onNewBookingClick={() => setActiveTab('conflict_manager')}
      />

      {/* Hero Strip / Role & Quick Bar */}
      <section className="bg-white border-b border-neutral-200 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Clinic verified details chips */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-[#075563] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#B59B62]" />
              {isAr ? 'علاج طبيعي وتأهيل فقط (لا توجد اختصاصات أخرى)' : 'Physiotherapy & Rehab Only'}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2A9DA5]" />
              {isAr ? 'بركاء - الصومحان الجنوب، بناية R&B' : 'Barka - Al Somhan'}
            </span>
            <span className="text-neutral-400">·</span>
            <span className="text-neutral-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#075563]" />
              {isAr ? 'السبت إلى الخميس: ٩:٠٠ ص - ١:٠٠ ظ & ٤:٠٠ م - ٨:٠٠ م' : 'Sat-Thu: 9am-1pm & 4pm-8pm'}
            </span>
          </div>

          {/* Quick Discharge Report Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenDischarge(patients[0])}
              className="px-3.5 py-1.5 bg-[#FAF8F1] hover:bg-[#f3ede0] text-[#075563] border border-[#B59B62]/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-[#B59B62]" />
              {isAr ? 'إصدار تقرير تخريج رسمي PDF' : 'Official Discharge PDF'}
            </button>
          </div>
        </div>
      </section>

      {/* Sub-Header Navigation Category Pills */}
      <div className="bg-[#FAF8F1] border-b border-neutral-200/80 px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs">
          {[
            { id: 'overview', labelAr: 'الرئيسية', labelEn: 'Overview' },
            { id: 'patients_directory', labelAr: 'سجل المرضى (EHR)', labelEn: 'Patients (EHR)' },
            { id: 'conflict_manager', labelAr: '١. تعارض الموارد 5D', labelEn: '1. 5D Conflicts' },
            { id: 'equipment_showcase', labelAr: 'الأجهزة والتقنيات', labelEn: 'Equipment' },
            { id: 'invoicing_ledger', labelAr: 'الفواتير والتعرفة', labelEn: 'Billing' },
            { id: 'soap_notes', labelAr: '٢. توثيق SOAP', labelEn: '2. SOAP Notes' },
            { id: 'body_map', labelAr: '٣. خريطة الألم', labelEn: '3. Body Map' },
            { id: 'calculators', labelAr: '٤. الحاسبات السريرية', labelEn: '4. Calculators' },
            { id: 'packages', labelAr: '٥. الباقات والكورسات', labelEn: '5. Packages' },
            { id: 'exercises', labelAr: '٦. مكتبة التمارين', labelEn: '6. Exercise Videos' },
            { id: 'progress_charts', labelAr: '٧. الرسوم البيانية', labelEn: '7. Progress Charts' },
            { id: 'insurance', labelAr: '٨. التأمين العُماني', labelEn: '8. Oman Insurance' },
            { id: 'whatsapp', labelAr: '٩. إشعارات الواتساب', labelEn: '9. WhatsApp API' },
            { id: 'specialized_clinics', labelAr: '١٠. العيادات الـ ٨', labelEn: '10. 8 Clinics' },
            { id: 'ai_scribe', labelAr: '١١. الكاتب الذكي Scribe', labelEn: '11. AI Scribe' },
            { id: 'motion_analysis', labelAr: '١٢. تحليل الحركة بالكاميرا', labelEn: '12. Motion ROM' },
            { id: 'home_trainer', labelAr: '١٣. المدرب المنزلي بالكاميرا', labelEn: '13. Home Trainer' },
            { id: 'voice_bot', labelAr: '١٤. البوت الصوتي العُماني', labelEn: '14. Omani Voice Bot' },
            { id: 'predictive_ai', labelAr: '١٥. التحليلات التنبؤية', labelEn: '15. Predictive AI' },
            { id: 'supabase_schema', labelAr: '١٦. سوبابيس PostgreSQL', labelEn: '16. Supabase SQL' },
            { id: 'flutter_code', labelAr: '١٧. كود فلاتر للجوال', labelEn: '17. Flutter Mobile' },
            { id: 'devops_deploy', labelAr: '١٨. دوكر وكوليفاي', labelEn: '18. Docker & Coolify' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#075563] text-white shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* Module: Clinic Overview & Executive Dashboard */}
        {activeTab === 'overview' && (
          <ClinicOverview
            patients={patients}
            appointments={appointments}
            packages={packages}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenDischarge={handleOpenDischarge}
            lang={lang}
          />
        )}

        {/* Module: Patients Management & EHR */}
        {activeTab === 'patients_directory' && (
          <PatientsManagement
            patients={patients}
            onAddPatient={(newPat) => setPatients([newPat, ...patients])}
            onOpenSoapNotes={() => setActiveTab('soap_notes')}
            onOpenBodyMap={() => setActiveTab('body_map')}
            onOpenDischarge={handleOpenDischarge}
            lang={lang}
          />
        )}

        {/* Module: Medical Equipment & Certified Hardware Showcase */}
        {activeTab === 'equipment_showcase' && (
          <ClinicEquipmentShowcase lang={lang} />
        )}

        {/* Module: Invoicing & Financial Ledger */}
        {activeTab === 'invoicing_ledger' && (
          <FinancialLedger patients={patients} lang={lang} />
        )}

        {/* Module 1: 5-Dimensional Resource Conflict Manager */}
        {activeTab === 'conflict_manager' && (
          <ResourceConflictManager
            appointments={appointments}
            patients={patients}
            therapists={THERAPISTS}
            rooms={TREATMENT_ROOMS}
            devices={MEDICAL_DEVICES}
            onAddAppointment={handleAddAppointment}
            lang={lang}
          />
        )}

        {/* Module 2: SOAP Notes */}
        {activeTab === 'soap_notes' && (
          <SoapNotesModule
            patients={patients}
            therapists={THERAPISTS}
            lang={lang}
          />
        )}

        {/* Module 3: Interactive Body Map */}
        {activeTab === 'body_map' && (
          <InteractiveBodyMap
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 4: Clinical Calculators */}
        {activeTab === 'calculators' && (
          <ClinicalCalculators lang={lang} />
        )}

        {/* Module 5: Packages & Courses */}
        {activeTab === 'packages' && (
          <PackagesCoursesModule
            packages={packages}
            patients={patients}
            onUpdatePackages={setPackages}
            lang={lang}
          />
        )}

        {/* Module 6: Home Exercise Library */}
        {activeTab === 'exercises' && (
          <HomeExerciseLibrary
            exercises={HOME_EXERCISES}
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 7: Progress Charts */}
        {activeTab === 'progress_charts' && (
          <ProgressChartsModule
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 8: Oman Insurance */}
        {activeTab === 'insurance' && (
          <OmanInsuranceModule
            claims={claims}
            patients={patients}
            onAddClaim={handleAddClaim}
            lang={lang}
          />
        )}

        {/* Module 9: WhatsApp Integration */}
        {activeTab === 'whatsapp' && (
          <WhatsAppIntegration
            patients={patients}
            lang={lang}
          />
        )}

        {/* Modules 16-23: 8 Specialized Clinics */}
        {(activeTab === 'specialized_clinics' || activeTab === 'clinics') && (
          <SpecializedClinics
            patients={patients}
            lang={lang}
          />
        )}

        {/* AI Suite Unified Container (from Header Nav) */}
        {activeTab === 'ai_suite' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#075563] flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#B59B62]" />
                  {isAr ? 'حزمة الذكاء الاصطناعي الإكلينيكي المتقدم 2026' : '2026 Clinical AI Suite'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {isAr
                    ? 'تقنيات مفتوحة المصدر: Whisper.cpp للتفريغ الصوتي، MediaPipe لتحليل المدى الحركي، ورؤية الحاسوب للتمارين'
                    : 'Open Source AI: Whisper.cpp Scribe, MediaPipe Joint Goniometer, Computer Vision Home Trainer'}
                </p>
              </div>

              {/* AI Sub-Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto bg-[#FAF8F1] p-1.5 rounded-xl border border-neutral-200/80 text-xs">
                {[
                  { id: 'scribe', labelAr: 'الكاتب الذكي (Whisper)', labelEn: 'AI Scribe' },
                  { id: 'motion', labelAr: 'قياس الحركة (MediaPipe)', labelEn: 'Motion ROM' },
                  { id: 'trainer', labelAr: 'المدرب المنزلي (CV)', labelEn: 'Home Trainer' },
                  { id: 'voice', labelAr: 'البوت العُماني (Voice)', labelEn: 'Voice Bot' },
                  { id: 'predictive', labelAr: 'التحليلات التنبؤية', labelEn: 'Predictive' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setAiSubTab(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-all ${
                      aiSubTab === st.id
                        ? 'bg-[#075563] text-white shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {isAr ? st.labelAr : st.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {aiSubTab === 'scribe' && <AiScribeModule patients={patients} lang={lang} />}
            {aiSubTab === 'motion' && <CameraMotionAnalysis patients={patients} lang={lang} />}
            {aiSubTab === 'trainer' && <AiHomeTrainer lang={lang} />}
            {aiSubTab === 'voice' && <OmaniVoiceBot patients={patients} lang={lang} />}
            {aiSubTab === 'predictive' && <PredictiveOutcomeAnalytics patients={patients} lang={lang} />}
          </div>
        )}

        {/* Module 11: AI Scribe */}
        {activeTab === 'ai_scribe' && (
          <AiScribeModule
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 12: Camera Motion Analysis */}
        {activeTab === 'motion_analysis' && (
          <CameraMotionAnalysis
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 13: AI Home Trainer */}
        {activeTab === 'home_trainer' && (
          <AiHomeTrainer lang={lang} />
        )}

        {/* Module 14: Omani Voice Bot */}
        {activeTab === 'voice_bot' && (
          <OmaniVoiceBot
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module 15: Predictive Outcome Analytics */}
        {activeTab === 'predictive_ai' && (
          <PredictiveOutcomeAnalytics
            patients={patients}
            lang={lang}
          />
        )}

        {/* Module: Supabase Schema */}
        {(activeTab === 'supabase_schema' || activeTab === 'devops_supabase') && (
          <SupabaseSchemaViewer lang={lang} />
        )}

        {/* Module: Flutter Mobile App Code */}
        {activeTab === 'flutter_code' && (
          <FlutterAppViewer lang={lang} />
        )}

        {/* Module: DevOps & Docker Deployment */}
        {activeTab === 'devops_deploy' && (
          <DevOpsDeployment lang={lang} />
        )}
      </main>

      {/* Discharge Report Modal */}
      {selectedDischargePatient && (
        <DischargeReportModal
          patient={selectedDischargePatient}
          therapist={THERAPISTS[0]}
          onClose={() => setSelectedDischargePatient(null)}
          lang={lang}
        />
      )}

      {/* Official Footer with Verified Business Details */}
      <footer className="no-print mt-auto bg-[#075563] text-white border-t border-[#B59B62]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            {/* Col 1: Identity & Official Logo */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="شعار مجمع أم القرى الطبي"
                  className="h-12 w-auto object-contain bg-white/95 p-1 rounded shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="font-bold text-sm block">مجمع أم القرى الطبي</span>
                  <span className="text-[#B59B62] text-[11px] block">بركاء - سلطنة عُمان</span>
                </div>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                المركز التخصصي الرائد في العلاج الطبيعي والتأهيل الحركي المتقدم بمحافظة جنوب الباطنة.
              </p>
            </div>

            {/* Col 2: Real Clinic Equipment */}
            <div className="space-y-2">
              <span className="font-bold text-[#B59B62] block">الأجهزة الطبية المتوفرة بالمجمع</span>
              <ul className="text-neutral-300 space-y-1 text-[11px]">
                <li>• جهاز شد الفقرات العنقية الرقمي</li>
                <li>• جهاز شد الفقرات القطنية المبرمج</li>
                <li>• جهاز الموجات التصادمية السويسري (ESWT)</li>
                <li>• جهاز الموجات فوق الصوتية والعلاج الكهربائي المدمج</li>
              </ul>
            </div>

            {/* Col 3: Official Pricing & Policies */}
            <div className="space-y-2">
              <span className="font-bold text-[#B59B62] block">التعرفة الرسمية المعتمدة</span>
              <ul className="text-neutral-300 space-y-1 text-[11px]">
                <li>• كشفية واستشارة أولية: <strong className="text-white">٣ ريال عُماني</strong></li>
                <li>• جلسة علاج طبيعي منفردة: <strong className="text-white">١٥ ريال عُماني</strong></li>
                <li>• خصم <strong className="text-[#B59B62]">١٠٪</strong> على جميع باقات ٥ جلسات فأكثر</li>
                <li>• خصوصية تامة: أخصائي للذكور وأخصائية للإناث</li>
              </ul>
            </div>

            {/* Col 4: Contact & Location */}
            <div className="space-y-2">
              <span className="font-bold text-[#B59B62] block">الموقع وأوقات العمل</span>
              <div className="text-neutral-300 space-y-1 text-[11px]">
                <p>📍 بركاء، الصومحان الجنوب، بناية R&B، بالقرب من مستشفى بدر السماء</p>
                <p>📞 هاتف المجمع: 79470050 / 94545025</p>
                <p>🕒 السبت إلى الخميس: 9:00 ص - 1:00 ظ & 4:00 م - 8:00 م</p>
                <p className="text-amber-300">🛑 الجمعة: إجازة أسبوعية</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
            <span>جميع الحقوق محفوظة © 2026 مجمع أم القرى الطبي - سلطنة عُمان</span>
            <span className="text-[#B59B62]">نظام إدارة العلاج الطبيعي والتأهيل الطبي المتكامل 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
