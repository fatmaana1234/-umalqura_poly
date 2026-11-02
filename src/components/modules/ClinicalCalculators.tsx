import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
}

export const ClinicalCalculators: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'oswestry' | 'dash' | 'berg'>('oswestry');

  // --- 1. OSWESTRY LOW BACK PAIN INDEX (ODI) ---
  const [odiScores, setOdiScores] = useState<number[]>([3, 2, 3, 2, 3, 2, 1, 1, 2, 2]); // baseline ~ 42%
  const odiTotal = odiScores.reduce((a, b) => a + b, 0);
  const odiPercentage = Math.round((odiTotal / 50) * 100);

  const getOdiSeverity = (pct: number) => {
    if (pct <= 20) return { labelAr: 'عجز طفيف جداً (Minimal Disability)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct <= 40) return { labelAr: 'عجز متوسط (Moderate Disability)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (pct <= 60) return { labelAr: 'عجز شديد (Severe Disability)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    if (pct <= 80) return { labelAr: 'عجز مقعد / إعاقة حركية (Crippled)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    return { labelAr: 'طريح الفراش بالكامل (Bed-bound)', color: 'text-red-900 bg-red-100 border-red-400' };
  };

  const odiQuestions = [
    { title: '١. شدة الألم (Pain Intensity)', options: ['لا أشعر بألم إطلاقاً (٠)', 'الألم خفيف جداً ولا يمنعني من الأنشطة (١)', 'ألم متوسط أحياناً يضايقني (٢)', 'ألم شديد إلى حد ما ولكن أتحمله (٣)', 'ألم شديد جداً ومزعج (٤)', 'ألم لا يطاق ويمنعني من الحركة تماماً (٥)'] },
    { title: '٢. العناية الشخصية واللباس (Personal Care)', options: ['أعتني بنفسي طبيعياً دون ألم (٠)', 'أعتني بنفسي طبيعياً مع ألم طفيف (١)', 'الألم يجعلني بطيئاً وحذراً (٢)', 'أحتاج مساعدة جزئية في بعض الأمور (٣)', 'أحتاج مساعدة يومية في معظم العناية (٤)', 'لا أستطيع ارتداء ملابسي بنفسي وألازم الفراش (٥)'] },
    { title: '٣. حمل الأشياء والأوزان (Lifting)', options: ['أحمل أوزاناً ثقيلة دون ألم (٠)', 'أحمل أوزاناً ثقيلة ولكن تسبب بعض الألم (١)', 'الألم يمنعني من حمل أوزان ثقيلة من الأرض (٢)', 'أستطيع حمل أوزان خفيفة إلى متوسطة فقط (٣)', 'أستطيع حمل أشياء خفيفة جداً فقط (٤)', 'لا أستطيع حمل أو التقاط أي شيء (٥)'] },
    { title: '٤. المشي (Walking)', options: ['الألم لا يمنعني من المشي لأي مسافة (٠)', 'الألم يمنعني من المشي أكثر من ميل واحد (١)', 'الألم يمنعني من المشي أكثر من نصف ميل (٢)', 'الألم يمنعني من المشي أكثر من ١٠٠ متر (٣)', 'أستطيع المشي بالعكاز فقط (٤)', 'ألازم الفراش ولا أستطيع المشي (٥)'] },
    { title: '٥. الجلوس (Sitting)', options: ['أستطيع الجلوس على أي كرسي طالما أردت (٠)', 'أستطيع الجلوس على الكرسي المفضل طالما أردت (١)', 'الألم يمنعني من الجلوس أكثر من ساعة واحدة (٢)', 'الألم يمنعني من الجلوس أكثر من نصف ساعة (٣)', 'الألم يمنعني من الجلوس أكثر من ١٠ دقائق (٤)', 'الألم يمنعني من الجلوس نهائياً (٥)'] },
  ];

  // --- 2. DASH (UPPER LIMB QUESTIONNAIRE) ---
  const [dashScores, setDashScores] = useState<number[]>([3, 4, 3, 2, 4, 3, 2, 3, 2, 3, 2]);
  const dashSum = dashScores.reduce((a, b) => a + b, 0);
  const dashScore = Math.round(((dashSum / dashScores.length) - 1) * 25);

  const dashQuestions = [
    'فتح غطاء مرطبان زجاجي محكم أو جديد',
    'الكتابة بالقلم أو الطباعة على لوحة المفاتيح',
    'إدارة مفتاح الباب في القفل',
    'إعداد وجبة طعام واستخدام أدوات المطبخ',
    'دفع باب ثقيل لفتحه للأمام',
    'وضع غرض على رف مرتفع فوق مستوى الرأس',
    'غسيل الشعر أو تمشيطه باليدين',
    'غسيل الظهر وفركه أثناء الاستحمام',
    'ارتداء العباءة أو الدشداشة والسترة',
    'استخدام سكين لتقطيع الطعام القاسي',
    'الأنشطة الترفيهية وحمل الحقائب',
  ];

  // --- 3. BERG BALANCE SCALE (BBS) ---
  const [bergScores, setBergScores] = useState<number[]>([3, 3, 2, 3, 2, 3, 2, 2, 3, 2, 2, 2, 2, 3]);
  const bergTotal = bergScores.reduce((a, b) => a + b, 0);

  const getBergRisk = (score: number) => {
    if (score >= 41) return { labelAr: 'خطر سقوط منخفض / توازن مستقل ممتاز (Low Risk: 41-56)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 21) return { labelAr: 'خطر سقوط متوسط / يحتاج مساعدة وقائية (Medium Risk: 21-40)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    return { labelAr: 'خطر سقوط مرتفع جداً / تحذير أحمر (High Risk: 0-20)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const bergItems = [
    'الجلوس إلى الوقوف (Sitting to Standing)',
    'الوقوف دون دعم لمدة دقيقتين (Standing Unsupported)',
    'الجلوس دون دعم الظهر لمدة دقيقتين (Sitting Unsupported)',
    'الوقوف إلى الجلوس (Standing to Sitting)',
    'الانتقال بين كرسيين (Transfers)',
    'الوقوف مع إغلاق العينين لمدة ١٠ ثوانٍ (Standing with Eyes Closed)',
    'الوقوف والقدمان ملتصقتان (Standing with Feet Together)',
    'الوصول للأمام بالذراع ممدودة (Reaching Forward)',
    'التقاط غرض من الأرض (Retrieving Object from Floor)',
    'الالتفات للنظر خلف الكتف يميناً ويساراً (Turning to Look Behind)',
    'الدوران ٣٦٠ درجة كاملة (Turn 360 Degrees)',
    'وضع القدمين بالتبادل على مصطبة/درجة (Placing Alternate Foot on Stool)',
    'الوقوف بقدم أمام الأخرى مباشرة (Standing with One Foot in Front)',
    'الوقوف على ساق واحدة لأكثر من ١٠ ثوانٍ (Standing on One Leg)',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'الحاسبات الإكلينيكية المعيارية للعلاج الطبيعي (Clinical Calculators)' : 'Clinical Calculators'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'حساب تلقائي لنسب العجز ومؤشرات التعافي المعتمدة دولياً: مقياس أوسويستري لآلام أسفل الظهر (ODI) • مقياس داش للأطراف العلوية والكتف (DASH) • مقياس بيرج للتوازن ومنع السقوط (Berg Balance)'
              : 'Automated disability and recovery indices: Oswestry Low Back Pain (ODI) • DASH for Upper Extremity • Berg Balance Scale (BBS)'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('oswestry')}
            className={`px-3 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'oswestry'
                ? 'bg-white text-[#075563] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isAr ? 'مقياس أوسويستري للظهر (ODI)' : 'Oswestry (ODI)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dash')}
            className={`px-3 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'dash'
                ? 'bg-white text-[#075563] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isAr ? 'مقياس داش للأطراف العلوية (DASH)' : 'DASH Calculator'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('berg')}
            className={`px-3 py-2 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'berg'
                ? 'bg-white text-[#075563] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {isAr ? 'مقياس بيرج للتوازن والسقوط' : 'Berg Balance Scale'}
          </button>
        </div>
      </div>

      {/* --- TAB 1: OSWESTRY LOW BACK PAIN INDEX --- */}
      {activeTab === 'oswestry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#075563]">
                {isAr ? 'بنود مقياس أوسويستري للعجز الوظيفي لأسفل الظهر (ODI Version 2.0)' : 'Oswestry Low Back Pain Index'}
              </h3>
              <span className="text-xs text-neutral-400">
                {isAr ? 'اختر الدرجة المطابقة لحالة المريض اليوم' : 'Select patient response'}
              </span>
            </div>

            <div className="space-y-5">
              {odiQuestions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <span className="text-xs font-bold text-neutral-800 block">{q.title}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          const updated = [...odiScores];
                          updated[qIdx] = optIdx;
                          setOdiScores(updated);
                        }}
                        className={`text-xs p-2 rounded-lg text-right border transition-colors ${
                          odiScores[qIdx] === optIdx
                            ? 'bg-[#075563] text-white border-[#075563] font-bold shadow-xs'
                            : 'bg-neutral-50/70 text-neutral-700 border-neutral-200 hover:bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ODI Result Summary Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs text-center space-y-4 sticky top-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase">
                {isAr ? 'النتيجة الإجمالية لمؤشر أوسويستري' : 'ODI Disability Score'}
              </h4>

              <div className="p-4 rounded-xl bg-gradient-to-b from-[#FAF8F1] to-white border border-[#B59B62]/30">
                <span className="text-4xl font-extrabold text-[#075563] block font-mono">
                  {odiPercentage}%
                </span>
                <span className="text-xs text-neutral-500 mt-1 block">
                  {odiTotal} / 50 {isAr ? 'نقطة إجمالية' : 'total points'}
                </span>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-bold ${getOdiSeverity(odiPercentage).color}`}>
                {getOdiSeverity(odiPercentage).labelAr}
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg text-right space-y-2 text-xs">
                <div className="flex justify-between items-center text-neutral-600">
                  <span>{isAr ? 'خط الأساس الأولي (الجلسة ١):' : 'Baseline (Session 1):'}</span>
                  <span className="font-bold font-mono">68%</span>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span>{isAr ? 'النتيجة الحالية:' : 'Current:'}</span>
                  <span className="font-bold font-mono text-[#075563]">{odiPercentage}%</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-bold border-t border-neutral-200 pt-2">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {isAr ? 'نسبة التحسن السريري:' : 'Clinical Improvement:'}
                  </span>
                  <span className="font-mono text-sm">+{68 - odiPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: DASH UPPER LIMB --- */}
      {activeTab === 'dash' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#075563]">
                {isAr ? 'مقياس عجز الذراع والكتف واليد (QuickDASH Disability Index)' : 'QuickDASH Upper Extremity Scale'}
              </h3>
              <span className="text-xs text-neutral-400">
                {isAr ? 'المقياس من ١ (بدون صعوبة) إلى ٥ (عجز تام)' : 'Scale 1 (No difficulty) to 5 (Unable)'}
              </span>
            </div>

            <div className="space-y-4">
              {dashQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-neutral-50/70 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-neutral-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2A9DA5]/10 text-[#075563] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {q}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((scoreVal) => (
                      <button
                        key={scoreVal}
                        type="button"
                        onClick={() => {
                          const updated = [...dashScores];
                          updated[idx] = scoreVal;
                          setDashScores(updated);
                        }}
                        className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                          dashScores[idx] === scoreVal
                            ? 'bg-[#075563] text-white shadow-xs'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                        }`}
                        title={
                          scoreVal === 1
                            ? 'بدون صعوبة'
                            : scoreVal === 2
                            ? 'صعوبة خفيفة'
                            : scoreVal === 3
                            ? 'صعوبة متوسطة'
                            : scoreVal === 4
                            ? 'صعوبة شديدة'
                            : 'عجز تام'
                        }
                      >
                        {scoreVal}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DASH Result Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs text-center space-y-4 sticky top-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase">
                {isAr ? 'مؤشر العجز الوظيفي للطرف العلوي (DASH Score)' : 'DASH Disability Score'}
              </h4>

              <div className="p-4 rounded-xl bg-gradient-to-b from-[#FAF8F1] to-white border border-[#B59B62]/30">
                <span className="text-4xl font-extrabold text-[#075563] block font-mono">
                  {dashScore}%
                </span>
                <span className="text-xs text-neutral-500 mt-1 block">
                  {isAr ? 'نسبة العجز الوظيفي في مفصل الكتف واليد' : 'Upper Extremity Disability'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold text-right space-y-1">
                <div className="flex justify-between">
                  <span>{isAr ? 'درجة الخط الأساسي (زيارة ١):' : 'Baseline:'}</span>
                  <span className="font-mono font-bold">62%</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-900 border-t border-emerald-200 pt-1">
                  <span>{isAr ? 'تحسن وظيفة الكتف:' : 'Improvement:'}</span>
                  <span className="font-mono">+{62 - dashScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: BERG BALANCE SCALE --- */}
      {activeTab === 'berg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#075563]">
                {isAr ? 'مقياس بيرج للتوازن الحركي والتنبؤ بمخاطر السقوط (Berg Balance Scale)' : 'Berg Balance Scale'}
              </h3>
              <span className="text-xs text-neutral-400">
                {isAr ? '١٤ مهمة وظيفية مدرجة من ٠ إلى ٤' : '14 Tasks Scored 0-4'}
              </span>
            </div>

            <div className="space-y-3">
              {bergItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-neutral-50/70 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-neutral-800">
                    {idx + 1}. {item}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {[0, 1, 2, 3, 4].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => {
                          const updated = [...bergScores];
                          updated[idx] = score;
                          setBergScores(updated);
                        }}
                        className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                          bergScores[idx] === score
                            ? 'bg-[#075563] text-white shadow-xs'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Berg Result Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs text-center space-y-4 sticky top-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase">
                {isAr ? 'مجموع مقياس بيرج للتوازن' : 'Berg Balance Total'}
              </h4>

              <div className="p-4 rounded-xl bg-gradient-to-b from-[#FAF8F1] to-white border border-[#B59B62]/30">
                <span className="text-4xl font-extrabold text-[#075563] block font-mono">
                  {bergTotal} <span className="text-lg font-normal text-neutral-400">/ 56</span>
                </span>
                <span className="text-xs text-neutral-500 mt-1 block">
                  {isAr ? 'الدرجة الكلية للتوازن الوظيفي' : 'Total Functional Score'}
                </span>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-bold leading-relaxed ${getBergRisk(bergTotal).color}`}>
                {getBergRisk(bergTotal).labelAr}
              </div>

              {bergTotal <= 20 && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-red-800 text-xs text-right space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    {isAr ? 'تنبيه سريري فوري (Red Alert):' : 'Clinical Red Alert:'}
                  </span>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    {isAr
                      ? 'المريض معرض لخطر سقوط وشيك. يجب استخدام أداة مساعدة للمشي فوراً وتفعيل برنامج التوازن المكثف وتنبيه المرافق العائلي.'
                      : 'High imminent fall risk. Prescribe assistive device and fall prevention protocol immediately.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
