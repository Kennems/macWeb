
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
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 mb-2 w-auto max-w-full overflow-visible flex flex-col items-center">
      {/* Dock Container: L-0 Fidelity
          - Height: ~84px total visual space
          - Backdrop: blur(24px) (Sonoma standard)
          - Border: 0.5px solid rgba(255,255,255,0.2) inner stroke simulation
          - Shadow: High diffusion drop shadow for 'floating' effect
      */}
      <div className="flex items-end gap-[10px] px-3 py-3 bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.2)] backdrop-blur-3xl rounded-[24px] border border-white/20 dark:border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.3)] mx-2 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
        
        {/* Launchpad Button */}
        <div 
          className="group relative flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-2 ease-[cubic-bezier(0.2,0,0,1)] active:scale-95 active:translate-y-0"
          onClick={toggleLaunchpad}
        >
           <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222]/90 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-[6px] backdrop-blur-sm whitespace-nowrap border border-white/10 pointer-events-none shadow-xl mb-2 z-50">
            Launchpad
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222]/90"></div>
          </div>
          <div className="w-[50px] h-[50px] md:w-[58px] md:h-[58px] transition-transform duration-200 hover:scale-110 active:scale-95 origin-bottom">
             <LaunchpadIcon />
          </div>
          {/* Spacing dot placeholder to align with apps */}
           <div className="w-1 h-1 opacity-0"></div>
        </div>
        
        <div className="w-[1px] h-10 bg-white/20 mx-1 self-center rounded-full"></div>

        {/* Apps */}
        {appList.map((app) => {
          const isOpen = activeApp === app.id || minimizedApps.some(id => id.startsWith(app.id));
          // Check if app is 'running' (has an open window or is a persistent app like Finder)
          const isRunning = isOpen || app.id === AppID.FINDER;
          
          return (
            <div 
              key={app.id} 
              className="group relative flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-2 ease-[cubic-bezier(0.2,0,0,1)] active:scale-95 active:translate-y-0"
              onClick={() => openApp(app.id)}
            >
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222]/90 text-white/90 text-[11px] font-medium px-2.5 py-1 rounded-[6px] backdrop-blur-sm whitespace-nowrap border border-white/10 pointer-events-none shadow-xl mb-2 z-50">
                {app.title}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#222]/90"></div>
              </div>

              {/* Icon Container with bounce animation class using refined cubic-bezier */}
              <div className={`w-[50px] h-[50px] md:w-[58px] md:h-[58px] transition-transform duration-200 hover:scale-110 active:scale-95 origin-bottom ${isOpen ? 'animate-bounce-dock' : ''}`}>
                {app.icon}
              </div>

              {/* Active Dot Indicator */}
              <div className={`w-1 h-1 rounded-full bg-black/70 dark:bg-white/70 transition-all duration-200 ${isRunning ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
