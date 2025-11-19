import React from 'react';
import { Image as ImageIcon, Monitor, User, Shield, Bell } from 'lucide-react';

interface SettingsProps {
  currentWallpaper: string;
  onSetWallpaper: (url: string) => void;
}

const WALLPAPERS = [
  { id: 1, name: 'Monterey', url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3270&auto=format&fit=crop' },
  { id: 2, name: 'Big Sur', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, name: 'Mojave', url: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, name: 'Yosemite', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, name: 'Aurora', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1000&auto=format&fit=crop' },
  { id: 7, name: 'Gradient', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop' },
  { id: 8, name: 'Desert', url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2000&auto=format&fit=crop' },
  { id: 9, name: 'Peaks', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop' },
];

const Settings: React.FC<SettingsProps> = ({ currentWallpaper, onSetWallpaper }) => {
  return (
    <div className="flex h-full bg-[#F5F5F5] text-gray-900 font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-[#E8E8E8]/50 border-r border-gray-300/50 p-4 space-y-1 flex flex-col">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 shadow-sm mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white overflow-hidden">
                    <User size={24} className="text-gray-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">Guest User</span>
                    <span className="text-xs text-gray-500">Apple ID</span>
                </div>
            </div>
            
            <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">System Preference</div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/40 cursor-pointer text-sm">
                    <Monitor size={16} className="text-gray-500" />
                    General
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-blue-500 text-white shadow-sm cursor-pointer text-sm">
                    <ImageIcon size={16} className="text-white" />
                    Wallpaper
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/40 cursor-pointer text-sm">
                    <Bell size={16} className="text-gray-500" />
                    Notifications
                </div>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-white/40 cursor-pointer text-sm">
                    <Shield size={16} className="text-gray-500" />
                    Privacy & Security
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-10 overflow-y-auto">
             <h2 className="text-2xl font-bold mb-1">Wallpaper</h2>
             <p className="text-sm text-gray-500 mb-8">Select a desktop picture.</p>

             {/* Current Preview */}
             <div className="mb-8">
                 <div className="text-xs font-semibold text-gray-500 mb-3">Current Wallpaper</div>
                 <div className="w-64 aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 relative">
                     <img src={currentWallpaper} className="w-full h-full object-cover" alt="Current" />
                     <div className="absolute inset-0 shadow-inner pointer-events-none border border-black/5 rounded-xl"></div>
                 </div>
             </div>

             {/* Grid */}
             <div>
                 <div className="text-xs font-semibold text-gray-500 mb-3">Dynamic Desktop</div>
                 <div className="grid grid-cols-3 gap-6">
                     {WALLPAPERS.map(wp => (
                         <div 
                            key={wp.id} 
                            className="group flex flex-col gap-2 cursor-pointer"
                            onClick={() => onSetWallpaper(wp.url)}
                         >
                             <div className={`aspect-video rounded-xl overflow-hidden border-2 transition-all relative ${currentWallpaper === wp.url ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-transparent group-hover:border-gray-300'}`}>
                                 <img src={wp.url} className="w-full h-full object-cover" alt={wp.name} />
                                 <div className="absolute inset-0 shadow-inner pointer-events-none border border-black/5 rounded-lg"></div>
                             </div>
                             <span className={`text-center text-xs font-medium ${currentWallpaper === wp.url ? 'text-blue-600' : 'text-gray-600'}`}>{wp.name}</span>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    </div>
  );
};

export default Settings;