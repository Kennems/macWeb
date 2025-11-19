
import React, { useEffect, useState } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { X, Sun, Cloud, Calendar as CalendarIcon, HardDrive, Battery } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { fs } = useFileSystem();
  const [storageUsed, setStorageUsed] = useState(0);
  
  // Backend Data Calculation
  useEffect(() => {
    if (isOpen) {
        // Calculate "Backend" usage based on JSON string length
        const size = JSON.stringify(fs).length;
        // Normalize to a percentage of a fake 5MB quota for LocalStorage
        setStorageUsed(Math.min(100, (size / 5000000) * 100));
    }
  }, [isOpen, fs]);

  return (
    <>
        {/* Click outside layer */}
        {isOpen && <div className="fixed inset-0 z-[80] bg-transparent" onClick={onClose}></div>}

        <div 
            className={`fixed top-0 right-0 bottom-0 w-[360px] bg-[#E6E6E6]/70 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.2)] border-l border-white/20 z-[90] transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) p-4 flex flex-col gap-4 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Widgets Section */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
                {/* Date Widget */}
                <div className="bg-white/50 rounded-[22px] p-4 flex flex-col items-center justify-center shadow-sm border border-white/20 aspect-square">
                    <span className="text-red-500 font-bold text-sm uppercase">{new Date().toLocaleString('default', { weekday: 'short' })}</span>
                    <span className="text-4xl font-light text-gray-800">{new Date().getDate()}</span>
                </div>

                {/* Weather Widget */}
                <div className="bg-gradient-to-b from-[#4facfe] to-[#00f2fe] rounded-[22px] p-4 text-white shadow-sm border border-white/20 aspect-square flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col">
                             <span className="text-xs font-medium">Cupertino</span>
                             <span className="text-2xl font-light">72°</span>
                        </div>
                        <Sun size={18} fill="yellow" className="text-yellow-300" />
                    </div>
                    <div className="text-[10px] font-medium z-10">Sunny</div>
                    <Cloud className="absolute -bottom-4 -right-4 text-white/20 w-24 h-24" fill="currentColor" />
                </div>
            </div>

            {/* Backend Storage Widget (Interactive) */}
            <div className="bg-white/50 rounded-[22px] p-4 shadow-sm border border-white/20 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <HardDrive size={16} className="text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">Macintosh HD</span>
                        <span className="text-[10px] text-gray-500">Local Backend Storage</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                        <span>Used</span>
                        <span>{storageUsed.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.max(5, storageUsed)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Batteries Widget */}
             <div className="bg-white/50 rounded-[22px] p-4 shadow-sm border border-white/20 flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Batteries</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2">
                         <Battery size={18} className="text-green-500" />
                         <span>MacBook Pro</span>
                     </div>
                     <span className="text-green-600 font-medium">100%</span>
                 </div>
             </div>

            {/* Notifications Area */}
            <div className="mt-2">
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-sm font-bold text-gray-500">Notifications</span>
                    <span className="text-xs text-blue-500 cursor-pointer bg-white/50 px-2 py-0.5 rounded-full">Clear</span>
                </div>
                
                {/* Fake Notification */}
                <div className="bg-white/60 backdrop-blur-md rounded-[18px] p-3 shadow-sm border border-white/20 mb-3 flex gap-3 cursor-default hover:bg-white/80 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png" alt="Insta" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-bold text-gray-900">Instagram</span>
                            <span className="text-[10px] text-gray-500">2m ago</span>
                        </div>
                        <div className="text-sm text-gray-700 leading-tight line-clamp-2">
                            zuck liked your photo. "Great implementation of the backend!"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default NotificationCenter;
