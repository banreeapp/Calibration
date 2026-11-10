import React, { useState } from 'react';
import { MedicalDevice, Department, DeviceStatus, UserProfile } from '../types/medical';
import { QRCodeModal } from './QRCodeModal';

interface InventoryViewProps {
  devices: MedicalDevice[];
  currentUser: UserProfile;
  onOpenNewDeviceModal: () => void;
  onOpenCalibrateModal: (device: MedicalDevice) => void;
  onOpenCertificateModal: (device: MedicalDevice) => void;
  onOpenLifespanModal: (device: MedicalDevice) => void;
  onOpenQRScanner: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  devices,
  currentUser,
  onOpenNewDeviceModal,
  onOpenCalibrateModal,
  onOpenCertificateModal,
  onOpenLifespanModal,
  onOpenQRScanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedDeviceForQR, setSelectedDeviceForQR] = useState<MedicalDevice | null>(null);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFacility = selectedFacility === 'all' || device.facilityId === selectedFacility;
    const matchesDept = selectedDepartment === 'all' || device.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;

    return matchesSearch && matchesFacility && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Search and Filter Section */}
      <div className="glass-card rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input with icon */}
          <div className="flex-1 flex items-center gap-3 bg-[#090f0f] border border-white/10 rounded-xl px-4 py-3 text-sm focus-within:border-[#47eaed] transition-colors">
            <span className="material-symbols-outlined text-[#bac9c9]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาอุปกรณ์ตามชื่อ, รหัสครุภัณฑ์, Serial Number หรือโมเดล..."
              className="bg-transparent border-none outline-none text-[#dde4e3] placeholder-[#bac9c9]/50 w-full text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[#bac9c9] hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* View mode toggle & QR button */}
          <div className="flex items-center gap-2">
            <div className="bg-[#090f0f] border border-white/10 p-1 rounded-xl flex items-center">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg text-xs font-mono-tech flex items-center gap-1 transition-all ${
                  viewMode === 'cards' 
                    ? 'bg-[#47eaed]/20 text-[#47eaed] shadow-sm' 
                    : 'text-[#bac9c9] hover:text-white'
                }`}
                title="มุมมองแบบการ์ดไฮเทค (Glass Cards)"
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-mono-tech flex items-center gap-1 transition-all ${
                  viewMode === 'table' 
                    ? 'bg-[#47eaed]/20 text-[#47eaed] shadow-sm' 
                    : 'text-[#bac9c9] hover:text-white'
                }`}
                title="มุมมองแบบตารางข้อมูล (Dense Table)"
              >
                <span className="material-symbols-outlined text-base">table_rows</span>
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            <button
              onClick={onOpenQRScanner}
              className="p-3 rounded-xl bg-[#47eaed]/10 hover:bg-[#47eaed]/20 border border-[#47eaed]/30 text-[#47eaed] transition-colors flex items-center gap-1.5"
              title="สแกนฉลาก QR Code เครื่องมือแพทย์"
            >
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
              <span className="hidden sm:inline text-xs font-mono-tech">Scan QR</span>
            </button>

            {(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN') && (
              <button
                onClick={onOpenNewDeviceModal}
                className="px-4 py-3 rounded-xl bg-[#00ced1] hover:bg-[#47eaed] text-black font-bold text-xs font-display flex items-center gap-1.5 shadow-[0_0_20px_rgba(71,234,237,0.3)] transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>ลงทะเบียนเครื่องมือ</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
          {/* Facility Filter */}
          <div>
            <label className="text-[10px] font-mono-tech uppercase text-[#bac9c9]/70 mb-1 block">
              สถานพยาบาล (Facility)
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#dde4e3] outline-none focus:border-[#47eaed]"
            >
              <option value="all">ทุกสถานพยาบาลในอำเภอดอนพุด</option>
              <option value="donphut-hospital">โรงพยาบาลดอนพุด (รพช. 30 เตียง)</option>
              <option value="donphut-subdistrict">PCU ดอนพุด</option>
              <option value="phailiu-subdistrict">รพ.สต.ไผ่หลิ่ว</option>
              <option value="banluang-subdistrict">รพ.สต.บ้านหลวง</option>
              <option value="dongnoi-subdistrict">รพ.สต.ดงตะงาว</option>
              <option value="banree-subdistrict">รพ.สต.บ้านรี</option>
              <option value="nongnmon-subdistrict">รพ.สต.บ้านหนองมน</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="text-[10px] font-mono-tech uppercase text-[#bac9c9]/70 mb-1 block">
              แผนก / หน่วยงาน (Department)
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#dde4e3] outline-none focus:border-[#47eaed]"
            >
              <option value="all">ทุกแผนกการแพทย์</option>
              <option value="Cardiology Unit">Cardiology Unit (หน่วยหัวใจ)</option>
              <option value="Intensive Care (ICU)">Intensive Care (ICU)</option>
              <option value="Emergency Room (ER)">Emergency Room (ER ฉุกเฉิน)</option>
              <option value="Radiology">Radiology (รังสีวิทยา)</option>
              <option value="Hematology Lab">Hematology Lab (ห้องปฏิบัติการ)</option>
              <option value="Oncology">Oncology (เคมีบำบัด)</option>
              <option value="Sub-district Primary Care">Sub-district Primary Care (รพ.สต.)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-mono-tech uppercase text-[#bac9c9]/70 mb-1 block">
              สถานะรอบการสอบเทียบ (Status)
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#090f0f] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#dde4e3] outline-none focus:border-[#47eaed]"
            >
              <option value="all">ทุกสถานะ (All Status)</option>
              <option value="Optimal">Optimal (ปกติ / สอบเทียบแล้ว)</option>
              <option value="Due Soon">Due Soon (ใกล้ถึงรอบ &lt; 60 วัน)</option>
              <option value="Expired">Expired (หมดอายุ / เร่งด่วน)</option>
              <option value="In-Transit">In-Transit (กำลังส่งสอบเทียบภายนอก)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header Counter & Active Units Pill */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#dde4e3] tracking-tight">
            Device Inventory
          </h2>
          <p className="text-xs text-[#bac9c9]">
            ทะเบียนเครื่องมือและอุปกรณ์ทางการแพทย์ ประจำสถานบริการในเขตอำเภอดอนพุด
          </p>
        </div>
        <span className="font-mono-tech text-xs tracking-wider uppercase text-[#47eaed] bg-[#47eaed]/10 px-3 py-1.5 rounded-full border border-[#47eaed]/30 font-bold">
          {filteredDevices.length} ACTIVE UNITS
        </span>
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-[#bac9c9]/40">search_off</span>
          <h3 className="font-display text-lg font-bold text-[#dde4e3]">ไม่พบรายการอุปกรณ์ที่ค้นหา</h3>
          <p className="text-xs text-[#bac9c9] max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองแผนกและสถานพยาบาล
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFacility('all');
              setSelectedDepartment('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#47eaed] rounded-lg border border-[#47eaed]/30"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* View Mode: Cards (Matching user Image 1) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDevices.map((device) => {
            const isExpired = device.status === 'Expired';
            const isOptimal = device.status === 'Optimal';
            const isDueSoon = device.status === 'Due Soon';
            const isInTransit = device.status === 'In-Transit';

            let borderClass = 'border-l-4 border-l-[#47eaed]';
            let statusBadge = (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#47eaed]/10 border border-[#47eaed]/30">
                <span className="w-2 h-2 rounded-full bg-[#47eaed]"></span>
                <span className="font-mono-tech text-[11px] text-[#47eaed] font-bold">OPTIMAL</span>
              </div>
            );

            if (isExpired) {
              borderClass = 'border-l-4 border-l-[#ffb4ab] active-glow-error';
              statusBadge = (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb4ab]/15 border border-[#ffb4ab]/30">
                  <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                  <span className="font-mono-tech text-[11px] text-[#ffb4ab] font-bold">EXPIRED</span>
                </div>
              );
            } else if (isDueSoon) {
              borderClass = 'border-l-4 border-l-[#4bc5ff] active-glow-warning';
              statusBadge = (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4bc5ff]/15 border border-[#4bc5ff]/30">
                  <span className="w-2 h-2 rounded-full bg-[#4bc5ff]"></span>
                  <span className="font-mono-tech text-[11px] text-[#4bc5ff] font-bold">DUE SOON</span>
                </div>
              );
            } else if (isInTransit) {
              borderClass = 'border-l-4 border-l-[#bec6e0]';
              statusBadge = (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bec6e0]/15 border border-[#bec6e0]/30">
                  <span className="w-2 h-2 rounded-full bg-[#bec6e0]"></span>
                  <span className="font-mono-tech text-[11px] text-[#bec6e0] font-bold">IN-TRANSIT</span>
                </div>
              );
            }

            return (
              <div
                key={device.id}
                className={`glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-white/30 hover:scale-[1.01] ${borderClass}`}
              >
                {/* Card Top */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#242b2b] flex items-center justify-center text-[#47eaed] flex-shrink-0 shadow-inner">
                      <span className="material-symbols-outlined text-2xl">
                        {device.name.toLowerCase().includes('monitor') ? 'monitor_heart' :
                         device.name.toLowerCase().includes('ventilator') ? 'ventilator' :
                         device.name.toLowerCase().includes('ecg') ? 'ecg' :
                         device.name.toLowerCase().includes('pump') ? 'vaccines' :
                         device.name.toLowerCase().includes('mri') || device.name.toLowerCase().includes('ultra') ? 'radiology' :
                         'biotech'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tech text-xs text-[#47eaed] font-bold">{device.id}</span>
                        <span className="text-[10px] text-[#bac9c9]/60 truncate">{device.facilityName}</span>
                      </div>
                      <h3 className="font-display text-base font-bold text-[#dde4e3] leading-snug truncate">
                        {device.name}
                      </h3>
                      <p className="text-xs text-[#bac9c9] truncate mt-0.5">
                        Model: <span className="font-mono-tech text-[#dde4e3]">{device.model}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    {statusBadge}
                  </div>
                </div>

                {/* Card Middle: Thai name & standard info */}
                <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 text-xs flex items-center justify-between">
                  <span className="text-[#bac9c9] truncate max-w-[200px]">{device.nameTh}</span>
                  <span className="text-[11px] font-mono-tech text-[#47eaed] bg-[#47eaed]/10 px-2 py-0.5 rounded">
                    Health {device.aging.equipmentHealthScore}%
                  </span>
                </div>

                {/* Card Grid Details matching user Image 1 */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <p className="font-mono-tech text-[10px] text-[#bac9c9]/70 uppercase tracking-wider mb-0.5">
                      {isExpired ? 'Last Calib' : isDueSoon ? 'Due In' : 'Next Calib'}
                    </p>
                    <p className={`font-mono-tech font-bold ${
                      isExpired ? 'text-[#ffb4ab]' : isDueSoon ? 'text-[#4bc5ff]' : 'text-[#dde4e3]'
                    }`}>
                      {isExpired 
                        ? device.lastCalibDate 
                        : isDueSoon 
                          ? `${device.daysRemaining} Days` 
                          : device.nextCalibDate}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono-tech text-[10px] text-[#bac9c9]/70 uppercase tracking-wider mb-0.5">
                      {isExpired ? 'Serial Num' : 'Department'}
                    </p>
                    <p className="font-mono-tech font-bold text-[#dde4e3] truncate">
                      {isExpired ? device.serialNumber : device.department}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenCertificateModal(device)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#dde4e3] flex items-center gap-1 transition-colors"
                      title="เปิดใบรับรองผลการทดสอบ (IEC 62353)"
                    >
                      <span className="material-symbols-outlined text-sm text-[#47eaed]">verified</span>
                      <span className="text-[11px]">Cert</span>
                    </button>

                    <button
                      onClick={() => onOpenLifespanModal(device)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#dde4e3] flex items-center gap-1 transition-colors"
                      title="วิเคราะห์แนวโน้มอายุการใช้งาน (Aging Prediction)"
                    >
                      <span className="material-symbols-outlined text-sm text-[#4bc5ff]">analytics</span>
                      <span className="text-[11px]">อายุใช้งาน</span>
                    </button>

                    <button
                      onClick={() => setSelectedDeviceForQR(device)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#47eaed]/10 hover:bg-[#47eaed]/20 text-[#47eaed] text-xs flex items-center gap-1 transition-all border border-[#47eaed]/30"
                      title="สร้างและดาวน์โหลดป้าย QR Code (PNG) สำหรับครุภัณฑ์"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      <span className="text-[11px] font-mono-tech font-bold">QR Tag</span>
                    </button>
                  </div>

                  {(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN') && (
                    <button
                      onClick={() => onOpenCalibrateModal(device)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#47eaed] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(71,234,237,0.3)]"
                    >
                      <span className="material-symbols-outlined text-sm">tune</span>
                      <span>สอบเทียบ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: Table */}
      {viewMode === 'table' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10 font-mono-tech text-[#bac9c9] uppercase tracking-wider text-[11px]">
                  <th className="px-5 py-3.5">Asset ID</th>
                  <th className="px-5 py-3.5">เครื่องมือแพทย์</th>
                  <th className="px-5 py-3.5">โมเดล / S/N</th>
                  <th className="px-5 py-3.5">แผนก / สถานพยาบาล</th>
                  <th className="px-5 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5">รอบถัดไป</th>
                  <th className="px-5 py-3.5">Health Score</th>
                  <th className="px-5 py-3.5 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDevices.map((device) => {
                  return (
                    <tr key={device.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-mono-tech font-bold text-[#47eaed]">
                        {device.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#dde4e3]">
                        <div>{device.name}</div>
                        <div className="text-[11px] text-[#bac9c9]/60">{device.nameTh}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[#bac9c9] font-mono-tech">
                        <div>{device.model}</div>
                        <div className="text-[10px] text-[#bac9c9]/60">SN: {device.serialNumber}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[#bac9c9]">
                        <div>{device.department}</div>
                        <div className="text-[10px] text-[#bac9c9]/60">{device.facilityName}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-bold ${
                          device.status === 'Optimal' ? 'bg-[#47eaed]/15 text-[#47eaed]' :
                          device.status === 'Due Soon' ? 'bg-[#4bc5ff]/15 text-[#4bc5ff]' :
                          device.status === 'Expired' ? 'bg-[#ffb4ab]/15 text-[#ffb4ab]' :
                          'bg-[#bec6e0]/15 text-[#bec6e0]'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono-tech text-[#dde4e3]">
                        {device.nextCalibDate}
                      </td>
                      <td className="px-5 py-3.5 font-mono-tech text-[#47eaed]">
                        {device.aging.equipmentHealthScore}%
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDeviceForQR(device)}
                            className="p-1 text-[#bac9c9] hover:text-[#47eaed]"
                            title="สร้างและดาวน์โหลดป้าย QR Code (PNG)"
                          >
                            <span className="material-symbols-outlined text-base">qr_code_2</span>
                          </button>
                          <button
                            onClick={() => onOpenCertificateModal(device)}
                            className="p-1 hover:text-[#47eaed]"
                            title="ดูใบรับรอง"
                          >
                            <span className="material-symbols-outlined text-base">verified</span>
                          </button>
                          <button
                            onClick={() => onOpenLifespanModal(device)}
                            className="p-1 hover:text-[#4bc5ff]"
                            title="วิเคราะห์อายุการใช้งาน"
                          >
                            <span className="material-symbols-outlined text-base">monitoring</span>
                          </button>
                          {(currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN') && (
                            <button
                              onClick={() => onOpenCalibrateModal(device)}
                              className="px-2 py-1 bg-[#47eaed]/15 hover:bg-[#47eaed] text-[#47eaed] hover:text-black rounded text-[11px] font-bold ml-1 transition-all"
                            >
                              สอบเทียบ
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* High-Resolution QR Code & Asset Tag Modal (powered by 'qrcode' library) */}
      <QRCodeModal
        device={selectedDeviceForQR}
        isOpen={selectedDeviceForQR !== null}
        onClose={() => setSelectedDeviceForQR(null)}
      />
    </div>
  );
};
