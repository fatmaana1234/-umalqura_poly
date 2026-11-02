import React, { useState } from 'react';
import { PainPoint, Patient } from '../../types/clinic';
import { Activity, Plus, Trash2, Calendar, MapPin, Eye, Clock } from 'lucide-react';

interface Props {
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const InteractiveBodyMap: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('posterior');

  // Input state for new point
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('severe');
  const [selectedScore, setSelectedScore] = useState<number>(8);
  const [selectedNature, setSelectedNature] = useState<'dull' | 'sharp' | 'burning' | 'radiating' | 'aching'>('radiating');

  // Points list
  const [painPoints, setPainPoints] = useState<PainPoint[]>([
    {
      id: 'pt-1',
      x: 50,
      y: 48,
      view: 'posterior',
      zone: 'lumbar',
      zoneNameAr: 'الفقرات القطنية L4-L5',
      zoneNameEn: 'Lumbar L4-L5 Spine',
      severity: 'severe',
      score: 8,
      nature: 'sharp',
      dateAdded: '2026-10-12 (الجلسة الأولى)',
    },
    {
      id: 'pt-2',
      x: 58,
      y: 62,
      view: 'posterior',
      zone: 'hip_r',
      zoneNameAr: 'المنطقة الألوية اليمنى وخلف الفخذ (عرق النسا)',
      zoneNameEn: 'Right Gluteal & Sciatic Radiation',
      severity: 'moderate',
      score: 6,
      nature: 'radiating',
      dateAdded: '2026-10-18 (الجلسة الرابعة)',
    },
    {
      id: 'pt-3',
      x: 35,
      y: 22,
      view: 'anterior',
      zone: 'shoulder_r',
      zoneNameAr: 'الكتف الأيمن الأمامي (العضلة فوق الشوكية)',
      zoneNameEn: 'Right Anterior Shoulder',
      severity: 'moderate',
      score: 5,
      nature: 'dull',
      dateAdded: '2026-10-25',
    },
    {
      id: 'pt-4',
      x: 50,
      y: 18,
      view: 'posterior',
      zone: 'cervical',
      zoneNameAr: 'الفقرات العنقية C5-C6',
      zoneNameEn: 'Cervical Spine C5-C6',
      severity: 'mild',
      score: 3,
      nature: 'aching',
      dateAdded: '2026-10-28 (الجلسة السابعة)',
    },
  ]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Approximate body zone
    let zone: PainPoint['zone'] = 'lumbar';
    let zoneNameAr = 'أسفل الظهر';
    let zoneNameEn = 'Lower Back';

    if (y < 25) {
      if (x < 40) {
        zone = 'shoulder_r';
        zoneNameAr = 'الكتف الأيمن';
        zoneNameEn = 'Right Shoulder';
      } else if (x > 60) {
        zone = 'shoulder_l';
        zoneNameAr = 'الكتف الأيسر';
        zoneNameEn = 'Left Shoulder';
      } else {
        zone = 'cervical';
        zoneNameAr = 'الفقرات العنقية والرقبة';
        zoneNameEn = 'Cervical Spine & Neck';
      }
    } else if (y < 42) {
      zone = 'thoracic';
      zoneNameAr = 'أعلى الظهر والقفص الصدري';
      zoneNameEn = 'Thoracic Region';
    } else if (y < 58) {
      zone = 'lumbar';
      zoneNameAr = 'الفقرات القطنية وعجز الظهر';
      zoneNameEn = 'Lumbar & Sacral Spine';
    } else if (y < 75) {
      if (x < 50) {
        zone = 'knee_r';
        zoneNameAr = 'مفصل الركبة اليمنى والفخذ';
        zoneNameEn = 'Right Knee & Thigh';
      } else {
        zone = 'knee_l';
        zoneNameAr = 'مفصل الركبة اليسرى والفخذ';
        zoneNameEn = 'Left Knee & Thigh';
      }
    } else {
      if (x < 50) {
        zone = 'ankle_r';
        zoneNameAr = 'الكاحل والقدم اليمنى';
        zoneNameEn = 'Right Ankle & Foot';
      } else {
        zone = 'ankle_l';
        zoneNameAr = 'الكاحل والقدم اليسرى';
        zoneNameEn = 'Left Ankle & Foot';
      }
    }

    const newPoint: PainPoint = {
      id: `pt-${Date.now()}`,
      x,
      y,
      view: activeView,
      zone,
      zoneNameAr,
      zoneNameEn,
      severity: selectedSeverity,
      score: selectedScore,
      nature: selectedNature,
      dateAdded: `${new Date().toISOString().slice(0, 10)} (جلسة اليوم)`,
    };

    setPainPoints([...painPoints, newPoint]);
  };

  const removePoint = (id: string) => {
    setPainPoints(painPoints.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'خريطة الجسد التفاعلية لتحديد مواضع الألم (Interactive Pain Body Map)' : 'Interactive Body Map for Pain Location'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'نموذج تشريحي تفاعلي للأمام والخلف. ينقر الأخصائي لتحديد بؤرة الألم مع التدرج اللوني: أحمر (شديد ٨-١٠) • برتقالي (متوسط ٥-٧) • أصفر (خفيف ١-٤) ومتابعة تطوره عبر الجلسات'
              : 'Interactive 2D anatomical map. Click points to log pain location, intensity, and track pain centralization timeline.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveView('posterior')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeView === 'posterior'
                ? 'bg-white text-[#075563] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isAr ? 'المنظر الخلفي (الظهر والرقبة)' : 'Posterior View (Back)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('anterior')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
              activeView === 'anterior'
                ? 'bg-white text-[#075563] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isAr ? 'المنظر الأمامي (الصدر والركبتين)' : 'Anterior View (Front)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Anatomical Model Canvas (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold text-[#075563]">
              {activeView === 'posterior'
                ? isAr
                  ? 'المنظر الخلفي (Posterior Aspect)'
                  : 'Posterior Aspect'
                : isAr
                ? 'المنظر الأمامي (Anterior Aspect)'
                : 'Anterior Aspect'}
            </span>
            <span className="text-[11px] text-neutral-400">
              {isAr ? 'انقر على أي موضع بالجسد لتسجيل نقطة ألم' : 'Click on body to pin pain site'}
            </span>
          </div>

          {/* SVG Anatomical Silhouette */}
          <div className="relative w-72 h-[480px] bg-gradient-to-b from-[#FAF8F1] to-neutral-100/50 rounded-xl border border-neutral-200/80 p-2 flex items-center justify-center select-none">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full cursor-crosshair drop-shadow-sm"
              onClick={handleSvgClick}
            >
              {/* Head & Neck */}
              <circle cx="100" cy="38" r="22" fill="#24383B" opacity="0.08" stroke="#075563" strokeWidth="1.5" />
              {/* Neck */}
              <rect x="94" y="58" width="12" height="16" rx="3" fill="#075563" opacity="0.1" />

              {/* Shoulders & Torso */}
              <path
                d="M 50 85 C 65 72 82 72 100 72 C 118 72 135 72 150 85 C 160 105 162 130 156 160 C 150 170 145 190 148 210 C 145 220 135 225 100 225 C 65 225 55 220 52 210 C 55 190 50 170 44 160 C 38 130 40 105 50 85 Z"
                fill="#24383B"
                opacity="0.07"
                stroke="#075563"
                strokeWidth="1.5"
              />

              {/* Arms */}
              <path
                d="M 45 90 L 25 150 L 15 220 L 22 225 L 35 155 L 50 110 Z"
                fill="#24383B"
                opacity="0.06"
                stroke="#075563"
                strokeWidth="1.2"
              />
              <path
                d="M 155 90 L 175 150 L 185 220 L 178 225 L 165 155 L 150 110 Z"
                fill="#24383B"
                opacity="0.06"
                stroke="#075563"
                strokeWidth="1.2"
              />

              {/* Spine Line on Posterior */}
              {activeView === 'posterior' && (
                <path
                  d="M 100 75 L 100 215"
                  stroke="#B59B62"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />
              )}

              {/* Legs */}
              {/* Right Leg (viewer's left in posterior) */}
              <path
                d="M 60 225 C 62 260 62 300 66 330 C 66 350 64 380 60 395 L 75 395 C 82 380 84 350 86 330 C 90 300 90 260 92 225 Z"
                fill="#24383B"
                opacity="0.07"
                stroke="#075563"
                strokeWidth="1.5"
              />
              {/* Left Leg */}
              <path
                d="M 108 225 C 110 260 110 300 114 330 C 116 350 118 380 125 395 L 140 395 C 136 380 134 350 134 330 C 138 300 138 260 140 225 Z"
                fill="#24383B"
                opacity="0.07"
                stroke="#075563"
                strokeWidth="1.5"
              />

              {/* Render Pin Points */}
              {painPoints
                .filter((p) => p.view === activeView)
                .map((pt) => {
                  const fillColor =
                    pt.severity === 'severe'
                      ? '#DC2626'
                      : pt.severity === 'moderate'
                      ? '#EA580C'
                      : '#EAB308';
                  return (
                    <g key={pt.id} transform={`translate(${(pt.x * 200) / 100}, ${(pt.y * 400) / 100})`}>
                      <circle r="9" fill={fillColor} opacity="0.3" className="animate-ping" />
                      <circle r="6" fill={fillColor} stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        y="3"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        {pt.score}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
              <span className="text-neutral-600">{isAr ? 'شديد (٨-١٠)' : 'Severe (8-10)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
              <span className="text-neutral-600">{isAr ? 'متوسط (٥-٧)' : 'Moderate (5-7)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="text-neutral-600">{isAr ? 'خفيف (١-٤)' : 'Mild (1-4)'}</span>
            </div>
          </div>
        </div>

        {/* Pain Properties & Timeline List (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Controls for Next Point */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#075563] border-b border-neutral-100 pb-2">
              {isAr ? 'خصائص نقطة الألم المراد تسجيلها' : 'Pain Point Properties'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  {isAr ? 'درجة الشدة (Severity):' : 'Severity:'}
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSeverity('severe');
                      setSelectedScore(8);
                    }}
                    className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${
                      selectedSeverity === 'severe'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {isAr ? 'شديد' : 'Severe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSeverity('moderate');
                      setSelectedScore(6);
                    }}
                    className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${
                      selectedSeverity === 'moderate'
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {isAr ? 'متوسط' : 'Moderate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSeverity('mild');
                      setSelectedScore(3);
                    }}
                    className={`flex-1 text-xs py-1.5 rounded font-bold transition-colors ${
                      selectedSeverity === 'mild'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {isAr ? 'خفيف' : 'Mild'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  {isAr ? 'طبيعة ونوع الألم:' : 'Pain Nature:'}
                </label>
                <select
                  value={selectedNature}
                  onChange={(e) => setSelectedNature(e.target.value as any)}
                  className="w-full text-xs border border-neutral-300 rounded p-1.5 bg-neutral-50"
                >
                  <option value="radiating">{isAr ? 'ممتد / عرق نسا (Radiating)' : 'Radiating'}</option>
                  <option value="sharp">{isAr ? 'حاد / وخز (Sharp/Stabbing)' : 'Sharp'}</option>
                  <option value="burning">{isAr ? 'حارق / ناري (Burning)' : 'Burning'}</option>
                  <option value="dull">{isAr ? 'مكتوم ومستمر (Dull Ache)' : 'Dull'}</option>
                  <option value="aching">{isAr ? 'وجع خفيف (Aching)' : 'Aching'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Points Timeline */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#075563] flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B59B62]" />
                {isAr ? 'الجدول الزمني لتطور نقاط الألم (Pain Mapping Timeline)' : 'Pain Timeline'}
              </span>
              <span className="text-[11px] text-neutral-500">
                {painPoints.length} {isAr ? 'بؤر مسجلة' : 'points'}
              </span>
            </h3>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {painPoints.map((pt) => (
                <div
                  key={pt.id}
                  className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 hover:bg-white flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          pt.severity === 'severe'
                            ? 'bg-red-600'
                            : pt.severity === 'moderate'
                            ? 'bg-orange-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="font-bold text-[#075563]">{pt.zoneNameAr}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="font-semibold text-neutral-700">VAS: {pt.score}/10</span>
                    </div>

                    <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                      <span>{pt.view === 'posterior' ? 'خلفي (ظهر)' : 'أمامي (صدر/ركبة)'}</span>
                      <span>•</span>
                      <span>نوع الألم: {pt.nature}</span>
                      <span>•</span>
                      <span className="text-[#B59B62] font-medium">{pt.dateAdded}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePoint(pt.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title={isAr ? 'حذف النقطة' : 'Remove Point'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
