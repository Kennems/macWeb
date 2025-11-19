
import React from 'react';
import { AppID } from '../../types';
import { APPS } from '../../constants';
import { LaunchpadIcon } from '../Icons';

interface DockProps {
  openApp: (id: AppID) => void;
  toggleLaunchpad: () => void;
  activeApp: string | null;
  minimizedApps: string[];
}

const Dock: React.FC<DockProps> = ({ openApp, toggleLaunchpad, activeApp, minimizedApps }) => {
  const appList = Object.values(APPS);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40 mb-2 w-auto max-w-full overflow-visible">
      {/* Dock Container: Ultra-glassmorphism */}
      <div className="flex items-end gap-3 px-4 py-3 bg-white/20 backdrop-blur-3xl rounded-[24px] border border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.3)] mx-2 transition-all duration-300 ease-out">
        
        {/* Launchpad Button */}
        <div 
          className="group relative flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-2 active:scale-95 active:translate-y-0"
          onClick={toggleLaunchpad}
        >
           <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222]/90 text-white/90 text-[11px] font-medium px-3 py-1.5 rounded-md backdrop-blur-sm whitespace-nowrap border border-white/10 pointer-events-none shadow-lg">
            Launchpad
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222]/90"></div>
          </div>
          <div className="w-[52px] h-[52px] md:w-[58px] md:h-[58px] transition-all duration-200 hover:scale-110">
             <LaunchpadIcon />
          </div>
        </div>
        
        <div className="w-[1px] h-12 bg-white/10 mx-0.5"></div>

        {/* Apps */}
        {appList.map((app) => {
          const isOpen = activeApp === app.id || minimizedApps.some(id => id.startsWith(app.id));
          
          return (
            <div 
              key={app.id} 
              className="group relative flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 hover:-translate-y-2 active:scale-90 active:translate-y-0"
              onClick={() => openApp(app.id)}
            >
              {/* Tooltip */}
              <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222]/90 text-white/90 text-[11px] font-medium px-3 py-1.5 rounded-md backdrop-blur-sm whitespace-nowrap border border-white/10 pointer-events-none shadow-lg">
                {app.title}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222]/90"></div>
              </div>

              {/* Icon Container */}
              <div className="w-[52px] h-[52px] md:w-[58px] md:h-[58px] transition-all duration-200 hover:scale-110 drop-shadow-xl">
                {app.icon}
              </div>

              {/* Active Dot Indicator */}
              <div className={`w-1 h-1 rounded-full bg-black/80 dark:bg-white/80 shadow-[0_0_2px_rgba(0,0,0,0.5)] transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
