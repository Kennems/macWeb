import React from 'react';
import { Wifi, Bluetooth, Moon, Sun, Play, Monitor, Volume2, Mic, Copy, Cast } from 'lucide-react';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay to close */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Control Center Panel */}
      <div className="fixed top-10 right-2 w-80 bg-[#e6e6e6]/50 backdrop-blur-3xl rounded-2xl p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_40px_rgba(0,0,0,0.3)] z-50 flex flex-col gap-3 text-black select-none animate-in fade-in zoom-in-95 duration-200 origin-top-right border border-white/20">
        
        <div className="flex gap-3 h-36">
          {/* Connectivity Block */}
          <div className="flex-1 bg-white/50 rounded-2xl p-3 flex flex-col justify-between shadow-sm border border-black/5">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                   <Wifi size={16} />
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-semibold">Wi-Fi</span>
                   <span className="text-[10px] text-gray-500">Home Network</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                   <Bluetooth size={16} />
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-semibold">Bluetooth</span>
                   <span className="text-[10px] text-gray-500">On</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                   <Cast size={14} />
                </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-semibold">AirDrop</span>
                   <span className="text-[10px] text-gray-500">Contacts Only</span>
                </div>
             </div>
          </div>

          {/* Right Blocks */}
          <div className="flex flex-col gap-3 w-32">
             <div className="flex-1 bg-white/50 rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-black/5 cursor-pointer hover:bg-white/60 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                    <Moon size={16} className="text-gray-600" />
                 </div>
                 <span className="text-xs font-medium leading-tight">Do Not Disturb</span>
             </div>
             <div className="flex-1 bg-white/50 rounded-2xl p-3 flex flex-col justify-center items-center gap-1 shadow-sm border border-black/5 cursor-pointer hover:bg-white/60 transition-colors">
                 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
                    <Copy size={14} className="text-gray-600" />
                 </div>
                 <span className="text-[10px] font-medium text-center">Screen Mirroring</span>
             </div>
          </div>
        </div>

        {/* Display Slider */}
        <div className="bg-white/50 rounded-2xl p-3 flex flex-col gap-2 shadow-sm border border-black/5">
            <div className="text-[11px] font-semibold pl-1 text-gray-600">Display</div>
            <div className="relative h-7 w-full bg-white/50 rounded-full overflow-hidden shadow-inner group cursor-pointer">
                <div className="absolute inset-y-0 left-0 bg-white shadow-sm w-[70%] rounded-full border border-black/5 group-hover:w-[71%] transition-all"></div>
                <Sun size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" />
            </div>
        </div>

        {/* Sound Slider */}
        <div className="bg-white/50 rounded-2xl p-3 flex flex-col gap-2 shadow-sm border border-black/5">
             <div className="text-[11px] font-semibold pl-1 text-gray-600">Sound</div>
             <div className="relative h-7 w-full bg-white/50 rounded-full overflow-hidden shadow-inner group cursor-pointer">
                <div className="absolute inset-y-0 left-0 bg-white shadow-sm w-[85%] rounded-full border border-black/5 group-hover:w-[86%] transition-all"></div>
                <Volume2 size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none" />
            </div>
        </div>

        {/* Media Player */}
        <div className="bg-white/50 rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-black/5">
           <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center shadow-sm">
               <Monitor size={20} className="text-gray-400" />
           </div>
           <div className="flex-1">
               <div className="text-sm font-semibold">Music</div>
               <div className="text-[10px] text-gray-500">Not Playing</div>
           </div>
           <Play size={20} className="text-gray-600 fill-gray-600 cursor-pointer hover:scale-110 transition-transform" />
        </div>

      </div>
    </>
  );
};

export default ControlCenter;
