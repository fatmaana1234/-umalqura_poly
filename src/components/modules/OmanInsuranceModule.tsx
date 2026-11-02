import React, { useState } from 'react';
import { InsuranceClaim, Patient } from '../../types/clinic';
import { Shield, Plus, CheckCircle2, FileText, Send, Building2, Download } from 'lucide-react';

interface Props {
  claims: InsuranceClaim[];
  patients: Patient[];
  onAddClaim: (claim: InsuranceClaim) => void;
  lang: 'ar' | 'en';
}

export const OmanInsuranceModule: React.FC<Props> = ({ claims, patients, onAddClaim, lang }) => {
  const isAr = lang === 'ar';

  const [claimList, setClaimList] = useState<InsuranceClaim[]>(claims);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [insuranceCompany, setInsuranceCompany] = useState('شركة ضمان للتأمين الصحي (Daman Health Oman)');
  const [policyNumber, setPolicyNumber] = useState('DAM-OM-9921');
  const [procedureCode, setProcedureCode] = useState('PT-202');
  const [copayPercent, setCopayPercent] = useState<number>(10);
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const procedureCodes = [
    { code: 'PT-101', nameAr: 'كشفية واستشارة أولية وتقييم سريري شامل', nameEn: 'Initial PT Assessment & Evaluation', price: 3.0 },
    { code: 'PT-201', nameAr: 'علاج يدوي وتحريك المفاصل المتقدم (Manual Therapy)', nameEn: 'Manual Therapy & Joint Mobilization', price: 15.0 },
    { code: 'PT-202', nameAr: 'شد الفقرات القطنية والعنقية الميكانيكي (Traction)', nameEn: 'Mechanical Spinal Decompression Traction', price: 15.0 },
    { code: 'PT-203', nameAr: 'علاج بالموجات التصادمية الشعاعية (Shockwave ESWT)', nameEn: 'Radial Shockwave Therapy (ESWT)', price: 15.0 },
    { code: 'PT-204', nameAr: 'موجات فوق صوتية وتيار كهربي تداخلي مدمج (US + Combo)', nameEn: 'Ultrasound + Combined Electrotherapy', price: 15.0 },
    { code: 'PT-205', nameAr: 'الوخز الجاف ونقاط الزناد العضلية (Dry Needling)', nameEn: 'Trigger Point Dry Needling', price: 15.0 },
    { code: 'PT-206', nameAr: 'تمارين تأهيل عصبي عضلي وحركي (Neuro Re-ed)', nameEn: 'Therapeutic Exercise & Neuromuscular Re-ed', price: 15.0 },
  ];

  const currentProc = procedureCodes.find((p) => p.code === procedureCode) || procedureCodes[1];
  const grossAmount = currentProc.price;
  const copayOmr = (grossAmount * copayPercent) / 100;
  const insuranceClaimOmr = grossAmount - copayOmr;

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newClaim: InsuranceClaim = {
      id: `CLM-OM-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientCivilId: selectedPatient.civilId,
      patientName: selectedPatient.nameAr,
      insuranceCompany,
      policyNumber,
      approvalCode: `AUTH-OM-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceDate: new Date().toISOString().slice(0, 10),
      procedureCode: currentProc.code,
      procedureDescriptionAr: currentProc.nameAr,
      grossAmountOmr: grossAmount,
      patientCopayPercent: copayPercent,
      patientCopayOmr: copayOmr,
      insuranceClaimOmr,
      status: 'approved',
    };

    const updated = [newClaim, ...claimList];
    setClaimList(updated);
    onAddClaim(newClaim);

    setSubmittedAlert(
      isAr
        ? `تم إرسال المطالبة الإلكترونية بنجاح وحصلت على موافقة فورية برقم ترخيص: ${newClaim.approvalCode}`
        : `Claim approved with authorization code: ${newClaim.approvalCode}`
    );
    setTimeout(() => setSubmittedAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'نظام الفوترة والمطالبات التأمينية العُمانية (Oman Insurance Integration)' : 'Oman Insurance Billing Integration'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'ربط مباشر بأكواد العلاج الطبيعي المعتمدة لدى شركات التأمين الصحي بسلطنة عُمان (ضمان، الوطنية، ظفار، عُمان للتأمين) • احتساب نسبة التحمل (Copay) والموافقة اللحظية'
              : 'Direct billing with Oman health insurance platform codes (Daman Health, NLGIC, Dhofar, etc.). Auto copay calculation and instant pre-auth approval.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#B59B62]" />
            {isAr ? 'منصة الربط الصحي العُماني (Daman API Ready)' : 'Oman Health Gate Ready'}
          </span>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {submittedAlert}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Claim Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#2A9DA5]" />
            {isAr ? 'إصدار مطالبة وتفويض تأميني فوري' : 'Submit Electronic Insurance Claim'}
          </h3>

          <form onSubmit={handleCreateClaim} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'المريض المستفيد' : 'Patient'}
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  const p = patients.find((pat) => pat.id === e.target.value);
                  if (p?.insuranceProvider) setInsuranceCompany(p.insuranceProvider);
                  if (p?.insuranceCardNo) setPolicyNumber(p.insuranceCardNo);
                }}
                className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameAr} ({p.civilId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'شركة التأمين الصحي بسلطنة عُمان' : 'Insurance Company'}
              </label>
              <select
                value={insuranceCompany}
                onChange={(e) => setInsuranceCompany(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
              >
                <option value="شركة ضمان للتأمين الصحي (Daman Health Oman)">شركة ضمان للتأمين الصحي (Daman Health Oman)</option>
                <option value="الشركة الوطنية للتأمين على الحياة والعام (NLGIC)">الشركة الوطنية للتأمين على الحياة والعام (NLGIC)</option>
                <option value="شركة ظفار للتأمين (Dhofar Insurance)">شركة ظفار للتأمين (Dhofar Insurance)</option>
                <option value="شركة عُمان للتأمين (Oman Insurance Company)">شركة عُمان للتأمين (Oman Insurance Company)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'رقم وثيقة / بطاقة التأمين' : 'Policy / Card Number'}
              </label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'كود الإجراء التأهيلي المعتمد (Procedure Code)' : 'Rehab Procedure Code'}
              </label>
              <select
                value={procedureCode}
                onChange={(e) => setProcedureCode(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
              >
                {procedureCodes.map((proc) => (
                  <option key={proc.code} value={proc.code}>
                    {proc.code} - {proc.nameAr} ({proc.price.toFixed(3)} ر.ع)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'نسبة التحمل على المريض (Copay %)' : 'Patient Copay %'}
              </label>
              <div className="flex gap-2">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setCopayPercent(pct)}
                    className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${
                      copayPercent === pct
                        ? 'bg-[#075563] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview Card */}
            <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{isAr ? 'المبلغ الإجمالي للإجراء:' : 'Gross Amount:'}</span>
                <span className="font-mono font-bold">{grossAmount.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>{isAr ? `تحمل المريض (${copayPercent}%):` : `Copay (${copayPercent}%):`}</span>
                <span className="font-mono">{copayOmr.toFixed(3)} ر.ع</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold border-t border-[#B59B62]/20 pt-1">
                <span>{isAr ? 'مطالبة شركة التأمين:' : 'Insurance Covered:'}</span>
                <span className="font-mono">{insuranceClaimOmr.toFixed(3)} ر.ع</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#075563] text-white rounded-lg text-xs font-bold hover:bg-[#06424e] flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? 'إرسال المطالبة الإلكترونية والحصول على الموافقة' : 'Submit & Authorize Claim'}
            </button>
          </form>
        </div>

        {/* Claims Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3 flex items-center justify-between">
            <span>{isAr ? 'سجل المطالبات والتفويضات التأمينية' : 'Insurance Claims Registry'}</span>
            <span className="text-xs text-neutral-500 font-normal">
              {claimList.length} {isAr ? 'مطالبات مسجلة' : 'claims'}
            </span>
          </h3>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {claimList.map((clm) => (
              <div
                key={clm.id}
                className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#075563]">{clm.id}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-semibold text-neutral-800">{clm.patientName}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      clm.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : clm.status === 'settled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {clm.status === 'approved'
                      ? isAr
                        ? 'معتمد (Approved)'
                        : 'Approved'
                      : isAr
                      ? 'تمت التسوية'
                      : 'Settled'}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-600">
                  <span className="font-semibold">{clm.procedureCode}</span>: {clm.procedureDescriptionAr}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 pt-1">
                  <span>{clm.insuranceCompany}</span>
                  <span className="font-mono text-[#075563] font-bold">
                    ترخيص: {clm.approvalCode}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 font-medium">
                  <span className="text-neutral-500">
                    {isAr ? 'التحمل: ' : 'Copay: '}
                    <span className="font-mono font-bold text-neutral-800">{clm.patientCopayOmr.toFixed(3)} ر.ع</span>
                  </span>
                  <span className="text-emerald-700">
                    {isAr ? 'مبلغ التأمين: ' : 'Insurance: '}
                    <span className="font-mono font-bold">{clm.insuranceClaimOmr.toFixed(3)} ر.ع</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
