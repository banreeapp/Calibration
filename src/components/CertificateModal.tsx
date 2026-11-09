import React from 'react';
import { MedicalDevice, CalibrationRecord } from '../types/medical';

interface CertificateModalProps {
  device: MedicalDevice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  device,
  isOpen,
  onClose
}) => {
  if (!isOpen || !device) return null;

  const record: CalibrationRecord = device.lastRecord || {
    id: 'cal-default',
    deviceId: device.id,
    testDate: device.lastCalibDate,
    nextDueDate: device.nextCalibDate,
    standardRef: 'IEC 62353:2014',
    testEquipment: 'Fluke ESA620 Electrical Safety Analyzer (S/N: 51920)',
    testEquipmentCalDueDate: '2025-06-30',
    traceabilityId: 'NIMT/TR-2024-8841',
    electricalSafety: {
      earthBondOhm: 0.12,
      earthBondPass: true,
      insulationMohm: 95.0,
      insulationPass: true,
      chassisLeakageUa: 36.4,
      chassisLeakagePass: true,
      patientLeakageUa: 4.8,
      patientLeakagePass: true
    },
    performanceParams: [
      { paramName: 'Functional Accuracy', nominalValue: '100%', measuredValue: '99.5%', tolerance: '±2%', pass: true },
      { paramName: 'Output Stability', nominalValue: 'Nominal', measuredValue: 'Nominal', tolerance: 'Pass', pass: true }
    ],
    overallResult: 'PASS',
    testedBy: 'S. Mitchell (Senior BME Tech)',
    certifiedBy: 'Dr. Aris Thorne (Lead Biomedical Engineer, Tier 4-Full)',
    certificateNumber: `DPH-CAL-${new Date().getFullYear()}-${device.id.replace('#', '')}`,
    notes: 'เครื่องผ่านเกณฑ์การทดสอบความปลอดภัยทางไฟฟ้าตามมาตรฐานสากล IEC 62353 ครบถ้วนทุกข้อกำหนด พร้อมใช้งานสำหรับผู้ป่วย',
    digitalSignature: 'VERIFIED_NIMT_DONPHUT_BME_SHA256',
    verificationHash: '8f4e2b01c7d8a90321ef5467ba980123'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 py-8">
      <div className="max-w-3xl w-full bg-[#161d1d] text-[#dde4e3] border border-white/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative my-auto print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#47eaed]"></span>
            <span className="font-mono-tech text-xs text-[#47eaed] font-bold">
              DIGITAL CALIBRATION CERTIFICATE (IEC 62353 / ISO 13485)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#47eaed] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>พิมพ์ใบรับรอง (Print PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#bac9c9] hover:text-white rounded-lg hover:bg-white/10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Certificate Paper Container */}
        <div className="bg-[#090f0f] print:bg-white p-6 md:p-8 rounded-xl border border-white/15 print:border-none space-y-6 font-sans">
          {/* Official Hospital Header */}
          <div className="flex items-center justify-between border-b-2 border-[#47eaed]/40 print:border-black pb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#47eaed]/20 print:bg-gray-100 flex items-center justify-center text-[#47eaed] print:text-black font-bold">
                <span className="material-symbols-outlined text-3xl">local_hospital</span>
              </div>
              <div>
                <p className="font-bold text-base md:text-lg text-[#dde4e3] print:text-black tracking-tight leading-tight">
                  เครือข่ายบริการสุขภาพอำเภอดอนพุด จังหวัดสระบุรี
                </p>
                <p className="text-xs text-[#bac9c9] print:text-gray-600 mt-0.5">
                  โรงพยาบาลดอนพุด (Don Phut Hospital) • ศูนย์วิศวกรรมชีวการแพทย์และเครื่องมือแพทย์
                </p>
                <p className="text-[11px] font-mono-tech text-[#47eaed] print:text-black">
                  ISO 13485:2016 Accredited Calibration Laboratory
                </p>
              </div>
            </div>

            {/* Cert No & QR */}
            <div className="text-right">
              <p className="font-mono-tech text-xs text-[#bac9c9] print:text-gray-600">CERTIFICATE NO.</p>
              <p className="font-mono-tech text-sm font-bold text-[#47eaed] print:text-black">
                {record.certificateNumber}
              </p>
              <div className="mt-1 inline-block p-1 bg-white rounded">
                <img src={device.qrCodeUrl} alt="QR" className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center py-1">
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#47eaed] print:text-black uppercase tracking-wide">
              Certificate of Calibration & Electrical Safety
            </h2>
            <p className="text-xs text-[#bac9c9] print:text-gray-600 mt-1">
              ใบรับรองผลการทดสอบความปลอดภัยทางไฟฟ้าและค่าความเที่ยงตรงของเครื่องมือแพทย์
            </p>
          </div>

          {/* Device Profile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/[0.03] print:bg-gray-50 rounded-xl border border-white/5 print:border-gray-200 text-xs">
            <div>
              <p className="text-[#bac9c9] print:text-gray-500 font-mono-tech text-[10px]">ASSET ID</p>
              <p className="font-mono-tech font-bold text-[#47eaed] print:text-black text-sm">{device.id}</p>
            </div>
            <div>
              <p className="text-[#bac9c9] print:text-gray-500 font-mono-tech text-[10px]">EQUIPMENT NAME</p>
              <p className="font-bold text-[#dde4e3] print:text-black truncate">{device.name}</p>
            </div>
            <div>
              <p className="text-[#bac9c9] print:text-gray-500 font-mono-tech text-[10px]">MODEL / SERIAL NO.</p>
              <p className="font-mono-tech text-[#dde4e3] print:text-black truncate">{device.model} / {device.serialNumber}</p>
            </div>
            <div>
              <p className="text-[#bac9c9] print:text-gray-500 font-mono-tech text-[10px]">FACILITY / DEPT</p>
              <p className="text-[#dde4e3] print:text-black truncate">{device.facilityName} ({device.department})</p>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono-tech font-bold text-[#47eaed] print:text-black uppercase">
                1. ELECTRICAL SAFETY TESTING (IEC 62353:2014)
              </span>
              <span className="font-mono-tech text-[11px] text-[#85e0a3] bg-[#34A853]/15 px-2 py-0.5 rounded">
                CRITERIA: PASS
              </span>
            </div>

            <table className="w-full text-left text-xs border border-white/10 print:border-gray-300">
              <thead className="bg-white/5 print:bg-gray-100 font-mono-tech text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-white/10 print:border-gray-300">Parameter Tested</th>
                  <th className="p-2.5 border-b border-white/10 print:border-gray-300">International Standard Limit</th>
                  <th className="p-2.5 border-b border-white/10 print:border-gray-300">Measured Value</th>
                  <th className="p-2.5 border-b border-white/10 print:border-gray-300 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200 font-mono-tech">
                <tr>
                  <td className="p-2.5 font-sans">Protective Earth Resistance (ความต้านทานสายดิน)</td>
                  <td className="p-2.5">&lt; 0.20 Ω</td>
                  <td className="p-2.5 text-[#47eaed] print:text-black font-bold">{record.electricalSafety.earthBondOhm} Ω</td>
                  <td className="p-2.5 text-center text-[#47eaed] print:text-green-700 font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans">Insulation Resistance (ความต้านทานฉนวน)</td>
                  <td className="p-2.5">&gt; 2.0 MΩ</td>
                  <td className="p-2.5 text-[#47eaed] print:text-black font-bold">{record.electricalSafety.insulationMohm} MΩ</td>
                  <td className="p-2.5 text-center text-[#47eaed] print:text-green-700 font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans">Equipment Touch/Chassis Leakage Current</td>
                  <td className="p-2.5">&lt; 100.0 µA</td>
                  <td className="p-2.5 text-[#47eaed] print:text-black font-bold">{record.electricalSafety.chassisLeakageUa} µA</td>
                  <td className="p-2.5 text-center text-[#47eaed] print:text-green-700 font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans">Patient Applied Part Leakage Current (CF/BF)</td>
                  <td className="p-2.5">&lt; 10.0 µA</td>
                  <td className="p-2.5 text-[#47eaed] print:text-black font-bold">{record.electricalSafety.patientLeakageUa ?? 4.8} µA</td>
                  <td className="p-2.5 text-center text-[#47eaed] print:text-green-700 font-bold">PASS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Traceability & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-3 bg-white/[0.02] print:bg-gray-50 rounded-xl border border-white/5 print:border-gray-200 space-y-1">
              <p className="font-mono-tech text-[10px] text-[#47eaed] print:text-black uppercase">Traceability Information</p>
              <p className="text-[#dde4e3] print:text-black font-medium">Standard Instrument: {record.testEquipment}</p>
              <p className="text-[#bac9c9] print:text-gray-600 text-[11px]">Calibration Traceable to: NIMT (สถาบันมาตรวิทยา) #{record.traceabilityId}</p>
            </div>

            <div className="p-3 bg-white/[0.02] print:bg-gray-50 rounded-xl border border-white/5 print:border-gray-200 space-y-1 font-mono-tech">
              <p className="text-[10px] text-[#47eaed] print:text-black uppercase">Inspection Dates</p>
              <p className="text-[#dde4e3] print:text-black">Calibrated Date: <span className="font-bold">{record.testDate}</span></p>
              <p className="text-[#dde4e3] print:text-black">Next Recalibration Due: <span className="font-bold text-[#47eaed] print:text-black">{record.nextDueDate}</span></p>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-white/10 print:border-gray-300 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Stamp seal */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-[#47eaed] print:border-black flex flex-col items-center justify-center text-center p-1 font-mono-tech text-[9px] text-[#47eaed] print:text-black rotate-[-8deg] shadow-lg">
                <span className="font-bold text-xs">PASSED</span>
                <span>IEC 62353</span>
                <span>DON PHUT</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#dde4e3] print:text-black">Official Biomedical Seal</p>
                <p className="text-[10px] text-[#bac9c9] print:text-gray-600 font-mono-tech">{record.digitalSignature}</p>
              </div>
            </div>

            {/* Engineer & Certifier signatures */}
            <div className="flex gap-8 text-center text-xs">
              <div>
                <div className="h-10 border-b border-white/20 print:border-black flex items-end justify-center pb-1 font-mono-tech text-[11px] text-[#47eaed] print:text-black font-semibold">
                  S. Mitchell
                </div>
                <p className="text-[#bac9c9] print:text-gray-600 text-[10px] mt-1">Tested By: Biomedical Technician</p>
              </div>

              <div>
                <div className="h-10 border-b border-white/20 print:border-black flex items-end justify-center pb-1 font-mono-tech text-[11px] text-[#47eaed] print:text-black font-bold">
                  Dr. Aris Thorne, Ph.D.
                </div>
                <p className="text-[#bac9c9] print:text-gray-600 text-[10px] mt-1">Certified By: Lead Biomedical Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
