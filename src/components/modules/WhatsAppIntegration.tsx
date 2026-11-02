import React, { useState } from 'react';
import { Patient } from '../../types/clinic';
import { MessageSquare, Send, CheckCheck, Clock, ExternalLink, Smartphone, BellRing } from 'lucide-react';

interface Props {
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const WhatsAppIntegration: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [templateType, setTemplateType] = useState<'booking_confirm' | 'reminder_3hr' | 'daily_exercise' | 'vas_survey'>('booking_confirm');
  const [customNote, setCustomNote] = useState('');
  const [notificationLogs, setNotificationLogs] = useState([
    {
      id: 'wa-1',
      patientName: 'سعيد بن سالم المعمري',
      phone: '+968 94545025',
      typeAr: 'تأكيد موعد الجلسة',
      timeSent: 'اليوم 08:30 ص',
      status: 'read',
      content: 'تأكيد موعد جلسة شد الفقرات القطنية غداً الساعة 09:30 ص بمجمع أم القرى الطبي بركاء.',
    },
    {
      id: 'wa-2',
      patientName: 'عائشة بنت ناصر البلوشية',
      phone: '+968 79470050',
      typeAr: 'تذكير قبل ٣ ساعات',
      timeSent: 'اليوم 07:30 ص',
      status: 'delivered',
      content: 'نذكركم بموعدكم الكريم اليوم الساعة 10:30 ص بجناح النساء الخاص.',
    },
    {
      id: 'wa-3',
      patientName: 'محمد بن راشد الفارسي',
      phone: '+968 91122334',
      typeAr: 'رابط فيديو التمرين المنزلي',
      timeSent: 'أمس 04:00 م',
      status: 'read',
      content: 'تمرين تقوية العضلة الرباعية الثابت للركبة مع عداد التكرارات.',
    },
  ]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const getTemplateContent = () => {
    const name = selectedPatient?.nameAr || 'المراجع الكريم';
    if (templateType === 'booking_confirm') {
      return `السلام عليكم ورحمة الله وبركاته يا ${name}،
نرحب بكم في *مجمع أم القرى الطبي - بركاء*.
تم تأكيد موعد جلستكم القادمة بنجاح:
📅 الموعد: غداً صباحاً (09:30 ص)
📍 الموقع: بركاء، الصومحان الجنوب، بناية R&B، بالقرب من مستشفى بدر السماء.
🩺 العيادة: قسم العلاج الطبيعي والتأهيل الطبي.
لوكيشن الموقع: https://maps.google.com/?q=23.7042,57.8871
*ملاحظة:* يرجى الحضور قبل الموعد بـ ١٠ دقائق. يسعدنا خدمتكم دائماً.`;
    }
    if (templateType === 'reminder_3hr') {
      return `تذكير بموعدكم اليوم يا ${name} ⏰
موعد جلستكم التأهيلية بعد ٣ ساعات (الساعة 04:30 م) بمجمع أم القرى الطبي ببركاء.
للإلغاء أو التعديل المبكر، يرجى الرد على هذه الرسالة أو الاتصال على: 79470050.
مع تمنياتنا لكم بتمام الصحة والعافية.`;
    }
    if (templateType === 'daily_exercise') {
      return `خطة التمارين المنزلية اليومية يا ${name} 🏃‍♂️
حرصاً على تسريع تعافيك، يرجى أداء تمرين الرقبة/الظهر الموصوف لك:
▶️ رابط الفيديو التعليمي (الحشمة والوقار): https://umalqura.om/ex/cervical-tuck
الجرعة: ٣ مجموعات × ١٠ تكرارات.
نظام أم القرى الذكي يتمنى لك يوماً مفعماً بالنشاط!`;
    }
    return `متابعة صحية من مجمع أم القرى الطبي يا ${name} 📋
كيف تشعر اليوم بعد جلستك الأخيرة؟
نرجو تقييم مستوى الألم الحالي من ٠ إلى ١٠ عبر الرابط السريع:
https://umalqura.om/feedback/vas?id=${selectedPatient?.civilId}
رأيكم وعافيتكم أولويتنا القصوى!`;
  };

  const handleDispatch = () => {
    if (!selectedPatient) return;
    const newLog = {
      id: `wa-${Date.now()}`,
      patientName: selectedPatient.nameAr,
      phone: selectedPatient.phone,
      typeAr:
        templateType === 'booking_confirm'
          ? 'تأكيد موعد'
          : templateType === 'reminder_3hr'
          ? 'تذكير قبل ٣ ساعات'
          : templateType === 'daily_exercise'
          ? 'تمرين منزلي'
          : 'استبيان ألم VAS',
      timeSent: 'الآن',
      status: 'delivered',
      content: getTemplateContent(),
    };

    setNotificationLogs([newLog, ...notificationLogs]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366]">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'نظام إشعارات واتساب للأعمال الذكي (Smart WhatsApp Business API)' : 'Smart WhatsApp Business API'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'تأكيد الحجز الفوري مع اللوكيشن • تذكير آلي قبل الموعد بـ ٣ ساعات • إرسال روابط التمارين المنزلية اليومية • استبيانات قياس الألم والمتابعة'
              : 'Direct API dispatch for instant booking confirmations, 3-hour prior alerts, home exercise video links, and pain feedback.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#25D366]/10 text-[#128C7E] flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            {isAr ? 'حساب الأعمال: 79470050 / 94545025' : 'WA Business: +968 79470050'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Dispatcher Form (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#2A9DA5]" />
            {isAr ? 'إرسال إشعار فوري لمريض' : 'Dispatch WhatsApp Notification'}
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'اختر المريض المستلم:' : 'Recipient Patient:'}
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs border border-neutral-300 rounded p-2 bg-neutral-50"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} - ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'نوع القالب المعتمد (Template Type):' : 'Template Type:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemplateType('booking_confirm')}
                className={`text-xs p-2 rounded text-right font-medium border transition-colors ${
                  templateType === 'booking_confirm'
                    ? 'bg-[#075563] text-white border-[#075563] font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                📅 {isAr ? 'تأكيد الحجز واللوكيشن' : 'Booking Confirmation'}
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('reminder_3hr')}
                className={`text-xs p-2 rounded text-right font-medium border transition-colors ${
                  templateType === 'reminder_3hr'
                    ? 'bg-[#075563] text-white border-[#075563] font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                ⏰ {isAr ? 'تذكير قبل ٣ ساعات' : '3-Hour Prior Alert'}
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('daily_exercise')}
                className={`text-xs p-2 rounded text-right font-medium border transition-colors ${
                  templateType === 'daily_exercise'
                    ? 'bg-[#075563] text-white border-[#075563] font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                🏃‍♂️ {isAr ? 'رابط التمرين المنزلي' : 'Exercise Video Link'}
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('vas_survey')}
                className={`text-xs p-2 rounded text-right font-medium border transition-colors ${
                  templateType === 'vas_survey'
                    ? 'bg-[#075563] text-white border-[#075563] font-bold'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                📊 {isAr ? 'استبيان متابعة الألم' : 'VAS Pain Survey'}
              </button>
            </div>
          </div>

          {/* Message Preview in WhatsApp Green Bubble */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {isAr ? 'معاينة نص الرسالة الصادرة للواتساب:' : 'Message Content Preview:'}
            </label>
            <div className="bg-[#EFEAE2] p-4 rounded-xl border border-neutral-300">
              <div className="bg-[#DCF8C6] p-3 rounded-lg text-xs text-neutral-800 leading-relaxed shadow-xs whitespace-pre-line font-sans">
                {getTemplateContent()}
                <div className="flex justify-end items-center gap-1 text-[10px] text-neutral-500 mt-2">
                  <span>10:45 ص</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
            {isAr ? 'إرسال الرسالة الآن عبر WhatsApp Business Cloud API' : 'Send via WhatsApp Business API'}
          </button>
        </div>

        {/* Live Logs List (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3 flex items-center justify-between">
            <span>{isAr ? 'سجل الرسائل المرسلة وحالة الاستلام' : 'Sent Notifications Log'}</span>
            <span className="text-xs text-neutral-500 font-normal">
              {notificationLogs.length} {isAr ? 'رسائل' : 'sent'}
            </span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notificationLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#075563]">{log.patientName}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="font-mono text-neutral-600 text-[11px]">{log.phone}</span>
                  </div>

                  <span className="text-[10px] text-neutral-400">{log.timeSent}</span>
                </div>

                <p className="text-[11px] text-neutral-700 leading-relaxed line-clamp-2">
                  {log.content}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#B59B62] font-semibold">{log.typeAr}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    {log.status === 'read' ? (isAr ? 'تمت القراءة' : 'Read') : (isAr ? 'تم التسليم' : 'Delivered')}
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
