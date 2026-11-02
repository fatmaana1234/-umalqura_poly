import React from 'react';
import { CLINIC_INFO, THERAPISTS, MEDICAL_DEVICES } from '../../data/mockData';
import { Patient, Appointment, PackageCourse } from '../../types/clinic';
import {
  Users,
  Calendar,
  Layers,
  TrendingUp,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Stethoscope,
  Award,
  Zap,
  Activity,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  Camera,
  Bot,
} from 'lucide-react';

interface Props {
  patients: Patient[];
  appointments: Appointment[];
  packages: PackageCourse[];
  onNavigateTab: (tab: string) => void;
  onOpenDischarge: (patient: Patient) => void;
  lang: 'ar' | 'en';
}

export const ClinicOverview: React.FC<Props> = ({
  patients,
  appointments,
  packages,
  onNavigateTab,
  onOpenDischarge,
  lang,
}) => {
  const isAr = lang === 'ar';

  const todayAppointments = appointments.filter((a) => a.date === '2026-11-02' || a.status === 'confirmed');

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Facility Hero Banner with Real Clinic Photos */}
      <div className="relative rounded-2xl overflow-hidden shadow-md border border-neutral-200 bg-white">
        {/* Background Scrim with Real Clinic Reception */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900">
          <img
            src="/assets/clinic/reception.jpg"
            alt="استقبال مجمع أم القرى الطبي بركاء"
            className="w-full h-full object-cover object-center opacity-40 scale-105 hover:scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#075563] via-[#075563]/70 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#B59B62] text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAr ? 'مرخص من وزارة الصحة العُمانية • بركاء' : 'Licensed by Oman MOH • Barka'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold">
                {isAr ? 'علاج طبيعي وتأهيل حركي فقط' : 'Physiotherapy & Rehab Exclusively'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-tight drop-shadow-sm">
              {CLINIC_INFO.nameAr}
            </h1>
            <p className="text-sm sm:text-base text-[#FAF8F1]/90 mt-1 max-w-2xl font-light">
              {isAr
                ? 'النظام السحابي الإكلينيكي المتكامل 2026 لإدارة الموارد، الفحص بالذكاء الاصطناعي، وأجهزة الشد والموجات التصادمية وفق أعلى المعايير الطبية الدولية وبخصوصية تامة.'
                : 'Complete 2026 Clinical Cloud ERP & AI Rehabilitation Platform for Um Alqura Polyclinic, Barka, Sultanate of Oman.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#FAF8F1]/80">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B59B62]" />
                {CLINIC_INFO.locationAr}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#B59B62]" />
                {CLINIC_INFO.phone1} / {CLINIC_INFO.phone2}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B59B62]" />
                {CLINIC_INFO.workingHoursAr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold text-neutral-600">{isAr ? 'المرضى المسجلون' : 'Active Patients'}</span>
            <Users className="w-4 h-4 text-[#075563]" />
          </div>
          <span className="text-2xl font-black text-[#075563] font-mono block">184</span>
          <p className="text-[10px] text-emerald-600 font-medium">{isAr ? '+14 حالة جديدة هذا الشهر' : '+14 new this month'}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold text-neutral-600">{isAr ? 'جلسات اليوم المجدولة' : 'Today Sessions'}</span>
            <Calendar className="w-4 h-4 text-[#2A9DA5]" />
          </div>
          <span className="text-2xl font-black text-[#075563] font-mono block">{todayAppointments.length}</span>
          <p className="text-[10px] text-neutral-500">{isAr ? 'سعة الجلسات: ٣٢ جلسة/يوم' : '32 max daily capacity'}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold text-neutral-600">{isAr ? 'الباقات العلاجية النشطة' : 'Active Courses'}</span>
            <Layers className="w-4 h-4 text-[#B59B62]" />
          </div>
          <span className="text-2xl font-black text-[#075563] font-mono block">{packages.length}</span>
          <p className="text-[10px] text-emerald-600 font-medium">{isAr ? 'خصم ١٠٪ مطبق آلياً' : '10% discount applied'}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold text-neutral-600">{isAr ? 'نسبة انحسار الألم (VAS)' : 'Pain Subsidence'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-600 font-mono block">-68.4%</span>
          <p className="text-[10px] text-neutral-500">{isAr ? 'متوسط تحسن الحالات' : 'Average improvement'}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-bold text-neutral-600">{isAr ? 'التعرفة الرسمية' : 'Official Pricing'}</span>
            <Stethoscope className="w-4 h-4 text-[#075563]" />
          </div>
          <div className="text-xs font-bold text-[#075563] pt-1">
            <span>كشفية: 3 ر.ع</span>
            <span className="block text-[11px] text-neutral-600 font-normal">جلسة: 15 ر.ع (خصم باقة)</span>
          </div>
        </div>
      </div>

      {/* 3. Real Clinic Facilities & Technology Showcase (Grid with real images) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#075563]">
              {isAr ? 'مرافق وأجهزة مجمع أم القرى الطبي (بركاء، عُمان)' : 'Real Clinic Facilities & Equipment (Barka, Oman)'}
            </h2>
            <p className="text-xs text-neutral-500">
              {isAr
                ? 'صور وتجهيزات المركز الواقع في الصومحان الجنوب، بناية R&B بالقرب من مستشفى بدر السماء'
                : 'Real photos of our specialized rehabilitation suites, BTL devices, and spinal traction facilities.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('specialized_clinics')}
            className="text-xs font-bold text-[#075563] hover:text-[#2A9DA5] flex items-center gap-1 transition-colors"
          >
            <span>{isAr ? 'عرض العيادات التخصصية الـ ٨' : 'View 8 Clinics'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 1: Spinal Traction Suite */}
          <div
            onClick={() => onNavigateTab('specialized_clinics')}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
              <img
                src="/assets/clinic/spinal_traction_bed.jpg"
                alt="جهاز شد الفقرات القطنية والعنقية الرقمي"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#075563] text-white shadow-xs">
                {isAr ? 'جناح شد الفقرات' : 'Spinal Traction'}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-xs text-[#075563] group-hover:text-[#2A9DA5] transition-colors">
                {isAr ? 'جهاز شد الفقرات العنقية والقطنية الرقمي' : 'Spinal Traction Table & Decompression'}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {isAr
                  ? 'برمجة قوة الشد الميكانيكي التدريجي لعلاج الانزلاقات الغضروفية وعرق النسا بدقة عالية.'
                  : 'Digital decompression traction bed for lumbar and cervical herniated discs.'}
              </p>
            </div>
          </div>

          {/* Item 2: BTL 4000 Electrotherapy & Ultrasound */}
          <div
            onClick={() => onNavigateTab('specialized_clinics')}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
              <img
                src="/assets/clinic/btl4000_electro_us.jpg"
                alt="جهاز العلاج الكهربائي والموجات فوق الصوتية BTL 4000"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#2A9DA5] text-white shadow-xs">
                {isAr ? 'BTL 4000 المزدوج' : 'BTL 4000 Combo'}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-xs text-[#075563] group-hover:text-[#2A9DA5] transition-colors">
                {isAr ? 'العلاج الكهربائي والموجات فوق الصوتية المدمج' : 'Electrotherapy + Ultrasound Unit'}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {isAr
                  ? 'شاشة ذكية وقرص تحكم مضيء، ٤ إلكترودات لتسكين الألم الفوري وتليين الأنسجة الصلبة.'
                  : 'Dual output unit for TENS, IFT, and deep therapeutic ultrasound waves.'}
              </p>
            </div>
          </div>

          {/* Item 3: Radial Shockwave Therapy */}
          <div
            onClick={() => onNavigateTab('specialized_clinics')}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
              <img
                src="/assets/clinic/shockwave_poster.jpg"
                alt="جهاز الموجات التصادمية السويسري Shockwave"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#B59B62] text-white shadow-xs">
                {isAr ? 'Shockwave Therapy' : 'Radial ESWT'}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-xs text-[#075563] group-hover:text-[#2A9DA5] transition-colors">
                {isAr ? 'جهاز الموجات التصادمية الشعاعية (ESWT)' : 'Radial Shockwave Therapy'}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {isAr
                  ? 'تفتيت التكلسات، علاج شوكة العقب والتهاب وتر الرضفة، وإعادة تحفيز التروية الدموية.'
                  : 'Treats plantar fasciitis, tendonitis, and calcifications effectively.'}
              </p>
            </div>
          </div>

          {/* Item 4: Medical Rehabilitation Gym */}
          <div
            onClick={() => onNavigateTab('specialized_clinics')}
            className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
              <img
                src="/assets/clinic/gym_hall.jpg"
                alt="صالة التأهيل الطبي والجيم الحركي بمجمع أم القرى"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#24383B] text-white shadow-xs">
                {isAr ? 'الجيم الطبي' : 'Rehab Gym'}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-xs text-[#075563] group-hover:text-[#2A9DA5] transition-colors">
                {isAr ? 'الصالة التأهيلية والجيم الطبي الحركي' : 'Medical Gymnasium & Motor Rehab'}
              </h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {isAr
                  ? 'مسارات المشي، دراجات التأهيل، أوزان تقوية العضلات، وألواح التوازن لمنع السقوط.'
                  : 'Equipped with parallel bars, ergometers, and balance re-education gear.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Access Hub to 2026 PDF Upgrades */}
      <div className="bg-[#FAF8F1] rounded-2xl border border-[#B59B62]/30 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B59B62]" />
            <h3 className="font-bold text-[#075563] text-sm sm:text-base">
              {isAr ? 'منظومة التطوير الإكلينيكي والذكاء الاصطناعي 2026 (مستند التطوير المعتمد)' : '2026 Clinical & AI Upgrades Suite'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">23 Functional Modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { id: 'conflict_manager', titleAr: 'تعارض الموارد 5D', icon: ShieldCheck, color: 'text-[#075563]' },
            { id: 'soap_notes', titleAr: 'ملاحظات SOAP', icon: Activity, color: 'text-[#2A9DA5]' },
            { id: 'body_map', titleAr: 'خريطة مواضع الألم', icon: MapPin, color: 'text-rose-600' },
            { id: 'calculators', titleAr: 'الحاسبات (ODI/DASH)', icon: Zap, color: 'text-amber-700' },
            { id: 'ai_scribe', titleAr: 'الكاتب الذكي Scribe', icon: Sparkles, color: 'text-[#B59B62]' },
            { id: 'motion_analysis', titleAr: 'تحليل الحركة بالكاميرا', icon: Camera, color: 'text-indigo-600' },
            { id: 'home_trainer', titleAr: 'المدرب المنزلي بالكاميرا', icon: Activity, color: 'text-emerald-700' },
            { id: 'voice_bot', titleAr: 'البوت الصوتي العُماني', icon: Bot, color: 'text-[#075563]' },
            { id: 'predictive_ai', titleAr: 'التحليلات التنبؤية', icon: TrendingUp, color: 'text-[#2A9DA5]' },
            { id: 'insurance', titleAr: 'التأمين العُماني (ضمان)', icon: ShieldCheck, color: 'text-[#075563]' },
            { id: 'whatsapp', titleAr: 'إشعارات الواتساب', icon: Phone, color: 'text-[#25D366]' },
            { id: 'specialized_clinics', titleAr: 'العيادات التخصصية الـ ٨', icon: Stethoscope, color: 'text-[#B59B62]' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onNavigateTab(m.id)}
                className="p-3 bg-white rounded-xl border border-neutral-200/80 hover:border-[#075563] text-right shadow-2xs hover:shadow-xs transition-all space-y-1.5 group"
              >
                <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition-transform`} />
                <span className="block text-xs font-bold text-neutral-800 group-hover:text-[#075563] leading-snug">
                  {m.titleAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Today's Appointments & Patient Roster Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#075563] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2A9DA5]" />
                {isAr ? 'جدول جلسات اليوم بمجمع أم القرى (بركاء)' : 'Today Scheduled Rehabilitation Sessions'}
              </h3>
              <span className="text-[11px] text-neutral-500">
                {isAr ? 'محصن بالكامل ضد تعارض الموارد خماسي الأبعاد' : '5D Conflict-free validated schedule'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('conflict_manager')}
              className="text-xs font-bold text-[#075563] hover:text-[#2A9DA5] flex items-center gap-1"
            >
              <span>{isAr ? 'حجز موعد جديد' : 'New Slot'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-white transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#075563] text-sm">{apt.patientName}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-mono text-neutral-600 font-semibold">{apt.timeSlot}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {isAr ? 'مؤكد ومحجوز' : 'Confirmed'}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-600 flex flex-wrap items-center gap-3">
                  <span>👨‍⚕️ {apt.therapistName}</span>
                  <span>•</span>
                  <span>🚪 {apt.roomName}</span>
                  {apt.deviceName && (
                    <>
                      <span>•</span>
                      <span className="text-[#B59B62] font-semibold">⚡ {apt.deviceName}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 text-[11px]">
                  <span className="text-neutral-500">{apt.notes || 'جلسة تأهيل قياسية'}</span>
                  <span className="font-mono font-bold text-[#075563]">{apt.amountOmr.toFixed(3)} ر.ع</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Patients & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-bold text-xs sm:text-sm text-[#075563] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#075563]" />
              {isAr ? 'أحدث ملفات المرضى المسجلين' : 'Recent Patient Admissions'}
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('patients_directory')}
              className="text-xs font-bold text-[#075563] hover:text-[#2A9DA5]"
            >
              {isAr ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-white transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#075563]">{p.nameAr}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">مدني: {p.civilId}</span>
                </div>
                <p className="text-[11px] text-neutral-600 line-clamp-1">{p.diagnosisAr}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                  <span>
                    {isAr ? 'الجلسات: ' : 'Sessions: '}
                    <strong className="text-[#075563]">{p.totalSessionsAttended}</strong>
                  </span>
                  <span>
                    {isAr ? 'مقياس الألم: ' : 'Pain VAS: '}
                    <strong className="text-red-600">{p.vasCurrent}/10</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDischarge(p)}
                    className="text-[#B59B62] font-bold hover:underline"
                  >
                    {isAr ? 'تقرير التخريج' : 'Discharge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
