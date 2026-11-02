import React, { useState } from 'react';
import { Language } from '../../types/clinic';
import {
  Zap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface Props {
  lang: Language;
}

export const ClinicEquipmentShowcase: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const devices = [
    {
      id: 'eq-1',
      nameAr: 'جهاز شد الفقرات العنقية والقطنية الرقمي المبرمج',
      nameEn: 'Digital Cervical & Lumbar Traction Bed',
      model: 'Triton DTS High-End Decompression System',
      categoryAr: 'علاج العمود الفقري والانزلاق الغضروفي',
      image: '/assets/clinic/spinal_traction_bed.jpg',
      featuresAr: [
        'شد ميكانيكي تدريجي مبرمج للفقرات القطنية والعنقية',
        'وحدة حاسوبية ذكية لمراقبة قوة السحب (Kg) ومقدار الشد بالمليمتر',
        'حزام تثبيت هوائي مبطن لحماية القفص الصدري والحوض',
        'مفتاح أمان طارئ في يد المريض للتوقف الفوري عند الشعور بعدم الارتياح',
      ],
      indicationsAr: 'الانزلاقات الغضروفية (L4-L5, L5-S1)، تضيق القناة الشوكية، عرق النسا، شد عضلات الرقبة المزمن',
      calibrationDate: '2026-10-15',
      nextCalibration: '2027-04-15',
      safetyStatus: 'معاير ومعتمد رسمياً من وزارة الصحة',
    },
    {
      id: 'eq-2',
      nameAr: 'جهاز BTL 4000 المزدوج (علاج كهربائي + موجات فوق صوتية)',
      nameEn: 'BTL 4000 Smart Electrotherapy & Ultrasound Combo',
      model: 'BTL 4000 Premium Smart Touch Edition',
      categoryAr: 'تسكين الألم وتليين الأنسجة وتخفيف التورم',
      image: '/assets/clinic/btl4000_electro_us.jpg',
      featuresAr: [
        'شاشة لمسية ملونة ذكية مع قرص إضاءة دائري أزرق لضبط الشدة بدقة متناهية',
        'مسبار موجات فوق صوتية متعدد الترددات (1 MHz للأنسجة العميقة و 3 MHz للسطحية)',
        'تيارات كهربائية علاجية متعددة (TENS, Interferential IFT, Russian, High Voltage)',
        '٤ إلكترودات مطاطية كربونية للتطبيق المتزامن على مفصلين أو جانبي العمود الفقري',
      ],
      indicationsAr: 'التهاب الأوتار، خشونة مفصل الركبة، التمزقات العضلية، آلام الظهر الحادة، التورم اللمفاوي',
      calibrationDate: '2026-10-20',
      nextCalibration: '2027-04-20',
      safetyStatus: 'معاير ومعتمد رسمياً من وزارة الصحة',
    },
    {
      id: 'eq-3',
      nameAr: 'جهاز الموجات التصادمية الشعاعية السويسري (Radial ESWT)',
      nameEn: 'Radial Shockwave Therapy System',
      model: 'BTL Shockwave High-Energy Unit',
      categoryAr: 'علاج التكلسات والأوتار المزمنة والشوك العظمية',
      image: '/assets/clinic/shockwave_poster.jpg',
      featuresAr: [
        'مقبض هوائي ضاغط مع مستشعرات طاقة تصل إلى 4-5 بار وتردد 15 هرتز',
        'تفتيت تكلسات الأوتار والألياف الندبية وإعادة تنشيط الدورة الدموية في الأنسجة الخاملة',
        'بروتوكول موجه للحالات المستعصية التي لم تستجب للعلاج التقليدي',
        'نتائج ملحوظة بعد ٣ إلى ٥ جلسات فقط مع تحفيز تكوين أوعية دموية جديدة (Neo-vascularization)',
      ],
      indicationsAr: 'الشوكة العظمية لعظم العقب (Plantar Fasciitis)، التهاب أوتار الكتف التكلسي، مرفق لاعب التنس',
      calibrationDate: '2026-09-18',
      nextCalibration: '2027-03-18',
      safetyStatus: 'معاير ومعتمد رسمياً من وزارة الصحة',
    },
    {
      id: 'eq-4',
      nameAr: 'جهاز الضغط الهوائي اللمفاوي المتدرج (Pressotherapy)',
      nameEn: 'Sequential Pneumatic Compression Boots',
      model: 'Air Relax Medical Lymphatic Unit',
      categoryAr: 'تصريف السوائل وتنشيط الدورة الدموية والاستشفاء الرياضي',
      image: '/assets/clinic/pressotherapy_device.jpg',
      featuresAr: [
        'أحذية هوائية متعددة الحجرات المتتابعة لتدليك الأطراف السفلية من الأسفل إلى الأعلى',
        'مضخة هواء هادئة مع صمامات تحكم رقمية في الضغط الزئبقي (mmHg)',
        'تصريف فعال للوذمات بعد العمليات الجراحية وإصابات الملاعب',
        'تسريع استشفاء العضلات بعد التمارين التأهيلية المكثفة',
      ],
      indicationsAr: 'التورم بعد تبديل مفصل الركبة، القصور الوريدي المزمن، إجهاد الساقين، الوذمة اللمفية',
      calibrationDate: '2026-10-01',
      nextCalibration: '2027-04-01',
      safetyStatus: 'معاير ومعتمد رسمياً من وزارة الصحة',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#B59B62]" />
          <h2 className="text-xl font-black text-[#075563]">
            {isAr ? 'الأجهزة والتقنيات الطبية المعتمدة بمجمع أم القرى الطبي' : 'Certified Clinical Equipment & Modalities'}
          </h2>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed max-w-3xl">
          {isAr
            ? 'نستخدم في مجمع أم القرى الطبي ببركاء أحدث تقنيات العلاج الطبيعي الفيزيائي المعتمدة من وزارة الصحة العُمانية، والمعايرة دورياً لضمان أعلى درجات الأمان والسلامة للمريض.'
            : 'Explore our verified, MOH-certified physical therapy and rehabilitation hardware, fully calibrated for patient safety and clinical excellence.'}
        </p>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
          >
            {/* Real Photo with overlay */}
            <div className="relative h-64 w-full bg-neutral-900 overflow-hidden group">
              <img
                src={device.image}
                alt={device.nameAr}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#075563] text-white text-[10px] font-bold shadow-xs">
                  {device.categoryAr}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs">
                <span className="font-mono text-[11px] text-[#FAF8F1]/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  {device.model}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(device.image)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs transition-colors"
                  title="تكبير الصورة"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Device Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-xs">
              <div className="space-y-2">
                <h3 className="font-black text-sm text-[#075563]">
                  {isAr ? device.nameAr : device.nameEn}
                </h3>

                <ul className="space-y-1.5 text-neutral-600 text-[11px]">
                  {device.featuresAr.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9DA5] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-3 border-t border-neutral-100">
                <div className="p-2.5 rounded-lg bg-[#FAF8F1] border border-[#B59B62]/30 text-[11px] text-neutral-700">
                  <strong className="text-[#075563] block mb-0.5">دواعي الاستعمال السريرية:</strong>
                  {device.indicationsAr}
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {device.safetyStatus}
                  </span>
                  <span className="font-mono">معايرة: {device.calibrationDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-3xl max-h-[90vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <img
              src={selectedPhoto}
              alt="صورة مكبرة لجهاز المجمع"
              className="w-full h-full object-contain max-h-[85vh]"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
