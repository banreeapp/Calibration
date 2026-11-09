import React, { useState } from 'react';
import { UserProfile, SystemNotification } from '../types/medical';
import { userProfiles } from '../data/mockMedicalData';

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  notifications: SystemNotification[];
  onOpenNotifications: () => void;
  onOpenQRScanner: () => void;
  onSyncGoogleSheets: () => void;
  isSyncingSheets: boolean;
  sheetsUrl?: string;
  isMobileDeviceView: boolean;
  onToggleMobileDeviceView: () => void;
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  notifications,
  onOpenNotifications,
  onOpenQRScanner,
  onSyncGoogleSheets,
  isSyncingSheets,
  sheetsUrl,
  isMobileDeviceView,
  onToggleMobileDeviceView,
  onOpenSidebar
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 fixed top-0 right-0 left-0 z-30 bg-[#0e1515]/75 backdrop-blur-xl border-b border-white/10 shadow-sm flex items-center justify-between px-4 md:px-8">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSidebar}
          className="p-2 text-[#47eaed] hover:bg-white/5 rounded-lg md:hidden transition-colors"
          title="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ced1] to-[#005354] flex items-center justify-center shadow-[0_0_18px_rgba(71,234,237,0.35)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-black font-bold text-2xl material-symbols-fill">biotech</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold tracking-tight text-[#47eaed]">
                MediCal <span className="text-[#dde4e3] font-light">Systems</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-tech tracking-wider uppercase bg-[#47eaed]/10 text-[#47eaed] rounded border border-[#47eaed]/30">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-[#bac9c9]/70 hidden sm:block truncate max-w-xs md:max-w-md">
              ระบบบริหารการสอบเทียบเครื่องมือแพทย์ เขตอำเภอดอนพุด (Don Phut Health Network)
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Google Sheets Sync Pill */}
        <div className="hidden lg:flex items-center gap-2">
          {sheetsUrl ? (
            <a
              href={sheetsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#34A853]/15 border border-[#34A853]/30 text-[#85e0a3] text-xs font-medium hover:bg-[#34A853]/25 transition-all"
              title="เปิด Google Sheets ทะเบียนสอบเทียบ"
            >
              <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
              <span>Sheets ทะเบียนสด</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          ) : null}

          <button
            onClick={onSyncGoogleSheets}
            disabled={isSyncingSheets}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#dde4e3] hover:text-[#47eaed] transition-all disabled:opacity-50"
            title="ซิงค์ข้อมูลกับ Google Sheets"
          >
            <span className={`material-symbols-outlined text-base ${isSyncingSheets ? 'animate-spin text-[#47eaed]' : 'text-[#34A853]'}`}>
              {isSyncingSheets ? 'sync' : 'table_chart'}
            </span>
            <span className="hidden xl:inline">{isSyncingSheets ? 'กำลังซิงค์...' : 'Sync Google Sheets'}</span>
          </button>
        </div>

        {/* Mobile View Toggle */}
        <button
          onClick={onToggleMobileDeviceView}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
            isMobileDeviceView 
              ? 'bg-[#47eaed]/20 text-[#47eaed] border-[#47eaed]/50 shadow-[0_0_15px_rgba(71,234,237,0.2)]'
              : 'bg-white/5 text-[#bac9c9] border-white/10 hover:text-white'
          }`}
          title="สลับโหมดพรีวิวหน้าจอมือถือ (Mobile Frame Preview)"
        >
          <span className="material-symbols-outlined text-sm">
            {isMobileDeviceView ? 'smartphone' : 'desktop_windows'}
          </span>
          <span className="hidden md:inline">{isMobileDeviceView ? 'Phone Frame: ON' : 'Mobile Preview'}</span>
        </button>

        {/* QR Scanner trigger */}
        <button
          onClick={onOpenQRScanner}
          className="p-2 rounded-lg bg-[#47eaed]/10 hover:bg-[#47eaed]/20 border border-[#47eaed]/30 text-[#47eaed] transition-all active:scale-95"
          title="สแกน QR Code เครื่องมือแพทย์ (QR Scanner)"
        >
          <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
        </button>

        {/* Notifications Alert Bell */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#bac9c9] hover:text-white transition-all relative"
            title="การแจ้งเตือนรอบสอบเทียบและระบบ"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#ffb4ab] text-[#93000a] text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#47eaed]/40 relative flex-shrink-0 bg-[#161d1d]">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrM6I0zLKymQkzvCiWVt-PmOmUq2hoRsMPohl3O25_rKYwoKvbruRjEE80UxgeJDEcsq8hJWbPNB1c0owq1wEKsOjv6Khwd6GrhOGknqFGu7xAqMMTHACpY5Z8Q8e2ifRWf_YcbpXNScS1UB-LdcI08sQH3MGZwNoGOoo72KdzkMm-cSsnv8V7nZWH8vn1hfm6QtEdGzYgkZmJ6UYGF0uo7Jpn2bPFQbGyGvFckWqNkDvguHc9gywZjL-gduFUalomm8QixJNRVvoI';
                }}
              />
            </div>
            <div className="hidden sm:block text-left pr-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-[#dde4e3] leading-none">{currentUser.name}</p>
                <span className="px-1.5 py-0.2 bg-[#47eaed]/15 text-[#47eaed] text-[9px] font-mono-tech rounded font-bold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[10px] text-[#bac9c9]/70 leading-none mt-1">{currentUser.tier}</p>
            </div>
            <span className="material-symbols-outlined text-[#bac9c9] text-sm">expand_more</span>
          </button>

          {/* Role selection dropdown modal */}
          {showRoleMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowRoleMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 glass-card-elevated rounded-xl shadow-2xl p-2 z-50 border border-white/20">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-mono-tech text-[#47eaed] uppercase tracking-wider">
                    สลับบทบาทผู้ใช้งาน (RBAC Simulation)
                  </p>
                  <p className="text-[11px] text-[#bac9c9] mt-0.5">
                    ทดสอบสิทธิ์การเข้าถึงข้อมูลตามบทบาท PDPA
                  </p>
                </div>

                <div className="space-y-1">
                  {userProfiles.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected 
                            ? 'bg-[#47eaed]/15 text-[#47eaed] font-medium' 
                            : 'hover:bg-white/5 text-[#dde4e3]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">{user.name}</span>
                            <span className="text-[10px] font-mono-tech text-[#47eaed] bg-white/5 px-1 rounded">
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#bac9c9] truncate">{user.title}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 px-3 py-1 flex items-center justify-between text-[11px] text-[#bac9c9]">
                  <span>PDPA Data Security</span>
                  <span className="text-[#47eaed] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified_user</span>
                    Active
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
