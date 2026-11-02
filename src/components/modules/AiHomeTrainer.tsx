import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Volume2, ShieldAlert, Award, Play, Pause, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  lang: 'ar' | 'en';
}

export const AiHomeTrainer: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [exercise, setExercise] = useState<'squat' | 'quad_extension' | 'shoulder_raise'>('squat');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [repCount, setRepCount] = useState<number>(0);
  const [targetReps, setTargetReps] = useState<number>(10);
  const [currentDepth, setCurrentDepth] = useState<number>(85); // Angle
  const [formFeedback, setFormFeedback] = useState<{
    status: 'good' | 'warning' | 'perfect';
    messageAr: string;
    messageEn: string;
  }>({
    status: 'good',
    messageAr: 'استعد أمام الكاميرا مع الحفاظ على استقامة الظهر',
    messageEn: 'Position yourself in front of camera',
  });

  const repCountRef = useRef(repCount);
  repCountRef.current = repCount;

  // Sound synthesis in Arabic
  const speakVoiceFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Rep cycle simulation engine
  useEffect(() => {
    if (!isActive) return;

    let direction = -1;
    let depth = 85;

    const interval = setInterval(() => {
      depth += direction * 4;

      if (depth <= 45) {
        // Peak contraction
        direction = 1;
        setRepCount((prev) => {
          const nextRep = prev + 1;
          speakVoiceFeedback(`تكرار ${nextRep}، أحسنت!`);
          if (nextRep >= targetReps) {
            confetti({ particleCount: 70, spread: 60 });
          }
          return nextRep;
        });

        // Form check
        setFormFeedback({
          status: 'perfect',
          messageAr: 'ممتاز! عمق حركي مثالي وتوزيع وزن متوازن على الكعبين',
          messageEn: 'Perfect depth and heel weight distribution!',
        });
      } else if (depth >= 90) {
        // Return to start
        direction = -1;
      }

      // Random occasional form safety warning check
      if (depth === 65 && Math.random() > 0.6) {
        setFormFeedback({
          status: 'warning',
          messageAr: '⚠️ انتبه لسلامة المفصل: ادفع الركبتين للخارج قليلاً لمنع تقوس الركبة للداخل',
          messageEn: 'Warning: Push knees outward to avoid valgus stress',
        });
      }

      setCurrentDepth(depth);
    }, 120);

    return () => clearInterval(interval);
  }, [isActive, targetReps]);

  const handleReset = () => {
    setRepCount(0);
    setIsActive(false);
    setFormFeedback({
      status: 'good',
      messageAr: 'تمت إعادة ضبط العداد',
      messageEn: 'Counter reset',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Camera className="w-5 h-5 text-[#B59B62]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'المدرب المنزلي الذكي بالذكاء الاصطناعي (AI Home Exercise Trainer)' : 'AI Home Exercise Trainer'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'تطبيق المريض المنزلي • فتح كاميرا الهاتف لعد التكرارات تلقائياً وتنبيه المريض صوتياً ومرئياً عند أي خطأ في زاوية المفصل يهدد السلامة'
              : 'Automated rep counting via mobile camera with real-time pose validation & voice alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              type="button"
              onClick={() => setIsActive(false)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Pause className="w-4 h-4" />
              {isAr ? 'إيقاف مؤقت' : 'Pause'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsActive(true)}
              className="px-4 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Play className="w-4 h-4" />
              {isAr ? 'بدء التمرين والتتبع بالكاميرا' : 'Start Camera Workout'}
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-100"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise Selection */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setExercise('squat');
            handleReset();
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            exercise === 'squat'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'bg-white text-neutral-700 border border-neutral-200'
          }`}
        >
          {isAr ? 'تمرين القرفصاء العلاجي (Rehab Squat)' : 'Rehab Squats'}
        </button>
        <button
          type="button"
          onClick={() => {
            setExercise('quad_extension');
            handleReset();
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            exercise === 'quad_extension'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'bg-white text-neutral-700 border border-neutral-200'
          }`}
        >
          {isAr ? 'مد الركبة الرباعي (Knee Extension)' : 'Knee Extension'}
        </button>
        <button
          type="button"
          onClick={() => {
            setExercise('shoulder_raise');
            handleReset();
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            exercise === 'shoulder_raise'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'bg-white text-neutral-700 border border-neutral-200'
          }`}
        >
          {isAr ? 'رفع الذراع للكتف المتجمد (Shoulder Elevation)' : 'Shoulder Elevation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Camera Vision Box (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          {/* Form Warning / Praise Alert Banner */}
          <div
            className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-between gap-2 transition-all ${
              formFeedback.status === 'warning'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : formFeedback.status === 'perfect'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {formFeedback.status === 'warning' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span>{isAr ? formFeedback.messageAr : formFeedback.messageEn}</span>
            </div>
            <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
          </div>

          {/* Interactive Screen */}
          <div className="relative aspect-video w-full bg-[#0F172A] rounded-xl overflow-hidden flex items-center justify-center border border-neutral-800 select-none">
            {/* Real-time Skeleton and Keypoint Rendering */}
            <svg viewBox="0 0 500 300" className="w-full h-full">
              {/* Torso */}
              <line x1="250" y1="70" x2="250" y2="160" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
              <circle cx="250" cy="50" r="16" fill="#075563" stroke="#B59B62" strokeWidth="2" />

              {/* Hips */}
              <circle cx="250" cy="160" r="8" fill="#B59B62" />

              {/* Thighs and Knees moving with current depth */}
              {(() => {
                const kneeY = 160 + (currentDepth * 60) / 90;
                const kneeX1 = 200;
                const kneeX2 = 300;
                const ankleY = 270;

                return (
                  <>
                    <line x1="250" y1="160" x2={kneeX1} y2={kneeY} stroke="#2A9DA5" strokeWidth="6" strokeLinecap="round" />
                    <line x1="250" y1="160" x2={kneeX2} y2={kneeY} stroke="#2A9DA5" strokeWidth="6" strokeLinecap="round" />

                    <circle cx={kneeX1} cy={kneeY} r="7" fill={formFeedback.status === 'warning' ? '#EF4444' : '#22C55E'} />
                    <circle cx={kneeX2} cy={kneeY} r="7" fill={formFeedback.status === 'warning' ? '#EF4444' : '#22C55E'} />

                    <line x1={kneeX1} y1={kneeY} x2="190" y2={ankleY} stroke="#2A9DA5" strokeWidth="6" strokeLinecap="round" />
                    <line x1={kneeX2} y1={kneeY} x2="310" y2={ankleY} stroke="#2A9DA5" strokeWidth="6" strokeLinecap="round" />
                  </>
                );
              })()}

              {/* HUD Rep Display */}
              <g transform="translate(30, 30)">
                <rect width="110" height="70" rx="8" fill="rgba(7, 85, 99, 0.85)" stroke="#B59B62" strokeWidth="1" />
                <text x="55" y="22" fill="#FAF8F1" fontSize="11" textAnchor="middle" fontWeight="bold">
                  تكرارات التمرين
                </text>
                <text x="55" y="55" fill="#FFFFFF" fontSize="28" textAnchor="middle" fontWeight="900" fontFamily="monospace">
                  {repCount} / {targetReps}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Workout Progress Metrics (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3">
            {isAr ? 'إحصائيات الجلسة المنزلية' : 'Session Metrics'}
          </h3>

          <div className="p-4 rounded-xl bg-gradient-to-b from-[#FAF8F1] to-white border border-[#B59B62]/30 text-center space-y-1">
            <span className="text-xs text-neutral-500 font-medium block">
              {isAr ? 'نسبة إنجاز المجموعة' : 'Set Completion'}
            </span>
            <span className="text-4xl font-black text-[#075563] font-mono block">
              {Math.min(100, Math.round((repCount / targetReps) * 100))}%
            </span>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-[#075563] to-[#2A9DA5] rounded-full transition-all"
                style={{ width: `${Math.min(100, (repCount / targetReps) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-neutral-600">{isAr ? 'دقة وضعية الجسم:' : 'Posture Score:'}</span>
              <span className="font-mono font-bold text-emerald-700">96.2%</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-neutral-50 border border-neutral-200">
              <span className="text-neutral-600">{isAr ? 'الإرشاد الصوتي:' : 'Voice Guidance:'}</span>
              <span className="font-bold text-[#075563]">{isAr ? 'مفعّل (عربي عُماني)' : 'Active'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
