import React, { useState } from 'react';
import { MedicalDevice } from '../types/medical';

interface QRScannerModalProps {
  devices: MedicalDevice[];
  isOpen: boolean;
  onClose: () => void;
  onSelectScannedDevice: (device: MedicalDevice) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  devices,
  isOpen,
  onClose,
  onSelectScannedDevice
}) => {
  if (!isOpen) return null;

  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<string | null>(null);

  const handleSimulateScan = (device: MedicalDevice) => {
    setScanStatus(`สแกนพบอุปกรณ์: ${device.id} (${device.name})`);
    setTimeout(() => {
      onSelectScannedDevice(device);
      onClose();
    }, 600);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = devices.find(
      d => d.id.toLowerCase() === manualCode.trim().toLowerCase() ||
           d.serialNumber.toLowerCase() === manualCode.trim().toLowerCase()
    );

    if (found) {
      handleSimulateScan(found);
    } else {
      alert(`ไม่พบอุปกรณ์ที่ตรงกับรหัส "${manualCode}" ในฐานข้อมูลอำเภอดอนพุด`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card-elevated max-w-md w-full rounded-2xl border border-white/20 p-6 space-y-6 shadow-2xl relative text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#47eaed]">qr_code_scanner</span>
            <span className="font-mono-tech text-xs text-[#47eaed] font-bold">
              SCAN MEDICAL ASSET QR TAG
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-[#bac9c9] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Viewfinder Canvas Simulation */}
        <div className="relative aspect-square max-w-[280px] mx-auto bg-[#090f0f] rounded-2xl overflow-hidden border-2 border-[#47eaed]/40 flex items-center justify-center shadow-[0_0_30px_rgba(71,234,237,0.15)]">
          {/* Laser scanning line animation */}
          <div className="absolute inset-x-0 h-0.5 bg-[#47eaed] shadow-[0_0_12px_#47eaed] animate-[bounce_3s_infinite]"></div>

          {/* Corner viewfinder brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#47eaed]"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#47eaed]"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#47eaed]"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#47eaed]"></div>

          <div className="text-center p-4 space-y-2">
            <span className="material-symbols-outlined text-5xl text-[#47eaed]/60 animate-pulse">
              barcode_scanner
            </span>
            <p className="text-xs text-[#bac9c9]">
              เล็งกล้องไปที่ป้าย QR Code บนตัวเครื่องมือแพทย์
            </p>
          </div>

          {scanStatus && (
            <div className="absolute bottom-3 inset-x-3 p-2 bg-[#47eaed] text-black font-mono-tech text-xs font-bold rounded-lg shadow animate-fade-in">
              {scanStatus}
            </div>
          )}
        </div>

        {/* Quick Simulated Asset Barcodes */}
        <div className="space-y-2 text-left">
          <p className="text-[11px] font-mono-tech uppercase text-[#bac9c9]">
            หรือคลิกเพื่อทดสอบจำลองการสแกนป้าย (Quick Tap):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
            {devices.slice(0, 6).map((device) => (
              <button
                key={device.id}
                onClick={() => handleSimulateScan(device)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#47eaed]/20 border border-white/10 text-xs font-mono-tech text-[#dde4e3] hover:text-[#47eaed] transition-colors truncate max-w-[170px]"
                title={device.name}
              >
                {device.id} ({device.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Manual Serial Search */}
        <form onSubmit={handleManualSearch} className="flex gap-2 pt-2 border-t border-white/10">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="ป้อนรหัสครุภัณฑ์ หรือ Serial No..."
            className="flex-1 bg-[#090f0f] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono-tech text-[#dde4e3] outline-none focus:border-[#47eaed]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#47eaed] text-black font-bold text-xs rounded-xl hover:brightness-110 active:scale-95"
          >
            ค้นหา
          </button>
        </form>
      </div>
    </div>
  );
};
