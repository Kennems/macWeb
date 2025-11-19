import React, { useEffect, useState } from 'react';
import { APPS } from '../../constants';
import { AppID } from '../../types';
import { Search } from 'lucide-react';

interface LaunchpadProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppID) => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [searchText, setSearchText] = useState('');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setAnimate(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  const filteredApps = Object.values(APPS).filter(app => 
    app.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 z-[60] transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 visible backdrop-blur-2xl bg-black/20' : 'opacity-0 invisible'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Search Bar */}
      <div className={`mt-16 flex justify-center transition-all duration-500 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-white/10 border border-white/20 rounded-lg py-1.5 pl-10 pr-4 text-white placeholder-white/60 outline-none focus:bg-white/20 transition-all text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* App Grid */}
      <div className="container mx-auto px-10 mt-10">
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-y-12 gap-x-8 justify-items-center">
          {filteredApps.map((app, index) => (
            <div 
              key={app.id}
              className={`flex flex-col items-center gap-3 group cursor-pointer transition-all duration-500 delay-[${index * 50}ms] ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              onClick={() => {
                onOpenApp(app.id);
                onClose();
              }}
            >
              <div className="w-20 h-20 rounded-[22px] shadow-xl transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                {React.cloneElement(app.icon as React.ReactElement<{ className?: string }>, { 
                  className: `w-full h-full rounded-[22px] flex items-center justify-center shadow-2xl`
                })}
              </div>
              <span className="text-white font-medium text-sm drop-shadow-md tracking-wide">{app.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots (Decorative) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
         <div className="w-2 h-2 rounded-full bg-white"></div>
         <div className="w-2 h-2 rounded-full bg-white/30"></div>
      </div>
    </div>
  );
};

export default Launchpad;