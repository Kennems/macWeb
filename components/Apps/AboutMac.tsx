
import React, { useState } from 'react';
import { Monitor, HardDrive, Cpu } from 'lucide-react';

const AboutMac: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'displays' | 'storage'>('overview');

  return (
    <div className="flex flex-col h-full bg-[#ECECEC] text-black font-sans select-none">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 pt-4 pb-4 border-b border-gray-300">
            <button onClick={() => setActiveTab('overview')} className={`px-3 py-1 rounded text-sm ${activeTab === 'overview' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}>Overview</button>
            <button onClick={() => setActiveTab('displays')} className={`px-3 py-1 rounded text-sm ${activeTab === 'displays' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}>Displays</button>
            <button onClick={() => setActiveTab('storage')} className={`px-3 py-1 rounded text-sm ${activeTab === 'storage' ? 'bg-white shadow-sm font-medium' : 'text-gray-600'}`}>Storage</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center">
            {activeTab === 'overview' && (
                <div className="flex items-start gap-6 w-full">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner flex items-center justify-center shrink-0 border border-white/50">
                        {/* Chip Icon */}
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center relative">
                            <div className="text-white font-bold text-xl tracking-tighter">M1</div>
                            {/* Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-md"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                        <h1 className="text-2xl font-bold tracking-tight">macOS <span className="font-light">Web</span></h1>
                        <div className="text-gray-500 text-xs mb-2">Version 15.0 (Sequoia)</div>
                        
                        <div className="grid grid-cols-[80px_1fr] gap-y-1 text-xs mt-2">
                            <span className="font-semibold text-gray-600 text-right pr-2">MacBook Pro</span>
                            <span>14-inch, 2024</span>

                            <span className="font-semibold text-gray-600 text-right pr-2">Chip</span>
                            <span>Apple M3 Max</span>

                            <span className="font-semibold text-gray-600 text-right pr-2">Memory</span>
                            <span>32 GB</span>

                            <span className="font-semibold text-gray-600 text-right pr-2">Startup Disk</span>
                            <span>Macintosh HD</span>
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                            <button className="px-3 py-0.5 bg-white border border-gray-300 rounded shadow-sm text-xs active:bg-gray-100">System Report...</button>
                            <button className="px-3 py-0.5 bg-white border border-gray-300 rounded shadow-sm text-xs active:bg-gray-100">Software Update...</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'displays' && (
                 <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
                     <Monitor size={64} className="text-blue-500" />
                     <div className="text-center">
                         <div className="font-bold text-sm">Built-in Liquid Retina XDR Display</div>
                         <div className="text-xs text-gray-500">14-inch (3024 × 1964)</div>
                     </div>
                 </div>
            )}

            {activeTab === 'storage' && (
                 <div className="flex flex-col w-full gap-4 mt-2">
                     <div className="flex items-center gap-4">
                         <HardDrive size={40} className="text-gray-400" />
                         <div className="flex-1">
                             <div className="font-bold text-sm">Macintosh HD</div>
                             <div className="text-xs text-gray-500">499 GB available of 1 TB</div>
                         </div>
                     </div>
                     <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden flex">
                         <div className="w-[30%] bg-blue-500 h-full"></div>
                         <div className="w-[15%] bg-yellow-500 h-full"></div>
                         <div className="w-[10%] bg-green-500 h-full"></div>
                         <div className="w-[5%] bg-purple-500 h-full"></div>
                     </div>
                     <div className="flex gap-4 text-[10px] text-gray-600 justify-center">
                         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Apps</div>
                         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> System</div>
                         <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Docs</div>
                     </div>
                 </div>
            )}
        </div>
    </div>
  );
};

export default AboutMac;
