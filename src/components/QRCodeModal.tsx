import React, { useState, useEffect } from 'react';
import { MedicalDevice } from '../types/medical';
import { 
  generateAssetUrlQRCodeDataURL, 
  generateDownloadableAssetTagPNG, 
  downloadPNGDataURL 
} from '../services/qrGenerator';

interface QRCodeModalProps {
  device: MedicalDevice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  device,
  isOpen,
  onClose
}) => {
  if (!isOpen || !device) return null;

  const [tagTheme, setTagTheme] = useState<'medical-dark' | 'clinical-white'>('medical-dark');
  const [standaloneQRDataUrl, setStandaloneQRDataUrl] = useState<string>('');
  const [assetTagDataUrl, setAssetTagDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'tag' | 'qr'>('tag');

  // Build canonical asset URL
  const baseUrl = window.location.origin;
  const assetUrl = `${baseUrl}/#device=${encodeURIComponent(device.id)}&facility=${encodeURIComponent(device.facilityId)}`;

  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    async function generateQRCodes() {
      try {
        const qrUrl = await generateAssetUrlQRCodeDataURL(assetUrl, { width: 360 });
        const tagUrl = await generateDownloadableAssetTagPNG(device!, assetUrl, tagTheme);

        if (isMounted) {
          setStandaloneQRDataUrl(qrUrl);
          setAssetTagDataUrl(tagUrl);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error('Failed to generate QR code PNG:', err);
        if (isMounted) setIsGenerating(false);
      }
    }

    generateQRCodes();

    return () => {
      isMounted = false;
    };
  }, [device, tagTheme, assetUrl]);

  const handleDownloadAssetTagPNG = () => {
    if (!assetTagDataUrl) return;
    const cleanId = device.id.replace('#', '').replace(/\s+/g, '-');
    const cleanSn = device.serialNumber.replace(/\s+/g, '-');
    const filename = `CLINICAL-TAG-${cleanId}-${cleanSn}.png`;
    downloadPNGDataURL(assetTagDataUrl, filename);
  };

  const handleDownloadQROnlyPNG = () => {
    if (!standaloneQRDataUrl) return;
    const cleanId = device.id.replace('#', '').replace(/\s+/g, '-');
    const filename = `QR-CODE-${cleanId}.png`;
    downloadPNGDataURL(standaloneQRDataUrl, filename);
  };

  const handleCopyAssetUrl = () => {
    navigator.clipboard.writeText(assetUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Asset Tag - ${device.id}</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
            img { max-width: 95%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${assetTagDataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 py-8">
      <div className="glass-card-elevated max-w-2xl w-full rounded-2xl border border-white/20 p-6 md:p-8 space-y-6 shadow-2xl relative my-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#47eaed] mb-1">
              <span>QR CODE &amp; ASSET TAG GENERATOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
              <span>{device.id}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#dde4e3]">
              ป้าย QR Code ประจำเครื่องมือแพทย์
            </h2>
            <p className="text-xs text-[#bac9c9] mt-0.5">
              สร้างภาพ PNG ความละเอียดสูง บรรจุรหัสครุภัณฑ์ (Device ID) และ Asset URL ตามมาตรฐานความปลอดภัยสากล
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-[#bac9c9] hover:text-white rounded-lg hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Preview Tabs & Theme Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] p-2 rounded-xl border border-white/5">
          {/* Tab selector */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActivePreviewTab('tag')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all flex items-center gap-1.5 ${
                activePreviewTab === 'tag'
                  ? 'bg-[#47eaed] text-black font-bold shadow-sm'
                  : 'text-[#bac9c9] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>ป้ายฉลากครุภัณฑ์ (Asset Label Tag)</span>
            </button>
            <button
              onClick={() => setActivePreviewTab('qr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-all flex items-center gap-1.5 ${
                activePreviewTab === 'qr'
                  ? 'bg-[#47eaed] text-black font-bold shadow-sm'
                  : 'text-[#bac9c9] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">qr_code</span>
              <span>เฉพาะ QR Code (Square)</span>
            </button>
          </div>

          {/* Theme selector */}
          {activePreviewTab === 'tag' && (
            <div className="flex items-center gap-1.5 text-xs font-mono-tech">
              <span className="text-[#bac9c9] text-[11px]">ธีมป้าย:</span>
              <button
                onClick={() => setTagTheme('medical-dark')}
                className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                  tagTheme === 'medical-dark'
                    ? 'bg-[#47eaed]/20 text-[#47eaed] border-[#47eaed]/40 font-bold'
                    : 'bg-white/5 text-[#bac9c9] border-white/10'
                }`}
              >
                Medical Dark
              </button>
              <button
                onClick={() => setTagTheme('clinical-white')}
                className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                  tagTheme === 'clinical-white'
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-white/5 text-[#bac9c9] border-white/10'
                }`}
              >
                Clinical White (Thermal)
              </button>
            </div>
          )}
        </div>

        {/* Live Canvas / PNG Preview Area */}
        <div className="bg-[#090f0f] p-4 sm:p-6 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px] relative overflow-hidden">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 text-[#47eaed]">
              <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
              <p className="text-xs font-mono-tech">กำลังเรนเดอร์ภาพ QR Code PNG ด้วยไลบรารี qrcode...</p>
            </div>
          ) : activePreviewTab === 'tag' ? (
            <div className="w-full max-w-xl shadow-2xl rounded-xl overflow-hidden border border-white/20">
              <img
                src={assetTagDataUrl}
                alt={`Clinical Asset Tag for ${device.id}`}
                className="w-full h-auto block"
              />
            </div>
          ) : (
            <div className="p-4 bg-white rounded-2xl shadow-2xl">
              <img
                src={standaloneQRDataUrl}
                alt={`QR Code for ${device.id}`}
                className="w-56 h-56 block mx-auto"
              />
            </div>
          )}
        </div>

        {/* Payload & Asset URL verification box */}
        <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono-tech text-[11px] uppercase text-[#47eaed] font-bold">
              Encoded Asset URL Payload:
            </span>
            <button
              onClick={handleCopyAssetUrl}
              className="text-[#47eaed] hover:underline font-mono-tech text-[11px] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">
                {isCopied ? 'done' : 'content_copy'}
              </span>
              <span>{isCopied ? 'คัดลอกลิงก์แล้ว!' : 'คัดลอก URL'}</span>
            </button>
          </div>
          <div className="p-2 bg-[#090f0f] rounded-lg font-mono-tech text-[11px] text-[#bac9c9] break-all border border-white/5 select-all">
            {assetUrl}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-tech text-[#bac9c9]/70 pt-1">
            <div>ASSET ID: <span className="text-[#dde4e3]">{device.id}</span></div>
            <div>SN: <span className="text-[#dde4e3]">{device.serialNumber}</span></div>
            <div>FACILITY: <span className="text-[#dde4e3] truncate">{device.facilityName}</span></div>
            <div>STATUS: <span className="text-[#47eaed]">{device.status}</span></div>
          </div>
        </div>

        {/* Download & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadAssetTagPNG}
              disabled={isGenerating || !assetTagDataUrl}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#47eaed] hover:bg-[#00ced1] text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(71,234,237,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download Asset Tag (PNG)</span>
            </button>

            <button
              onClick={handleDownloadQROnlyPNG}
              disabled={isGenerating || !standaloneQRDataUrl}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#dde4e3] hover:text-[#47eaed] text-xs font-mono-tech rounded-xl flex items-center gap-1.5 transition-colors"
              title="ดาวน์โหลดเฉพาะภาพ QR Code สี่เหลี่ยม (PNG)"
            >
              <span className="material-symbols-outlined text-sm">qr_code</span>
              <span className="hidden sm:inline">QR Only (PNG)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              disabled={isGenerating || !assetTagDataUrl}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[#dde4e3] text-xs font-mono-tech rounded-xl flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>พิมพ์สติกเกอร์</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#dde4e3] text-xs rounded-xl"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
