import React, { useState } from 'react';
import { MedicalDevice } from '../types/medical';

interface LifespanAnalyticsModalProps {
  device: MedicalDevice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LifespanAnalyticsModal: React.FC<LifespanAnalyticsModalProps> = ({
  device,
  isOpen,
  onClose
}) => {
  if (!isOpen || !device) return null;

  const [usageIntensity, setUsageIntensity] = useState<'Standard' | 'Intensive 24/7' | 'Low/Occasional'>('Standard');

  const { aging } = device;

  // Calculate dynamic health adjusted by intensity
  const factor = usageIntensity === 'Intensive 24/7' ? 0.88 : usageIntensity === 'Low/Occasional' ? 1.08 : 1.0;
  const simulatedHealth = Math.min(100, Math.round(aging.equipmentHealthScore * factor));
  const simulatedFailureProb = Math.min(95, Math.round(aging.failureProbabilityNext12m * (usageIntensity === 'Intensive 24/7' ? 1.3 : 0.8)));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 py-8">
      <div className="glass-card-elevated max-w-3xl w-full rounded-2xl border border-white/20 p-6 md:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#4bc5ff] mb-1">
              <span>PREDICTIVE LIFESPAN & WEAR ANALYSIS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4bc5ff]"></span>
              <span>{device.id}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#dde4e3]">
              วิเคราะห์แนวโน้มอายุการใช้งาน: {device.name}
            </h2>
            <p className="text-xs text-[#bac9c9] mt-0.5">
              โมเดลคาดการณ์ความเสื่อมสภาพ (Weibull Reliability Model) และแผนจัดซื้อทดแทน รพ.ดอนพุด
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-[#bac9c9] hover:text-white rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Top 3 Score Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Health Index */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-mono-tech uppercase text-[#bac9c9]">Health Index Score</span>
            <div className="flex items-baseline gap-2">
              <span className={`font-display text-4xl font-extrabold ${
                simulatedHealth > 80 ? 'text-[#47eaed]' : simulatedHealth > 60 ? 'text-[#4bc5ff]' : 'text-[#ffb4ab]'
              }`}>
                {simulatedHealth}%
              </span>
              <span className="text-xs text-[#bac9c9]">ความสมบูรณ์</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  simulatedHealth > 80 ? 'bg-[#47eaed]' : simulatedHealth > 60 ? 'bg-[#4bc5ff]' : 'bg-[#ffb4ab]'
                }`}
                style={{ width: `${simulatedHealth}%` }}
              ></div>
            </div>
          </div>

          {/* Failure Probability */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-mono-tech uppercase text-[#bac9c9]">Failure Risk (Next 12M)</span>
            <div className="flex items-baseline gap-2">
              <span className={`font-display text-4xl font-extrabold ${
                simulatedFailureProb < 10 ? 'text-[#47eaed]' : simulatedFailureProb < 25 ? 'text-[#4bc5ff]' : 'text-[#ffb4ab]'
              }`}>
                {simulatedFailureProb}%
              </span>
              <span className="text-xs text-[#bac9c9]">ความน่าจะเป็น</span>
            </div>
            <p className="text-[10px] text-[#bac9c9]/70 mt-1">
              {simulatedFailureProb < 10 ? 'ความเสี่ยงต่ำมาก ทำงานเสถียร' : simulatedFailureProb < 25 ? 'ความเสี่ยงปานกลาง ควรตรวจรอบ 6M' : 'ความเสี่ยงสูง เสี่ยงต่อการขัดข้อง'}
            </p>
          </div>

          {/* MTBF */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-mono-tech uppercase text-[#bac9c9]">MTBF (Mean Time Between Failures)</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-[#dde4e3]">
                {aging.mtbfHours.toLocaleString()}
              </span>
              <span className="text-xs text-[#bac9c9]">ชม. ทำงาน</span>
            </div>
            <p className="text-[10px] text-[#47eaed] font-mono-tech mt-1">
              ~{Math.round(aging.mtbfHours / 24)} วันทำการต่อเนื่อง
            </p>
          </div>
        </div>

        {/* Interactive Usage Simulator */}
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono-tech uppercase text-[#47eaed]">
              จำลองภาระการใช้งานทางคลินิก (Clinical Workload Simulation):
            </span>
            <div className="flex items-center gap-1.5">
              {(['Standard', 'Intensive 24/7', 'Low/Occasional'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setUsageIntensity(mode)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-tech transition-all ${
                    usageIntensity === mode
                      ? 'bg-[#47eaed] text-black font-bold'
                      : 'bg-white/5 text-[#bac9c9] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Degradation Points Chart */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono-tech text-[#dde4e3] uppercase">
              กราฟจำลองการเสื่อมสภาพตามอายุการใช้งาน (Historical & Projected Degradation)
            </span>
            <span className="text-[#bac9c9] font-mono-tech text-[11px]">
              อายุปัจจุบัน: {aging.currentAgeYears} ปี / อายุขัยเฉลี่ย: {aging.expectedLifespanYears} ปี
            </span>
          </div>

          <div className="p-4 bg-[#090f0f] rounded-xl border border-white/10 space-y-4">
            <div className="flex items-end gap-4 h-36 pt-4 border-b border-white/10 pb-2">
              {aging.degradationPoints.map((point) => {
                const isCurrentYear = point.year === 2024;
                return (
                  <div key={point.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-mono-tech text-[#47eaed]">
                      {point.health}%
                    </span>
                    <div className="w-full bg-white/5 rounded-t-lg h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isCurrentYear
                            ? 'bg-gradient-to-t from-[#00ced1] to-[#47eaed] shadow-[0_0_15px_rgba(71,234,237,0.4)]'
                            : point.year > 2024
                              ? 'bg-white/20 border-t border-dashed border-[#47eaed]'
                              : 'bg-[#47eaed]/40'
                        }`}
                        style={{ height: `${point.health}%` }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-mono-tech ${isCurrentYear ? 'text-[#47eaed] font-bold' : 'text-[#bac9c9]'}`}>
                      {point.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Capex Recommendation Box */}
        <div className="p-4 rounded-xl bg-[#47eaed]/5 border border-[#47eaed]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#47eaed] text-xs font-mono-tech uppercase font-bold">
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span>ข้อเสนอแนะเพื่อการจัดทำงบประมาณพัสดุการแพทย์ (Capex Plan - Don Phut Health Network)</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
            <div>
              <p className="text-[#dde4e3] font-semibold">
                มาตรการแนะนำ: <span className="text-[#47eaed]">{aging.recommendedAction}</span>
              </p>
              <p className="text-xs text-[#bac9c9] mt-0.5">
                ประเมินอายุการใช้งานที่เหลือ: <span className="font-mono-tech text-[#dde4e3]">{aging.remainingLifespanMonths} เดือน</span>
              </p>
            </div>
            <button
              onClick={() => {
                alert(`บันทึกแผน Capex สำหรับ ${device.name} เข้าสู่สมุดแผนพัฒนาระบบสุขภาพอำเภอดอนพุดเรียบร้อยแล้ว`);
                onClose();
              }}
              className="px-4 py-2 bg-[#47eaed]/20 hover:bg-[#47eaed] text-[#47eaed] hover:text-black rounded-lg text-xs font-mono-tech font-bold transition-all"
            >
              บรรจุเข้าแผนคำของบประมาณครุภัณฑ์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
