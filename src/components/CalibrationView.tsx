import React, { useState } from 'react';
import { MedicalDevice, CalibrationRecord, UserProfile } from '../types/medical';

interface CalibrationViewProps {
  devices: MedicalDevice[];
  records: CalibrationRecord[];
  currentUser: UserProfile;
  onOpenCalibrateModal: (device: MedicalDevice) => void;
  onOpenCertificateModal: (device: MedicalDevice) => void;
  onOpenLifespanModal: (device: MedicalDevice) => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  devices,
  records,
  currentUser,
  onOpenCalibrateModal,
  onOpenCertificateModal,
  onOpenLifespanModal
}) => {
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const pendingDevices = devices.filter(
    d => d.status === 'Expired' || d.status === 'Due Soon' || d.status === 'In-Transit'
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-tech text-xs uppercase tracking-wider text-[#47eaed]">
              International Medical Safety Testing
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
            <span className="text-xs text-[#bac9c9]">IEC 62353 / ISO 13485</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#dde4e3] tracking-tight">
            Calibration & Safety Inspection
          </h1>
          <p className="text-xs text-[#bac9c9]">
            ศูนย์ควบคุมการทดสอบทางวิศวกรรมชีวการแพทย์ การวัดความปลอดภัยทางไฟฟ้า และบันทึกประวัติการบำรุงรักษา
          </p>
        </div>

        {/* Standard pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#bac9c9] hidden lg:inline">มาตรฐาน:</span>
          <span className="px-3 py-1.5 rounded-lg bg-[#47eaed]/15 text-[#47eaed] text-xs font-mono-tech font-bold border border-[#47eaed]/30">
            IEC 62353:2014
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#4bc5ff]/15 text-[#4bc5ff] text-xs font-mono-tech font-bold border border-[#4bc5ff]/30">
            ISO 13485:2016
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-[#47eaed] text-black shadow-[0_0_15px_rgba(71,234,237,0.3)]'
              : 'text-[#bac9c9] hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-base">pending_actions</span>
          <span>รายการรอทดสอบ & สอบเทียบ ({pendingDevices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#47eaed] text-black shadow-[0_0_15px_rgba(71,234,237,0.3)]'
              : 'text-[#bac9c9] hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-base">history_edu</span>
          <span>ประวัติใบรับรองผลการทดสอบดิจิทัล ({records.length})</span>
        </button>
      </div>

      {/* Pending Queue Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDevices.map((device) => {
              const isExpired = device.status === 'Expired';
              return (
                <div
                  key={device.id}
                  className={`glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 border-l-4 ${
                    isExpired ? 'border-l-[#ffb4ab] active-glow-error' : 'border-l-[#4bc5ff]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono-tech text-xs font-bold text-[#47eaed]">{device.id}</span>
                      <h3 className="font-bold text-[#dde4e3] text-sm mt-0.5 leading-snug">{device.name}</h3>
                      <p className="text-xs text-[#bac9c9]">{device.model} • SN: {device.serialNumber}</p>
                    </div>
                    <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full ${
                      isExpired ? 'bg-[#ffb4ab]/15 text-[#ffb4ab]' : 'bg-[#4bc5ff]/15 text-[#4bc5ff]'
                    }`}>
                      {isExpired ? 'EXPIRED' : 'DUE SOON'}
                    </span>
                  </div>

                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#bac9c9]">สถานที่:</span>
                      <span className="text-[#dde4e3]">{device.facilityName} ({device.department})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#bac9c9]">มาตรฐานทดสอบ:</span>
                      <span className="font-mono-tech text-[#47eaed]">{device.safetyStandard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#bac9c9]">กำหนดสอบเทียบ:</span>
                      <span className={`font-mono-tech font-bold ${isExpired ? 'text-[#ffb4ab]' : 'text-[#4bc5ff]'}`}>
                        {device.nextCalibDate} ({device.daysRemaining > 0 ? `เหลือ ${device.daysRemaining} วัน` : `เลยกำหนด ${Math.abs(device.daysRemaining)} วัน`})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <button
                      onClick={() => onOpenLifespanModal(device)}
                      className="text-xs text-[#bac9c9] hover:text-[#4bc5ff] flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">timeline</span>
                      <span>วิเคราะห์อายุ ({device.aging.equipmentHealthScore}%)</span>
                    </button>

                    {(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN') && (
                      <button
                        onClick={() => onOpenCalibrateModal(device)}
                        className="px-4 py-1.5 bg-[#47eaed] text-black font-bold text-xs rounded-xl shadow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">fact_check</span>
                        <span>เริ่มการทดสอบ</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Records Tab */}
      {activeTab === 'history' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-[#dde4e3]">
              ประวัติการออกใบรับรองการสอบเทียบดิจิทัล (Digital Calibration Certificates)
            </h3>
            <span className="text-xs font-mono-tech text-[#47eaed]">
              IEC 62353 Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10 font-mono-tech text-[#bac9c9] text-[11px] uppercase">
                  <th className="px-5 py-3">เลขที่ใบรับรอง</th>
                  <th className="px-5 py-3">Asset ID / อุปกรณ์</th>
                  <th className="px-5 py-3">วันที่ทดสอบ</th>
                  <th className="px-5 py-3">ความปลอดภัยไฟฟ้า (IEC 62353)</th>
                  <th className="px-5 py-3">ผลการทดสอบ</th>
                  <th className="px-5 py-3">วิศวกรผู้ทดสอบ</th>
                  <th className="px-5 py-3 text-right">เอกสาร</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map((rec) => {
                  const targetDev = devices.find(d => d.id === rec.deviceId);
                  return (
                    <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono-tech font-bold text-[#47eaed]">
                        {rec.certificateNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-[#dde4e3] block">{rec.deviceId}</span>
                        <span className="text-[11px] text-[#bac9c9]">{targetDev?.name || 'Medical Instrument'}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono-tech text-[#bac9c9]">
                        {rec.testDate}
                      </td>
                      <td className="px-5 py-3.5 font-mono-tech text-[11px]">
                        <div>Earth: <span className="text-[#47eaed]">{rec.electricalSafety.earthBondOhm} Ω</span> (&lt;0.2Ω)</div>
                        <div>Insulation: <span className="text-[#47eaed]">{rec.electricalSafety.insulationMohm} MΩ</span> (&gt;2MΩ)</div>
                        <div>Leakage: <span className="text-[#47eaed]">{rec.electricalSafety.chassisLeakageUa} µA</span> (&lt;100µA)</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-[#47eaed]/20 text-[#47eaed] border border-[#47eaed]/40">
                          {rec.overallResult}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#bac9c9]">
                        <div>{rec.testedBy}</div>
                        <div className="text-[10px] text-[#47eaed] font-mono-tech">{rec.traceabilityId}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {targetDev && (
                          <button
                            onClick={() => onOpenCertificateModal(targetDev)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#47eaed]/15 text-[#47eaed] border border-[#47eaed]/30 font-medium transition-colors inline-flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">print</span>
                            <span>ดูใบรับรอง</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
