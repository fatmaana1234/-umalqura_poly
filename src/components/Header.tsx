import React from 'react';
import { Role, Language } from '../types/clinic';
import { Phone, Calendar, UserCheck, Shield, Stethoscope, Globe, Bed } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onNewBookingClick: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  lang,
  setLang,
  onNewBookingClick,
}) => {
  const isAr = lang === 'ar';

  const navLinks = [
    { id: 'overview', labelAr: 'الرئيسية', labelEn: 'Overview' },
    { id: 'patients_directory', labelAr: 'سجل المرضى', labelEn: 'Patients' },
    { id: 'conflict_manager', labelAr: 'المواعيد 5D', labelEn: '5D Schedule' },
    { id: 'equipment_showcase', labelAr: 'الأجهزة والتقنيات', labelEn: 'Equipment' },
    { id: 'invoicing_ledger', labelAr: 'الفواتير والتعرفة', labelEn: 'Billing' },
    { id: 'soap_notes', labelAr: 'ملاحظات SOAP', labelEn: 'SOAP' },
    { id: 'body_map', labelAr: 'خريطة الألم', labelEn: 'Body Map' },
    { id: 'calculators', labelAr: 'الحاسبات', labelEn: 'Calculators' },
    { id: 'packages', labelAr: 'الباقات والكورسات', labelEn: 'Packages' },
    { id: 'specialized_clinics', labelAr: 'العيادات الـ ٨', labelEn: '8 Clinics' },
    { id: 'ai_suite', labelAr: 'الذكاء الاصطناعي', labelEn: 'AI 2026' },
    { id: 'devops_supabase', labelAr: 'قاعدة البيانات والتطبيق', labelEn: 'DB & App' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#075563] text-white shadow-md border-b border-[#B59B62]/30">
      {/* Top Notification Bar */}
      <div className="bg-[#053c46] px-4 sm:px-8 py-1.5 text-[11px] flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-[#B59B62] font-bold">
            {isAr ? 'مجمع أم القرى الطبي - بركاء، سلطنة عُمان' : 'Um Alqura Polyclinic - Barka, Oman'}
          </span>
          <span className="hidden sm:inline text-neutral-300">
            {isAr ? 'الصومحان الجنوب، بناية R&B، بالقرب من مستشفى بدر السماء' : 'Al Somhan, Building R&B'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="tel:+96879470050"
            className="flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#B59B62]" />
            <span className="font-mono">79470050 / 94545025</span>
          </a>
          <span className="hidden sm:inline text-neutral-400">·</span>
          <span className="hidden sm:inline text-emerald-400 font-medium">
            {isAr ? 'السبت - الخميس (٩ص - ١ظ & ٤ع - ٨م)' : 'Sat-Thu: 9am-1pm & 4pm-8pm'}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-6">
        {/* Zone 1: Single element brand wordmark with exact official logo */}
        <div
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <img
            src="/logo.png"
            alt="شعار مجمع أم القرى الطبي"
            className="h-10 w-auto object-contain bg-white/95 p-1 rounded-md shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="leading-tight">
            <span className="text-base sm:text-lg font-black tracking-tight text-white block">
              {isAr ? 'مُجَمَّع أُمِّ القُرَى الطِّبِّي' : 'Um Alqura Polyclinic'}
            </span>
            <span className="text-[10px] text-[#B59B62] font-semibold block">
              {isAr ? 'العلاج الطبيعي والتأهيل الطبي المتقدم' : 'Physiotherapy & Rehabilitation'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold overflow-x-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === link.id
                  ? 'bg-white text-[#075563] font-bold shadow-xs'
                  : 'text-neutral-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {isAr ? link.labelAr : link.labelEn}
            </button>
          ))}
        </nav>

        {/* Zone 3: Role Switcher, Language Toggle, and Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1.5 bg-[#053c46] p-1 rounded-lg border border-white/15">
            <span className="text-[10px] text-neutral-300 px-1 hidden md:inline">
              {isAr ? 'الدور:' : 'Role:'}
            </span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as Role)}
              className="bg-transparent text-white text-xs font-bold rounded focus:outline-hidden cursor-pointer"
            >
              <option value="admin" className="text-neutral-900">
                {isAr ? 'المدير الإداري (Admin)' : 'Admin'}
              </option>
              <option value="physio" className="text-neutral-900">
                {isAr ? 'أخصائي علاج طبيعي' : 'Physiotherapist'}
              </option>
              <option value="reception" className="text-neutral-900">
                {isAr ? 'موظف الاستقبال' : 'Receptionist'}
              </option>
              <option value="patient" className="text-neutral-900">
                {isAr ? 'المريض (Patient App)' : 'Patient'}
              </option>
            </select>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => {
              const newLang = lang === 'ar' ? 'en' : 'ar';
              setLang(newLang);
              document.documentElement.lang = newLang;
              document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="w-4 h-4 text-[#B59B62]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onNewBookingClick}
            className="px-3.5 py-2 bg-[#B59B62] hover:bg-[#a68c55] text-white rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'حجز موعد جديد' : 'New Booking'}</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Navigation Scroll */}
      <div className="xl:hidden bg-[#06424e] px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/10 text-xs">
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => setActiveTab(link.id)}
            className={`px-3 py-1 rounded-md whitespace-nowrap text-xs transition-colors shrink-0 ${
              activeTab === link.id
                ? 'bg-white text-[#075563] font-bold'
                : 'text-neutral-200 hover:bg-white/10'
            }`}
          >
            {isAr ? link.labelAr : link.labelEn}
          </button>
        ))}
      </div>
    </header>
  );
};
