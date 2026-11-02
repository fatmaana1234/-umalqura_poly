import React, { useState } from 'react';
import { Bot, PhoneCall, Volume2, UserCheck, UserX, ArrowRight, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types/clinic';

interface Props {
  patients: Patient[];
  lang: 'ar' | 'en';
}

export const OmaniVoiceBot: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';

  const [botState, setBotState] = useState<'idle' | 'calling' | 'patient_answering' | 'cancelled_reallocating' | 'confirmed'>('idle');
  const [activeCallPatient, setActiveCallPatient] = useState<string>('سعيد المعمري');
  const [waitlistQueue, setWaitlistQueue] = useState([
    { id: 'w-1', nameAr: 'أحمد بن حمد الحراصي', phone: '+968 92345678', conditionAr: 'ألم حاد بالرقبة والكتف', status: 'waiting' },
    { id: 'w-2', nameAr: 'سليمة بنت مسعود الفزارية', phone: '+968 97890123', conditionAr: 'خشونة ركبة حادة', status: 'waiting' },
  ]);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'patient' | 'system'; textAr: string; textEn: string }>>([
    {
      sender: 'bot',
      textAr: 'حياك الله يا خوي سعيد... معك المساعد الذكي لمجمع أم القرى الطبي في بركاء. نود التأكيد على موعد جلستك غداً الساعة ٠٤:٣٠ م مع الأخصائي طارق. هل الموعد مناسب لك؟',
      textEn: 'Hello Said, this is Um Alqura Polyclinic automated voice assistant. Confirming your session tomorrow at 4:30 PM with PT Tariq. Does this work for you?',
    },
  ]);

  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const simulateCall = () => {
    setBotState('calling');
    setTimeout(() => {
      setBotState('patient_answering');
      speakAudio('حياك الله يا خوي سعيد، معك مجمع أم القرى الطبي في بركاء. هل موعدك غداً الساعة ٤:٣٠ م مناسب؟');
    }, 1500);
  };

  const handlePatientConfirm = () => {
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', textAr: 'نعم جزاكم الله خير، مناسب جداً وبحضر في الوقت بإذن الله.', textEn: 'Yes, thank you, I will attend on time.' },
      { sender: 'bot', textAr: 'تسلم يا خوي، تم تثبيت الموعد وإرسال لوكيشن مجمع أم القرى على واتسابك. نتشرف بخدمتك!', textEn: 'Confirmed! Location sent via WhatsApp.' },
    ]);
    setBotState('confirmed');
    speakAudio('تسلم يا خوي، تم تثبيت موعدك وإرسال التفاصيل على الواتساب.');
  };

  const handlePatientCancel = () => {
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', textAr: 'والله يا خوي صار عندي ظرف طارئ بمسقط وما بقدر أجي باكر.', textEn: 'Unfortunately I have an emergency and cannot attend tomorrow.' },
      { sender: 'bot', textAr: 'لا تشيل هم أبداً وسلامات ما تشوف شر. تم إلغاء الموعد وسنتواصل معك لاحقاً لإعادة الجدولة.', textEn: 'No worries. Appointment cancelled.' },
      {
        sender: 'system',
        textAr: '⚡ نظام الانتظار الذكي: رصد شاغر تلقائي في الساعة ٠٤:٣٠ م، جاري إرسال عرض الموعد الشاغر عبر الواتساب للمريض التالي بقائمة الانتظار (أحمد الحراصي)...',
        textEn: 'Smart Waitlist Engine: Slot 4:30 PM opened. Auto-offering to next waitlist patient (Ahmed Al-Harrasi) via WhatsApp...',
      },
    ]);
    setBotState('cancelled_reallocating');

    // Update waitlist
    setTimeout(() => {
      setWaitlistQueue((prev) =>
        prev.map((item, idx) => (idx === 0 ? { ...item, status: 'slot_offered_via_whatsapp' } : item))
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Bot className="w-5 h-5 text-[#2A9DA5]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'المساعد الصوتي العُماني لإدارة المواعيد وقائمة الانتظار (Omani Voice Bot)' : 'Omani Smart Voice Bot for Waitlist'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'مساعد صوتي ذكي يتحدث باللهجة العُمانية الأصيلة لتأكيد المواعيد هاتفياً • في حال اعتذار المريض يتم تفريغ الموعد فوراً وعرضه آلياً عبر الواتساب على المريض التالي بقائمة الانتظار'
              : 'Authentic Omani dialect appointment confirmation bot. Auto-hands over cancelled slots to next waitlist patient.'}
          </p>
        </div>

        <button
          type="button"
          onClick={simulateCall}
          className="px-4 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          {isAr ? 'بدء مكالمة صوتية تجريبية' : 'Test Voice Call'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Audio Conversation Stream (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-bold text-[#075563] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#B59B62]" />
              {isAr ? `المكالمة الحية مع المريض: ${activeCallPatient}` : `Active Call: ${activeCallPatient}`}
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {isAr ? 'لهجة عُمانية طبيعية' : 'Omani Dialect'}
            </span>
          </div>

          {/* Voice Wave Visualizer Simulation */}
          <div className="p-4 bg-gradient-to-r from-[#075563] to-[#24383B] rounded-xl text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B59B62] text-white flex items-center justify-center font-bold">
                🇴🇲
              </div>
              <div>
                <span className="text-xs font-bold block">مساعد مجمع أم القرى الصوتي</span>
                <span className="text-[10px] text-neutral-300">متصل الآن برقم المريض (+968 94545025)</span>
              </div>
            </div>

            {/* Audio Wave Bars */}
            <div className="flex items-center gap-1">
              {[12, 24, 16, 32, 20, 28, 14, 22].map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}px` }}
                  className="w-1 bg-[#2A9DA5] rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Dialogue Transcript Stream */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'bot'
                    ? 'bg-[#FAF8F1] border border-[#B59B62]/30 text-neutral-800 ml-6'
                    : msg.sender === 'patient'
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 mr-6'
                    : 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold'
                }`}
              >
                <span className="text-[10px] font-bold block mb-1 text-neutral-400">
                  {msg.sender === 'bot'
                    ? isAr
                      ? 'المساعد الآلي (أم القرى)'
                      : 'Voice Bot'
                    : msg.sender === 'patient'
                    ? isAr
                      ? 'المريض'
                      : 'Patient'
                    : isAr
                    ? 'نظام المجمع الذكي'
                    : 'System Engine'}
                </span>
                {isAr ? msg.textAr : msg.textEn}
              </div>
            ))}
          </div>

          {/* Response Buttons for Simulation */}
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-3">
            <button
              type="button"
              onClick={handlePatientConfirm}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              {isAr ? 'محاكاة: المريض يؤكد حضوره' : 'Simulate: Patient Confirms'}
            </button>
            <button
              type="button"
              onClick={handlePatientCancel}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <UserX className="w-4 h-4" />
              {isAr ? 'محاكاة: المريض يعتذر ويطلب إلغاء' : 'Simulate: Patient Cancels'}
            </button>
          </div>
        </div>

        {/* Real-time Waitlist Queue Table (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#075563] border-b border-neutral-100 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B59B62]" />
              {isAr ? 'قائمة الانتظار الذكية (Smart Waitlist)' : 'Smart Waitlist Queue'}
            </span>
            <span className="text-xs text-neutral-500 font-normal">
              {waitlistQueue.length} {isAr ? 'في الانتظار' : 'waiting'}
            </span>
          </h3>

          <div className="space-y-3">
            {waitlistQueue.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#075563] text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#075563]">{item.nameAr}</span>
                  </div>
                  <span className="font-mono text-[11px] text-neutral-500">{item.phone}</span>
                </div>

                <div className="text-[11px] text-neutral-600">
                  {isAr ? 'الحالة:' : 'Condition:'} {item.conditionAr}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
                  <span className="text-[10px] text-neutral-500">
                    {isAr ? 'الأولوية: حسب الأسبقية والحاجة' : 'FIFO Priority'}
                  </span>
                  {item.status === 'slot_offered_via_whatsapp' ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      {isAr ? 'تم عرض الموعد بالواتساب!' : 'Offered via WhatsApp!'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-medium">
                      {isAr ? 'في قائمة الترقب' : 'On Standby'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
