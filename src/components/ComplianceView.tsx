import React, { useState } from 'react';
import { AuditLogItem, UserProfile } from '../types/medical';

interface ComplianceViewProps {
  auditLogs: AuditLogItem[];
  currentUser: UserProfile;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  auditLogs,
  currentUser
}) => {
  const [filterAction, setFilterAction] = useState('all');

  const standards = [
    {
      name: 'IEC 62353:2014',
      title: 'Medical electrical equipment - Recurrent test and test after repair',
      scope: 'ความปลอดภัยทางไฟฟ้า, ความต้านทานสายดิน, ฉนวน, และกระแสไฟฟ้ารั่วไหล',
      complianceRate: 94,
      status: 'VERIFIED',
      certBody: 'สถาบันมาตรวิทยาแห่งชาติ (NIMT) / กรมวิทยาศาสตร์การแพทย์'
    },
    {
      name: 'ISO 13485:2016',
      title: 'Medical devices — Quality management systems',
      scope: 'ระบบบริหารคุณภาพเครื่องมือแพทย์สำหรับการจัดซื้อ บำรุงรักษา และสอบเทียบ',
      complianceRate: 92,
      status: 'SCHEDULED AUDIT',
      certBody: 'External Quality Auditor Committee'
    },
    {
      name: 'ISO/IEC 17025:2017',
      title: 'Competence of testing and calibration laboratories',
      scope: 'ความสามารถทางเทคนิคของห้องปฏิบัติการสอบเทียบ Lab A-4 รพ.ดอนพุด',
      complianceRate: 88,
      status: 'COMPLIANT',
      certBody: 'NIST & MOPH Calibration Network'
    },
    {
      name: 'PDPA พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562',
      title: 'Healthcare Clinical Equipment Data Protection & Privacy',
      scope: 'การเข้ารหัสข้อมูล, การควบคุมสิทธิ์ RBAC, และประวัติการเข้าถึงข้อมูลผู้ป่วยที่เชื่อมโยงกับเครื่องมือ',
      complianceRate: 100,
      status: 'SECURED',
      certBody: 'คณะกรรมการคุ้มครองข้อมูลส่วนบุคคลด้านสาธารณสุข'
    }
  ];

  const filteredLogs = filterAction === 'all'
    ? auditLogs
    : auditLogs.filter(log => log.action.toLowerCase().includes(filterAction.toLowerCase()));

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono-tech text-xs uppercase tracking-wider text-[#47eaed]">
            International Regulatory &amp; Data Privacy Framework
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
          <span className="text-xs text-[#bac9c9]">ISO 13485 • IEC 62353 • PDPA</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#dde4e3]">
          Compliance, Safety Standards &amp; PDPA Security
        </h1>
        <p className="text-xs text-[#bac9c9]">
          ระบบรายงานผลความสอดคล้องกับมาตรฐานความปลอดภัยระดับสากล และการคุ้มครองข้อมูลตามกฎหมาย PDPA ของสถานพยาบาลอำเภอดอนพุด
        </p>
      </div>

      {/* Standards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standards.map((std) => (
          <div key={std.name} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-tech font-bold text-sm text-[#47eaed]">{std.name}</span>
                <h3 className="font-bold text-sm text-[#dde4e3] mt-0.5">{std.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-tech font-bold bg-[#47eaed]/15 text-[#47eaed] border border-[#47eaed]/30">
                {std.status}
              </span>
            </div>

            <p className="text-xs text-[#bac9c9] leading-relaxed">{std.scope}</p>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono-tech">
                <span className="text-[#bac9c9]">Compliance Rating</span>
                <span className="text-[#47eaed] font-bold">{std.complianceRate}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00ced1] to-[#47eaed] rounded-full"
                  style={{ width: `${std.complianceRate}%` }}
                ></div>
              </div>
            </div>

            <p className="text-[10px] text-[#bac9c9]/60 font-mono-tech pt-1">
              หน่วยตรวจรับรอง: {std.certBody}
            </p>
          </div>
        ))}
      </div>

      {/* PDPA Governance Panel */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#85e0a3]/15 text-[#85e0a3] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#dde4e3]">
              PDPA Health Data Protection &amp; RBAC Control (พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล)
            </h3>
            <p className="text-xs text-[#bac9c9]">
              มาตรการรักษาความมั่นคงปลอดภัยของข้อมูลผู้ป่วยและบันทึกประวัติการใช้เครื่องมือแพทย์
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#47eaed] font-mono-tech">
              <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
              <span className="font-bold">Cryptographic Hashes</span>
            </div>
            <p className="text-[#bac9c9]">ทุกบันทึกการสอบเทียบถูกลงนามด้วยรหัสแฮช SHA-256 ป้องกันการดัดแปลงย้อนหลัง</p>
          </div>

          <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#85e0a3] font-mono-tech">
              <span className="material-symbols-outlined text-sm">visibility_off</span>
              <span className="font-bold">Data Masking</span>
            </div>
            <p className="text-[#bac9c9]">ข้อมูลเวชระเบียนที่เชื่อมโยงกับเครื่องมือแพทย์ถูก Masking ตามหลัก Least Privilege</p>
          </div>

          <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-[#4bc5ff] font-mono-tech">
              <span className="material-symbols-outlined text-sm">badge</span>
              <span className="font-bold">Role-Based Tiers</span>
            </div>
            <p className="text-[#bac9c9]">สิทธิ์ระดับ Tier 4 (Admin) ถึง Tier 0 (Viewer) ควบคุมการบันทึก แก้ไข และนำออกข้อมูล</p>
          </div>
        </div>
      </div>

      {/* Audit Trail Section */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 space-y-4">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-[#dde4e3]">
              Immutable System Audit Log (ประวัติการเข้าถึงและการปฏิบัติงาน)
            </h3>
            <p className="text-xs text-[#bac9c9]">เก็บบันทึกประวัติอย่างน้อย 5 ปีตามข้อกำหนดมาตรฐานความปลอดภัยและ PDPA</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-[#090f0f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#dde4e3] outline-none"
            >
              <option value="all">ทุกกิจกรรม (All Actions)</option>
              <option value="Calibration">การสอบเทียบ (Calibration)</option>
              <option value="Settings">การแก้ไขการตั้งค่า (Settings)</option>
              <option value="Telegram">การแจ้งเตือน (Telegram)</option>
              <option value="PDPA">การตรวจสอบสิทธิ์ (PDPA)</option>
            </select>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#dde4e3] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>พิมพ์ Log</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10 font-mono-tech text-[#bac9c9] text-[11px] uppercase">
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">ผู้ปฏิบัติงาน (Actor)</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">กิจกรรม (Action)</th>
                <th className="px-5 py-3">รายละเอียด (Details)</th>
                <th className="px-5 py-3">IP Address</th>
                <th className="px-5 py-3 font-mono-tech">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-mono-tech text-[#bac9c9] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#dde4e3] whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-[#47eaed]/15 text-[#47eaed]">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#47eaed]">
                    {log.action}
                  </td>
                  <td className="px-5 py-3.5 text-[#bac9c9] max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 font-mono-tech text-[#bac9c9]/70 text-[11px]">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-3.5 font-mono-tech text-[#47eaed] text-[10px]">
                    {log.integrityHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
