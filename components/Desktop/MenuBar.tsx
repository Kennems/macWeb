
import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Battery, Search, Settings } from 'lucide-react';

interface MenuBarProps {
  toggleControlCenter: () => void;
  onAppleClick?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ toggleControlCenter, onAppleClick }) => {
  const [time, setTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWifiOpen, setIsWifiOpen] = useState(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const wifiRef = useRef<HTMLDivElement>(null);
  const appleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (wifiRef.current && !wifiRef.current.contains(e.target as Node)) {
        setIsWifiOpen(false);
      }
      if (appleMenuRef.current && !appleMenuRef.current.contains(e.target as Node)) {
         setIsAppleMenuOpen(false);
      }
    };
    if (isCalendarOpen || isWifiOpen || isAppleMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen, isWifiOpen, isAppleMenuOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-2xl text-white/90 flex items-center px-4 justify-between z-50 select-none shadow-sm border-b border-white/5">
        <div className="flex items-center gap-4 text-[13px] font-medium tracking-tight">
          <div 
            className="hover:bg-white/10 p-1 rounded cursor-pointer transition-colors relative"
            onClick={() => setIsAppleMenuOpen(!isAppleMenuOpen)}
          >
            <Apple size={16} fill="currentColor" />
            
            {isAppleMenuOpen && (
                <div ref={appleMenuRef} className="absolute top-full left-0 mt-1 w-56 bg-[#E6E6E6]/90 backdrop-blur-xl rounded-lg shadow-xl py-1 border border-white/20 text-black animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default" onClick={() => { onAppleClick && onAppleClick(); setIsAppleMenuOpen(false); }}>About This Mac</div>
                    <div className="h-[1px] bg-gray-300 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">System Settings...</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">App Store...</div>
                    <div className="h-[1px] bg-gray-300 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Sleep</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Restart...</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Shut Down...</div>
                    <div className="h-[1px] bg-gray-300 my-1 mx-3"></div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Lock Screen</div>
                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default">Log Out Guest User...</div>
                </div>
            )}
          </div>
          <span className="font-bold cursor-pointer hidden sm:block">Finder</span>
          {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(item => (
              <span key={item} className="cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition-colors hidden sm:block">{item}</span>
          ))}
        </div>

        <div className="flex items-center gap-1 text-[13px]">
          <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <Battery size={20} className="text-gray-200" />
                  <span className="text-xs font-medium">100%</span>
              </div>
              
              <div 
                  className={`cursor-pointer px-2 py-0.5 rounded transition-colors ${isWifiOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setIsWifiOpen(!isWifiOpen)}
              >
                  <Wifi size={16} className="text-gray-200" />
              </div>
              
              <div className="cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded">
                  <Search size={14} className="text-gray-200" />
              </div>
          </div>

          {/* Control Center Toggle */}
          <div 
              className="cursor-pointer hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
              onClick={toggleControlCenter}
          >
              <Settings size={16} className="text-white" />
          </div>

          {/* Clock */}
          <div 
            className={`flex items-center gap-2 px-3 py-0.5 rounded transition-colors cursor-pointer ml-1 ${isCalendarOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
              <span className="hidden sm:inline font-medium">{formatDate(time)}</span>
              <span className="font-medium">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      {/* Wifi Menu */}
      {isWifiOpen && (
        <div ref={wifiRef} className="fixed top-9 right-24 w-64 bg-[#e6e6e6]/80 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 p-2 z-50 text-black animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 flex justify-between items-center border-b border-black/5 mb-1">
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

      {/* Calendar Widget */}
      {isCalendarOpen && (
        <div ref={calendarRef} className="fixed top-9 right-4 w-72 bg-[#e6e6e6]/80 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 p-4 z-50 text-black animate-in fade-in zoom-in-95 duration-200">
            <div className="font-bold text-lg px-2 mb-4">{time.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 opacity-50 font-semibold">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {[...Array(30)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                            i + 1 === time.getDate() 
                            ? 'bg-red-500 text-white font-bold shadow-md' 
                            : 'hover:bg-black/10'
                        }`}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-black/5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Events</div>
                <div className="bg-white/50 rounded-lg p-3 mb-2 border border-black/5 shadow-sm">
                    <div className="text-xs font-bold border-l-2 border-blue-500 pl-2">Team Sync</div>
                    <div className="text-[10px] text-gray-500 pl-2.5 mt-0.5">10:00 AM</div>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;
