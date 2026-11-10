import React from 'react';
import { UserProfile } from '../types/medical';

export type NavigationTab = 
  | 'dashboard' 
  | 'inventory' 
  | 'calibration' 
  | 'lifespan' 
  | 'compliance' 
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  currentUser: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalDevicesCount: number;
  expiredCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  totalDevicesCount,
  expiredCount
}) => {
  const navItems: Array<{
    id: NavigationTab;
    label: string;
    labelTh: string;
    icon: string;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelTh: 'ภาพรวมระบบ',
      icon: 'dashboard'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      labelTh: 'ทะเบียนเครื่องมือแพทย์',
      icon: 'biotech',
      badge: totalDevicesCount,
      badgeColor: 'bg-[#47eaed]/15 text-[#47eaed]'
    },
    {
      id: 'calibration',
      label: 'Calibration',
      labelTh: 'งานทดสอบและสอบเทียบ',
      icon: 'event_repeat',
      badge: expiredCount > 0 ? `${expiredCount} ด่วน` : undefined,
      badgeColor: 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
    },
    {
      id: 'lifespan',
      label: 'Lifespan Analytics',
      labelTh: 'วิเคราะห์อายุการใช้งาน',
      icon: 'monitoring'
    },
    {
      id: 'compliance',
      label: 'Compliance & PDPA',
      labelTh: 'มาตรฐานสากล & PDPA',
      icon: 'fact_check'
    },
    {
      id: 'settings',
      label: 'Settings & Control',
      labelTh: 'การตั้งค่าและเชื่อมต่อ',
      icon: 'settings'
    }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 md:z-20 w-64 bg-[#0e1515]/90 md:bg-[#161d1d]/60 backdrop-blur-2xl border-r border-white/10 flex flex-col py-6 px-4 transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00ced1] to-[#005354] flex items-center justify-center shadow-[0_0_15px_rgba(71,234,237,0.3)]">
              <span className="material-symbols-outlined text-black font-bold text-xl material-symbols-fill">biotech</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-[#47eaed] tracking-tight">MediCal</span>
              <p className="text-[10px] font-mono-tech uppercase text-[#bac9c9]/60 tracking-wider">Don Phut Health</p>
            </div>
          </div>
          <button 
            onClick={onCloseMobile}
            className="md:hidden text-[#bac9c9] hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <p className="text-[10px] font-mono-tech uppercase text-[#bac9c9]/50 px-3 pb-1 tracking-wider">
            Clinical Operations
          </p>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left group ${
                  isActive
                    ? 'bg-[#47eaed]/15 text-[#47eaed] font-bold border-l-4 border-[#47eaed] shadow-[0_0_20px_rgba(71,234,237,0.12)]'
                    : 'text-[#bac9c9] hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span 
                    className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${
                      isActive ? 'material-symbols-fill text-[#47eaed]' : 'text-[#bac9c9]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="truncate">
                    <p className="text-sm leading-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-[#bac9c9]/60 leading-tight truncate">{item.labelTh}</p>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* District Health Facility quick badge */}
        <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#bac9c9] text-[11px]">เครือข่ายสถานพยาบาล</span>
            <span className="text-[#47eaed] font-mono-tech text-[10px]">7 แห่ง</span>
          </div>
          <div className="space-y-1 text-[11px] text-[#bac9c9]/80 font-light">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47eaed]"></span>
              <span className="truncate">รพ.ดอนพุด (แม่ข่าย 30 เตียง)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#bac9c9]/60">
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
              <span className="truncate">PCU/รพ.สต. 6 แห่ง (ดอนพุด, ไผ่หลิ่ว, บ้านหลวง, ดงตะงาว, บ้านรี, หนองมน)</span>
            </div>
          </div>
        </div>

        {/* User Profile Mini Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#47eaed]/30 overflow-hidden flex-shrink-0 bg-[#161d1d]">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="font-bold text-sm text-[#dde4e3] truncate">{currentUser.name}</p>
            <p className="text-xs text-[#bac9c9] truncate">{currentUser.title}</p>
            <span className="text-[9px] font-mono-tech text-[#47eaed]">{currentUser.tier}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
