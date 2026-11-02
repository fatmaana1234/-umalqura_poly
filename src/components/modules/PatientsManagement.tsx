import React, { useState } from 'react';
import { Patient, Language } from '../../types/clinic';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  FileText,
  UserCheck,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle2,
  Printer,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  patients: Patient[];
  onAddPatient: (patient: Patient) => void;
  onOpenSoapNotes?: (patient: Patient) => void;
  onOpenBodyMap?: (patient: Patient) => void;
  onOpenDischarge?: (patient: Patient) => void;
  lang: Language;
}

export const PatientsManagement: React.FC<Props> = ({
  patients,
  onAddPatient,
  onOpenSoapNotes,
  onOpenBodyMap,
  onOpenDischarge,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'on_hold'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New patient form state
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    civilId: '',
    age: 35,
    gender: 'male' as 'male' | 'female',
    phone: '968',
    diagnosisAr: '',
    diagnosisEn: '',
    vasBaseline: 7,
    insuranceProvider: 'None',
  });

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.civilId.includes(searchTerm) ||
      p.phone.includes(searchTerm);
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || (p.status || 'active') === statusFilter;
    return matchesSearch && matchesGender && matchesStatus;
  });

  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr || !formData.civilId) return;

    const newPatient: Patient = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      civilId: formData.civilId,
      nameAr: formData.nameAr,
      nameEn: formData.nameEn || formData.nameAr,
      age: Number(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      address: 'بركاء، سلطنة عُمان',
      chiefComplaint: formData.diagnosisAr || 'ألم حركي وإصابة عضلية',
      diagnosisAr: formData.diagnosisAr || 'ألم أسفل الظهر الحركي',
      diagnosisEn: formData.diagnosisEn || 'Mechanical Low Back Pain',
      vasBaseline: Number(formData.vasBaseline),
      vasCurrent: Number(formData.vasBaseline),
      totalSessionsAttended: 1,
      totalSessionsPrescribed: 10,
      assignedTherapistId: formData.gender === 'female' ? 'th-2' : 'th-1',
      assignedRoomId: formData.gender === 'female' ? 'room-2' : 'room-1',
      preferredRoomId: formData.gender === 'female' ? 'room-2' : 'room-1',
      registrationDate: '2026-11-02',
      insuranceProvider: formData.insuranceProvider,
      policyNumber: formData.insuranceProvider !== 'None' ? `OM-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      copayPercentage: formData.insuranceProvider !== 'None' ? 20 : 0,
      status: 'active',
      createdAt: '2026-11-01',
    };

    onAddPatient(newPatient);
    setSelectedPatient(newPatient);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      nameAr: '',
      nameEn: '',
      civilId: '',
      age: 35,
      gender: 'male',
      phone: '968',
      diagnosisAr: '',
      diagnosisEn: '',
      vasBaseline: 7,
      insuranceProvider: 'None',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#075563] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2A9DA5]" />
            {isAr ? 'سجل المرضى والملف الطبي الإلكتروني (EHR)' : 'Patients Directory & EHR'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'إدارة السجلات الطبية وفق معايير الخصوصية العُمانية، وتوثيق بطاقة الرقم المدني ومسار الاستشفاء'
              : 'Electronic Health Records compliant with Omani healthcare privacy and civil identification'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#075563] hover:bg-[#06424e] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-[#B59B62]" />
          <span>{isAr ? 'تسجيل مريض جديد' : 'New Patient Admission'}</span>
        </button>
      </div>

      {/* Main Split Layout: Patient List (5 cols) & Active Patient Profile (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filter & List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filters Card */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder={isAr ? 'بحث بالاسم، الرقم المدني، أو رقم الهاتف...' : 'Search by name, civil ID, phone...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-[#075563] text-neutral-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-semibold"
              >
                <option value="all">{isAr ? 'جميع الفئات (ذكور وإناث)' : 'All Genders'}</option>
                <option value="male">{isAr ? 'ذكور (أخصائي ذكر)' : 'Male Patients'}</option>
                <option value="female">{isAr ? 'إناث (أخصائية أنثى)' : 'Female Patients'}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 font-semibold"
              >
                <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
                <option value="active">{isAr ? 'حالات نشطة قيد العلاج' : 'Active'}</option>
                <option value="completed">{isAr ? 'تم إكمال الكورس' : 'Completed'}</option>
                <option value="on_hold">{isAr ? 'مؤجل / قيد المتابعة' : 'On Hold'}</option>
              </select>
            </div>
          </div>

          {/* Patients Cards List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'border-[#075563] bg-[#FAF8F1] shadow-xs ring-1 ring-[#075563]/30'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          patient.gender === 'female'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-teal-100 text-[#075563]'
                        }`}
                      >
                        {patient.gender === 'female' ? '♀' : '♂'}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#075563] block">
                          {isAr ? patient.nameAr : patient.nameEn}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {isAr ? 'الرقم المدني:' : 'Civil ID:'} {patient.civilId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        (patient.status || 'active') === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {(patient.status || 'active') === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'مكتمل' : 'Done')}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-600 line-clamp-1 font-medium">
                    🩺 {isAr ? patient.diagnosisAr : patient.diagnosisEn}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-200/60">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#B59B62]" />
                      {patient.phone}
                    </span>
                    <span>
                      {isAr ? 'جلسات:' : 'Sessions:'}{' '}
                      <strong className="text-[#075563]">
                        {patient.totalSessionsAttended}/{patient.totalSessionsPrescribed || 10}
                      </strong>
                    </span>
                    <span className="text-red-600 font-bold">
                      VAS: {patient.vasCurrent}/10
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-neutral-300 text-neutral-500 text-xs">
                {isAr ? 'لم يتم العثور على أي مريض يطابق معايير البحث' : 'No patients match your search criteria'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed EHR Record */}
        <div className="lg:col-span-7">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden space-y-6">
              {/* Header profile banner */}
              <div className="bg-gradient-to-r from-[#075563] to-[#2A9DA5] p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#B59B62] text-white text-[10px] font-bold">
                        {selectedPatient.gender === 'female'
                          ? isAr ? 'مريضة (خصوصية تامة - أخصائية أنثى)' : 'Female Patient'
                          : isAr ? 'مريض (أخصائي ذكر)' : 'Male Patient'}
                      </span>
                      <span className="text-xs text-white/80 font-mono">
                        ID: {selectedPatient.id}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                    </h3>
                    <p className="text-xs text-neutral-200">
                      {isAr ? 'التشخيص الطبي السريري:' : 'Clinical Diagnosis:'}{' '}
                      <strong className="text-white">
                        {isAr ? selectedPatient.diagnosisAr : selectedPatient.diagnosisEn}
                      </strong>
                    </p>
                  </div>

                  {/* Quick Action Badges */}
                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenDischarge && onOpenDischarge(selectedPatient)}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تقرير التخريج PDF' : 'Discharge PDF'}</span>
                    </button>
                    {onOpenSoapNotes && (
                      <button
                        type="button"
                        onClick={() => onOpenSoapNotes(selectedPatient)}
                        className="px-3 py-1.5 bg-[#FAF8F1] text-[#075563] hover:bg-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2A9DA5]" />
                        <span>{isAr ? 'توثيق SOAP' : 'SOAP Notes'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio & Administrative Grid */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'الرقم المدني العُماني' : 'Civil ID'}</span>
                    <span className="font-mono font-bold text-neutral-900">{selectedPatient.civilId}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'العمر' : 'Age'}</span>
                    <span className="font-bold text-neutral-900">{selectedPatient.age} {isAr ? 'سنة' : 'yrs'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'رقم الاتصال / واتساب' : 'Phone'}</span>
                    <span className="font-mono font-bold text-[#075563]">{selectedPatient.phone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 block text-[11px]">{isAr ? 'شركة التأمين' : 'Insurance'}</span>
                    <span className="font-bold text-neutral-900">{selectedPatient.insuranceProvider || (isAr ? 'دفع نقدي' : 'Self-Pay')}</span>
                  </div>
                </div>

                {/* Clinical Progress: VAS Pain Level comparison */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#075563] flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      {isAr ? 'مؤشر تطور الألم السريري (VAS 0-10)' : 'Pain Subsidence Curve'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {isAr
                        ? `تحسن بنسبة ${Math.round(((selectedPatient.vasBaseline - selectedPatient.vasCurrent) / selectedPatient.vasBaseline) * 100)}%`
                        : `${Math.round(((selectedPatient.vasBaseline - selectedPatient.vasCurrent) / selectedPatient.vasBaseline) * 100)}% Improvement`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-500">{isAr ? 'عند الدخول (Baseline)' : 'Initial Baseline'}</span>
                        <span className="font-bold text-red-600 font-mono">{selectedPatient.vasBaseline}/10</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${selectedPatient.vasBaseline * 10}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-500">{isAr ? 'الجلسة الحالية (Current)' : 'Current'}</span>
                        <span className="font-bold text-emerald-600 font-mono">{selectedPatient.vasCurrent}/10</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${selectedPatient.vasCurrent * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Sessions Counter & Quota */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      {isAr ? 'الجلسات المنفذة من الكورس العلاجي' : 'Rehab Sessions Progress'}
                    </span>
                    <span className="font-mono font-bold text-[#075563]">
                      {selectedPatient.totalSessionsAttended} / {selectedPatient.totalSessionsPrescribed || 10} {isAr ? 'جلسات' : 'Sessions'}
                    </span>
                  </div>

                  <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2A9DA5] h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedPatient.totalSessionsAttended / (selectedPatient.totalSessionsPrescribed || 10)) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-neutral-500">
                    {isAr
                      ? `تبقى للمريض ${Math.max(0, (selectedPatient.totalSessionsPrescribed || 10) - selectedPatient.totalSessionsAttended)} جلسات حتى إعادة التقييم النهائي.`
                      : `${Math.max(0, (selectedPatient.totalSessionsPrescribed || 10) - selectedPatient.totalSessionsAttended)} sessions remaining until final reassessment.`}
                  </p>
                </div>

                {/* Assigned Therapists & Compliance Protocols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                    <span className="font-bold text-[#075563] block">
                      {isAr ? 'الأخصائي المعالج والخصوصية' : 'Assigned Specialist & Privacy'}
                    </span>
                    <div className="space-y-1 text-neutral-600 text-[11px]">
                      <p>
                        {selectedPatient.gender === 'female'
                          ? isAr ? '👩‍⚕️ الأخصائية: فاطمة البلوشية (غرفة خاصة مغلقة للإناث)' : 'Therapist: Fatima Al Balushi (Private Suite)'
                          : isAr ? '👨‍⚕️ الأخصائي: سيف المعمري (عيادة الرجال بالزي العُماني)' : 'Therapist: Saif Al Maamari (Male Clinic)'}
                      </p>
                      <p className="text-neutral-500">
                        {isAr ? 'الالتزام التام بضوابط وزارة الصحة العُمانية' : 'Full compliance with Oman MOH gender protocol'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
                    <span className="font-bold text-[#075563] block">
                      {isAr ? 'البروتوكول العلاجي المقترح' : 'Prescribed Modalities'}
                    </span>
                    <div className="space-y-1 text-neutral-600 text-[11px]">
                      <p>• جهاز شد الفقرات الرقمي (Spinal Traction)</p>
                      <p>• BTL 4000 موجات فوق صوتية وتيارات مسكنة</p>
                      <p>• تمارين علاجية وتقوية في الجيم الحركي</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
              {isAr ? 'اختر مريضاً من القائمة لعرض سجله الطبي' : 'Select a patient to inspect record'}
            </div>
          )}
        </div>
      </div>

      {/* Add New Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-black text-sm sm:text-base text-[#075563] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B59B62]" />
                {isAr ? 'فتح ملف مريض جديد (مجمع أم القرى الطبي)' : 'New Patient Electronic Registration'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewPatient} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  {isAr ? 'الاسم الرباعي (باللغة العربية) *' : 'Full Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سعيد بن خلفان الحراصي"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'الرقم المدني العُماني *' : 'Oman Civil ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="10492817"
                    value={formData.civilId}
                    onChange={(e) => setFormData({ ...formData, civilId: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-neutral-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'رقم الهاتف العُماني *' : 'Phone (+968) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="96894545025"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'الجنس (تحديد الأخصائي تلقائياً) *' : 'Gender *'}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-semibold"
                  >
                    <option value="male">{isAr ? 'ذكر (يُعالج بواسطة أخصائي ذكر)' : 'Male'}</option>
                    <option value="female">{isAr ? 'أنثى (تُعالج بواسطة أخصائية أنثى)' : 'Female'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'العمر' : 'Age'}
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  {isAr ? 'التشخيص الطبي الأولي' : 'Initial Diagnosis'}
                </label>
                <input
                  type="text"
                  placeholder="مثال: انزلاق غضروفي قطني L4-L5 مع عرق النسا"
                  value={formData.diagnosisAr}
                  onChange={(e) => setFormData({ ...formData, diagnosisAr: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'مقياس الألم المبدئي (VAS)' : 'Initial VAS (0-10)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={formData.vasBaseline}
                    onChange={(e) => setFormData({ ...formData, vasBaseline: Number(e.target.value) })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">
                    {isAr ? 'التأمين الصحي' : 'Insurance'}
                  </label>
                  <select
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-semibold"
                  >
                    <option value="None">{isAr ? 'دفع نقدي / بدون تأمين' : 'Self-Pay'}</option>
                    <option value="Daman Oman">{isAr ? 'ضمان للتأمين (Daman)' : 'Daman'}</option>
                    <option value="National Life & General (NLGIC)">{isAr ? 'الوطنية للتأمين (NLGIC)' : 'NLGIC'}</option>
                    <option value="Dhofar Insurance">{isAr ? 'ظفار للتأمين' : 'Dhofar Insurance'}</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#B59B62]" />
                  <span>{isAr ? 'حفظ وفتح الملف' : 'Save & Open EHR'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
