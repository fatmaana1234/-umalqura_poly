import React, { useState } from 'react';
import { PackageCourse, Patient } from '../../types/clinic';
import { Layers, Plus, CheckCircle2, CreditCard, Clock, Activity, Percent } from 'lucide-react';

interface Props {
  packages: PackageCourse[];
  patients: Patient[];
  onUpdatePackages: (updated: PackageCourse[]) => void;
  lang: 'ar' | 'en';
}

export const PackagesCoursesModule: React.FC<Props> = ({
  packages,
  patients,
  onUpdatePackages,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [packageList, setPackageList] = useState<PackageCourse[]>(packages);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Package Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [packageNameAr, setPackageNameAr] = useState('باقة تأهيل متكاملة مخصصة (١٠ جلسات)');
  const [category, setCategory] = useState('العمود الفقري والديسك');
  const [sessionsCount, setSessionsCount] = useState<number>(10);
  const [paidAmount, setPaidAmount] = useState<number>(135);

  // Calculate pricing with 10% discount for >= 5 sessions
  const singleSessionPrice = 15;
  const originalPrice = sessionsCount * singleSessionPrice;
  const discountPercent = sessionsCount >= 5 ? 10 : 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = originalPrice - discountAmount;

  const handleDeductSession = (pkgId: string) => {
    const updated = packageList.map((pkg) => {
      if (pkg.id === pkgId && pkg.remainingSessions > 0) {
        const newCompleted = pkg.completedSessions + 1;
        const newRemaining = pkg.totalSessions - newCompleted;
        return {
          ...pkg,
          completedSessions: newCompleted,
          remainingSessions: newRemaining,
          status: (newRemaining === 0 ? 'completed' : 'active') as 'completed' | 'active',
        };
      }
      return pkg;
    });

    setPackageList(updated);
    onUpdatePackages(updated);
  };

  const handleCreatePackage = () => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const newPkg: PackageCourse = {
      id: `pkg-${Date.now()}`,
      patientId,
      patientName: patient.nameAr,
      packageNameAr,
      packageNameEn: 'Custom Physiotherapy Course',
      specialtyCategory: category,
      totalSessions: sessionsCount,
      completedSessions: 0,
      remainingSessions: sessionsCount,
      originalPriceOmr: originalPrice,
      discountAppliedOmr: discountAmount,
      finalPriceOmr: finalPrice,
      paidAmountOmr: paidAmount,
      remainingPaymentOmr: Math.max(0, finalPrice - paidAmount),
      startDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      devicesIncluded: ['شد الفقرات الرقمي', 'العلاج الكهربائي والموجات فوق الصوتية'],
    };

    const updated = [newPkg, ...packageList];
    setPackageList(updated);
    onUpdatePackages(updated);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'نظام الباقات والكورسات العلاجية (Courses & Packages System)' : 'Courses & Packages System'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'إدارة الخطط العلاجية الشاملة بدلاً من المواعيد الفردية • تطبيق خصم ١٠٪ التلقائي على باقات ٥ جلسات فأكثر • خصم الجلسات المنجزة آلياً ومتابعة الرصيد المالي والسريري'
              : 'Multi-session rehabilitation courses. 10% discount on packages of 5+ sessions. Auto-deduction and financial/clinical balance tracking.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-[#075563] text-white rounded-lg text-xs font-bold hover:bg-[#06424e] flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {isAr ? 'إنشاء باقة علاجية جديدة لمريض' : 'Create New Patient Package'}
        </button>
      </div>

      {/* Package KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">
            {isAr ? 'إجمالي الباقات النشطة' : 'Active Packages'}
          </span>
          <span className="text-2xl font-bold text-[#075563] mt-1 block">
            {packageList.filter((p) => p.status === 'active').length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">
            {isAr ? 'الجلسات المنجزة الكلية' : 'Total Sessions Delivered'}
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {packageList.reduce((acc, p) => acc + p.completedSessions, 0)}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">
            {isAr ? 'الجلسات المتبقية في رصيد المرضى' : 'Remaining Sessions Balance'}
          </span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">
            {packageList.reduce((acc, p) => acc + p.remainingSessions, 0)}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">
            {isAr ? 'إجمالي وفورات المرضى بالخصم' : 'Total 10% Discount Savings'}
          </span>
          <span className="text-2xl font-bold text-[#B59B62] mt-1 block font-mono">
            {packageList.reduce((acc, p) => acc + p.discountAppliedOmr, 0)}{' '}
            <span className="text-xs font-normal text-neutral-500">ر.ع</span>
          </span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packageList.map((pkg) => {
          const progressPercent = Math.round((pkg.completedSessions / pkg.totalSessions) * 100);
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4 hover:border-[#075563]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                <div>
                  <span className="text-[11px] text-[#B59B62] font-bold block mb-0.5">
                    {pkg.specialtyCategory}
                  </span>
                  <h3 className="text-sm font-bold text-[#075563]">{pkg.packageNameAr}</h3>
                  <div className="text-xs text-neutral-700 font-medium mt-1">
                    {isAr ? 'المريض:' : 'Patient:'} <span className="font-bold">{pkg.patientName}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    pkg.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {pkg.status === 'active'
                    ? isAr
                      ? 'قيد التنفيذ'
                      : 'Active'
                    : isAr
                    ? 'مكتملة'
                    : 'Completed'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">
                    {isAr ? 'التقدم السريري:' : 'Clinical Progress:'}{' '}
                    <span className="font-bold text-[#075563]">
                      {pkg.completedSessions} / {pkg.totalSessions} {isAr ? 'جلسات' : 'sessions'}
                    </span>
                  </span>
                  <span className="font-bold font-mono text-[#075563]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#075563] to-[#2A9DA5] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 block">{isAr ? 'السعر بعد الخصم' : 'Net Price'}</span>
                  <span className="font-bold text-[#075563] font-mono">{pkg.finalPriceOmr} ر.ع</span>
                  <span className="text-[9px] text-emerald-600 block">(وفر {pkg.discountAppliedOmr} ر.ع)</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{isAr ? 'المدفوع' : 'Paid'}</span>
                  <span className="font-bold text-emerald-700 font-mono">{pkg.paidAmountOmr} ر.ع</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">{isAr ? 'المتبقي المالي' : 'Balance'}</span>
                  <span
                    className={`font-bold font-mono ${
                      pkg.remainingPaymentOmr > 0 ? 'text-rose-600' : 'text-neutral-500'
                    }`}
                  >
                    {pkg.remainingPaymentOmr} ر.ع
                  </span>
                </div>
              </div>

              {/* Devices included */}
              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                <span className="font-semibold text-neutral-700">{isAr ? 'الأجهزة المضمنة:' : 'Devices:'}</span>
                <span>{pkg.devicesIncluded.join(' • ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={pkg.remainingSessions === 0}
                  onClick={() => handleDeductSession(pkg.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                    pkg.remainingSessions > 0
                      ? 'bg-[#075563] hover:bg-[#06424e] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? 'خصم جلسة منجزة اليوم (Deduct Session)' : 'Deduct Session'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Package Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <h3 className="text-base font-bold text-[#075563] border-b border-neutral-100 pb-3">
              {isAr ? 'إنشاء باقة علاجية جديدة وتطبيق خصم ١٠٪' : 'Create New Course with 10% Discount'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'اختر المريض' : 'Patient'}
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameAr} - {p.diagnosisAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'اسم الباقة العلاجية' : 'Package Name'}
              </label>
              <input
                type="text"
                value={packageNameAr}
                onChange={(e) => setPackageNameAr(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {isAr ? 'عدد الجلسات' : 'Sessions Count'}
                </label>
                <select
                  value={sessionsCount}
                  onChange={(e) => {
                    const c = Number(e.target.value);
                    setSessionsCount(c);
                    const orig = c * 15;
                    const disc = c >= 5 ? orig * 0.1 : 0;
                    setPaidAmount(orig - disc);
                  }}
                  className="w-full text-xs border border-neutral-300 rounded p-2"
                >
                  <option value={5}>٥ جلسات (خصم ١٠٪)</option>
                  <option value={8}>٨ جلسات (خصم ١٠٪)</option>
                  <option value={10}>١٠ جلسات (خصم ١٠٪)</option>
                  <option value={12}>١٢ جلسة (تأهيل متقدم - خصم ١٠٪)</option>
                  <option value={15}>١٥ جلسة (تأهيل إصابات ملاعب - خصم ١٠٪)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {isAr ? 'التصنيف التخصصي' : 'Specialty Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded p-2"
                >
                  <option value="العمود الفقري والديسك">العمود الفقري والديسك</option>
                  <option value="تأهيل مفصل الكتف">تأهيل مفصل الكتف</option>
                  <option value="إصابات الملاعب والرباط الصليبي">إصابات الملاعب والرباط الصليبي</option>
                  <option value="تأهيل كبار السن وخشونة الركبة">تأهيل كبار السن وخشونة الركبة</option>
                </select>
              </div>
            </div>

            {/* Financial Calculation Live Preview */}
            <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>{isAr ? 'السعر الأصلي (١٥ ر.ع × عدد الجلسات):' : 'Gross Price:'}</span>
                <span className="font-mono">{originalPrice} ر.ع</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>{isAr ? 'خصم مجمع أم القرى الطبي (١٠٪):' : 'Clinic 10% Discount:'}</span>
                <span className="font-mono">-{discountAmount} ر.ع</span>
              </div>
              <div className="flex justify-between text-[#075563] font-bold border-t border-[#B59B62]/20 pt-1 text-sm">
                <span>{isAr ? 'السعر الصافي للباقة:' : 'Net Package Price:'}</span>
                <span className="font-mono">{finalPrice} ر.ع</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleCreatePackage}
                className="flex-1 py-2.5 bg-[#075563] text-white rounded-lg text-xs font-bold hover:bg-[#06424e]"
              >
                {isAr ? 'تأكيد وحفظ الباقة' : 'Create Package'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2.5 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-bold hover:bg-neutral-200"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
