import React, { useState } from 'react';
import { Patient, Language } from '../../types/clinic';
import {
  CreditCard,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Building,
  Calendar,
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  patientId: string;
  patientName: string;
  civilId: string;
  serviceType: 'consultation' | 'session' | 'package_5' | 'package_10' | 'device_session';
  serviceNameAr: string;
  amountOmr: number;
  discountOmr: number;
  taxOmr: number; // 5% VAT in Oman if applicable or exempt for healthcare
  netAmountOmr: number;
  paymentMethod: 'Cash' | 'Card (Debit/Credit)' | 'Oman Insurance (Daman)' | 'Bank Muscat Transfer';
  status: 'paid' | 'pending';
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0041',
    date: '2026-11-02',
    patientId: 'pat-1',
    patientName: 'سالم بن حمد البلوشي',
    civilId: '10928374',
    serviceType: 'package_10',
    serviceNameAr: 'باقة تأهيل العمود الفقري (10 جلسات) - خصم 10%',
    amountOmr: 150.0,
    discountOmr: 15.0,
    taxOmr: 0.0,
    netAmountOmr: 135.0,
    paymentMethod: 'Card (Debit/Credit)',
    status: 'paid',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0042',
    date: '2026-11-02',
    patientId: 'pat-2',
    patientName: 'مريم بنت ناصر الحبسية',
    civilId: '10847291',
    serviceType: 'session',
    serviceNameAr: 'جلسة علاج طبيعي وتأهيل ركبة (BTL 4000)',
    amountOmr: 15.0,
    discountOmr: 0.0,
    taxOmr: 0.0,
    netAmountOmr: 15.0,
    paymentMethod: 'Oman Insurance (Daman)',
    status: 'paid',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-0043',
    date: '2026-11-02',
    patientId: 'pat-3',
    patientName: 'خالد بن خميس المعولي',
    civilId: '10294819',
    serviceType: 'consultation',
    serviceNameAr: 'كشفية واستشارة أولية - أخصائي علاج طبيعي',
    amountOmr: 3.0,
    discountOmr: 0.0,
    taxOmr: 0.0,
    netAmountOmr: 3.0,
    paymentMethod: 'Cash',
    status: 'paid',
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0044',
    date: '2026-11-01',
    patientId: 'pat-4',
    patientName: 'عائشة بنت خلفان الشكيلية',
    civilId: '10938201',
    serviceType: 'package_5',
    serviceNameAr: 'باقة تأهيل وتر الكتف (5 جلسات) - خصم 10%',
    amountOmr: 75.0,
    discountOmr: 7.5,
    taxOmr: 0.0,
    netAmountOmr: 67.5,
    paymentMethod: 'Card (Debit/Credit)',
    status: 'paid',
  },
];

interface Props {
  patients: Patient[];
  lang: Language;
}

export const FinancialLedger: React.FC<Props> = ({ patients, lang }) => {
  const isAr = lang === 'ar';
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(INITIAL_INVOICES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // New Invoice form state
  const [selectedPatId, setSelectedPatId] = useState(patients[0]?.id || '');
  const [serviceCategory, setServiceCategory] = useState<'consultation' | 'session' | 'package_10'>('session');
  const [payMethod, setPayMethod] = useState<'Cash' | 'Card (Debit/Credit)' | 'Oman Insurance (Daman)'>('Card (Debit/Credit)');

  const totalRevenue = invoices.reduce((acc, i) => acc + i.netAmountOmr, 0);
  const totalDiscounts = invoices.reduce((acc, i) => acc + i.discountOmr, 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatId) || patients[0];

    let baseAmount = 15.0;
    let discount = 0.0;
    let serviceName = 'جلسة علاج طبيعي منفردة';

    if (serviceCategory === 'consultation') {
      baseAmount = 3.0;
      discount = 0.0;
      serviceName = 'كشفية واستشارة أولية - 3 ر.ع';
    } else if (serviceCategory === 'session') {
      baseAmount = 15.0;
      discount = 0.0;
      serviceName = 'جلسة علاج طبيعي منفردة - 15 ر.ع';
    } else if (serviceCategory === 'package_10') {
      baseAmount = 150.0;
      discount = 15.0; // 10% OFF
      serviceName = 'باقة 10 جلسات تأهيل (خصم 10% معتمد) - 135 ر.ع';
    }

    const newInv: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-00${invoices.length + 45}`,
      date: '2026-11-02',
      patientId: pat.id,
      patientName: pat.nameAr,
      civilId: pat.civilId,
      serviceType: serviceCategory,
      serviceNameAr: serviceName,
      amountOmr: baseAmount,
      discountOmr: discount,
      taxOmr: 0,
      netAmountOmr: baseAmount - discount,
      paymentMethod: payMethod,
      status: 'paid',
    };

    setInvoices([newInv, ...invoices]);
    setSelectedInvoice(newInv);
    setShowNewInvoiceModal(false);
  };

  const filteredInvoices = invoices.filter(
    (i) =>
      i.patientName.includes(searchTerm) ||
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.civilId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-[#075563] flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#2A9DA5]" />
            {isAr ? 'الفواتير والتحصيل المالي والتعرفة المعتمدة' : 'Invoicing & Financial Ledger'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'كشفية: ٣ ر.ع • جلسة: ١٥ ر.ع • خصم ١٠٪ على باقات ٥ جلسات فأكثر • فواتير رسمية متوافقة مع سلطنة عُمان'
              : 'Consultation: 3 OMR • Single Session: 15 OMR • 10% OFF for 5+ sessions packages'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewInvoiceModal(true)}
          className="px-4 py-2.5 bg-[#075563] hover:bg-[#06424e] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-[#B59B62]" />
          <span>{isAr ? 'إصدار فاتورة جديدة' : 'Issue New Invoice'}</span>
        </button>
      </div>

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>{isAr ? 'إجمالي التحصيل اليومي' : 'Daily Collected'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-[#075563] font-mono block">
            {totalRevenue.toFixed(3)} <span className="text-sm font-sans">ر.ع</span>
          </span>
          <p className="text-[10px] text-neutral-500">{isAr ? 'عبر نقاط البيع والنقد وتأمين ضمان' : 'POS, Cash & Insurance'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>{isAr ? 'وفورات خصم الباقات (10%)' : 'Package Discounts (10%)'}</span>
            <DollarSign className="w-4 h-4 text-[#B59B62]" />
          </div>
          <span className="text-2xl font-black text-[#B59B62] font-mono block">
            {totalDiscounts.toFixed(3)} <span className="text-sm font-sans">ر.ع</span>
          </span>
          <p className="text-[10px] text-emerald-600 font-medium">{isAr ? 'مطبق تلقائياً على باقات 5+' : '10% OFF automated rule'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>{isAr ? 'التعرفة المعتمدة' : 'Approved Tariff'}</span>
            <ShieldCheck className="w-4 h-4 text-[#075563]" />
          </div>
          <div className="text-xs font-bold text-[#075563] pt-1">
            <span>كشفية: 3.000 ر.ع</span>
            <span className="block text-[11px] text-neutral-600 font-normal">جلسة: 15.000 ر.ع</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Invoices Table (7 cols) + Official Printable Receipt Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Invoices */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs sm:text-sm text-[#075563]">
              {isAr ? 'سجل الفواتير الصادرة' : 'Issued Invoices Log'}
            </h3>
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
              <input
                type="text"
                placeholder={isAr ? 'بحث برقم الفاتورة أو المريض...' : 'Search invoices...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-8 pl-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'border-[#075563] bg-[#FAF8F1] shadow-xs ring-1 ring-[#075563]/30'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#075563]">{inv.invoiceNumber}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="font-bold text-neutral-800">{inv.patientName}</span>
                    </div>
                    <span className="font-mono font-black text-sm text-[#075563]">
                      {inv.netAmountOmr.toFixed(3)} ر.ع
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-600">
                    <span>{inv.serviceNameAr}</span>
                    <span className="text-neutral-400 font-mono">{inv.date}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                      💳 {inv.paymentMethod}
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {isAr ? 'تم السداد' : 'Paid'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Official Receipt Preview */}
        <div className="lg:col-span-5">
          {selectedInvoice ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-5 text-neutral-800">
              {/* Receipt Header with Real Clinic Logo */}
              <div className="text-center pb-4 border-b border-neutral-200 space-y-2">
                <img
                  src="/logo.png"
                  alt="مجمع أم القرى الطبي"
                  className="h-12 w-auto mx-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-black text-base text-[#075563]">مُجَمَّع أُمِّ القُرَى الطِّبِّي</h4>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  بركاء، الصومحان الجنوب، بناية R&B، بالقرب من مستشفى بدر السماء
                  <br />
                  هاتف: 79470050 / 94545025 • سلطنة عُمان
                </p>
                <div className="inline-block px-3 py-1 bg-neutral-100 rounded text-[11px] font-bold text-neutral-700">
                  سند قبض وفاتورة علاج طبيعي وتأهيل
                </div>
              </div>

              {/* Invoice meta details */}
              <div className="text-xs space-y-1.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                <div className="flex justify-between">
                  <span className="text-neutral-500">رقم الفاتورة:</span>
                  <span className="font-mono font-bold text-[#075563]">{selectedInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">تاريخ الإصدار:</span>
                  <span className="font-mono">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">اسم المريض:</span>
                  <span className="font-bold">{selectedInvoice.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">الرقم المدني العُماني:</span>
                  <span className="font-mono">{selectedInvoice.civilId}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="text-xs space-y-2 border-t border-b border-neutral-200 py-3">
                <div className="flex justify-between font-bold text-neutral-700">
                  <span>البيان / الخدمة</span>
                  <span>المبلغ</span>
                </div>
                <div className="flex justify-between text-neutral-600 text-[11px]">
                  <span>{selectedInvoice.serviceNameAr}</span>
                  <span className="font-mono">{selectedInvoice.amountOmr.toFixed(3)} ر.ع</span>
                </div>
                {selectedInvoice.discountOmr > 0 && (
                  <div className="flex justify-between text-emerald-600 text-[11px]">
                    <span>خصم معتمد (10% باقة 5+ جلسات):</span>
                    <span className="font-mono">-{selectedInvoice.discountOmr.toFixed(3)} ر.ع</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-[#075563] pt-2 border-t border-neutral-200">
                  <span>الصافي المدفوع:</span>
                  <span className="font-mono">{selectedInvoice.netAmountOmr.toFixed(3)} ر.ع</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>طريقة الدفع: <strong className="text-neutral-800">{selectedInvoice.paymentMethod}</strong></span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">خالص السداد</span>
              </div>

              {/* Official Stamp & Sign */}
              <div className="pt-4 flex justify-between items-end text-[10px] text-neutral-400">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#B59B62]/50 flex items-center justify-center text-[9px] text-[#B59B62] font-serif rotate-[-12deg]">
                    ختم المجمع
                  </div>
                  <span className="mt-1 block">مجمع أم القرى الطبي</span>
                </div>
                <div className="text-center">
                  <span className="block border-b border-neutral-300 w-24 pb-4"></span>
                  <span className="mt-1 block">توقيع أمين الصندوق</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-[#075563] hover:bg-[#06424e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#B59B62]" />
                <span>طباعة السند الضريبي المعتمد</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-400 text-xs">
              اختر فاتورة لعرض سند القبض الرسمي
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-black text-sm text-[#075563] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#B59B62]" />
                <span>إصدار فاتورة جديدة للعيادة</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">المريض</label>
                <select
                  value={selectedPatId}
                  onChange={(e) => setSelectedPatId(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-semibold"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameAr} (الرقم المدني: {p.civilId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">نوع الخدمة والتعرفة</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-semibold"
                >
                  <option value="consultation">كشفية واستشارة أولية - 3 ر.ع</option>
                  <option value="session">جلسة علاج طبيعي منفردة - 15 ر.ع</option>
                  <option value="package_10">باقة 10 جلسات تأهيل (135 ر.ع بعد خصم 10%)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">طريقة السداد</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 font-semibold"
                >
                  <option value="Card (Debit/Credit)">بطاقة بنكية / نقطة بيع (POS)</option>
                  <option value="Cash">دفع نقدي (Cash)</option>
                  <option value="Oman Insurance (Daman)">تأمين عُمان (ضمان للتأمين)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075563] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#B59B62]" />
                  <span>إصدار الفاتورة والسداد</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
