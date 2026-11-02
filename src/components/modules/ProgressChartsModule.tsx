import React, { useState } from 'react';
import { Patient } from '../../types/clinic';
import { TrendingUp, Activity, Award, CheckCircle2, ChevronRight, BarChart3 } from 'lucide-react';

interface Props {
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const ProgressChartsModule: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Session Progression Data (Pain VAS & ROM over 8 sessions)
  const sessionData = [
    { session: 1, date: '12 Oct', vas: 9, kneeRom: 65, shoulderRom: 70, lumbarRom: 25 },
    { session: 2, date: '15 Oct', vas: 8, kneeRom: 75, shoulderRom: 85, lumbarRom: 32 },
    { session: 3, date: '18 Oct', vas: 7, kneeRom: 85, shoulderRom: 100, lumbarRom: 40 },
    { session: 4, date: '21 Oct', vas: 5, kneeRom: 98, shoulderRom: 115, lumbarRom: 48 },
    { session: 5, date: '24 Oct', vas: 4, kneeRom: 110, shoulderRom: 130, lumbarRom: 54 },
    { session: 6, date: '27 Oct', vas: 3, kneeRom: 118, shoulderRom: 145, lumbarRom: 58 },
    { session: 7, date: '30 Oct', vas: 3, kneeRom: 124, shoulderRom: 155, lumbarRom: 62 },
    { session: 8, date: '02 Nov', vas: 2, kneeRom: 130, shoulderRom: 165, lumbarRom: 65 },
  ];

  const baselineVas = sessionData[0].vas;
  const currentVas = sessionData[sessionData.length - 1].vas;
  const painReductionPercent = Math.round(((baselineVas - currentVas) / baselineVas) * 100);

  const baselineRom = sessionData[0].kneeRom;
  const currentRom = sessionData[sessionData.length - 1].kneeRom;
  const romGained = currentRom - baselineRom;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'لوحة الرسوم البيانية التلقائية لتطور المدى الحركي والألم' : 'Automatic Progress Charts Dashboard'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'مقارنة خط الأساس الأولي (Baseline) مع الجلسة الحالية أوتوماتيكياً • قياس انحسار الألم وسرعة اكتساب الدرجات المفصلية (ROM Velocity)'
              : 'Line charts comparing Baseline vs Current session. Tracking pain subsidence and ROM recovery velocity.'}
          </p>
        </div>

        {/* Patient Selector */}
        <div className="flex items-center gap-2 bg-[#FAF8F1] p-2 rounded-lg border border-[#B59B62]/30">
          <span className="text-xs font-bold text-[#075563]">
            {isAr ? 'المريض:' : 'Patient:'}
          </span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="text-xs border border-neutral-300 rounded p-1.5 bg-white font-medium text-neutral-800"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameAr} - {p.diagnosisAr.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-neutral-500">
            {isAr ? 'انخفاض حدة الألم التراكمي (VAS Reduction)' : 'Pain Reduction'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#075563] font-mono">
              -{painReductionPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              ({baselineVas}/10 ← {currentVas}/10)
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {isAr ? 'تراجع الألم من شديد جداً إلى ألم مجهري خفيف' : 'From severe to mild residual'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-neutral-500">
            {isAr ? 'اكتساب المدى الحركي المفصلي (ROM Gain)' : 'ROM Gained'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2A9DA5] font-mono">
              +{romGained}°
            </span>
            <span className="text-xs text-neutral-600">
              ({baselineRom}° ← {currentRom}°)
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {isAr ? 'معدل اكتساب حركي: +٨.١ درجات أسبوعياً' : '+8.1 degrees per week velocity'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-1">
          <span className="text-xs font-medium text-neutral-500">
            {isAr ? 'مؤشر تحقيق الأهداف السريرية (Goal Metric)' : 'Goal Achievement'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#B59B62] font-mono">
              88%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {isAr ? 'مؤهل للتخريج قريباً' : 'Near Discharge'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {isAr ? 'تحقيق ٧ من ٨ أهداف وظيفية مدرجة' : '7 of 8 functional milestones met'}
          </p>
        </div>
      </div>

      {/* Visual SVG Progress Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: VAS Pain Score Line Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-[#075563] flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              {isAr ? 'منحنى انحسار الألم (VAS Pain Score 0-10)' : 'Pain Subsidence Curve (VAS)'}
            </h3>
            <span className="text-xs text-neutral-400">{isAr ? 'الهدف: أقل من ٢' : 'Target: < 2'}</span>
          </div>

          <div className="relative h-64 w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              {[0, 50, 100, 150].map((y, idx) => (
                <line
                  key={idx}
                  x1="30"
                  y1={y + 20}
                  x2="480"
                  y2={y + 20}
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="15" y="25" fontSize="10" fill="#9CA3AF" textAnchor="end">10</text>
              <text x="15" y="75" fontSize="10" fill="#9CA3AF" textAnchor="end">7</text>
              <text x="15" y="125" fontSize="10" fill="#9CA3AF" textAnchor="end">4</text>
              <text x="15" y="175" fontSize="10" fill="#9CA3AF" textAnchor="end">1</text>

              {/* Connecting line */}
              {(() => {
                const points = sessionData.map((d, i) => {
                  const x = 50 + i * ((470 - 50) / (sessionData.length - 1));
                  const y = 170 - (d.vas / 10) * 150;
                  return `${x},${y}`;
                });
                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="3"
                      points={points.join(' ')}
                    />
                    {/* Points */}
                    {sessionData.map((d, i) => {
                      const x = 50 + i * ((470 - 50) / (sessionData.length - 1));
                      const y = 170 - (d.vas / 10) * 150;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                          <text x={x} y={y - 8} fontSize="10" fontWeight="bold" fill="#075563" textAnchor="middle">
                            {d.vas}
                          </text>
                          <text x={x} y="195" fontSize="9" fill="#6B7280" textAnchor="middle">
                            {d.date}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between items-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <span>{isAr ? 'الجلسة ١ (خط الأساس): ٩/١٠' : 'Session 1 (Baseline): 9/10'}</span>
            <span className="font-bold text-emerald-600">{isAr ? 'الجلسة ٨ (الحالية): ٢/١٠' : 'Session 8 (Current): 2/10'}</span>
          </div>
        </div>

        {/* Chart 2: Joint ROM Improvement Line Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-[#075563] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2A9DA5]" />
              {isAr ? 'منحنى المدى الحركي (Knee Flexion ROM Degrees)' : 'ROM Flexion Degrees Curve'}
            </h3>
            <span className="text-xs text-neutral-400">{isAr ? 'المدى الطبيعي: ١٣٥°' : 'Normal: 135°'}</span>
          </div>

          <div className="relative h-64 w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              {[0, 50, 100, 150].map((y, idx) => (
                <line
                  key={idx}
                  x1="30"
                  y1={y + 20}
                  x2="480"
                  y2={y + 20}
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="15" y="25" fontSize="10" fill="#9CA3AF" textAnchor="end">140°</text>
              <text x="15" y="75" fontSize="10" fill="#9CA3AF" textAnchor="end">110°</text>
              <text x="15" y="125" fontSize="10" fill="#9CA3AF" textAnchor="end">85°</text>
              <text x="15" y="175" fontSize="10" fill="#9CA3AF" textAnchor="end">60°</text>

              {/* Connecting line */}
              {(() => {
                const points = sessionData.map((d, i) => {
                  const x = 50 + i * ((470 - 50) / (sessionData.length - 1));
                  // Normalize 60° to 140° (span 80)
                  const y = 170 - ((d.kneeRom - 60) / 80) * 150;
                  return `${x},${y}`;
                });
                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#2A9DA5"
                      strokeWidth="3"
                      points={points.join(' ')}
                    />
                    {/* Points */}
                    {sessionData.map((d, i) => {
                      const x = 50 + i * ((470 - 50) / (sessionData.length - 1));
                      const y = 170 - ((d.kneeRom - 60) / 80) * 150;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="#2A9DA5" stroke="#FFFFFF" strokeWidth="2" />
                          <text x={x} y={y - 8} fontSize="10" fontWeight="bold" fill="#075563" textAnchor="middle">
                            {d.kneeRom}°
                          </text>
                          <text x={x} y="195" fontSize="9" fill="#6B7280" textAnchor="middle">
                            {d.date}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between items-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
            <span>{isAr ? 'البداية: ٦٥ درجة' : 'Initial: 65°'}</span>
            <span className="font-bold text-emerald-600">{isAr ? 'الحالي: ١٣٠ درجة (قريب من الطبيعي)' : 'Current: 130° (Normal)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
