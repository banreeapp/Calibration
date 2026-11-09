import React, { useState } from 'react';
import { MedicalDevice, Department, FacilityId } from '../types/medical';
import { facilities } from '../data/mockMedicalData';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDevice: (newDevice: MedicalDevice) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onSaveDevice
}) => {
  const [name, setName] = useState('');
  const [nameTh, setNameTh] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [department, setDepartment] = useState<Department>('Cardiology Unit');
  const [facilityId, setFacilityId] = useState<FacilityId>('donphut-hospital');
  const [room, setRoom] = useState('ห้องตรวจรักษา 1');
  const [manufacturer, setManufacturer] = useState('Philips Healthcare');
  const [lastCalibDate, setLastCalibDate] = useState(new Date().toISOString().split('T')[0]);
  const [calibIntervalMonths, setCalibIntervalMonths] = useState<number>(12);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Auto-calculate next calibration date
  const calculateNextDate = (lastDateStr: string, months: number) => {
    if (!lastDateStr) return '';
    const d = new Date(lastDateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const nextCalibDate = calculateNextDate(lastCalibDate, calibIntervalMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !serialNumber.trim()) {
      alert('กรุณากรอกชื่ออุปกรณ์และ Serial Number ให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    const facilityObj = facilities.find(f => f.id === facilityId) || facilities[0];

    const today = new Date();
    const nextDateObj = new Date(nextCalibDate);
    const diffTime = nextDateObj.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const prefix = department.includes('Cardio') ? '#CRD' :
                   department.includes('ICU') ? '#ICU' :
                   department.includes('Emergency') ? '#ER' :
                   department.includes('Lab') ? '#LAB' : '#MED';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}-${randNum}`;

    const newDevice: MedicalDevice = {
      id: newId,
      name,
      nameTh: nameTh || name,
      model: model || 'MD-GEN-2024',
      serialNumber,
      manufacturer,
      department,
      facilityId,
      facilityName: facilityObj.name,
      room,
      riskClass: department.includes('ICU') || department.includes('Emergency')
        ? 'Class III (Critical/Life Support)'
        : 'Class II (Moderate Risk)',
      installDate: lastCalibDate,
      lastCalibDate,
      calibIntervalMonths,
      nextCalibDate,
      daysRemaining,
      status: daysRemaining > 60 ? 'Optimal' : daysRemaining > 0 ? 'Due Soon' : 'Expired',
      safetyStandard: 'IEC 62353:2014',
      technician: 'Dr. Aris Thorne',
      aging: {
        equipmentHealthScore: 98,
        expectedLifespanYears: 8,
        currentAgeYears: 0.1,
        remainingLifespanMonths: 96,
        failureProbabilityNext12m: 2,
        maintenanceCostTrend: 'Low',
        recommendedAction: 'Keep in service',
        mtbfHours: 8500,
        degradationPoints: [
          { year: 2024, health: 100 },
          { year: 2026, health: 94 },
          { year: 2028, health: 85 }
        ]
      },
      qrCodeUrl: `https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=${newId}-${facilityId}`
    };

    setTimeout(() => {
      onSaveDevice(newDevice);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 py-8">
      <div className="glass-card-elevated max-w-4xl w-full rounded-2xl border border-white/20 p-6 md:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Breadcrumb & Header matching user Image 8 */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#bac9c9] mb-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="hover:text-[#47eaed] cursor-pointer" onClick={onClose}>Inventory</span>
              <span className="opacity-40">/</span>
              <span className="text-[#47eaed]">Add New Device</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#47eaed] tracking-tight">
              Register Medical Instrument
            </h2>
            <p className="text-xs text-[#bac9c9] mt-0.5">
              บันทึกข้อมูลครุภัณฑ์การแพทย์เข้าสู่ฐานข้อมูลระบบสุขภาพอำเภอดอนพุด (ISO 13485 / PDPA)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#bac9c9] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* 2-Column Form and Info layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Fields (2 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Device Name */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Device Name (ชื่อสากล) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Philips IntelliVue MX550"
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors"
                />
              </div>

              {/* Device Name Thai */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  ชื่อภาษาไทย (Thai Name)
                </label>
                <input
                  type="text"
                  value={nameTh}
                  onChange={(e) => setNameTh(e.target.value)}
                  placeholder="e.g. เครื่องติดตามสัญญาณชีพผู้ป่วยข้างเตียง"
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors"
                />
              </div>

              {/* Model Number */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Model Number (รุ่น) *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="MD-200X-B"
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors font-mono-tech"
                />
              </div>

              {/* Serial Number */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Serial Number (SN) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="SN-882194-Z"
                    className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors font-mono-tech pr-10"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#bac9c9] text-base">
                    barcode_scanner
                  </span>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Department (แผนก)
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors"
                >
                  <option value="Cardiology Unit">Cardiology Unit (หน่วยหัวใจ)</option>
                  <option value="Intensive Care (ICU)">Intensive Care (ICU)</option>
                  <option value="Emergency Room (ER)">Emergency Room (ER ฉุกเฉิน)</option>
                  <option value="Radiology">Radiology (รังสีวิทยา)</option>
                  <option value="Hematology Lab">Hematology Lab (ห้องแล็บ)</option>
                  <option value="Oncology">Oncology (เคมีบำบัด)</option>
                  <option value="Pediatrics">Pediatrics (กุมารเวชกรรม)</option>
                  <option value="Sub-district Primary Care">Sub-district Primary Care (รพ.สต.)</option>
                </select>
              </div>

              {/* Health Facility */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  สถานบริการสุขภาพ (Facility)
                </label>
                <select
                  value={facilityId}
                  onChange={(e) => setFacilityId(e.target.value as FacilityId)}
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors"
                >
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.type.split(' ')[0]})</option>
                  ))}
                </select>
              </div>

              {/* Last Calibration Date */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Last Calibration Date (วันที่สอบเทียบล่าสุด)
                </label>
                <input
                  type="date"
                  value={lastCalibDate}
                  onChange={(e) => setLastCalibDate(e.target.value)}
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors font-mono-tech"
                />
              </div>

              {/* Next Scheduled Review (Auto-calculated) */}
              <div className="space-y-1.5">
                <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block">
                  Next Scheduled Review (คำนวณอัตโนมัติ)
                </label>
                <div className="flex items-center gap-2 bg-[#090f0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#47eaed] font-mono-tech opacity-90">
                  <span className="material-symbols-outlined text-sm text-[#bac9c9]">lock</span>
                  <span>{nextCalibDate} (+{calibIntervalMonths} เดือน)</span>
                </div>
              </div>
            </div>

            {/* Drag & Drop Calibration Certificate area */}
            <div className="pt-2">
              <label className="font-mono-tech text-xs uppercase text-[#bac9c9] block mb-2">
                Calibration Certificates (PDF)
              </label>
              <div className="w-full border-2 border-dashed border-[#47eaed]/30 rounded-2xl p-6 flex flex-col items-center justify-center bg-[#47eaed]/5 hover:bg-[#47eaed]/10 transition-colors cursor-pointer group text-center">
                <span className="material-symbols-outlined text-[#47eaed] text-4xl mb-2 group-hover:scale-110 transition-transform">
                  upload_file
                </span>
                <p className="text-sm font-semibold text-[#dde4e3]">
                  {uploadedFileName ? `ไฟล์แนบ: ${uploadedFileName}` : 'ลากไฟล์ใบรับรองผลสอบเทียบมาวางที่นี่'}
                </p>
                <p className="text-xs text-[#bac9c9]/60 mt-0.5">รองรับไฟล์ PDF, Digital Signatures (สูงสุด 15MB)</p>
                <label className="mt-3 px-4 py-1.5 border border-[#47eaed]/40 text-[#47eaed] rounded-lg text-xs font-mono-tech cursor-pointer hover:bg-[#47eaed] hover:text-black transition-all">
                  <span>เลือกไฟล์จากเครื่อง</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#00ced1] hover:bg-[#47eaed] text-black font-bold text-xs font-display rounded-xl shadow-[0_0_20px_rgba(71,234,237,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'Save Medical Device'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-[#bac9c9] hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Right Column: Registration Guide & Device Preview (Matching user Image 8) */}
          <div className="space-y-4">
            {/* Guide Card */}
            <div className="glass-panel rounded-xl p-4 border-l-4 border-l-[#47eaed] space-y-2">
              <div className="flex items-center gap-2 text-[#47eaed] font-bold text-sm">
                <span className="material-symbols-outlined text-base">info</span>
                <span>Registration Guide</span>
              </div>
              <p className="text-xs text-[#bac9c9] leading-relaxed">
                กรุณาตรวจสอบว่า Serial Number ตรงกับแผ่นป้ายฉลากหลังเครื่องจริง เอกสารรับรองผลการสอบเทียบต้องมีลายเซ็นวิศวกรชีวการแพทย์ที่ได้รับอนุญาต
              </p>
            </div>

            {/* Device Preview Card */}
            <div className="glass-panel rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase font-mono-tech text-[#dde4e3]">
                  Device Preview
                </h4>
                <span className="text-[10px] font-mono-tech text-[#47eaed] bg-[#47eaed]/15 px-2 py-0.5 rounded">
                  NEW
                </span>
              </div>

              {/* Graphic container */}
              <div className="aspect-video bg-[#090f0f] rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative">
                <img
                  src="/assets/aistudio/Image_12_6433f597.png"
                  alt="Medical Monitor Preview"
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1515] to-transparent"></div>
                <div className="absolute bottom-2 left-3 right-3 text-left">
                  <p className="text-xs font-bold text-[#dde4e3] truncate">{name || 'Philips IntelliVue MX550'}</p>
                  <p className="text-[10px] text-[#47eaed] font-mono-tech">S/N: {serialNumber || 'SN-PENDING'}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-mono-tech text-[#bac9c9]">
                  <span>Compliance Status</span>
                  <span className="text-[#47eaed]">PENDING APPROVAL</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00ced1] to-[#4bc5ff] w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
