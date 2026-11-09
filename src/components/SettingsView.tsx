import React, { useState } from 'react';
import { UserProfile, SystemSettings, AuditLogItem } from '../types/medical';
import { sendTelegramAlert } from '../services/telegramService';

interface SettingsViewProps {
  currentUser: UserProfile;
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
  auditLogs: AuditLogItem[];
  onOpenAuditLog: () => void;
  onSyncGoogleSheets: () => void;
  isSyncingSheets: boolean;
  sheetsUrl?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  settings,
  onSaveSettings,
  auditLogs,
  onOpenAuditLog,
  onSyncGoogleSheets,
  isSyncingSheets,
  sheetsUrl
}) => {
  const [botToken, setBotToken] = useState(settings.telegramBotToken);
  const [chatId, setChatId] = useState(settings.adminChatId);
  const [thresholdDays, setThresholdDays] = useState(settings.notificationThresholdDays);
  const [showToken, setShowToken] = useState(false);
  const [autoSyncSheets, setAutoSyncSheets] = useState(settings.autoSyncGoogleSheets);
  const [pdpaMasking, setPdpaMasking] = useState(settings.pdpaMaskingEnabled);
  const [audioAlerts, setAudioAlerts] = useState(settings.audioAlertsEnabled);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleTestTelegram = async () => {
    setTestStatus('กำลังส่งข้อความทดสอบผ่าน Telegram Bot Gateway...');
    const res = await sendTelegramAlert(
      botToken,
      chatId,
      '🧪 <b>[MediCal Test Gateway]</b> การเชื่อมต่อระบบแจ้งเตือนอำเภอดอนพุด สำเร็จเรียบร้อย (HTTP 200 OK)'
    );

    setTestStatus(res.message);
    setTimeout(() => setTestStatus(null), 4000);
  };

  const handleSave = () => {
    const updated: SystemSettings = {
      ...settings,
      telegramBotToken: botToken,
      adminChatId: chatId,
      notificationThresholdDays: thresholdDays,
      autoSyncGoogleSheets: autoSyncSheets,
      pdpaMaskingEnabled: pdpaMasking,
      audioAlertsEnabled: audioAlerts
    };
    onSaveSettings(updated);
    setSaveStatus('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว (Configuration Saved)');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDiscard = () => {
    setBotToken(settings.telegramBotToken);
    setChatId(settings.adminChatId);
    setThresholdDays(settings.notificationThresholdDays);
    setAutoSyncSheets(settings.autoSyncGoogleSheets);
    setPdpaMasking(settings.pdpaMaskingEnabled);
    setAudioAlerts(settings.audioAlertsEnabled);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-5xl mx-auto">
      {/* Title matching user Image 3 */}
      <section className="space-y-1">
        <p className="font-mono-tech text-xs text-[#47eaed] uppercase tracking-[0.2em]">
          System Configuration &amp; Control
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#dde4e3]">
          Configuration &amp; Control
        </h2>
        <p className="text-xs text-[#bac9c9]">
          ศูนย์ควบคุมเกณฑ์การแจ้งเตือนสากล, Telegram Bot Gateway, และความปลอดภัยตามบทบาท PDPA
        </p>
      </section>

      {saveStatus && (
        <div className="p-3 bg-[#47eaed]/15 border border-[#47eaed]/40 rounded-xl text-xs text-[#47eaed] flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Bento Layout Grid matching user Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile & RBAC Panel (4 cols) */}
        <div className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#47eaed]/5 rounded-full blur-3xl transition-all group-hover:bg-[#47eaed]/10"></div>
          <div>
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/20 mb-4 bg-[#161d1d] shadow-lg">
              <img
                src={currentUser.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-display font-bold text-lg text-[#dde4e3]">{currentUser.name}</h3>
            <p className="text-[#bac9c9] font-mono-tech text-xs mt-0.5">{currentUser.title}</p>
            <p className="text-[11px] text-[#bac9c9]/60 mt-1">{currentUser.department}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#bac9c9]">System Role</span>
              <span className="px-3 py-1 bg-[#47eaed] text-black font-bold text-xs rounded-full shadow-[0_0_15px_rgba(71,234,237,0.35)] font-mono-tech">
                {currentUser.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#bac9c9]">Access Level</span>
              <span className="font-mono-tech text-[#47eaed] text-xs font-bold">{currentUser.tier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#bac9c9]">PDPA Data Clearance</span>
              <span className="text-[11px] font-mono-tech text-[#85e0a3] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">lock_open</span>
                Authorized
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Integration Panel (8 cols) */}
        <div className="md:col-span-8 glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#47eaed]/10 flex items-center justify-center text-[#47eaed]">
                <span className="material-symbols-outlined text-2xl">send</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#dde4e3]">Telegram Bot Gateway</h3>
                <p className="text-xs text-[#bac9c9]">ระบบแจ้งเตือนแบบเรียลไทม์เข้ากลุ่มช่างชีวการแพทย์และหัวหน้าแผนก</p>
              </div>
            </div>
            <button
              onClick={handleTestTelegram}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#47eaed]/15 border border-[#47eaed]/30 text-xs font-mono-tech text-[#47eaed] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              <span>Test Ping</span>
            </button>
          </div>

          {testStatus && (
            <div className="p-2.5 bg-[#47eaed]/10 border border-[#47eaed]/30 rounded-lg text-xs text-[#47eaed] font-mono-tech">
              {testStatus}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono-tech text-xs text-[#47eaed] block">
                Telegram Bot Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-[#dde4e3] focus:outline-none focus:border-[#47eaed] pr-12 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bac9c9] hover:text-[#47eaed]"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showToken ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono-tech text-xs text-[#47eaed] block">
                Admin Chat ID (Group or Channel ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-[#090f0f] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono-tech text-[#dde4e3] focus:outline-none focus:border-[#47eaed] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Notification Threshold Panel (12 cols) matching user Image 3 */}
        <div className="md:col-span-12 glass-card rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#47eaed] text-lg">alarm</span>
                <h3 className="font-display font-bold text-base text-[#dde4e3]">
                  Calibration Notification Threshold
                </h3>
              </div>
              <p className="text-xs text-[#bac9c9] leading-relaxed">
                กำหนดระยะเวลาแจ้งเตือนล่วงหน้าก่อนเครื่องมือแพทย์หมดอายุการสอบเทียบ ระบบจะส่งสัญญาณเตือนผ่าน Telegram และแดชบอร์ดเมื่อเครื่องมือเข้าสู่ช่วงเวลานี้
              </p>
            </div>

            <div className="flex items-center gap-6 bg-[#090f0f]/80 p-4 px-6 rounded-2xl border border-white/5 min-w-[240px]">
              <div className="text-center pr-2 border-r border-white/10">
                <p className="font-mono-tech text-[10px] text-[#47eaed]">THRESHOLD</p>
                <p className="font-mono-tech text-3xl font-extrabold text-[#47eaed]">{thresholdDays}</p>
                <p className="text-[10px] text-[#bac9c9]">DAYS</p>
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={thresholdDays}
                  onChange={(e) => setThresholdDays(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#47eaed]"
                />
                <div className="flex justify-between text-[9px] font-mono-tech text-[#bac9c9]">
                  <span>1 วัน</span>
                  <span>30 วัน</span>
                  <span>60 วัน</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Sheets Workspace Integration Box (12 cols) */}
        <div className="md:col-span-12 glass-card rounded-2xl p-6 space-y-4 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34A853]/15 flex items-center justify-center text-[#85e0a3]">
                <span className="material-symbols-outlined text-2xl">table_chart</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#dde4e3]">
                  Google Workspace &amp; Google Sheets Integration
                </h3>
                <p className="text-xs text-[#bac9c9]">
                  ซิงค์ข้อมูลทะเบียนเครื่องมือแพทย์และประวัติสอบเทียบ IEC 62353 กับ Google Sheets สดแบบอัตโนมัติ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sheetsUrl && (
                <a
                  href={sheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-[#85e0a3] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>เปิด Google Spreadsheet</span>
                </a>
              )}
              <button
                onClick={onSyncGoogleSheets}
                disabled={isSyncingSheets}
                className="px-4 py-2 bg-[#34A853] hover:bg-[#2e9349] text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-sm ${isSyncingSheets ? 'animate-spin' : ''}`}>
                  {isSyncingSheets ? 'sync' : 'cloud_upload'}
                </span>
                <span>{isSyncingSheets ? 'กำลังส่งออก...' : 'ซิงค์เข้า Google Sheets'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <label className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncSheets}
                onChange={(e) => setAutoSyncSheets(e.target.checked)}
                className="rounded accent-[#47eaed]"
              />
              <span className="text-[#dde4e3]">Auto-sync Google Sheets ทุกครั้งที่สอบเทียบเสร็จ</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={pdpaMasking}
                onChange={(e) => setPdpaMasking(e.target.checked)}
                className="rounded accent-[#47eaed]"
              />
              <span className="text-[#dde4e3]">เปิดการเข้ารหัสและมาสก์ข้อมูลผู้ป่วยตาม PDPA</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="rounded accent-[#47eaed]"
              />
              <span className="text-[#dde4e3]">ส่งสัญญาณเสียงเตือน (Audio Alert) เมื่อมีเครื่องหมดอายุ</span>
            </label>
          </div>
        </div>

        {/* Global Action Controls matching user Image 3 */}
        <div className="md:col-span-12 flex flex-col sm:flex-row gap-4 justify-end pt-2">
          <button
            onClick={handleDiscard}
            className="px-8 py-3 rounded-xl border border-[#47eaed]/30 text-[#47eaed] font-bold text-xs hover:bg-[#47eaed]/10 transition-all active:scale-95"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-3 rounded-xl bg-[#47eaed] text-black font-bold text-xs shadow-[0_0_30px_rgba(71,234,237,0.3)] hover:brightness-110 transition-all active:scale-95"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* System Logs Teaser matching user Image 3 */}
      <section className="pt-6 space-y-3">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-mono-tech text-xs uppercase tracking-wider text-[#bac9c9]">
            Recent System Events &amp; Audit Trail
          </h4>
          <button
            onClick={onOpenAuditLog}
            className="text-xs text-[#47eaed] hover:underline font-mono-tech"
          >
            View Full Audit Log
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="glass-card py-3.5 px-6 rounded-xl flex items-center justify-between border-l-4 border-l-[#47eaed] text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sm text-[#47eaed]">update</span>
                <p className="text-[#dde4e3]">
                  {log.action} by <span className="font-bold text-white">{log.actor}</span>
                  <span className="text-[#bac9c9] ml-2 hidden sm:inline">• {log.details}</span>
                </p>
              </div>
              <p className="font-mono-tech text-[11px] text-[#bac9c9] whitespace-nowrap ml-2">
                {log.timestamp}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
