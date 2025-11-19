import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { APPS } from '../../constants';
import { AppID } from '../../types';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: AppID) => void;
}

const Spotlight: React.FC<SpotlightProps> = ({ isOpen, onClose, onOpenApp }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredApps = Object.values(APPS).filter(app =>
    app.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[70] flex justify-center pt-[20vh]" onClick={onClose}>
      <div 
        className="w-[600px] bg-white/80 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-white/40 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 h-16 border-b border-gray-200/50">
          <Search className="text-gray-500 w-6 h-6 mr-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent border-none outline-none text-2xl text-gray-800 placeholder-gray-400 font-light"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filteredApps.length > 0) {
                onOpenApp(filteredApps[0].id);
                onClose();
              }
            }}
          />
        </div>

        {query && (
          <div className="py-2">
            {filteredApps.length > 0 ? (
              <>
                <div className="px-4 py-1 text-xs font-semibold text-gray-500 mb-1">Top Hit</div>
                {filteredApps.map(app => (
                  <div 
                    key={app.id}
                    className="px-4 py-2 flex items-center gap-3 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors group"
                    onClick={() => {
                      onOpenApp(app.id);
                      onClose();
                    }}
                  >
                    <div className="w-8 h-8 rounded-md shadow-sm overflow-hidden">
                        {React.cloneElement(app.icon as React.ReactElement<{ className?: string }>, {
                           className: "w-full h-full flex items-center justify-center"
                        })}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{app.title}</span>
                        <span className="text-xs opacity-70 group-hover:text-blue-100">Application</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Spotlight;