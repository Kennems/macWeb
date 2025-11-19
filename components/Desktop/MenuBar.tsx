
import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Battery, Search, Settings } from 'lucide-react';

interface MenuBarProps {
  toggleControlCenter: () => void;
  toggleNotificationCenter: () => void;
  onAppleClick: () => void;
  onRestart: () => void;
  onSleep: () => void;
  onShutDown: () => void;
  onLogOut: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  toggleControlCenter, 
  toggleNotificationCenter, 
  onAppleClick,
  onRestart,
  onSleep,
  onShutDown,
  onLogOut
}) => {
  const [time, setTime] = useState(new Date());
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const wifiRef = useRef<HTMLDivElement>(null);
  const appleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wifiRef.current && !wifiRef.current.contains(e.target as Node)) {
        setIsWifiOpen(false);
      }
      if (appleMenuRef.current && !appleMenuRef.current.contains(e.target as Node)) {
         setIsAppleMenuOpen(false);
      }
    };
    if (isWifiOpen || isAppleMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isWifiOpen, isAppleMenuOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleMenuAction = (action: () => void) => {
      action();
      setIsAppleMenuOpen(false);
  };

  return (
    <>
      {/* L-0 Fidelity: 28px height (h-7) for modern macOS notch compatibility */}
      <div className="fixed top-0 left-0 right-0 h-7 bg-white/40 dark:bg-black/30 backdrop-blur-2xl text-black/90 dark:text-white/90 flex items-center px-4 justify-between z-[100] select-none shadow-sm border-b border-white/10 transition-colors">
        <div className="flex items-center gap-4 text-[13px] font-medium tracking-tight">
          <div 
            className={`hover:bg-black/10 dark:hover:bg-white/10 p-1 rounded cursor-pointer transition-colors relative ${isAppleMenuOpen ? 'bg-black/10 dark:bg-white/10' : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsAppleMenuOpen(!isAppleMenuOpen); }}
          >
            <Apple size={15} fill="currentColor" />
            
            {isAppleMenuOpen && (
                <div ref={appleMenuRef} className="absolute top-full left-0 mt-1 w-64 bg-[#E6E6E6]/90 dark:bg-[#2A2A2A]/90 backdrop-blur-xl rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] py-1.5 border border-black/5 dark:border-white/10 text-black dark:text-white animate-in fade-in zoom-in-95 duration-100 flex flex-col z-[110]">
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]" onClick={() => handleMenuAction(onAppleClick)}>About This Mac</div>
                    <div className="h-[1px] bg-gray-400/20 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]">System Settings...</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]">App Store...</div>
                    <div className="h-[1px] bg-gray-400/20 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]" onClick={() => handleMenuAction(onSleep)}>Sleep</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]" onClick={() => handleMenuAction(onRestart)}>Restart...</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]" onClick={() => handleMenuAction(onShutDown)}>Shut Down...</div>
                    <div className="h-[1px] bg-gray-400/20 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]">Lock Screen</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-[13px]" onClick={() => handleMenuAction(onLogOut)}>Log Out Guest User...</div>
                </div>
            )}
          </div>
          <span className="font-bold cursor-pointer hidden sm:block">Finder</span>
          {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(item => (
              <span key={item} className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors hidden sm:block">{item}</span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[13px]">
          <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1 transition-colors">
                  <Battery size={20} className="text-gray-500 dark:text-gray-200" />
                  <span className="text-xs font-medium">100%</span>
              </div>
              
              <div 
                  className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${isWifiOpen ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                  onClick={(e) => { e.stopPropagation(); setIsWifiOpen(!isWifiOpen); }}
              >
                  <Wifi size={16} className="text-gray-500 dark:text-gray-200" />
              </div>
              
              <div className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors">
                  <Search size={14} className="text-gray-500 dark:text-gray-200" />
              </div>
          </div>

          {/* Control Center Toggle */}
          <div 
              className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
              onClick={toggleControlCenter}
          >
              <Settings size={16} className="text-black dark:text-white" />
          </div>

          {/* Clock -> Trigger Notification Center */}
          <div 
            className="flex items-center gap-2 px-3 py-0.5 rounded transition-colors cursor-pointer ml-1 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={toggleNotificationCenter}
          >
              <span className="hidden sm:inline font-medium">{formatDate(time)}</span>
              <span className="font-medium">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      {/* Wifi Menu */}
      {isWifiOpen && (
        <div ref={wifiRef} className="fixed top-8 right-24 w-64 bg-[#e6e6e6]/80 dark:bg-[#2A2A2A]/80 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 p-2 z-[100] text-black dark:text-white animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 flex justify-between items-center border-b border-black/5 dark:border-white/5 mb-1">
                <span className="font-semibold text-sm">Wi-Fi</span>
                <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
            </div>
            <div className="space-y-0.5">
                <div className="px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white cursor-default flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                        <Wifi size={14} />
                        <span className="text-sm font-medium">Home Network</span>
                    </div>
                    <div className="text-blue-500 group-hover:text-white">✓</div>
                </div>
                <div className="px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white cursor-default flex items-center gap-2">
                    <Wifi size={14} />
                    <span className="text-sm font-medium">Starbucks Guest</span>
                </div>
                 <div className="px-3 py-1.5 rounded-md hover:bg-blue-500 hover:text-white cursor-default flex items-center gap-2">
                    <Wifi size={14} />
                    <span className="text-sm font-medium">iPhone Hotspot</span>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;
