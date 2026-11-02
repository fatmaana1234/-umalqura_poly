import React, { useState } from 'react';
import { HomeExercise, Patient } from '../../types/clinic';
import { Play, Share2, Check, Video, Clock, Repeat, Shield, MessageCircle } from 'lucide-react';

interface Props {
  exercises: HomeExercise[];
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const HomeExerciseLibrary: React.FC<Props> = ({ exercises, patients, lang }) => {
  const isAr = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<HomeExercise>(exercises[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [sentSuccessMessage, setSentSuccessMessage] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const filteredExercises =
    selectedCategory === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === selectedCategory);

  const handleSendToPatient = (exercise: HomeExercise) => {
    if (!selectedPatient) return;

    // Simulate WhatsApp Cloud API dispatch
    const text = isAr
      ? `السلام عليكم ورحمة الله وبركاته يا ${selectedPatient.nameAr}، أرسل لك أخصائي العلاج الطبيعي بمجمع أم القرى الطبي بركاء تمرينك المنزلي المخصص: *${exercise.titleAr}*.\nالمجموعات: ${exercise.repsAndSets}.\nرابط الفيديو التعليمي المعتمد: https://umalqura.om/rx/${exercise.id}?pat=${selectedPatient.civilId}\nمع تمنياتنا لك بالشفاء العاجل.`
      : `Dear ${selectedPatient.nameEn}, your prescribed home exercise from Um Alqura Polyclinic: ${exercise.titleEn}. Instructions: ${exercise.repsAndSets}. Watch: https://umalqura.om/rx/${exercise.id}`;

    // Show simulated feedback
    setSentSuccessMessage(
      isAr
        ? `تم إرسال رابط التمرين بنجاح إلى واتساب المريض (${selectedPatient.phone}) عبر WhatsApp Cloud API!`
        : `Exercise sent to patient WhatsApp (${selectedPatient.phone})!`
    );

    setTimeout(() => setSentSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Video className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'مكتبة التمارين العلاجية المنزلية المحتشمة (Home Exercise Video Library)' : 'Home Exercise Video Library'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'مكتبة إكلينيكية رقمية مصورة تراعي العادات العُمانية والحشمة التامة • يختار الأخصائي التمارين المناسبة ويرسلها إلى واتساب المريض بنقرة واحدة مع عداد التكرارات التفاعلي'
              : 'Culturally modest clinical video library. 1-click WhatsApp dispatch to patient with sets, reps, and precautions.'}
          </p>
        </div>

        {/* Patient Selection for dispatch */}
        <div className="flex items-center gap-2 bg-[#FAF8F1] p-2 rounded-lg border border-[#B59B62]/30">
          <span className="text-xs font-bold text-[#075563] whitespace-nowrap">
            {isAr ? 'إرسال إلى المريض:' : 'Send To:'}
          </span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs border border-neutral-300 rounded p-1.5 bg-white font-medium text-neutral-800 focus:outline-hidden"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameAr} ({p.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {sentSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          {sentSuccessMessage}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', labelAr: 'جميع التمارين', labelEn: 'All' },
          { id: 'cervical', labelAr: 'الفقرات العنقية والرقبة', labelEn: 'Cervical' },
          { id: 'lumbar', labelAr: 'أسفل الظهر والديسك', labelEn: 'Lumbar' },
          { id: 'knee', labelAr: 'مفصل الركبة والخشونة', labelEn: 'Knee' },
          { id: 'shoulder', labelAr: 'الكتف والأطراف العلوية', labelEn: 'Shoulder' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
              selectedCategory === tab.id
                ? 'bg-[#075563] text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Main Grid: Player on Left, Exercise List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player & Instruction View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
            <div>
              <span className="text-[11px] text-[#B59B62] font-bold block mb-0.5">
                {selectedExercise.category.toUpperCase()} • {selectedExercise.targetMuscleAr}
              </span>
              <h3 className="text-base font-bold text-[#075563]">{selectedExercise.titleAr}</h3>
            </div>

            <button
              type="button"
              onClick={() => handleSendToPatient(selectedExercise)}
              className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {isAr ? 'إرسال بالواتساب' : 'WhatsApp'}
            </button>
          </div>

          {/* Video Player Screen Simulation */}
          <div className="relative aspect-video w-full bg-gradient-to-tr from-[#075563] to-[#24383B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-white text-center shadow-inner">
            {/* Omani Modesty Banner */}
            <div className="absolute top-3 right-3 left-3 flex justify-between items-center text-[11px] bg-black/40 backdrop-blur-xs px-3 py-1 rounded-md text-neutral-200">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#B59B62]" />
                {selectedExercise.modestyNoticeAr}
              </span>
              <span className="font-mono text-emerald-400">4K HD • صوت ومرئي</span>
            </div>

            {isPlaying ? (
              <div className="space-y-3 z-10">
                <div className="w-16 h-16 rounded-full border-4 border-[#2A9DA5] border-t-transparent animate-spin mx-auto" />
                <div className="text-sm font-bold text-[#FAF8F1]">
                  {isAr ? 'جاري تشغيل التمرين الإكلينيكي المعتمد...' : 'Playing Clinical Video...'}
                </div>
                <div className="text-xs text-neutral-300">
                  {selectedExercise.instructionsAr[0]}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors"
                >
                  {isAr ? 'إيقاف مؤقت' : 'Pause'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 z-10">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-[#B59B62] hover:bg-[#a68c55] text-white flex items-center justify-center mx-auto shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
                <div className="text-xs text-neutral-300">
                  {isAr ? 'انقر لتشغيل الفيديو التعليمي مع الشرح الصوتي العُماني' : 'Click to preview exercise video'}
                </div>
              </div>
            )}

            {/* Bottom bar overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-[#2A9DA5]" />
                {selectedExercise.repsAndSets}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B59B62]" />
                {selectedExercise.frequency}
              </span>
            </div>
          </div>

          {/* Exercise Instructions & Precautions */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#075563]">
              {isAr ? 'خطوات أداء التمرين الصحيحة:' : 'Step-by-Step Instructions:'}
            </h4>
            <ol className="text-xs text-neutral-700 space-y-1.5 list-decimal list-inside pr-1">
              {selectedExercise.instructionsAr.map((inst, idx) => (
                <li key={idx} className="leading-relaxed">
                  {inst}
                </li>
              ))}
            </ol>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 mt-3">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">{isAr ? 'تنبيه أمان علاجي:' : 'Safety Precaution:'}</span>
                <p className="text-[11px] leading-relaxed">{selectedExercise.precautionsAr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-[#075563] mb-3 flex items-center justify-between">
              <span>{isAr ? 'قائمة التمارين المتاحة بالمجمع' : 'Available Exercises'}</span>
              <span className="text-[11px] text-neutral-500 font-normal">
                {filteredExercises.length} {isAr ? 'تمارين' : 'items'}
              </span>
            </h4>

            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setSelectedExercise(ex);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedExercise.id === ex.id
                      ? 'border-[#075563] bg-[#075563]/5 shadow-xs'
                      : 'border-neutral-200 bg-neutral-50/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-[#075563] leading-snug">{ex.titleAr}</span>
                    <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {ex.videoDurationSec} {isAr ? 'ثانية' : 'sec'}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                    <span>{ex.targetMuscleAr}</span>
                    <span>•</span>
                    <span className="text-[#B59B62] font-semibold">{ex.repsAndSets}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
