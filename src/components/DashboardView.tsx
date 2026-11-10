import React, { useState, useEffect } from 'react';
import { MedicalDevice, UserProfile } from '../types/medical';

interface DashboardViewProps {
  devices: MedicalDevice[];
  currentUser: UserProfile;
  onSelectDevice: (device: MedicalDevice) => void;
  onOpenNewDeviceModal: () => void;
  onOpenCalibrateModal: (device: MedicalDevice) => void;
  onOpenCertificateModal: (device: MedicalDevice) => void;
  onOpenLifespanModal: (device: MedicalDevice) => void;
  onNavigateToTab: (tab: any) => void;
  onSyncGoogleSheets: () => void;
  isSyncingSheets: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  devices,
  currentUser,
  onSelectDevice,
  onOpenNewDeviceModal,
  onOpenCalibrateModal,
  onOpenCertificateModal,
  onOpenLifespanModal,
  onNavigateToTab,
  onSyncGoogleSheets,
  isSyncingSheets
}) => {
  // NIST Sync Countdown Timer
  const [countdownSeconds, setCountdownSeconds] = useState(51728); // ~14:22:08
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<string>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredDevices = selectedFacilityFilter === 'all'
    ? devices
    : devices.filter(d => d.facilityId === selectedFacilityFilter);

  const normalCount = filteredDevices.filter(d => d.status === 'Optimal').length;
  const pendingCount = filteredDevices.filter(d => d.status === 'Due Soon').length;
  const expiredCount = filteredDevices.filter(d => d.status === 'Expired').length;

  const urgentDevices = filteredDevices
    .filter(d => d.status === 'Expired' || d.status === 'Due Soon')
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const handlePrintAuditPack = () => {
    setExportNotice('กำลังเตรียมเอกสารชุดตรวจประเมิน ISO 13485:2016 สำหรับสถานพยาบาลอำเภอดอนพุด...');
    setTimeout(() => {
      window.print();
      setExportNotice(null);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-tech text-xs uppercase tracking-wider text-[#47eaed]">
              Don Phut District Healthcare Network
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
            <span className="text-xs text-[#bac9c9]">สระบุรี</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#dde4e3] tracking-tight">
            System Overview
          </h1>
          <p className="text-[#bac9c9] text-sm mt-1">
            ระบบติดตามสถานะการสอบเทียบเครื่องมือแพทย์แบบเรียลไทม์ และมาตรฐานความปลอดภัยสากล
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Facility Filter Pills */}
          <select
            value={selectedFacilityFilter}
            onChange={(e) => setSelectedFacilityFilter(e.target.value)}
            className="bg-[#161d1d] border border-white/10 rounded-lg text-xs text-[#dde4e3] px-3 py-2.5 outline-none focus:border-[#47eaed] transition-colors"
          >
            <option value="all">ทุกสถานพยาบาลในอำเภอดอนพุด (7 แห่ง)</option>
            <option value="donphut-hospital">โรงพยาบาลดอนพุด (รพช. 30 เตียง / แม่ข่าย)</option>
            <option value="donphut-subdistrict">PCU ดอนพุด</option>
            <option value="phailiu-subdistrict">รพ.สต.ไผ่หลิ่ว</option>
            <option value="banluang-subdistrict">รพ.สต.บ้านหลวง</option>
            <option value="dongnoi-subdistrict">รพ.สต.ดงตะงาว</option>
            <option value="banree-subdistrict">รพ.สต.บ้านรี</option>
            <option value="nongnmon-subdistrict">รพ.สต.บ้านหนองมน</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#dde4e3] px-4 py-2.5 rounded-lg text-xs font-mono-tech flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-base">ios_share</span>
              <span>Export Reports</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 glass-card-elevated rounded-xl p-2 z-50 border border-white/20 shadow-2xl space-y-1">
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onSyncGoogleSheets();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs flex items-center gap-2.5 text-[#85e0a3]"
                  >
                    <span className="material-symbols-outlined text-sm">table_chart</span>
                    <span>ส่งออกไปยัง Google Sheets ทันที</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      handlePrintAuditPack();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs flex items-center gap-2.5 text-[#dde4e3]"
                  >
                    <span className="material-symbols-outlined text-sm text-[#47eaed]">description</span>
                    <span>พิมพ์รายงานสรุปผลสอบเทียบ (PDF)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onNavigateToTab('compliance');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs flex items-center gap-2.5 text-[#ffb4ab]"
                  >
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>ส่งออกเฉพาะรายการหมดอายุ (Out of Spec)</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* New Audit / Add Device button (Allowed for Admin & Tech) */}
          {(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN') && (
            <button
              onClick={onOpenNewDeviceModal}
              className="bg-gradient-to-r from-[#00ced1] to-[#47eaed] text-black font-bold px-5 py-2.5 rounded-lg text-xs font-display flex items-center gap-2 shadow-[0_0_20px_rgba(71,234,237,0.3)] hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>ลงทะเบียนเครื่องมือแพทย์ใหม่</span>
            </button>
          )}
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-[#47eaed]/10 border border-[#47eaed]/30 rounded-xl text-xs text-[#47eaed] flex items-center gap-2 animate-pulse">
          <span className="material-symbols-outlined text-sm">sync</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Summary Stats Cards (Bento 3 columns) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Normal Status */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-[#47eaed]/40 transition-all border-l-4 border-l-[#47eaed] active-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-[#47eaed]">check_circle</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#47eaed]/15 flex items-center justify-center text-[#47eaed]">
                <span className="material-symbols-outlined text-xl material-symbols-fill">verified_user</span>
              </div>
              <span className="font-mono-tech text-xs uppercase tracking-wider text-[#bac9c9]">Normal Status</span>
            </div>
            <span className="font-mono-tech text-xs text-[#47eaed] bg-[#47eaed]/15 px-2.5 py-1 rounded-full font-bold">
              ACTIVE
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl md:text-5xl font-extrabold text-[#47eaed]">
              {normalCount.toLocaleString()}
            </span>
            <span className="text-sm font-mono-tech text-[#47eaed] flex items-center">
              ↑ 4% <span className="text-xs text-[#bac9c9] ml-1">Assets</span>
            </span>
          </div>
          <p className="text-xs text-[#bac9c9]/70 mt-2">
            เครื่องมือแพทย์ผ่านการทดสอบและอยู่ในเกณฑ์มาตรฐานความปลอดภัย
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#47eaed]">
            <span className="w-2 h-2 rounded-full bg-[#47eaed] animate-pulse"></span>
            <span>All systems operational & NIST traceable</span>
          </div>
        </div>

        {/* Card 2: Pending Calibration (<60 Days) */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-[#4bc5ff]/40 transition-all border-l-4 border-l-[#4bc5ff]">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-[#4bc5ff]">schedule</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4bc5ff]/15 flex items-center justify-center text-[#4bc5ff]">
                <span className="material-symbols-outlined text-xl">pending_actions</span>
              </div>
              <span className="font-mono-tech text-xs uppercase tracking-wider text-[#bac9c9]">Pending Calibration</span>
            </div>
            <span className="font-mono-tech text-xs text-[#4bc5ff] bg-[#4bc5ff]/15 px-2.5 py-1 rounded-full font-bold">
              60 DAYS
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl md:text-5xl font-extrabold text-[#4bc5ff]">
              {pendingCount}
            </span>
            <span className="text-sm font-mono-tech text-[#4bc5ff]">
              Scheduled <span className="text-xs text-[#bac9c9]">Units</span>
            </span>
          </div>
          <p className="text-xs text-[#bac9c9]/70 mt-2">
            ถึงรอบนัดสอบเทียบประจำปีภายใน 60 วันข้างหน้า
          </p>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4bc5ff] rounded-full shadow-[0_0_10px_rgba(75,197,255,0.4)] transition-all"
              style={{ width: `${Math.min(100, (pendingCount / (filteredDevices.length || 1)) * 100 * 2)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Expired Assets (Critical) */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-[#ffb4ab]/40 transition-all border-l-4 border-l-[#ffb4ab] active-glow-error">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-7xl text-[#ffb4ab]">warning</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffb4ab]/15 flex items-center justify-center text-[#ffb4ab]">
                <span className="material-symbols-outlined text-xl material-symbols-fill">warning</span>
              </div>
              <span className="font-mono-tech text-xs uppercase tracking-wider text-[#bac9c9]">Expired Assets</span>
            </div>
            <span className="font-mono-tech text-xs text-[#ffb4ab] bg-[#ffb4ab]/15 px-2.5 py-1 rounded-full font-bold animate-pulse">
              CRITICAL
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl md:text-5xl font-extrabold text-[#ffb4ab]">
              {expiredCount}
            </span>
            <span className="text-sm font-mono-tech text-[#ffb4ab]">
              Out of Spec
            </span>
          </div>
          <p className="text-xs text-[#bac9c9]/70 mt-2">
            หมดอายุการสอบเทียบ ต้องงดใช้งานชั่วคราวตามมาตรฐาน HA / PDPA
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#ffb4ab]">
            <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping"></span>
            <span>Immediate Attention Required (ระงับใช้เพื่อความปลอดภัย)</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Urgent Tasks Table + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Urgent Calibration Tasks (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#47eaed]">notification_important</span>
                  <h2 className="font-display text-xl font-bold text-[#dde4e3]">
                    Urgent Calibration Tasks
                  </h2>
                </div>
                <p className="text-xs text-[#bac9c9] mt-0.5">
                  คิวความสำคัญเร่งด่วนสำหรับการสอบเทียบและตรวจสอบความปลอดภัยไฟฟ้า (Priority Queue)
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('inventory')}
                className="text-xs font-mono-tech text-[#47eaed] hover:underline flex items-center gap-1"
              >
                <span>ดูทะเบียนทั้งหมด ({filteredDevices.length})</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-[11px] font-mono-tech text-[#bac9c9] uppercase tracking-wider">
                    <th className="px-6 py-3.5">Asset ID</th>
                    <th className="px-6 py-3.5">Equipment Name</th>
                    <th className="px-6 py-3.5">Department / รพ.</th>
                    <th className="px-6 py-3.5">Due Date</th>
                    <th className="px-6 py-3.5">Risk & Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {urgentDevices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-[#bac9c9]/60">
                        <span className="material-symbols-outlined text-4xl text-[#47eaed] mb-2 block">task_alt</span>
                        ไม่มีรายการเร่งด่วนในขณะนี้ อุปกรณ์ทุกชิ้นอยู่ในรอบปกติ
                      </td>
                    </tr>
                  ) : (
                    urgentDevices.slice(0, 5).map((device) => {
                      const isExpired = device.status === 'Expired';
                      return (
                        <tr key={device.id} className="hover:bg-white/[0.03] transition-colors group">
                          {/* Asset ID */}
                          <td className="px-6 py-4 font-mono-tech font-bold text-[#47eaed] whitespace-nowrap">
                            {device.id}
                          </td>

                          {/* Equipment Name */}
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#dde4e3] group-hover:text-[#47eaed] transition-colors">
                              {device.name}
                            </div>
                            <div className="text-xs text-[#bac9c9]/70">
                              {device.model} • S/N: {device.serialNumber}
                            </div>
                          </td>

                          {/* Department */}
                          <td className="px-6 py-4 text-xs text-[#bac9c9]">
                            <div className="text-[#dde4e3]">{device.department}</div>
                            <div className="text-[11px] text-[#bac9c9]/60">{device.facilityName}</div>
                          </td>

                          {/* Due Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isExpired ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tech font-bold bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                                EXPIRED ({Math.abs(device.daysRemaining)}d ago)
                              </span>
                            ) : (
                              <span className="text-xs font-mono-tech text-[#4bc5ff]">
                                {device.daysRemaining} Days
                              </span>
                            )}
                          </td>

                          {/* Risk */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-[#bac9c9] flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${
                                device.riskClass.includes('Class III') 
                                  ? 'bg-[#ffb4ab]' 
                                  : device.riskClass.includes('Class II') 
                                    ? 'bg-[#4bc5ff]' 
                                    : 'bg-[#47eaed]'
                              }`}></span>
                              <span>{device.riskClass.split(' ')[0]}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {/* Calibrate action button */}
                              <button
                                onClick={() => onOpenCalibrateModal(device)}
                                className="px-3 py-1.5 rounded-lg bg-[#47eaed]/15 hover:bg-[#47eaed] text-[#47eaed] hover:text-black font-semibold text-xs transition-all active:scale-95 flex items-center gap-1"
                                title="บันทึกผลการสอบเทียบ IEC 62353"
                              >
                                <span className="material-symbols-outlined text-sm">build</span>
                                <span>{isExpired ? 'สอบเทียบด่วน' : 'ทดสอบ'}</span>
                              </button>

                              {/* Certificate / Details */}
                              <button
                                onClick={() => onOpenCertificateModal(device)}
                                className="p-1.5 rounded-lg text-[#bac9c9] hover:text-[#47eaed] hover:bg-white/5 transition-colors"
                                title="ดูใบรับรองการสอบเทียบ"
                              >
                                <span className="material-symbols-outlined text-base">verified</span>
                              </button>

                              {/* Aging / Lifespan */}
                              <button
                                onClick={() => onOpenLifespanModal(device)}
                                className="p-1.5 rounded-lg text-[#bac9c9] hover:text-[#4bc5ff] hover:bg-white/5 transition-colors"
                                title="วิเคราะห์แนวโน้มอายุการใช้งาน"
                              >
                                <span className="material-symbols-outlined text-base">timeline</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="p-4 px-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs text-[#bac9c9]">
            <span>แสดง {Math.min(5, urgentDevices.length)} จากทั้งหมด {urgentDevices.length} รายการที่ต้องติดตาม</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span> หมดอายุ ({expiredCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4bc5ff]"></span> ใกล้ถึงกำหนด ({pendingCount})
              </span>
            </div>
          </div>
        </div>

        {/* Right Bento Column: NIST Sync + Upcoming Audit (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* NIST Reference Sync Card (Matching Image 5) */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col relative group">
            <div className="h-40 relative overflow-hidden">
              <img
                src="/assets/aistudio/Image_5_49633a89.png"
                alt="Precision Lab Equipment"
                className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1515] via-[#0e1515]/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <span className="text-[10px] font-mono-tech uppercase bg-[#47eaed]/20 text-[#47eaed] px-2.5 py-1 rounded-md border border-[#47eaed]/30 backdrop-blur-md">
                  Lab A-4 • รพ.ดอนพุด
                </span>
                <span className="text-[10px] font-mono-tech text-[#dde4e3] bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                  NIMT Traceable
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-[#dde4e3]">
                  Next NIST Reference Sync
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#47eaed] animate-ping"></span>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4bc5ff] text-2xl">timer</span>
                <span className="font-mono-tech text-3xl font-extrabold text-[#47eaed] tracking-wider">
                  {formatTimer(countdownSeconds)}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#00ced1] to-[#4bc5ff] h-full w-2/3 animate-pulse"></div>
              </div>

              <p className="text-[11px] text-[#bac9c9]/70 leading-relaxed">
                การซิงโครไนซ์ค่ามาตรฐานอ้างอิงกับสถาบันมาตรวิทยาแห่งชาติ (NIMT) และ NIST เพื่อความเที่ยงตรงระดับสากล
              </p>
            </div>
          </div>

          {/* Upcoming ISO 13485:2016 Audit Card (Matching Image 10) */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#dde4e3]">
                Upcoming Quality Audit
              </h3>
              <span className="text-[10px] font-mono-tech text-[#47eaed] bg-[#47eaed]/15 px-2 py-0.5 rounded">
                HA / ISO
              </span>
            </div>

            <div className="bg-[#47eaed]/5 border border-[#47eaed]/20 p-4 rounded-xl">
              <p className="text-[10px] font-mono-tech text-[#47eaed] uppercase">External Quality Audit</p>
              <p className="text-base font-bold text-[#dde4e3] mt-0.5">ISO 13485:2016 Review</p>
              <p className="text-xs text-[#bac9c9] mt-2">
                กำหนดการตรวจประเมินในอีก <span className="text-[#47eaed] font-bold font-mono-tech">14 Days</span>
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#bac9c9]">Device Calibration Rate</span>
                  <span className="font-mono-tech font-bold text-[#47eaed]">92%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#47eaed] w-[92%] rounded-full shadow-[0_0_10px_rgba(71,234,237,0.3)]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#bac9c9]">Documentation Completion</span>
                  <span className="font-mono-tech font-bold text-[#4bc5ff]">88%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4bc5ff] w-[88%] rounded-full shadow-[0_0_10px_rgba(75,197,255,0.3)]"></div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePrintAuditPack}
              className="w-full mt-2 bg-transparent hover:bg-[#47eaed]/10 border border-[#47eaed]/40 text-[#47eaed] py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">folder_zip</span>
              <span>Prepare Audit Pack (จัดเตรียมเอกสารตรวจรับ)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Health 6-Month Chart (Matching Image 10) */}
      <section className="glass-card p-6 md:p-8 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-[#dde4e3]">
              Compliance Health & District Performance
            </h3>
            <p className="text-xs text-[#bac9c9] mt-0.5">
              แนวโน้มอัตราการสอบเทียบตามรอบของสถานบริการในเครือข่ายอำเภอดอนพุด ย้อนหลัง 6 เดือน
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#bac9c9]">เกณฑ์มาตรฐานขั้นต่ำ: 90%</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#47eaed]"></span>
          </div>
        </div>

        {/* CSS Glass Chart */}
        <div className="flex items-end gap-3 sm:gap-6 h-48 pt-6 border-b border-white/10 pb-4">
          {[
            { month: 'SEP', rate: 60, status: '60%' },
            { month: 'OCT', rate: 75, status: '75%' },
            { month: 'NOV', rate: 45, status: '45%' },
            { month: 'DEC', rate: 90, status: '90%' },
            { month: 'JAN', rate: 85, status: '85%' },
            { month: 'FEB', rate: 95, status: '95% (Now)' }
          ].map((bar, i) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-mono-tech text-[#47eaed] opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.status}
              </span>
              <div className="w-full bg-white/5 rounded-t-lg relative h-full flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-t-lg transition-all duration-700 ${
                    i === 5
                      ? 'bg-gradient-to-t from-[#00ced1] to-[#47eaed] shadow-[0_0_15px_rgba(71,234,237,0.4)]'
                      : 'bg-[#47eaed]/30 group-hover:bg-[#47eaed]/60'
                  }`}
                  style={{ height: `${bar.rate}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-mono-tech text-[#bac9c9] group-hover:text-white transition-colors">
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
