import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  ShieldAlert,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Heart,
  Scale,
  Smile,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  Sliders,
  Volume2,
} from 'lucide-react';
import { Patient } from '../../types/clinic';

interface Props {
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const SpecializedClinics: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';

  const [activeClinic, setActiveClinic] = useState<
    | 'spine'
    | 'knee'
    | 'shoulder'
    | 'sports'
    | 'post_op'
    | 'geriatric'
    | 'neuro'
    | 'fitness'
  >('spine');

  // --- 16. SPINE CARE CLINIC STATE ---
  const [selectedVertebra, setSelectedVertebra] = useState<string>('L4-L5');
  const [tractionMode, setTractionMode] = useState<'lumbar' | 'cervical'>('lumbar');
  const [tractionPoundage, setTractionPoundage] = useState<number>(32); // kg
  const [cvaAngle, setCvaAngle] = useState<number>(44); // Craniovertebral angle (Normal > 50°)
  const [shoulderAsymmetryMm, setShoulderAsymmetryMm] = useState<number>(12); // mm

  // --- 17. KNEE & OA CLINIC STATE ---
  const [patientWeightKg, setPatientWeightKg] = useState<number>(85);
  const [electroMa, setElectroMa] = useState<number>(18);
  const [electroFreqHz, setElectroFreqHz] = useState<number>(100);
  const [electroMinutes, setElectroMinutes] = useState<number>(20);

  // --- 18. SHOULDER CLINIC STATE ---
  const [shoulderAbductionActive, setShoulderAbductionActive] = useState<number>(115);
  const [shoulderAbductionPassive, setShoulderAbductionPassive] = useState<number>(135);
  const [frozenShoulderStage, setFrozenShoulderStage] = useState<1 | 2 | 3>(2); // Stage 2 Frozen

  // --- 19. SPORTS INJURIES & RTP STATE ---
  const [lsiQuadStrength, setLsiQuadStrength] = useState<number>(88); // Limb Symmetry Index %
  const [singleLegHopCm, setSingleLegHopCm] = useState<number>(140);
  const [yBalanceScore, setYBalanceScore] = useState<number>(92);
  const isRtpApproved = lsiQuadStrength >= 90 && yBalanceScore >= 90;

  // --- 20. POST-SURGICAL REHAB STATE ---
  const [surgeryType, setSurgeryType] = useState<string>('acl_patellar');
  const [postOpDays, setPostOpDays] = useState<number>(35); // Day 35 (~Week 5)
  const [reedaScore, setReedaScore] = useState<number>(1); // REEDA 0-15 scale

  // --- 21. GERIATRIC & ELDERLY UI MODE ---
  const [elderlyModeActive, setElderlyModeActive] = useState<boolean>(false);
  const [bergGeriatricScore, setBergGeriatricScore] = useState<number>(36); // Medium risk

  // --- 22. NEUROLOGICAL REHAB STATE ---
  const [ashworthScale, setAshworthScale] = useState<string>('1+');
  const [adlMatrix, setAdlMatrix] = useState({
    feeding: 100,
    grooming: 85,
    transfers: 75,
    walking50m: 60,
  });

  // --- 23. MEDICAL FITNESS & INBODY STATE ---
  const [inbodySmm, setInbodySmm] = useState<number>(31.4); // Skeletal Muscle Mass kg
  const [inbodyBfm, setInbodyBfm] = useState<number>(22.8); // Body Fat Mass kg
  const [inbodyPbf, setInbodyPbf] = useState<number>(26.8); // %
  const [metValue, setMetValue] = useState<number>(4.5); // Exercise MET
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(30);

  const calculateJointForce = (multiplier: number) => {
    return Math.round(patientWeightKg * multiplier);
  };

  const calculateCaloriesBurned = () => {
    // Calories = MET * Weight(kg) * Duration(hours)
    return Math.round(metValue * patientWeightKg * (exerciseMinutes / 60));
  };

  return (
    <div className={`space-y-6 ${elderlyModeActive ? 'text-lg' : ''}`}>
      {/* Module Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Stethoscope className="w-5 h-5 text-[#B59B62]" />
            </span>
            <h2 className={`font-bold text-[#075563] ${elderlyModeActive ? 'text-2xl' : 'text-xl'}`}>
              {isAr ? 'العيادات التأهيلية التخصصية الثمانية (8 Specialized Clinics UI)' : '8 Specialized Physiotherapy Clinics'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'واجهات سريرية متقدمة مخصصة لكل عيادة متخصصة بمجمع أم القرى الطبي في بركاء، مجهزة بالحاسبات ومصفوفات الأمان والمؤشرات الرقمية'
              : 'Dedicated interfaces for 8 specialized clinics: Spine, Knee OA, Shoulder, Sports RTP, Post-Op Red Flags, Geriatric, Neuro, and Medical Fitness.'}
          </p>
        </div>

        {/* Elderly Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#FAF8F1] p-2 rounded-lg border border-[#B59B62]/30">
          <Smile className="w-4 h-4 text-[#B59B62]" />
          <span className="text-xs font-bold text-[#075563]">
            {isAr ? 'واجهة كبار السن الميسرة:' : 'Elderly Mode:'}
          </span>
          <button
            type="button"
            onClick={() => setElderlyModeActive(!elderlyModeActive)}
            className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${
              elderlyModeActive
                ? 'bg-[#075563] text-white'
                : 'bg-white text-neutral-600 border border-neutral-200'
            }`}
          >
            {elderlyModeActive ? (isAr ? 'مفعّلة (خط كبير)' : 'Enabled') : (isAr ? 'عادية' : 'Standard')}
          </button>
        </div>
      </div>

      {/* 8 Clinics Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {[
          { id: 'spine', nameAr: '١. العمود الفقري', nameEn: 'Spine Care' },
          { id: 'knee', nameAr: '٢. خشونة الركبة', nameEn: 'Knee OA' },
          { id: 'shoulder', nameAr: '٣. مفصل الكتف', nameEn: 'Shoulder' },
          { id: 'sports', nameAr: '٤. إصابات الملاعب', nameEn: 'Sports & RTP' },
          { id: 'post_op', nameAr: '٥. ما بعد الجراحة', nameEn: 'Post-Surgical' },
          { id: 'geriatric', nameAr: '٦. كبار السن', nameEn: 'Geriatric' },
          { id: 'neuro', nameAr: '٧. التأهيل العصبي', nameEn: 'Neuro Rehab' },
          { id: 'fitness', nameAr: '٨. اللياقة الطبية', nameEn: 'Medical Fitness' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveClinic(c.id as any)}
            className={`p-2.5 rounded-lg text-xs font-bold text-center transition-all ${
              activeClinic === c.id
                ? 'bg-[#075563] text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {isAr ? c.nameAr : c.nameEn}
          </button>
        ))}
      </div>

      {/* ---------------- 16. SPINE CARE CLINIC ---------------- */}
      {activeClinic === 'spine' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'خريطة رادار الفقرات وبروتوكول الشد الميكانيكي' : 'Vertebral Radar & Traction Protocol'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? 'اختر الفقرة المصابة بالانزلاق الغضروفي:' : 'Target Vertebral Level:'}
              </label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['C3-C4', 'C5-C6', 'C6-C7', 'L1-L2', 'L3-L4', 'L4-L5', 'L5-S1', 'S1-Sacral'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setSelectedVertebra(v);
                      if (v.startsWith('C')) {
                        setTractionMode('cervical');
                        setTractionPoundage(8);
                      } else {
                        setTractionMode('lumbar');
                        setTractionPoundage(34);
                      }
                    }}
                    className={`p-2 rounded font-mono font-bold border transition-colors ${
                      selectedVertebra === v
                        ? 'bg-[#075563] text-white border-[#075563]'
                        : 'bg-neutral-50 border-neutral-200 hover:bg-white text-neutral-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#B59B62]/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#075563]">
                  {isAr ? `جهاز الشد الموصى به: ${tractionMode === 'lumbar' ? 'جهاز شد الفقرات القطنية' : 'جهاز شد الفقرات العنقية'}` : 'Assigned Traction Unit'}
                </span>
                <span className="text-neutral-500 font-mono">بركاء - غرفة ٣</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>{isAr ? 'قوة الشد التدريجية (Poundage):' : 'Traction Force (kg):'}</span>
                  <span className="font-mono font-bold text-[#075563]">{tractionPoundage} كجم</span>
                </div>
                <input
                  type="range"
                  min={tractionMode === 'cervical' ? 5 : 20}
                  max={tractionMode === 'cervical' ? 14 : 50}
                  value={tractionPoundage}
                  onChange={(e) => setTractionPoundage(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                <div className="p-2 bg-white rounded border border-neutral-200">
                  <span className="block text-neutral-400">وقت الشد (Hold):</span>
                  <span className="font-bold text-[#075563]">٣٠ ثانية متواصلة</span>
                </div>
                <div className="p-2 bg-white rounded border border-neutral-200">
                  <span className="block text-neutral-400">وقت الراحة (Rest):</span>
                  <span className="font-bold text-[#075563]">١٠ ثوانٍ خفيفة</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'محلل القوام بالذكاء الاصطناعي (AI Posture Analyzer)' : 'AI Posture Analyzer'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-neutral-700">
                    {isAr ? 'زاوية الرأس للأمام (CVA Angle):' : 'Craniovertebral Angle (CVA):'}
                  </span>
                  <span className={`font-mono font-bold ${cvaAngle < 48 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {cvaAngle}° {cvaAngle < 48 ? '(ميل أمامي غير صحي)' : '(قوام مثالي)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="60"
                  value={cvaAngle}
                  onChange={(e) => setCvaAngle(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-neutral-700">
                    {isAr ? 'انحراف الكتف للأعلى (Shoulder Elevation Asymmetry):' : 'Shoulder Asymmetry:'}
                  </span>
                  <span className="font-mono font-bold text-amber-700">{shoulderAsymmetryMm} ملم</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={shoulderAsymmetryMm}
                  onChange={(e) => setShoulderAsymmetryMm(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] leading-relaxed text-neutral-700">
                {isAr
                  ? '💡 التشخيص الآلي: يوجد متلازمة التقاطع العلوي (Upper Crossed Syndrome). يوصى بتمرين إرجاع الذقن (Chin Tucks) وتمديد العضلة الصدرية الكبيرة.'
                  : 'Diagnostic: Upper Crossed Syndrome detected. Chin tucks and pectoral stretching recommended.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 17. KNEE & OA CLINIC ---------------- */}
      {activeClinic === 'knee' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'حاسبة الأحمال والضغط المفصلي على الركبة (Joint Loading Calculator)' : 'Joint Loading Calculator'}
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-neutral-700">{isAr ? 'وزن المريض الحالي:' : 'Patient Weight:'}</span>
                <span className="font-mono font-bold text-[#075563]">{patientWeightKg} كجم</span>
              </div>
              <input
                type="range"
                min="50"
                max="130"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] text-neutral-500 block">{isAr ? 'عند المشي (2.5x)' : 'Walking (2.5x)'}</span>
                <span className="text-base font-bold text-[#075563] font-mono mt-1 block">
                  {calculateJointForce(2.5)} كجم
                </span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-[10px] text-amber-800 block">{isAr ? 'صعود الدرج (4x)' : 'Stairs (4x)'}</span>
                <span className="text-base font-bold text-amber-900 font-mono mt-1 block">
                  {calculateJointForce(4.0)} كجم
                </span>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <span className="text-[10px] text-rose-800 block">{isAr ? 'القرفصاء (7x)' : 'Squatting (7x)'}</span>
                <span className="text-base font-bold text-rose-900 font-mono mt-1 block">
                  {calculateJointForce(7.0)} كجم
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
              <span className="font-bold block mb-0.5">🌟 {isAr ? 'الأثر الإيجابي لتخفيف الوزن:' : 'Weight Loss Payoff:'}</span>
              <p className="text-[11px] leading-relaxed">
                {isAr
                  ? `إنقاص ٥ كجم فقط من وزن المريض سيقلل بمقدار ٢٠ كجم من الحمل الميكانيكي الضاغط على غضروف الركبة في كل خطوة مشي!`
                  : 'Losing 5 kg relieves 20 kg of mechanical force off the knee cartilage every stride!'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'لوحة تحكم العلاج الكهربائي الذكي (Smart Electrotherapy Dashboard)' : 'Electrotherapy Safe Control'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>{isAr ? 'شدة التيار (Intensity mA):' : 'Intensity (mA):'}</span>
                  <span className="font-mono font-bold text-[#075563]">{electroMa} mA</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={electroMa}
                  onChange={(e) => setElectroMa(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span>{isAr ? 'التردد التداخلي (Frequency Hz):' : 'Frequency (Hz):'}</span>
                  <span className="font-mono font-bold text-[#075563]">{electroFreqHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={electroFreqHz}
                  onChange={(e) => setElectroFreqHz(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex justify-between items-center">
                <span>{isAr ? 'مؤقت الإيقاف التلقائي للأمان:' : 'Safety Cut-Off Timer:'}</span>
                <span className="font-mono font-bold text-emerald-700">{electroMinutes} دقيقة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 18. SHOULDER CLINIC ---------------- */}
      {activeClinic === 'shoulder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'متتبع زوايا مفصل الكتف المركبة (Complex Shoulder Angles)' : 'Shoulder Angles Tracker'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>{isAr ? 'التبعيد الإيجابي (Active Abduction):' : 'Active Abduction:'}</span>
                  <span className="font-mono font-bold text-[#075563]">{shoulderAbductionActive}° (الطبيعي ١٨٠°)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={shoulderAbductionActive}
                  onChange={(e) => setShoulderAbductionActive(Number(e.target.value))}
                  className="w-full accent-[#075563]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>{isAr ? 'التبعيد السلبي بمساعدة المعالج (Passive):' : 'Passive Abduction:'}</span>
                  <span className="font-mono font-bold text-[#2A9DA5]">{shoulderAbductionPassive}°</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={shoulderAbductionPassive}
                  onChange={(e) => setShoulderAbductionPassive(Number(e.target.value))}
                  className="w-full accent-[#2A9DA5]"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[11px] text-neutral-500 block mb-1">
                  {isAr ? 'الفجوة الحركية (Lag Sign / Active vs Passive Deficit):' : 'Active-Passive Gap:'}
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {shoulderAbductionPassive - shoulderAbductionActive}° عجز وظيفي ناتج عن ضعف العضلات المدورة
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'لوحة متابعة الكتف المتجمد (Frozen Shoulder Dashboard)' : 'Frozen Shoulder Dashboard'}
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { stage: 1, titleAr: 'المرحلة ١: التجمد والألم', titleEn: 'Stage 1: Freezing' },
                { stage: 2, titleAr: 'المرحلة ٢: التصلب الحركي', titleEn: 'Stage 2: Frozen' },
                { stage: 3, titleAr: 'المرحلة ٣: الذوبان والتعافي', titleEn: 'Stage 3: Thawing' },
              ].map((st) => (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setFrozenShoulderStage(st.stage as any)}
                  className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
                    frozenShoulderStage === st.stage
                      ? 'bg-[#075563] text-white border-[#075563]'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                  }`}
                >
                  {isAr ? st.titleAr : st.titleEn}
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20 text-xs space-y-2">
              <span className="font-bold text-[#075563] block">
                {isAr ? 'البروتوكول الموصى به لهذه المرحلة بالمجمع:' : 'Recommended Clinical Protocol:'}
              </span>
              <ul className="text-[11px] text-neutral-700 list-disc list-inside space-y-1">
                <li>الموجات فوق الصوتية المستمرة بقوة 1.5 وات/سم² لتليين المحفظة المفصلية.</li>
                <li>تمارين كودمان للبندول بمساعدة الجاذبية الأرضية.</li>
                <li>تليين لفافي للعضلة شبه المنحرفة والكتف الخلفي.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 19. SPORTS INJURIES & RETURN TO PLAY ---------------- */}
      {activeClinic === 'sports' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#075563]">
                {isAr ? 'مؤشر الجاهزية للعودة للملاعب (Return to Play - RTP Checklist)' : 'Return to Play Readiness'}
              </h3>
              <p className="text-xs text-neutral-500">
                {isAr
                  ? 'يمنع النظام إغلاق ملف الرياضي أو السماح له بالمنافسة إلا بعد اجتياز الفحوصات الرقمية الصارمة بنسبة ٩٠٪ فأكثر'
                  : 'Safety lock: Discharging athlete requires LSI >= 90% and functional hop clearance.'}
              </p>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-md ${
                isRtpApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isRtpApproved
                ? isAr
                  ? 'مؤهل للملاعب (RTP Approved)'
                  : 'RTP Cleared'
                : isAr
                ? 'غير مؤهل - خطر انتكاس (RTP Locked)'
                : 'Locked: Not Cleared'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-700">{isAr ? 'مؤشر تناظر الطرفين (LSI):' : 'LSI Quad Strength:'}</span>
                <span className="font-mono font-bold">{lsiQuadStrength}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={lsiQuadStrength}
                onChange={(e) => setLsiQuadStrength(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
              <span className="text-[10px] text-neutral-500 block">المعيار المطلوب: ٩٠٪ فأكثر مقارنة بالطرف السليم</span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-700">{isAr ? 'اختبار القفز بساق واحدة:' : 'Single Leg Hop:'}</span>
                <span className="font-mono font-bold">{singleLegHopCm} سم</span>
              </div>
              <input
                type="range"
                min="80"
                max="180"
                value={singleLegHopCm}
                onChange={(e) => setSingleLegHopCm(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
              <span className="text-[10px] text-neutral-500 block">يقيس القوة الانفجارية وثبات مفصل الركبة</span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-700">{isAr ? 'اختبار توازن Y-Balance:' : 'Y-Balance Score:'}</span>
                <span className="font-mono font-bold">{yBalanceScore}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={yBalanceScore}
                onChange={(e) => setYBalanceScore(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
              <span className="text-[10px] text-neutral-500 block">الاستقرار الديناميكي في ٣ اتجاهات</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 20. POST-SURGICAL REHABILITATION ---------------- */}
      {activeClinic === 'post_op' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
            {isAr ? 'نظام الخطوط الحمراء والتحذيرات الجراحية (Surgical Red Flags Guard)' : 'Surgical Red Flags Protocol'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'نوع الجراحة المجراة للمريض:' : 'Surgery Type:'}
              </label>
              <select
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
              >
                <option value="acl_patellar">إعادة بناء الرباط الصليبي (ACL Patellar Tendon Graft)</option>
                <option value="lumbar_discectomy">استئصال غضروف قطني ميكروسكوبي (Lumbar Discectomy)</option>
                <option value="rotator_cuff">إصلاح وتر الكفة المدورة للكتف (Rotator Cuff Repair)</option>
                <option value="total_knee">تبديل مفصل الركبة الكامل (Total Knee Arthroplasty)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'عدد الأيام منذ إجراء العملية:' : 'Post-Op Days Elapsed:'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={postOpDays}
                  onChange={(e) => setPostOpDays(Number(e.target.value))}
                  className="w-24 text-sm font-bold border border-neutral-300 rounded p-1.5 text-center"
                />
                <span className="text-xs text-neutral-500">
                  ({Math.floor(postOpDays / 7)} أسابيع و {postOpDays % 7} أيام)
                </span>
              </div>
            </div>
          </div>

          {/* Red Flags Banner */}
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{isAr ? 'الحركات والتمارين المحظورة أوتوماتيكياً في هذه المرحلة لحماية الرقعة:' : 'Prohibited Movements in this Phase:'}</span>
            </div>
            <ul className="text-rose-700 text-[11px] list-disc list-inside space-y-1">
              {postOpDays < 42 && surgeryType === 'acl_patellar' && (
                <>
                  <li>🚫 يمنع منعاً باتاً تمارين السلسلة الحركية المفتوحة (Open Kinetic Chain) لمد الركبة من ٠ إلى ٣٠ درجة.</li>
                  <li>🚫 يمنع الجري أو القفز قبل إتمام الأسبوع الثاني عشر وتجاوز فحص القوة.</li>
                </>
              )}
              {surgeryType === 'lumbar_discectomy' && (
                <>
                  <li>🚫 ممنوع الانحناء القطني للأمام أو حمل أي وزن يفوق ٢ كجم.</li>
                  <li>🚫 تجنب الحركات الالتوائية (Lumbar Twisting) للجذع.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ---------------- 21. GERIATRIC CLINIC & ELDERLY UI ---------------- */}
      {activeClinic === 'geriatric' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <h3 className={`font-bold text-[#075563] border-b border-neutral-100 pb-2 ${elderlyModeActive ? 'text-xl' : 'text-sm'}`}>
            {isAr ? 'تأهيل كبار السن ومقياس بيرج لمنع السقوط (Geriatric Fall Prevention)' : 'Geriatric Fall Prevention'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-3 ${elderlyModeActive ? 'p-6 bg-[#FAF8F1]' : 'bg-neutral-50'}`}>
              <span className={`font-bold text-neutral-700 block ${elderlyModeActive ? 'text-lg' : 'text-xs'}`}>
                {isAr ? 'درجة تقييم بيرج الحالي للمريض:' : 'Current Berg Score:'}
              </span>
              <div className="flex items-center gap-4">
                <span className={`font-black font-mono text-[#075563] ${elderlyModeActive ? 'text-5xl' : 'text-3xl'}`}>
                  {bergGeriatricScore} / 56
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold">
                  {isAr ? 'خطر سقوط متوسط' : 'Medium Fall Risk'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="56"
                value={bergGeriatricScore}
                onChange={(e) => setBergGeriatricScore(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <span className="font-bold text-[#075563] block">
                {isAr ? 'إرشادات السلامة لكبار السن بمحافظة جنوب الباطنة:' : 'Home Safety Guidance:'}
              </span>
              <ul className="text-neutral-700 space-y-1 list-disc list-inside text-[11px] leading-relaxed">
                <li>إزالة السجاد المتزحلق في المنزل وتركيب مقابض سند في دورات المياه.</li>
                <li>توفير إضاءة ليلية خافتة في الممرات لتقليل التعثر أثناء صلاة الفجر.</li>
                <li>استخدام عصا المشي الطبية رباعية القواعد تحت إشراف الأخصائي.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 22. NEUROLOGICAL REHABILITATION ---------------- */}
      {activeClinic === 'neuro' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
            {isAr ? 'تتبع التشنج العضلي ومصفوفة الأهداف الوظيفية (MAS Spasticity & ADL)' : 'Spasticity & ADL Matrix'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-700">
                {isAr ? 'مقياس آشوورث المعدل للتشنج العضلي (Ashworth Scale):' : 'Modified Ashworth Scale (MAS):'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['0', '1', '1+', '2', '3', '4'].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setAshworthScale(scale)}
                    className={`p-2 rounded text-xs font-bold border transition-colors ${
                      ashworthScale === scale
                        ? 'bg-[#075563] text-white border-[#075563]'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    الدرجة {scale}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
              <span className="font-bold text-[#075563] block">
                {isAr ? 'مصفوفة إنجاز مهام الحياة اليومية (ADL Matrix):' : 'Functional Living Goals:'}
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>تناول الطعام واستخدام اليدين</span>
                    <span className="font-bold text-[#075563]">{adlMatrix.feeding}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#075563]" style={{ width: `${adlMatrix.feeding}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span>الانتقال من الكرسي للسرير</span>
                    <span className="font-bold text-[#2A9DA5]">{adlMatrix.transfers}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2A9DA5]" style={{ width: `${adlMatrix.transfers}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 23. MEDICAL FITNESS & INBODY ---------------- */}
      {activeClinic === 'fitness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2 flex items-center justify-between">
              <span>{isAr ? 'قراءات جهاز إن بودي (InBody Composition)' : 'InBody Analyzer'}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ربط إلكتروني مباشر
              </span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] text-neutral-500 block">كتلة العضلات (SMM)</span>
                <span className="text-base font-bold text-[#075563] font-mono mt-1 block">{inbodySmm} كجم</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] text-neutral-500 block">كتلة الدهون (BFM)</span>
                <span className="text-base font-bold text-amber-700 font-mono mt-1 block">{inbodyBfm} كجم</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="text-[10px] text-neutral-500 block">نسبة الدهون (PBF)</span>
                <span className="text-base font-bold text-neutral-800 font-mono mt-1 block">{inbodyPbf}%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'حاسبة السعرات الطبية (METs Calorie Calculator)' : 'METs Calorie Calculator'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span>{isAr ? 'المدة الزمنية للتمرين:' : 'Duration:'}</span>
                <span className="font-mono font-bold text-[#075563]">{exerciseMinutes} دقيقة</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                className="w-full accent-[#075563]"
              />

              <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/30 flex justify-between items-center">
                <span>{isAr ? 'السعرات المستهلكة دون إجهاد المفاصل:' : 'Safe Calories Burned:'}</span>
                <span className="text-xl font-black text-[#075563] font-mono">
                  {calculateCaloriesBurned()} <span className="text-xs font-normal">سعرة حرارية</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
