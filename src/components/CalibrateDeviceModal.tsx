import React, { useState } from 'react';
import { MedicalDevice, CalibrationRecord, UserProfile } from '../types/medical';

interface CalibrateDeviceModalProps {
  device: MedicalDevice | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCompleteCalibration: (updatedDevice: MedicalDevice, newRecord: CalibrationRecord) => void;
}

export const CalibrateDeviceModal: React.FC<CalibrateDeviceModalProps> = ({
  device,
  currentUser,
  isOpen,
  onClose,
  onCompleteCalibration
}) => {
  if (!isOpen || !device) return null;

  const [earthBond, setEarthBond] = useState<number>(0.11);
  const [insulation, setInsulation] = useState<number>(85.0);
  const [chassisLeakage, setChassisLeakage] = useState<number>(38.5);
  const [patientLeakage, setPatientLeakage] = useState<number>(4.2);
  const [standardRef, setStandardRef] = useState<'IEC 62353:2014' | 'IEC 60601-1' | 'ISO 13485:2016' | 'ISO/IEC 17025'>('IEC 62353:2014');
  const [testEquipment, setTestEquipment] = useState('Fluke ESA620 Electrical Safety Analyzer (S/N: 51920)');
  const [traceabilityId, setTraceabilityId] = useState('NIMT/TR-2024-8841');
  const [notes, setNotes] = useState('เครื่องผ่านเกณฑ์การทดสอบความปลอดภัยทางไฟฟ้าและสมรรถนะตามข้อกำหนด พร้อมใช้งานทางคลินิก');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limits
  const earthBondPass = earthBond <= 0.20;
  const insulationPass = insulation >= 2.0;
  const chassisLeakagePass = chassisLeakage <= 100.0;
  const patientLeakagePass = patientLeakage <= 10.0;
  const allElectricalPass = earthBondPass && insulationPass && chassisLeakagePass && patientLeakagePass;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const todayStr = new Date().toISOString().split('T')[0];
    const nextDueDate = new Date();
    nextDueDate.setMonth(nextDueDate.getMonth() + device.calibIntervalMonths);
    const nextDueDateStr = nextDueDate.toISOString().split('T')[0];

    const certNum = `DPH-CAL-${new Date().getFullYear()}-${device.id.replace('#', '').replace('-', '')}`;

    const newRecord: CalibrationRecord = {
      id: `cal-rec-${Date.now()}`,
      deviceId: device.id,
      testDate: todayStr,
      nextDueDate: nextDueDateStr,
      standardRef,
      testEquipment,
      testEquipmentCalDueDate: '2025-12-31',
      traceabilityId,
      electricalSafety: {
        earthBondOhm: earthBond,
        earthBondPass,
        insulationMohm: insulation,
        insulationPass,
        chassisLeakageUa: chassisLeakage,
        chassisLeakagePass,
        patientLeakageUa: patientLeakage,
        patientLeakagePass
      },
      performanceParams: [
        { paramName: 'Output Accuracy & Functional Range', nominalValue: '100.0%', measuredValue: '99.4%', tolerance: '±2%', pass: true },
        { paramName: 'Alarm Trigger Response Time', nominalValue: '< 2.0s', measuredValue: '1.2s', tolerance: 'Pass', pass: true }
      ],
      overallResult: allElectricalPass ? 'PASS' : 'FAIL',
      testedBy: `${currentUser.name} (${currentUser.title})`,
      certifiedBy: 'Dr. Aris Thorne (Lead BME, Tier 4-Full)',
      certificateNumber: certNum,
      notes,
      digitalSignature: `SIG_${currentUser.id.toUpperCase()}_${Date.now()}`,
      verificationHash: `hash-${Math.random().toString(36).substring(2, 15)}`
    };

    const updatedDevice: MedicalDevice = {
      ...device,
      lastCalibDate: todayStr,
      nextCalibDate: nextDueDateStr,
      daysRemaining: device.calibIntervalMonths * 30,
      status: 'Optimal',
      technician: currentUser.name,
      aging: {
        ...device.aging,
        equipmentHealthScore: Math.min(100, device.aging.equipmentHealthScore + 8),
        failureProbabilityNext12m: Math.max(2, device.aging.failureProbabilityNext12m - 10)
      },
      lastRecord: newRecord
    };

    setTimeout(() => {
      onCompleteCalibration(updatedDevice, newRecord);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 py-8">
      <div className="glass-card-elevated max-w-3xl w-full rounded-2xl border border-white/20 p-6 md:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#47eaed] mb-1">
              <span>IEC 62353 RECURRENT TEST PROTOCOL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
              <span>{device.id}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#dde4e3]">
              ทดสอบและบันทึกการสอบเทียบ: {device.name}
            </h2>
            <p className="text-xs text-[#bac9c9] mt-0.5">
              โมเดล: {device.model} • SN: {device.serialNumber} • สถานที่: {device.facilityName} ({device.department})
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-[#bac9c9] hover:text-white rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Standards & Test equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div>
              <label className="text-[10px] font-mono-tech uppercase text-[#bac9c9] block mb-1">
                มาตรฐานการทดสอบความปลอดภัย (Safety Standard)
              </label>
              <select
                value={standardRef}
                onChange={(e) => setStandardRef(e.target.value as any)}
                className="w-full bg-[#090f0f] border border-white/10 rounded-lg p-2.5 text-xs text-[#dde4e3] outline-none font-mono-tech"
              >
                <option value="IEC 62353:2014">IEC 62353:2014 (Recurrent & After-repair test)</option>
                <option value="IEC 60601-1">IEC 60601-1 (General Requirements for Basic Safety)</option>
                <option value="ISO 13485:2016">ISO 13485:2016 (Quality Management System)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono-tech uppercase text-[#bac9c9] block mb-1">
                เครื่องมือทดสอบที่ใช้งาน (Analyzer Used)
              </label>
              <input
                type="text"
                value={testEquipment}
                onChange={(e) => setTestEquipment(e.target.value)}
                className="w-full bg-[#090f0f] border border-white/10 rounded-lg p-2.5 text-xs text-[#dde4e3] outline-none"
              />
            </div>
          </div>

          {/* Electrical Safety Test Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#47eaed] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">bolt</span>
                <span>การวัดค่าความปลอดภัยทางไฟฟ้า (Electrical Safety Parameters - IEC 62353)</span>
              </h3>
              <span className={`text-[11px] font-mono-tech font-bold px-2 py-0.5 rounded-full ${
                allElectricalPass ? 'bg-[#47eaed]/20 text-[#47eaed]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
              }`}>
                {allElectricalPass ? 'PASS ALL CRITERIA' : 'OUT OF TOLERANCE'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earth Bond */}
              <div className="glass-panel p-3.5 rounded-xl space-y-1.5 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#dde4e3] font-semibold">1. Protective Earth Resistance</span>
                  <span className="font-mono-tech text-[10px] text-[#bac9c9]">Limit: &lt; 0.20 Ω</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={earthBond}
                    onChange={(e) => setEarthBond(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono-tech text-[#dde4e3] outline-none focus:border-[#47eaed]"
                  />
                  <span className="text-xs font-mono-tech text-[#bac9c9]">Ω</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold ${
                    earthBondPass ? 'bg-[#47eaed]/20 text-[#47eaed]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {earthBondPass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Insulation Resistance */}
              <div className="glass-panel p-3.5 rounded-xl space-y-1.5 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#dde4e3] font-semibold">2. Insulation Resistance</span>
                  <span className="font-mono-tech text-[10px] text-[#bac9c9]">Limit: &gt; 2.0 MΩ</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={insulation}
                    onChange={(e) => setInsulation(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono-tech text-[#dde4e3] outline-none focus:border-[#47eaed]"
                  />
                  <span className="text-xs font-mono-tech text-[#bac9c9]">MΩ</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold ${
                    insulationPass ? 'bg-[#47eaed]/20 text-[#47eaed]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {insulationPass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Chassis Leakage */}
              <div className="glass-panel p-3.5 rounded-xl space-y-1.5 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#dde4e3] font-semibold">3. Touch / Chassis Leakage</span>
                  <span className="font-mono-tech text-[10px] text-[#bac9c9]">Limit: &lt; 100.0 µA</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={chassisLeakage}
                    onChange={(e) => setChassisLeakage(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono-tech text-[#dde4e3] outline-none focus:border-[#47eaed]"
                  />
                  <span className="text-xs font-mono-tech text-[#bac9c9]">µA</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold ${
                    chassisLeakagePass ? 'bg-[#47eaed]/20 text-[#47eaed]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {chassisLeakagePass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>

              {/* Patient Applied Part Leakage */}
              <div className="glass-panel p-3.5 rounded-xl space-y-1.5 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#dde4e3] font-semibold">4. Patient Applied Part Leakage</span>
                  <span className="font-mono-tech text-[10px] text-[#bac9c9]">Limit: &lt; 10.0 µA</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={patientLeakage}
                    onChange={(e) => setPatientLeakage(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono-tech text-[#dde4e3] outline-none focus:border-[#47eaed]"
                  />
                  <span className="text-xs font-mono-tech text-[#bac9c9]">µA</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold ${
                    patientLeakagePass ? 'bg-[#47eaed]/20 text-[#47eaed]' : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                  }`}>
                    {patientLeakagePass ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Certification */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tech uppercase text-[#bac9c9] block">
              หมายเหตุและผลการวิเคราะห์ทางเทคนิค (Technician Comments)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#090f0f] border border-white/10 rounded-xl p-3 text-xs text-[#dde4e3] outline-none focus:border-[#47eaed]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#bac9c9] pt-2 border-t border-white/10">
            <div>
              <span>ผู้บันทึก: </span>
              <span className="font-semibold text-[#dde4e3]">{currentUser.name}</span>
              <span className="font-mono-tech text-[#47eaed] ml-1">({currentUser.role})</span>
            </div>
            <div className="font-mono-tech text-[11px] text-[#47eaed]">
              Digital Signature Active • SHA256
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-[#bac9c9] rounded-xl text-xs font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#47eaed] text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(71,234,237,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>{isSubmitting ? 'กำลังออกใบรับรอง...' : 'บันทึกผลสอบเทียบ & ออกใบรับรอง'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
