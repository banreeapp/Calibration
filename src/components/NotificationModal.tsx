import React from 'react';
import { SystemNotification, MedicalDevice } from '../types/medical';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onMarkAllAsRead: () => void;
  onSelectDeviceById: (deviceId: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectDeviceById
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card-elevated max-w-lg w-full rounded-2xl border border-white/20 p-6 space-y-4 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#47eaed]">notifications_active</span>
            <h3 className="font-display font-bold text-base text-[#dde4e3]">
              Real-time Notifications Center
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-[#47eaed] hover:underline font-mono-tech"
            >
              อ่านทั้งหมดแล้ว
            </button>
            <button onClick={onClose} className="p-1 text-[#bac9c9] hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* List of alerts */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#bac9c9] text-xs">
              <span className="material-symbols-outlined text-4xl text-[#47eaed] mb-1">done_all</span>
              <p>ไม่มีการแจ้งเตือนค้างอยู่</p>
            </div>
          ) : (
            notifications.map((item) => {
              const isCritical = item.severity === 'critical';
              const isWarning = item.severity === 'warning';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isCritical
                      ? 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#dde4e3]'
                      : isWarning
                        ? 'bg-[#4bc5ff]/10 border-[#4bc5ff]/30 text-[#dde4e3]'
                        : 'bg-white/5 border-white/10 text-[#dde4e3]'
                  } ${!item.read ? 'border-l-4' : 'opacity-70'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      isCritical ? 'text-[#ffb4ab]' : isWarning ? 'text-[#4bc5ff]' : 'text-[#47eaed]'
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {isCritical ? 'report' : isWarning ? 'schedule' : 'info'}
                      </span>
                      <span>{item.title}</span>
                    </span>
                    <span className="font-mono-tech text-[10px] text-[#bac9c9]">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#bac9c9] leading-relaxed">
                    {item.message}
                  </p>

                  {item.deviceId && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          onSelectDeviceById(item.deviceId!);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-white/10 hover:bg-[#47eaed] hover:text-black rounded text-[11px] font-mono-tech transition-colors flex items-center gap-1 font-semibold"
                      >
                        <span>เปิดตรวจดู {item.deviceId}</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-[#bac9c9]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#47eaed] animate-pulse"></span>
            Telegram Bot Gateway: Active
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-[#dde4e3] rounded-lg text-xs"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
