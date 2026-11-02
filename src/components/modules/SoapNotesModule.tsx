import React, { useState } from 'react';
import { Patient, SoapNote, Therapist } from '../../types/clinic';
import { FileText, Save, History, PlusCircle, Check, Activity, Sparkles } from 'lucide-react';

interface Props {
  patients: Patient[];
  therapists: Therapist[];
  lang: 'ar' | 'en';
}

export const SoapNotesModule: React.FC<Props> = ({ patients, therapists, lang }) => {
  const isAr = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Form State for new SOAP note
  const [vasPain, setVasPain] = useState<number>(selectedPatient?.vasCurrent || 4);
  const [complaint, setComplaint] = useState(
    'يشكو المريض من ألم متكرر أسفل الظهر عند الجلوس لأكثر من نصف ساعة، مع تيبس صباحي يمتد لنحو ٢٠ دقيقة.'
  );
  const [painBehavior, setPainBehavior] = useState('يزداد مع الانحناء للأمام وحمل الأوزان، ويخف مع الاستلقاء والمشي الخفيف.');
  const [functionalLimitation, setFunctionalLimitation] = useState('صعوبة في قيادة السيارة لمسافات طويلة وأداء الصلاة جالساً أحياناً.');

  // Objective state
  const [palpationSpasm, setPalpationSpasm] = useState('تقلص عضلي واضح في عضلات الفقرات القطنية المجاورة (Paravertebral Spasm Grade 2) بالجهة اليمنى.');
  const [activeRomKnee, setActiveRomKnee] = useState(110);
  const [activeRomLumbar, setActiveRomLumbar] = useState(45);
  const [passiveRomLumbar, setPassiveRomLumbar] = useState(55);
  const [mmtGrade, setMmtGrade] = useState('4/5 (عضلات الفخذ والمقربة)');
  const [slrTest, setSlrTest] = useState<'positive' | 'negative'>('negative');

  // Assessment state
  const [tissueResponse, setTissueResponse] = useState<'improving_rapidly' | 'moderate_progress' | 'plateau' | 'reactive_flareup'>('moderate_progress');
  const [clinicalImpression, setClinicalImpression] = useState(
    'تحسن إيجابي ملحوظ في مرونة الأنسجة الليفية وتراجع حدة الضغط العصبي بنسبة ٣٥٪ مقارنة بالجلسة التأسيسية الأولى.'
  );
  const [prognosis, setPrognosis] = useState('ممتاز (Good to Excellent) مع الالتزام التام بتمارين الاستقرار المنزلي.');

  // Plan state
  const [modalityUsed, setModalityUsed] = useState<string[]>([
    'شد الفقرات القطنية الميكانيكي (Lumbar Traction)',
    'التيار التداخلي المسكن (IFT)',
    'كمادات دافئة رطبة (Hydrocollator)',
  ]);
  const [manualTherapy, setManualTherapy] = useState('تحريك مفصلي قطني درجات Maitland Grade II-III مع تليين لفافي للنسيج العضلي.');
  const [homeUpdates, setHomeUpdates] = useState('زيادة تكرارات تمرين الجسر الحوضي إلى ٣ مجموعات × ١٢ تكرار، والامتناع التام عن الجلوس المتصل لأكثر من ٤٥ دقيقة.');

  const [savedNotes, setSavedNotes] = useState<SoapNote[]>([
    {
      id: 'soap-101',
      patientId: 'pat-1',
      appointmentId: 'apt-prev-1',
      date: '2026-10-28',
      sessionNumber: 5,
      therapistId: 'th-1',
      subjective: {
        patientComplaint: 'ألم أسفل الظهر انخفض إلى ٣/١٠، مع اختفاء التنميل في الساق بنسبة كبيرة.',
        painLocation: ['المنطقة القطنية L4-L5'],
        vasPainScore: 3,
        painBehavior: 'ألم خفيف عند نهاية يوم العمل فقط.',
        functionalLimitations: 'أصبح قادراً على صعود الدرج بشكل مريح.',
      },
      objective: {
        postureFindings: 'استقامة أفضل في الجذع وانخفاض الميلان الجانبي.',
        palpationSpasm: 'انحسار الشد العضلي إلى الدرجة الأولى.',
        activeRom: {
          lumbarFlexion: { baseline: 30, current: 55, normal: 60, unit: 'درجة' },
        },
        passiveRom: {
          lumbarFlexion: { baseline: 40, current: 65, normal: 70, unit: 'درجة' },
        },
        manualMuscleTesting: { core: '4/5', gluteus: '4+/5' },
        specialTests: { slr: 'negative' },
        neurologicalCheck: 'ردود الفعل الانعكاسية طبيعية (+2)، الإحساس متكافئ بالطرفين.',
      },
      assessment: {
        tissueResponse: 'improving_rapidly',
        clinicalImpression: 'استجابة ممتازة لبروتوكول الشد الميكانيكي والتمارين العلاجية.',
        shortTermGoalProgress: 'تم تحقيق ٨٠٪ من الأهداف قصيرة الأجل.',
        prognosis: 'ممتاز مع إنهاء باقة الـ ١٠ جلسات.',
      },
      plan: {
        modalityUsed: ['شد فقرات قطنية قوة 32 كجم', 'تيارات IFT'],
        manualTherapyTechniques: ['Mobilization Grade III'],
        exercisePrescription: ['تمارين تقوية عضلات الجذع والمقعدة'],
        homeProgramUpdates: 'الاستمرار بتمارين الإمالة الحوضية مرتين يومياً.',
        precautions: 'تجنب رفع الأحمال الثقيلة.',
        nextAppointmentDate: '2026-11-02',
      },
    },
  ]);

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSaveNote = () => {
    if (!selectedPatient) return;
    const newNote: SoapNote = {
      id: `soap-${Date.now()}`,
      patientId: selectedPatient.id,
      appointmentId: `apt-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      sessionNumber: (selectedPatient.totalSessionsAttended || 0) + 1,
      therapistId: selectedPatient.assignedTherapistId,
      subjective: {
        patientComplaint: complaint,
        painLocation: ['المنطقة المصابة'],
        vasPainScore: vasPain,
        painBehavior,
        functionalLimitations: functionalLimitation,
      },
      objective: {
        postureFindings: 'وضعية متوازنة',
        palpationSpasm,
        activeRom: {
          movement: { baseline: 30, current: activeRomLumbar, normal: 60, unit: 'درجة' },
        },
        passiveRom: {
          movement: { baseline: 40, current: passiveRomLumbar, normal: 70, unit: 'درجة' },
        },
        manualMuscleTesting: { main: mmtGrade },
        specialTests: { slr: slrTest },
        neurologicalCheck: 'إحساس وقوة العضلات سليمة',
      },
      assessment: {
        tissueResponse,
        clinicalImpression,
        shortTermGoalProgress: 'التقدم مستمر وفق الخطة التأهيلية',
        prognosis,
      },
      plan: {
        modalityUsed,
        manualTherapyTechniques: [manualTherapy],
        exercisePrescription: ['تمارين التقوية الحركية'],
        homeProgramUpdates: homeUpdates,
        precautions: 'مراعاة سلامة المفاصل',
        nextAppointmentDate: '2026-11-04',
      },
    };

    setSavedNotes([newNote, ...savedNotes]);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'نموذج التوثيق السريري المتقدم (SOAP Notes for Physiotherapy)' : 'SOAP Notes Clinical Documentation'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'التوثيق الرقمي الرباعي الإلزامي لكل جلسة علاج طبيعي بمجمع أم القرى: الذاتي (S) • الميداني/القياسات (O) • التقييم واستجابة الأنسجة (A) • الخطة والتعديلات التلقائية (P)'
              : 'Mandatory 4-part digital note per session: Subjective & VAS • Objective ROM & MMT • Assessment & tissue response • Plan & auto adjustments'}
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-neutral-700 whitespace-nowrap">
            {isAr ? 'ملف المريض:' : 'Patient File:'}
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              const p = patients.find((pat) => pat.id === e.target.value);
              if (p) setVasPain(p.vasCurrent);
            }}
            className="text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50 focus:bg-white focus:outline-hidden font-medium text-[#075563]"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameAr} ({p.diagnosisAr.slice(0, 30)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {showSavedFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          {isAr
            ? 'تم حفظ وتوثيق تقرير الـ SOAP Note في السجل الإلكتروني بنجاح وتحديث خط الأساس للمريض!'
            : 'SOAP Note saved to electronic record and patient baseline updated!'}
        </div>
      )}

      {/* 4 Pillars of SOAP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* S - SUBJECTIVE */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-[#075563] text-white">
              S - Subjective
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {isAr ? 'الشكوى الذاتية ومقياس الألم' : 'Patient Complaint & Pain'}
            </span>
          </div>

          {/* VAS Pain Slider */}
          <div className="p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#075563]">
                {isAr ? 'مقياس شدة الألم البصري (VAS Pain Score):' : 'Visual Analog Scale (VAS):'}
              </span>
              <span className={`text-base font-extrabold px-2.5 py-0.5 rounded ${
                vasPain >= 7 ? 'bg-red-100 text-red-700' : vasPain >= 4 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {vasPain} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={vasPain}
              onChange={(e) => setVasPain(Number(e.target.value))}
              className="w-full accent-[#075563] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>{isAr ? '٠ بدون ألم' : '0 No pain'}</span>
              <span>{isAr ? '٥ ألم متوسط' : '5 Moderate'}</span>
              <span>{isAr ? '١٠ ألم شديد جداً' : '10 Worst possible'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'شكوى المريض ووصف الأعراض' : 'Chief Complaint Description'}
            </label>
            <textarea
              rows={3}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'سلوك الألم ومثيراته (Pain Aggravating / Easing Factors)' : 'Pain Behavior'}
            </label>
            <input
              type="text"
              value={painBehavior}
              onChange={(e) => setPainBehavior(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'المحددات الوظيفية والأنشطة اليومية المتأثرة' : 'Functional Limitations'}
            </label>
            <input
              type="text"
              value={functionalLimitation}
              onChange={(e) => setFunctionalLimitation(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* O - OBJECTIVE */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-[#2A9DA5] text-white">
              O - Objective
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {isAr ? 'الفحص السريري وقياسات المدى الحركي (ROM)' : 'Clinical Exam & ROM Measurements'}
            </span>
          </div>

          {/* ROM Numeric Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-700 block mb-1">
                {isAr ? 'المدى الحركي الإيجابي (Active ROM)' : 'Active ROM'}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={activeRomLumbar}
                  onChange={(e) => setActiveRomLumbar(Number(e.target.value))}
                  className="w-20 text-sm font-bold border border-neutral-300 rounded p-1 text-center bg-white"
                />
                <span className="text-xs text-neutral-500">{isAr ? 'درجة (طبيعي: ٦٠°)' : 'deg (Normal: 60°)'}</span>
              </div>
            </div>

            <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-700 block mb-1">
                {isAr ? 'المدى الحركي السلبي (Passive ROM)' : 'Passive ROM'}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={passiveRomLumbar}
                  onChange={(e) => setPassiveRomLumbar(Number(e.target.value))}
                  className="w-20 text-sm font-bold border border-neutral-300 rounded p-1 text-center bg-white"
                />
                <span className="text-xs text-neutral-500">{isAr ? 'درجة (طبيعي: ٧٠°)' : 'deg (Normal: 70°)'}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'الجس والتقلص العضلي (Palpation / Muscle Spasm)' : 'Palpation Spasm'}
            </label>
            <input
              type="text"
              value={palpationSpasm}
              onChange={(e) => setPalpationSpasm(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'القوة العضلية اليدوية (MMT 0-5)' : 'MMT Grade'}
              </label>
              <input
                type="text"
                value={mmtGrade}
                onChange={(e) => setMmtGrade(e.target.value)}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'فحص رفع الساق مستقيمة (SLR Test)' : 'SLR Test'}
              </label>
              <select
                value={slrTest}
                onChange={(e) => setSlrTest(e.target.value as 'positive' | 'negative')}
                className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
              >
                <option value="negative">{isAr ? 'سلبي Negative (سليم)' : 'Negative'}</option>
                <option value="positive">{isAr ? 'إيجابي Positive (انضغاط جذري)' : 'Positive'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* A - ASSESSMENT */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-[#B59B62] text-white">
              A - Assessment
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {isAr ? 'التقييم السريري واستجابة الأنسجة' : 'Clinical Assessment & Response'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'استجابة الأنسجة الحيوية للبروتوكول العلاجي' : 'Tissue Healing Response'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTissueResponse('improving_rapidly')}
                className={`text-xs p-2 rounded border text-right transition-colors ${
                  tissueResponse === 'improving_rapidly'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                ⚡ {isAr ? 'تحسن متسارع (Rapid Progress)' : 'Improving Rapidly'}
              </button>
              <button
                type="button"
                onClick={() => setTissueResponse('moderate_progress')}
                className={`text-xs p-2 rounded border text-right transition-colors ${
                  tissueResponse === 'moderate_progress'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                📈 {isAr ? 'تقدم قياسي متدرج (Moderate)' : 'Moderate Progress'}
              </button>
              <button
                type="button"
                onClick={() => setTissueResponse('plateau')}
                className={`text-xs p-2 rounded border text-right transition-colors ${
                  tissueResponse === 'plateau'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                ⏸️ {isAr ? 'ثبات المرحلة (Plateau)' : 'Plateau'}
              </button>
              <button
                type="button"
                onClick={() => setTissueResponse('reactive_flareup')}
                className={`text-xs p-2 rounded border text-right transition-colors ${
                  tissueResponse === 'reactive_flareup'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold'
                    : 'border-neutral-200 bg-neutral-50/50'
                }`}
              >
                ⚠️ {isAr ? 'تهيج نسيجي تفاعلي (Flare-up)' : 'Reactive Flare-up'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'الانطباع السريري (Clinical Impression)' : 'Clinical Impression'}
            </label>
            <textarea
              rows={3}
              value={clinicalImpression}
              onChange={(e) => setClinicalImpression(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'التكهن المستقبلي للتعافي (Prognosis)' : 'Prognosis'}
            </label>
            <input
              type="text"
              value={prognosis}
              onChange={(e) => setPrognosis(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* P - PLAN */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-[#24383B] text-white">
              P - Plan
            </span>
            <span className="text-xs font-semibold text-neutral-600">
              {isAr ? 'الخطة العلاجية والتعديلات التلقائية' : 'Treatment Plan & Auto Modifications'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {isAr ? 'الأجهزة والوسائل المستخدمة في الجلسة' : 'Modalities Used'}
            </label>
            <div className="space-y-1.5">
              {[
                'شد الفقرات القطنية الميكانيكي (Lumbar Traction)',
                'شد الفقرات العنقية الرقمي (Cervical Traction)',
                'الموجات التصادمية الشعاعية (Shockwave ESWT)',
                'التيار التداخلي المسكن (IFT)',
                'الموجات فوق الصوتية العلاجية (Ultrasound 1MHz)',
              ].map((mod) => (
                <label key={mod} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalityUsed.includes(mod)}
                    onChange={(e) => {
                      if (e.target.checked) setModalityUsed([...modalityUsed, mod]);
                      else setModalityUsed(modalityUsed.filter((m) => m !== mod));
                    }}
                    className="accent-[#075563]"
                  />
                  <span>{mod}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'العلاج اليدوي والتحريك المفصلي (Manual Therapy)' : 'Manual Therapy'}
            </label>
            <input
              type="text"
              value={manualTherapy}
              onChange={(e) => setManualTherapy(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'تعديلات برنامج التمارين المنزلي والاحتياطات' : 'Home Program Updates & Precautions'}
            </label>
            <textarea
              rows={2}
              value={homeUpdates}
              onChange={(e) => setHomeUpdates(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSaveNote}
              className="w-full py-2.5 bg-[#075563] text-white rounded-lg text-xs font-bold hover:bg-[#06424e] flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              {isAr ? 'حفظ وتوثيق الـ SOAP Note للجلسة' : 'Save & Certify SOAP Note'}
            </button>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#075563] flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-[#B59B62]" />
          {isAr ? 'سجل الـ SOAP Notes السابق للمريض (Timeline History)' : 'Previous SOAP Notes Timeline'}
        </h3>

        <div className="space-y-4">
          {savedNotes.map((note) => (
            <div key={note.id} className="p-4 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#075563]">
                    {isAr ? `جلسة رقم ${note.sessionNumber}` : `Session #${note.sessionNumber}`}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-neutral-600">{note.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    VAS: {note.subjective.vasPainScore} / 10
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {note.assessment.tissueResponse === 'improving_rapidly' ? 'تحسن متسارع' : 'استجابة جيدة'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="font-bold text-neutral-800 block mb-0.5">S (الذاتي):</span>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{note.subjective.patientComplaint}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-800 block mb-0.5">O (الفحص):</span>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{note.objective.palpationSpasm}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-800 block mb-0.5">A (التقييم):</span>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{note.assessment.clinicalImpression}</p>
                </div>
                <div>
                  <span className="font-bold text-neutral-800 block mb-0.5">P (الخطة):</span>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">{note.plan.homeProgramUpdates}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
