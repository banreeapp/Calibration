import React from 'react';
import { NavigationTab } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenQRScanner: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQRScanner
}) => {
  const tabs: Array<{ id: NavigationTab; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'inventory', label: 'Inventory', icon: 'biotech' },
    { id: 'calibration', label: 'Calib', icon: 'event_repeat' },
    { id: 'compliance', label: 'Compliance', icon: 'fact_check' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Floating Action Button (FAB) for QR Scanner */}
      <button
        onClick={onOpenQRScanner}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#47eaed] to-[#00ced1] text-black shadow-[0_0_25px_rgba(71,234,237,0.5)] flex items-center justify-center active:scale-95 transition-transform"
        title="สแกน QR Code เครื่องมือแพทย์"
      >
        <span className="material-symbols-outlined text-2xl font-bold">qr_code_scanner</span>
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0e1515]/90 backdrop-blur-xl border-t border-white/10 z-30 flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#47eaed]' : 'text-[#bac9c9]/70 hover:text-white'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-xl ${
                  isActive ? 'material-symbols-fill text-[#47eaed]' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className={`text-[10px] font-mono-tech uppercase ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
