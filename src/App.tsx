import React, { useState, useEffect } from 'react';
import { 
  MedicalDevice, 
  CalibrationRecord, 
  UserProfile, 
  SystemSettings, 
  AuditLogItem, 
  SystemNotification 
} from './types/medical';
import { 
  initialDevices, 
  initialCalibrationRecords, 
  userProfiles, 
  initialSystemSettings, 
  initialAuditLogs, 
  initialNotifications 
} from './data/mockMedicalData';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { CalibrationView } from './components/CalibrationView';
import { ComplianceView } from './components/ComplianceView';
import { SettingsView } from './components/SettingsView';
import { AddDeviceModal } from './components/AddDeviceModal';
import { CalibrateDeviceModal } from './components/CalibrateDeviceModal';
import { CertificateModal } from './components/CertificateModal';
import { LifespanAnalyticsModal } from './components/LifespanAnalyticsModal';
import { QRScannerModal } from './components/QRScannerModal';
import { NotificationModal } from './components/NotificationModal';
import { initAuth, googleSignIn, getAccessToken } from './services/firebaseAuth';
import { exportToGoogleSheets } from './services/googleSheetsService';
import { sendTelegramAlert, formatCalibrationExpiringMessage } from './services/telegramService';

export default function App() {
  const [devices, setDevices] = useState<MedicalDevice[]>(initialDevices);
  const [records, setRecords] = useState<CalibrationRecord[]>(initialCalibrationRecords);
  const [currentUser, setCurrentUser] = useState<UserProfile>(userProfiles[0]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [settings, setSettings] = useState<SystemSettings>(initialSystemSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);

  // Modals
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);
  const [selectedDeviceForCalibrate, setSelectedDeviceForCalibrate] = useState<MedicalDevice | null>(null);
  const [selectedDeviceForCertificate, setSelectedDeviceForCertificate] = useState<MedicalDevice | null>(null);
  const [selectedDeviceForLifespan, setSelectedDeviceForLifespan] = useState<MedicalDevice | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Google Sheets state
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState<string | undefined>(undefined);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Mobile Device Frame Preview mode toggle
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);

  // Initialize Firebase Auth listener on load
  useEffect(() => {
    initAuth(
      (user, token) => {
        console.log('Firebase Auth initialized for Google Workspace user:', user.email);
      },
      () => {
        // Not signed in yet or token expired
      }
    );
  }, []);

  // Play audio ping for alert
  const playAlertPing = () => {
    if (!settings.audioAlertsEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext may be restricted by browser until user gesture
    }
  };

  // Synchronize with Google Sheets
  const handleSyncGoogleSheets = async () => {
    setIsSyncingSheets(true);
    setSyncToastMessage('กำลังเชื่อมต่อ Google Sheets API...');

    try {
      let token = await getAccessToken();

      // If token not in memory, trigger Google Sign-In popup
      if (!token) {
        setSyncToastMessage('กำลังเปิดหน้าต่าง Google Workspace เพื่อขออนุญาตบันทึกสเปรดชีต...');
        const authResult = await googleSignIn();
        if (authResult) {
          token = authResult.accessToken;
        } else {
          throw new Error('การยืนยันตัวตน Google ถูกยกเลิก');
        }
      }

      const result = await exportToGoogleSheets(devices, records, settings.googleSpreadsheetId);
      setSheetsUrl(result.spreadsheetUrl);
      setSyncToastMessage(result.message);

      // Log in audit log
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        actor: currentUser.name,
        role: currentUser.role,
        action: 'Google Sheets Export',
        details: `ส่งออกข้อมูลสำเร็จ: ${devices.length} รายการเครื่องมือแพทย์ และ ${records.length} บันทึกสอบเทียบ`,
        ipAddress: '192.168.10.45',
        integrityHash: `gs-${Date.now().toString(36)}`
      };
      setAuditLogs(prev => [newLog, ...prev]);

      setTimeout(() => setSyncToastMessage(null), 5000);
    } catch (err: any) {
      console.warn('Sheets sync failed, providing graceful feedback:', err);
      // Fallback message with option to retry
      setSyncToastMessage(`แจ้งเตือน: ${err.message || 'ไม่สามารถเชื่อมต่อ Google API ได้'}`);
      setTimeout(() => setSyncToastMessage(null), 6000);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Add new device handler
  const handleSaveNewDevice = (newDevice: MedicalDevice) => {
    setDevices(prev => [newDevice, ...prev]);

    // Add audit log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'Register Medical Device',
      details: `ลงทะเบียนเครื่องมือใหม่ ${newDevice.name} (${newDevice.id}) ประจำ ${newDevice.facilityName}`,
      ipAddress: '192.168.10.45',
      integrityHash: `reg-${newDevice.id.replace('#', '')}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Check if auto-sync enabled
    if (settings.autoSyncGoogleSheets && sheetsUrl) {
      handleSyncGoogleSheets();
    }
  };

  // Complete Calibration
  const handleCompleteCalibration = (updatedDevice: MedicalDevice, newRecord: CalibrationRecord) => {
    setDevices(prev => prev.map(d => (d.id === updatedDevice.id ? updatedDevice : d)));
    setRecords(prev => [newRecord, ...prev]);

    // Add audit log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'Calibration Completed',
      details: `ผ่านเกณฑ์ IEC 62353 สำหรับ ${updatedDevice.name} (#${updatedDevice.id}) โดย ${currentUser.name}`,
      ipAddress: '192.168.10.45',
      integrityHash: newRecord.verificationHash
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Auto-open certificate to view or print
    setSelectedDeviceForCertificate(updatedDevice);

    // Auto-sync if enabled
    if (settings.autoSyncGoogleSheets) {
      setTimeout(() => handleSyncGoogleSheets(), 1000);
    }
  };

  // Save System Settings
  const handleSaveSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      actor: currentUser.name,
      role: currentUser.role,
      action: 'Settings Modified',
      details: `ปรับเกณฑ์แจ้งเตือนเป็น ${newSettings.notificationThresholdDays} วัน และบันทึก Token ประตูเชื่อมต่อ Telegram`,
      ipAddress: '192.168.10.45',
      integrityHash: `cfg-${Date.now().toString(36)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Select device from search/scan
  const handleSelectDeviceById = (deviceId: string) => {
    const found = devices.find(d => d.id === deviceId);
    if (found) {
      setSelectedDeviceForCertificate(found);
    }
  };

  const expiredCount = devices.filter(d => d.status === 'Expired').length;

  return (
    <div className="min-h-screen bg-[#0e1515] text-[#dde4e3] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onSyncGoogleSheets={handleSyncGoogleSheets}
        isSyncingSheets={isSyncingSheets}
        sheetsUrl={sheetsUrl}
        isMobileDeviceView={isMobileDeviceView}
        onToggleMobileDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
        onOpenSidebar={() => setIsSidebarOpenMobile(true)}
      />

      {/* Sync Toast Notification */}
      {syncToastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 max-w-md bg-[#161d1d] border border-[#47eaed]/40 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-[#47eaed] text-2xl">
            {isSyncingSheets ? 'sync' : 'check_circle'}
          </span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#dde4e3]">Google Sheets Sync</p>
            <p className="text-[#bac9c9] mt-0.5 leading-relaxed">{syncToastMessage}</p>
          </div>
          <button 
            onClick={() => setSyncToastMessage(null)}
            className="text-[#bac9c9] hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* App Body Layout */}
      <div className="flex-1 flex pt-20">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentUser={currentUser}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          totalDevicesCount={devices.length}
          expiredCount={expiredCount}
        />

        {/* Main Content Area */}
        <main className={`flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-5rem)] transition-all ${
          isMobileDeviceView ? 'flex justify-center items-start py-8 bg-[#070b0b]' : ''
        }`}>
          {/* Conditional Mobile Frame Container */}
          {isMobileDeviceView ? (
            <div className="w-[390px] min-h-[844px] bg-[#0e1515] border-[6px] border-[#242b2b] rounded-[48px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative pb-16">
              {/* iPhone Notch header */}
              <div className="w-full h-8 bg-black flex items-center justify-between px-6 text-[10px] text-white font-mono-tech select-none">
                <span>09:41</span>
                <div className="w-20 h-4 bg-[#161d1d] rounded-full mx-auto"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-xs">wifi</span>
                  <span className="material-symbols-outlined text-xs">battery_full</span>
                </div>
              </div>

              {/* Mobile Main Canvas */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentTab === 'dashboard' && (
                  <DashboardView
                    devices={devices}
                    currentUser={currentUser}
                    onSelectDevice={setSelectedDeviceForCertificate}
                    onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
                    onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                    onOpenCertificateModal={setSelectedDeviceForCertificate}
                    onOpenLifespanModal={setSelectedDeviceForLifespan}
                    onNavigateToTab={setCurrentTab}
                    onSyncGoogleSheets={handleSyncGoogleSheets}
                    isSyncingSheets={isSyncingSheets}
                  />
                )}
                {currentTab === 'inventory' && (
                  <InventoryView
                    devices={devices}
                    currentUser={currentUser}
                    onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
                    onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                    onOpenCertificateModal={setSelectedDeviceForCertificate}
                    onOpenLifespanModal={setSelectedDeviceForLifespan}
                    onOpenQRScanner={() => setIsQRScannerOpen(true)}
                  />
                )}
                {currentTab === 'calibration' && (
                  <CalibrationView
                    devices={devices}
                    records={records}
                    currentUser={currentUser}
                    onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                    onOpenCertificateModal={setSelectedDeviceForCertificate}
                    onOpenLifespanModal={setSelectedDeviceForLifespan}
                  />
                )}
                {currentTab === 'lifespan' && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#dde4e3]">
                      Lifespan &amp; Wear Analysis
                    </h3>
                    <p className="text-xs text-[#bac9c9]">
                      แตะเลือกอุปกรณ์จากรายการด้านล่างเพื่อเปิดการวิเคราะห์ความเสื่อมสภาพ
                    </p>
                    <div className="space-y-2">
                      {devices.map(d => (
                        <div
                          key={d.id}
                          onClick={() => setSelectedDeviceForLifespan(d)}
                          className="glass-card p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#47eaed]/50 text-xs"
                        >
                          <div>
                            <span className="font-mono-tech text-[#47eaed] font-bold">{d.id}</span>
                            <p className="font-bold text-[#dde4e3]">{d.name}</p>
                          </div>
                          <span className="font-mono-tech text-xs text-[#47eaed]">
                            Health {d.aging.equipmentHealthScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentTab === 'compliance' && (
                  <ComplianceView
                    auditLogs={auditLogs}
                    currentUser={currentUser}
                  />
                )}
                {currentTab === 'settings' && (
                  <SettingsView
                    currentUser={currentUser}
                    settings={settings}
                    onSaveSettings={handleSaveSettings}
                    auditLogs={auditLogs}
                    onOpenAuditLog={() => setCurrentTab('compliance')}
                    onSyncGoogleSheets={handleSyncGoogleSheets}
                    isSyncingSheets={isSyncingSheets}
                    sheetsUrl={sheetsUrl}
                  />
                )}
              </div>

              {/* Embedded Mobile Bottom Bar in Frame */}
              <MobileBottomNav
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
                onOpenQRScanner={() => setIsQRScannerOpen(true)}
              />
            </div>
          ) : (
            // Full Responsive Desktop / Tablet View
            <div className="max-w-7xl mx-auto w-full">
              {currentTab === 'dashboard' && (
                <DashboardView
                  devices={devices}
                  currentUser={currentUser}
                  onSelectDevice={setSelectedDeviceForCertificate}
                  onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
                  onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                  onOpenCertificateModal={setSelectedDeviceForCertificate}
                  onOpenLifespanModal={setSelectedDeviceForLifespan}
                  onNavigateToTab={setCurrentTab}
                  onSyncGoogleSheets={handleSyncGoogleSheets}
                  isSyncingSheets={isSyncingSheets}
                />
              )}

              {currentTab === 'inventory' && (
                <InventoryView
                  devices={devices}
                  currentUser={currentUser}
                  onOpenNewDeviceModal={() => setIsNewDeviceModalOpen(true)}
                  onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                  onOpenCertificateModal={setSelectedDeviceForCertificate}
                  onOpenLifespanModal={setSelectedDeviceForLifespan}
                  onOpenQRScanner={() => setIsQRScannerOpen(true)}
                />
              )}

              {currentTab === 'calibration' && (
                <CalibrationView
                  devices={devices}
                  records={records}
                  currentUser={currentUser}
                  onOpenCalibrateModal={setSelectedDeviceForCalibrate}
                  onOpenCertificateModal={setSelectedDeviceForCertificate}
                  onOpenLifespanModal={setSelectedDeviceForLifespan}
                />
              )}

              {currentTab === 'lifespan' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono-tech text-xs uppercase tracking-wider text-[#4bc5ff]">
                          Weibull Reliability &amp; Predictive Asset Management
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4bc5ff]"></span>
                        <span className="text-xs text-[#bac9c9]">Don Phut Hospital</span>
                      </div>
                      <h1 className="font-display text-3xl font-bold text-[#dde4e3]">
                        Equipment Lifespan &amp; Aging Analytics
                      </h1>
                      <p className="text-xs text-[#bac9c9]">
                        การวิเคราะห์แนวโน้มอายุการใช้งาน โอกาสการเกิดข้อผิดพลาด และการวางแผนจัดซื้อจัดจ้างครุภัณฑ์ทดแทน
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map((device) => (
                      <div
                        key={device.id}
                        className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4 hover:border-[#4bc5ff]/40 transition-all cursor-pointer"
                        onClick={() => setSelectedDeviceForLifespan(device)}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono-tech text-xs font-bold text-[#47eaed]">{device.id}</span>
                            <span className="text-[10px] font-mono-tech text-[#4bc5ff] bg-[#4bc5ff]/15 px-2 py-0.5 rounded">
                              {device.aging.recommendedAction}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-[#dde4e3] leading-snug">{device.name}</h3>
                          <p className="text-xs text-[#bac9c9]">{device.facilityName} ({device.department})</p>
                        </div>

                        <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#bac9c9]">Health Score:</span>
                            <span className="font-mono-tech font-bold text-[#47eaed]">{device.aging.equipmentHealthScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#00ced1] to-[#4bc5ff] rounded-full"
                              style={{ width: `${device.aging.equipmentHealthScore}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-[#bac9c9]">
                            <span>อายุ: {device.aging.currentAgeYears} ปี</span>
                            <span>อายุขัย: {device.aging.expectedLifespanYears} ปี</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDeviceForLifespan(device);
                          }}
                          className="w-full py-2 bg-white/5 hover:bg-[#4bc5ff]/20 text-[#4bc5ff] rounded-xl text-xs font-mono-tech font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">monitoring</span>
                          <span>เปิดดูกราฟคาดการณ์ความเสื่อม</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'compliance' && (
                <ComplianceView
                  auditLogs={auditLogs}
                  currentUser={currentUser}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  auditLogs={auditLogs}
                  onOpenAuditLog={() => setCurrentTab('compliance')}
                  onSyncGoogleSheets={handleSyncGoogleSheets}
                  isSyncingSheets={isSyncingSheets}
                  sheetsUrl={sheetsUrl}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation for actual mobile viewport */}
      {!isMobileDeviceView && (
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
        />
      )}

      {/* Modals */}
      <AddDeviceModal
        isOpen={isNewDeviceModalOpen}
        onClose={() => setIsNewDeviceModalOpen(false)}
        onSaveDevice={handleSaveNewDevice}
      />

      <CalibrateDeviceModal
        device={selectedDeviceForCalibrate}
        currentUser={currentUser}
        isOpen={selectedDeviceForCalibrate !== null}
        onClose={() => setSelectedDeviceForCalibrate(null)}
        onCompleteCalibration={handleCompleteCalibration}
      />

      <CertificateModal
        device={selectedDeviceForCertificate}
        isOpen={selectedDeviceForCertificate !== null}
        onClose={() => setSelectedDeviceForCertificate(null)}
      />

      <LifespanAnalyticsModal
        device={selectedDeviceForLifespan}
        isOpen={selectedDeviceForLifespan !== null}
        onClose={() => setSelectedDeviceForLifespan(null)}
      />

      <QRScannerModal
        devices={devices}
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onSelectScannedDevice={(scannedDev) => {
          setSelectedDeviceForCertificate(scannedDev);
        }}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onSelectDeviceById={handleSelectDeviceById}
      />
    </div>
  );
}
