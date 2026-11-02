import React, { useRef } from 'react';
import { Patient, Therapist } from '../../types/clinic';
import { CLINIC_INFO } from '../../data/mockData';
import { Printer, Download, CheckCircle2, ShieldCheck, Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  patient: Patient;
  therapist: Therapist;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const DischargeReportModal: React.FC<Props> = ({ patient, therapist, onClose, lang }) => {
  const isAr = lang === 'ar';
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl border border-neutral-300 flex flex-col max-h-[90vh]">
        {/* Top Control Bar (Non-printable) */}
        <div className="no-print p-4 bg-neutral-900 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B59B62]" />
            <span className="text-sm font-bold">
              {isAr ? 'تقرير التخريج الطبي النهائي والتحويل المعتمد' : 'Official Medical Discharge & Referral Summary'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#2A9DA5] hover:bg-[#23848b] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              {isAr ? 'طباعة التقرير الطبي الرسمي (PDF)' : 'Print Official PDF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Medical Document */}
        <div
          ref={reportRef}
          className="p-8 sm:p-12 overflow-y-auto bg-white text-[#24383B] space-y-8 select-text"
          id="printable-discharge-report"
        >
          {/* Clinic Official Letterhead */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-[#075563] pb-6">
            <div className="text-center sm:text-right space-y-1">
              <h1 className="text-2xl font-black text-[#075563] font-serif">
                {CLINIC_INFO.nameAr}
              </h1>
              <p className="text-sm font-bold text-[#B59B62]">{CLINIC_INFO.nameEn}</p>
              <p className="text-xs text-neutral-500 font-semibold">{CLINIC_INFO.sloganAr}</p>
              <p className="text-[11px] text-neutral-500">
                {CLINIC_INFO.locationAr} • هاتف: {CLINIC_INFO.phone1}
              </p>
            </div>

            {/* Official Uploaded Clinic Logo */}
            <div className="flex flex-col items-center">
              <img
                src="/logo.png"
                alt="مجمع أم القرى الطبي - اللوجو الرسمي"
                className="h-24 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Report Title Banner */}
          <div className="text-center space-y-1 bg-[#FAF8F1] py-3 rounded-xl border border-[#B59B62]/30">
            <h2 className="text-lg font-black text-[#075563] tracking-wide">
              تقرير التخريج وإخلاء الطرف الطبي التأهيلي (MEDICAL DISCHARGE SUMMARY)
            </h2>
            <p className="text-xs text-neutral-600">
              قسم العلاج الطبيعي والتأهيل الطبي المتقدم • مرخص من وزارة الصحة العُمانية
            </p>
          </div>

          {/* Patient & Case Demographics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs">
            <div>
              <span className="text-[11px] text-neutral-500 block">{isAr ? 'اسم المريض:' : 'Patient Name:'}</span>
              <span className="font-bold text-[#075563] text-sm">{patient.nameAr}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isAr ? 'الرقم المدني العُماني:' : 'Civil ID:'}</span>
              <span className="font-mono font-bold">{patient.civilId}</span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isAr ? 'العمر / الجنس:' : 'Age / Gender:'}</span>
              <span className="font-medium">
                {patient.age} سنة / {patient.gender === 'male' ? 'ذكر' : 'أنثى'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">{isAr ? 'تاريخ التخريج:' : 'Discharge Date:'}</span>
              <span className="font-bold font-mono">{new Date().toISOString().slice(0, 10)}</span>
            </div>
          </div>

          {/* Diagnosis & Attending Staff */}
          <div className="p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-neutral-700">{isAr ? 'التشخيص الطبي السريري:' : 'Clinical Diagnosis:'}</span>
                <span className="font-bold text-[#075563] mr-2">{patient.diagnosisAr}</span>
              </div>
              <div className="text-neutral-500">
                {isAr ? 'الأخصائي المعالج:' : 'Physiotherapist:'} <span className="font-semibold text-neutral-800">{therapist.nameAr} ({therapist.licenseNumber})</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-neutral-700">{isAr ? 'الشكوى الأولية عند الدخول:' : 'Initial Complaint:'}</span>
              <span className="text-neutral-600 mr-2">{patient.chiefComplaint}</span>
            </div>
          </div>

          {/* Clinical Outcomes Comparison: Baseline vs Discharge */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#075563] uppercase border-b border-neutral-200 pb-1">
              {isAr ? 'نتائج القياسات السريرية: مقارنة خط الأساس مع التخريج النهائي' : 'Clinical Outcomes: Baseline vs Final Discharge'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-[#075563] text-white">
                    <th className="p-2.5 rounded-r-md">{isAr ? 'المعيار السريري / الإجراء' : 'Clinical Metric'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'عند الدخول (Baseline)' : 'Initial Baseline'}</th>
                    <th className="p-2.5 text-center">{isAr ? 'عند التخريج (Discharge)' : 'Final Discharge'}</th>
                    <th className="p-2.5 text-center rounded-l-md">{isAr ? 'نسبة التحسن الصافي' : 'Net Improvement'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold">مقياس شدة الألم البصري (VAS Pain Score 0-10)</td>
                    <td className="p-2.5 text-center font-mono font-bold text-red-600">8 / 10</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">2 / 10</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+75% تحسن</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold">المدى الحركي الإيجابي المفصلي (Active ROM Degrees)</td>
                    <td className="p-2.5 text-center font-mono">45 درجة</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">125 درجة</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+80 درجة مكتسبة</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold">مؤشر العجز الوظيفي لأوسويستري (ODI Disability Index)</td>
                    <td className="p-2.5 text-center font-mono text-red-600">58% (عجز شديد)</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">14% (عجز طفيف)</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+76% استعادة وظيفة</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold">القوة العضلية اليدوية (MMT Grade 0-5)</td>
                    <td className="p-2.5 text-center font-mono">3 / 5</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-600">5 / 5 (كاملة)</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">استعادة تامة للقوة</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Treatment Modalities Administered */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs space-y-2">
            <span className="font-bold text-[#075563] block">
              {isAr ? 'الوسائل والأجهزة التكنولوجية المنفذة بمجمع أم القرى:' : 'Modalities Delivered at Um Alqura:'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-neutral-700">
              <div>• جهاز شد الفقرات الرقمي المبرمج (Traction Therapy)</div>
              <div>• جهاز الموجات التصادمية السويسري (Shockwave ESWT)</div>
              <div>• العلاج اليدوي والتحريك المفصلي (Maitland Mobilization)</div>
              <div>• التيار التداخلي المسكن والموجات فوق الصوتية (Combo Therapy)</div>
            </div>
          </div>

          {/* Post-Discharge Home Recommendations */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs space-y-1.5">
            <span className="font-bold text-emerald-900 block">
              {isAr ? 'توصيات ما بعد التخريج والبرنامج الوقائي المستمر:' : 'Discharge Recommendations:'}
            </span>
            <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px] leading-relaxed">
              <li>الاستمرار بأداء تمارين استقرار الجذع وإرجاع الذقن مرتين أسبوعياً بالمنزل.</li>
              <li>الالتزام بالوضعية الصحية أثناء الجلوس المكتبي أو قيادة السيارة وعدم الجلوس لأكثر من ٤٥ دقيقة متصلة.</li>
              <li>مراجعة مجمع أم القرى الطبي في بركاء لإجراء تقييم دوري وقائي بعد ٣ أشهر أو عند الشعور بأي بوادر ارتداد.</li>
            </ul>
          </div>

          {/* Official Signatures & Clinic Stamp Section */}
          <div className="pt-8 border-t border-neutral-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-10">
              <span className="font-bold text-neutral-700 block">توقيع أخصائي العلاج الطبيعي</span>
              <div className="font-serif italic text-sm text-[#075563]">{therapist.nameAr}</div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#B59B62] flex flex-col items-center justify-center p-2 text-center text-[10px] text-[#075563] font-bold">
                <ShieldCheck className="w-6 h-6 text-[#B59B62] mb-1" />
                <span>مجمع أم القرى الطبي</span>
                <span className="text-[8px] text-[#B59B62]">سلطنة عُمان - بركاء</span>
                <span className="text-[7px]">ختم الاعتماد الرسمي</span>
              </div>
            </div>

            <div className="space-y-10">
              <span className="font-bold text-neutral-700 block">اعتماد المدير الطبي والإداري</span>
              <div className="font-serif italic text-sm text-[#075563]">د. المدير الطبي (بركاء)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
