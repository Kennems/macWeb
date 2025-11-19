
import React, { useState } from 'react';
import { Image as ImageIcon, Monitor, User, Shield, Bell, Wifi, Bluetooth, Globe, Volume2, Moon, Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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

const MenuItem: React.FC<{ icon: any, label: string, color: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, color, active, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors ${active ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'}`}
    >
        <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center text-white shadow-sm ${color}`}>
            <Icon size={12} strokeWidth={2.5} />
        </div>
        <span className="font-medium">{label}</span>
    </div>
);

const Settings: React.FC<SettingsProps> = ({ currentWallpaper, onSetWallpaper }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'wallpaper'>('wallpaper');

  return (
    <div className="flex h-full bg-[#F5F5F5] dark:bg-[#1E1E1E] text-gray-900 dark:text-white font-sans transition-colors">
        {/* Sidebar */}
        <div className="w-64 bg-[#E8E8E8]/50 dark:bg-[#2A2A2A]/50 border-r border-gray-300/50 dark:border-black/20 p-4 flex flex-col">
             {/* Search */}
            <div className="relative mb-4">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/5 rounded-md py-1 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg mb-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white overflow-hidden shadow-inner">
                    <User size={24} className="text-gray-500 dark:text-gray-300" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold">Guest User</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Apple ID</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-0.5 -mx-2 px-2 scrollbar-hide">
                <MenuItem icon={Wifi} label="Wi-Fi" color="bg-blue-500" />
                <MenuItem icon={Bluetooth} label="Bluetooth" color="bg-blue-500" />
                <MenuItem icon={Globe} label="Network" color="bg-blue-500" />
                <div className="h-2"></div>
                <MenuItem icon={Bell} label="Notifications" color="bg-red-500" />
                <MenuItem icon={Volume2} label="Sound" color="bg-red-500" />
                <MenuItem icon={Moon} label="Focus" color="bg-indigo-500" />
                <MenuItem icon={Monitor} label="Screen Time" color="bg-indigo-500" />
                <div className="h-2"></div>
                <MenuItem icon={Monitor} label="General" color="bg-gray-500" />
                <MenuItem 
                    icon={ImageIcon} 
                    label="Appearance" 
                    color="bg-gray-500" 
                    active={activeTab === 'appearance'}
                    onClick={() => setActiveTab('appearance')} 
                />
                <MenuItem icon={Shield} label="Privacy & Security" color="bg-blue-500" />
                <div className="h-2"></div>
                <MenuItem 
                    icon={ImageIcon} 
                    label="Wallpaper" 
                    color="bg-teal-500" 
                    active={activeTab === 'wallpaper'}
                    onClick={() => setActiveTab('wallpaper')}
                />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 h-full overflow-y-auto p-8">
             {activeTab === 'wallpaper' && (
                 <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-200">
                    <h2 className="text-2xl font-bold mb-1">Wallpaper</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Select a desktop picture.</p>

                    {/* Current Preview */}
                    <div className="mb-8">
                        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-black/5 dark:border-white/10 relative group">
                            <img src={currentWallpaper} className="w-full h-full object-cover" alt="Current" />
                            <div className="absolute inset-0 shadow-inner pointer-events-none rounded-xl"></div>
                            <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20">Current Wallpaper</div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div>
                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Dynamic Desktop</div>
                        <div className="grid grid-cols-3 gap-4">
                            {WALLPAPERS.map(wp => (
                                <div 
                                    key={wp.id} 
                                    className="group flex flex-col gap-2 cursor-pointer"
                                    onClick={() => onSetWallpaper(wp.url)}
                                >
                                    <div className={`aspect-video rounded-xl overflow-hidden border-[3px] transition-all relative ${currentWallpaper === wp.url ? 'border-blue-500 shadow-md scale-[1.02]' : 'border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-600'}`}>
                                        <img src={wp.url} className="w-full h-full object-cover" alt={wp.name} />
                                    </div>
                                    <span className={`text-center text-xs font-medium ${currentWallpaper === wp.url ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>{wp.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>
             )}

             {activeTab === 'appearance' && (
                 <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-200">
                     <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                     
                     <div className="bg-white dark:bg-[#2A2A2A] rounded-xl border border-gray-200 dark:border-black/20 p-1 flex gap-1 mb-6 shadow-sm">
                         <button 
                            onClick={() => setTheme('light')}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${theme === 'light' ? 'bg-gray-100 dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                         >
                             <SunIcon /> Light
                         </button>
                         <button 
                            onClick={() => setTheme('dark')}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${theme === 'dark' ? 'bg-gray-100 dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                         >
                             <MoonIcon /> Dark
                         </button>
                         <button 
                            onClick={() => setTheme('auto')}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${theme === 'auto' ? 'bg-gray-100 dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                         >
                             <AutoIcon /> Auto
                         </button>
                     </div>
                 </div>
             )}
        </div>
    </div>
  );
};

const SunIcon = () => (
    <div className="w-4 h-4 rounded-full border border-current bg-white dark:bg-gray-200"></div>
);
const MoonIcon = () => (
    <div className="w-4 h-4 rounded-full bg-gray-800 border border-current"></div>
);
const AutoIcon = () => (
    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-white to-gray-800 border border-current"></div>
);

export default Settings;
