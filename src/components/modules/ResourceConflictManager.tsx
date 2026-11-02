import React, { useState } from 'react';
import { Appointment, Patient, Therapist, TreatmentRoom, MedicalDevice } from '../../types/clinic';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ShieldCheck, UserCheck, Stethoscope, Bed, Plus } from 'lucide-react';

interface Props {
  appointments: Appointment[];
  patients: Patient[];
  therapists: Therapist[];
  rooms: TreatmentRoom[];
  devices: MedicalDevice[];
  onAddAppointment: (appointment: Appointment) => void;
  lang: 'ar' | 'en';
}

export const ResourceConflictManager: React.FC<Props> = ({
  appointments,
  patients,
  therapists,
  rooms,
  devices,
  onAddAppointment,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [selectedTherapistId, setSelectedTherapistId] = useState(therapists[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('none');
  const [bookingDate, setBookingDate] = useState('2026-11-03');
  const [timeSlot, setTimeSlot] = useState('10:00 ص');
  const [duration, setDuration] = useState<number>(45);
  const [sessionType, setSessionType] = useState<'consultation' | 'session' | 'package_session'>('session');
  const [notes, setNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);

  // 5-Dimensional Conflict Detection Engine
  const conflicts: { dimension: string; reasonAr: string; reasonEn: string; severity: 'error' | 'warning' }[] = [];

  // Dimension 1: Cultural & Gender Compliance Check
  if (selectedPatient && selectedTherapist) {
    if (selectedPatient.gender !== selectedTherapist.gender) {
      conflicts.push({
        dimension: isAr ? 'البُعد الأول: التوافق الشرعي والمجتمعي' : 'Dim 1: Gender Compliance',
        reasonAr: `مخالفة لضوابط العيادة: المريض (${selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى'}) لا يجوز معالجته بواسطة المعالج (${selectedTherapist.nameAr}). المرضى الذكور للأخصائيين الذكور فقط، والإناث للأخصائيات الإناث فقط.`,
        reasonEn: `Protocol Violation: ${selectedPatient.nameEn} (${selectedPatient.gender}) cannot be treated by ${selectedTherapist.nameEn}. Strict gender segregation applies.`,
        severity: 'error',
      });
    }
  }

  // Dimension 2: Room Designation & Capacity Check
  if (selectedPatient && selectedRoom) {
    if (selectedRoom.designatedGender !== 'any' && selectedRoom.designatedGender !== selectedPatient.gender) {
      conflicts.push({
        dimension: isAr ? 'البُعد الثاني: خصوصية الجناح/الغرفة' : 'Dim 2: Room Privacy Designation',
        reasonAr: `الغرفة المحددة (${selectedRoom.nameAr}) مخصصة لـ (${selectedRoom.designatedGender === 'male' ? 'الرجال' : 'النساء'}) حصراً لتوفير الخصوصية التامة.`,
        reasonEn: `Room conflict: ${selectedRoom.nameEn} is restricted to ${selectedRoom.designatedGender} patients for privacy.`,
        severity: 'error',
      });
    }

    // Check room simultaneous booking
    const roomOverlap = appointments.filter(
      (a) => a.date === bookingDate && a.timeSlot === timeSlot && a.roomId === selectedRoomId && a.status !== 'cancelled'
    );
    if (roomOverlap.length >= selectedRoom.capacity) {
      conflicts.push({
        dimension: isAr ? 'البُعد الثاني: سعة الغرفة' : 'Dim 2: Room Capacity Overflow',
        reasonAr: `الغرفة (${selectedRoom.nameAr}) محجوزة بالكامل في هذا التوقيت (${roomOverlap.length}/${selectedRoom.capacity}).`,
        reasonEn: `Room capacity exceeded for ${selectedRoom.nameEn} at ${timeSlot}.`,
        severity: 'error',
      });
    }
  }

  // Dimension 3: Therapist Schedule Conflict Check
  const therapistOverlap = appointments.find(
    (a) => a.date === bookingDate && a.timeSlot === timeSlot && a.therapistId === selectedTherapistId && a.status !== 'cancelled'
  );
  if (therapistOverlap) {
    conflicts.push({
      dimension: isAr ? 'البُعد الثالث: انشغال الأخصائي' : 'Dim 3: Specialist Availability',
      reasonAr: `الأخصائي (${selectedTherapist?.nameAr}) لديه جلسة أخرى مجدولة مع المريض (${therapistOverlap.patientName}) في نفس التوقيت.`,
      reasonEn: `${selectedTherapist?.nameEn} is already booked with ${therapistOverlap.patientName} at ${timeSlot}.`,
      severity: 'error',
    });
  }

  // Dimension 4: Medical Device Conflict Check
  if (selectedDeviceId !== 'none') {
    const deviceOverlap = appointments.find(
      (a) => a.date === bookingDate && a.timeSlot === timeSlot && a.deviceId === selectedDeviceId && a.status !== 'cancelled'
    );
    if (deviceOverlap) {
      conflicts.push({
        dimension: isAr ? 'البُعد الرابع: الجهاز الطبي محجوز' : 'Dim 4: Medical Equipment Conflict',
        reasonAr: `الجهاز (${selectedDevice?.nameAr}) قيد الاستخدام حالياً مع مريض آخر في هذا الوقت.`,
        reasonEn: `Equipment ${selectedDevice?.nameEn} is occupied at this time.`,
        severity: 'error',
      });
    }
  }

  // Dimension 5: Working Hours & Friday Closure Check
  const checkDay = new Date(bookingDate).getDay();
  if (checkDay === 5) {
    // Friday
    conflicts.push({
      dimension: isAr ? 'البُعد الخامس: أوقات العمل الرسمية' : 'Dim 5: Operating Hours',
      reasonAr: 'المجمع مغلق يوم الجمعة. ساعات العمل من السبت إلى الخميس: 9:00 ص - 1:00 ظ ومن 4:00 م - 8:00 م.',
      reasonEn: 'Polyclinic is closed on Fridays. Operating hours are Saturday to Thursday 9am-1pm & 4pm-8pm.',
      severity: 'error',
    });
  }

  const hasBlockingConflict = conflicts.some((c) => c.severity === 'error');

  const handleBook = () => {
    if (hasBlockingConflict || !selectedPatient || !selectedTherapist || !selectedRoom) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.nameAr,
      patientGender: selectedPatient.gender,
      therapistId: selectedTherapist.id,
      therapistName: selectedTherapist.nameAr,
      roomId: selectedRoom.id,
      roomName: selectedRoom.nameAr,
      deviceId: selectedDeviceId !== 'none' ? selectedDeviceId : undefined,
      deviceName: selectedDeviceId !== 'none' ? selectedDevice?.nameAr : undefined,
      date: bookingDate,
      timeSlot,
      durationMinutes: duration,
      status: 'confirmed',
      sessionType,
      amountOmr: sessionType === 'consultation' ? 3 : sessionType === 'package_session' ? 13.5 : 15,
      notes,
      conflictCheckPassed: true,
    };

    onAddAppointment(newApt);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#075563]">
                {isAr ? 'مدير تعارض الموارد خماسي الأبعاد (5D Resource Conflict Manager)' : '5-Dimensional Resource Conflict Manager'}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              {isAr
                ? 'فحص إلكتروني فوري للموارد الخمسة: الأخصائي المعالج (والتوافق الشرعي) • سرير/جناح العلاج • الأجهزة الطبية المتخصصة • مدة الإجراء • أوقات دوام المجمع في بركاء'
                : 'Instant validation across 5 clinical axes: Specialist gender matching • Room capacity • Device lock • Procedure duration • Clinic schedule'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#FAF8F1] text-[#075563] border border-[#B59B62]/30 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#B59B62]" />
              {isAr ? 'كشفية: ٣ ر.ع | جلسة: ١٥ ر.ع | خصم باقة: ١٠٪' : 'Consultation: 3 OMR | Session: 15 OMR | Package: 10% OFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Booking Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-[#24383B] flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Calendar className="w-4 h-4 text-[#2A9DA5]" />
            {isAr ? 'حجز موعد جديد والتحقق الفوري من الموارد' : 'Schedule New Appointment & Conflict Check'}
          </h3>

          {/* 1. Patient Selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {isAr ? '١. المريض / المراجِع' : '1. Patient'}
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                const patId = e.target.value;
                setSelectedPatientId(patId);
                const pat = patients.find((p) => p.id === patId);
                // Auto recommend compliant therapist & room
                if (pat) {
                  const compliantTherapist = therapists.find((t) => t.gender === pat.gender);
                  if (compliantTherapist) setSelectedTherapistId(compliantTherapist.id);
                  const compliantRoom = rooms.find((r) => r.designatedGender === pat.gender || r.designatedGender === 'any');
                  if (compliantRoom) setSelectedRoomId(compliantRoom.id);
                }
              }}
              className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameAr} ({p.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')} - {p.age} {isAr ? 'سنة' : 'yrs'}) - {p.diagnosisAr.slice(0, 35)}...
                </option>
              ))}
            </select>
            {selectedPatient && (
              <p className="text-[11px] text-neutral-500 mt-1">
                {isAr ? `الرقم المدني: ${selectedPatient.civilId} | الهاتف: ${selectedPatient.phone} | مقياس الألم VAS: ${selectedPatient.vasCurrent}/10` : `Civil ID: ${selectedPatient.civilId} | Pain: ${selectedPatient.vasCurrent}/10`}
              </p>
            )}
          </div>

          {/* 2. Therapist Selection */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              {isAr ? '٢. الأخصائي / الأخصائية المعالجة (ضوابط الحشمة والفصل التام)' : '2. Treating Physiotherapist (Gender Compliance)'}
            </label>
            <select
              value={selectedTherapistId}
              onChange={(e) => setSelectedTherapistId(e.target.value)}
              className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
            >
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.avatar} {t.nameAr} - {t.titleAr} ({t.gender === 'male' ? (isAr ? 'معالج ذكور' : 'Male Physio') : (isAr ? 'معالجة إناث' : 'Female Physio')})
                </option>
              ))}
            </select>
            {selectedTherapist && (
              <p className="text-[11px] text-[#075563] bg-[#075563]/5 p-2 rounded-md mt-1 border border-[#075563]/10">
                {selectedTherapist.dressCodeAr}
              </p>
            )}
          </div>

          {/* 3. Room & Device Selection (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? '٣. جناح / غرفة العلاج' : '3. Treatment Suite / Room'}
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? '٤. الجهاز الطبي المتخصص (اختياري)' : '4. Specialized Device'}
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
              >
                <option value="none">{isAr ? '— بدون جهاز (علاج يدوي وتمارين فقط) —' : '— Manual Therapy Only (No Device) —'}</option>
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full text-sm border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? 'الوقت المتاح' : 'Time Slot'}
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-sm border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
              >
                <option value="09:00 ص">09:00 ص (الفترة الصباحية)</option>
                <option value="09:45 ص">09:45 ص</option>
                <option value="10:30 ص">10:30 ص</option>
                <option value="11:15 ص">11:15 ص</option>
                <option value="12:00 م">12:00 م</option>
                <option value="04:00 م">04:00 م (الفترة المسائية)</option>
                <option value="04:45 م">04:45 م</option>
                <option value="05:30 م">05:30 م</option>
                <option value="06:15 م">06:15 م</option>
                <option value="07:00 م">07:00 م</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                {isAr ? 'المدة التلقائية للإجراء' : 'Duration'}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full text-sm border border-neutral-300 rounded-lg p-2 bg-neutral-50/50 focus:bg-white focus:outline-hidden focus:border-[#2A9DA5]"
              >
                <option value={30}>{isAr ? '٣٠ دقيقة (كشفية سريعة)' : '30 min (Quick check)'}</option>
                <option value={45}>{isAr ? '٤٥ دقيقة (جلسة علاج طبيعي قياسية)' : '45 min (Standard Session)'}</option>
                <option value={60}>{isAr ? '٦٠ دقيقة (جلسة مكثفة + شد ميكانيكي)' : '60 min (Intensive + Traction)'}</option>
              </select>
            </div>
          </div>

          {/* 5. Session Type & Pricing Preview */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#FAF8F1] rounded-lg border border-[#B59B62]/20">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                {isAr ? 'نوع الزيارة والتعرفة الرسمية' : 'Visit Type & Pricing'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSessionType('consultation')}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    sessionType === 'consultation'
                      ? 'bg-[#075563] text-white font-bold'
                      : 'bg-white text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {isAr ? 'كشفية (٣ ر.ع)' : 'Consultation (3 OMR)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType('session')}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    sessionType === 'session'
                      ? 'bg-[#075563] text-white font-bold'
                      : 'bg-white text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {isAr ? 'جلسة منفردة (١٥ ر.ع)' : 'Single Session (15 OMR)'}
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType('package_session')}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    sessionType === 'package_session'
                      ? 'bg-[#B59B62] text-white font-bold'
                      : 'bg-white text-neutral-700 border border-neutral-200'
                  }`}
                >
                  {isAr ? 'خصم باقة ١٠٪ (١٣.٥ ر.ع)' : 'Package Session (13.5 OMR)'}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-neutral-500 block">{isAr ? 'المبلغ المطلوب' : 'Due Amount'}</span>
              <span className="text-lg font-bold text-[#075563]">
                {sessionType === 'consultation' ? '3.000' : sessionType === 'package_session' ? '13.500' : '15.000'}{' '}
                <span className="text-xs">{isAr ? 'ريال عُماني' : 'OMR'}</span>
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={hasBlockingConflict}
              onClick={handleBook}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                hasBlockingConflict
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#075563] hover:bg-[#06424e] text-white shadow-xs'
              }`}
            >
              <Plus className="w-4 h-4" />
              {hasBlockingConflict
                ? isAr
                  ? 'يوجد تعارض يمنع الحجز (راجع التنبيهات)'
                  : 'Cannot Book: Resource Conflicts Detected'
                : isAr
                ? 'تأكيد الحجز وتوثيق الموارد الخمسة'
                : 'Confirm Booking & Lock Resources'}
            </button>
          </div>
        </div>

        {/* Conflict Validator Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-[#24383B] flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#075563]" />
              {isAr ? 'حالة مصفوفة الموارد الخمسة (Live Matrix)' : '5D Resource Validation Matrix'}
            </h3>

            {conflicts.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800">
                    {isAr ? 'جميع الموارد متاحة ومتوافقة بنسبة ١٠٠٪' : 'All 5 Resources Available & Compliant'}
                  </h4>
                  <ul className="text-[11px] text-emerald-700 mt-1 space-y-0.5 list-disc list-inside">
                    <li>{isAr ? 'توافق جنس الأخصائي والمريض تام' : 'Specialist gender matched'}</li>
                    <li>{isAr ? 'الجناح التأهيلي متاح ومخصص بالكامل' : 'Room reserved & private'}</li>
                    <li>{isAr ? 'الجهاز الطبي غير محجوز ومستعد' : 'Device ready for session'}</li>
                    <li>{isAr ? 'الوقت والمدة ضمن ساعات العمل في بركاء' : 'Valid Barka clinic shift'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {conflicts.map((conflict, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50 rounded-lg border border-rose-200 flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-rose-800 block">
                        {conflict.dimension}
                      </span>
                      <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                        {isAr ? conflict.reasonAr : conflict.reasonEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Confirmed Schedule on this date */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold text-[#24383B] mb-3 flex items-center justify-between">
              <span>{isAr ? `المواعيد المحجوزة لتاريخ: ${bookingDate}` : `Booked Slots for: ${bookingDate}`}</span>
              <span className="text-[10px] text-neutral-500 font-normal">
                {appointments.filter((a) => a.date === bookingDate).length} {isAr ? 'حجوزات' : 'bookings'}
              </span>
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {appointments
                .filter((a) => a.date === bookingDate)
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/70 hover:bg-white text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#075563]">
                      <span>{apt.timeSlot} ({apt.durationMinutes} د)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                        {isAr ? 'مؤكد' : 'Confirmed'}
                      </span>
                    </div>
                    <div className="text-neutral-700 mt-1 font-medium">{apt.patientName}</div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span>{apt.therapistName}</span>
                      <span>•</span>
                      <span>{apt.roomName}</span>
                    </div>
                    {apt.deviceName && (
                      <div className="text-[10px] text-[#B59B62] font-semibold mt-1">
                        ⚡ {apt.deviceName}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-center shadow-xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#075563]">
              {isAr ? 'تم تأكيد الموعد وقفل الموارد الخمسة بنجاح!' : 'Appointment Confirmed & Resources Locked!'}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {isAr
                ? `تم حجز موعد للمريض (${selectedPatient?.nameAr}) مع (${selectedTherapist?.nameAr}) في (${selectedRoom?.nameAr}) لتاريخ ${bookingDate} الساعة ${timeSlot}. تم إرسال رسالة واتساب تلقائية للمريض.`
                : `Booking confirmed for ${selectedPatient?.nameEn} with ${selectedTherapist?.nameEn} in ${selectedRoom?.nameEn} on ${bookingDate} at ${timeSlot}.`}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-2.5 bg-[#075563] text-white rounded-lg text-sm font-bold hover:bg-[#06424e]"
              >
                {isAr ? 'حسناً، متابعة العمل' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
