
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Share, Plus, Shield, X, Globe, Star, Book } from 'lucide-react';

interface Tab {
    id: number;
    title: string;
    url: string;
    active: boolean;
}

const FAVORITES = [
    { title: 'Apple', url: 'https://www.apple.com', icon: '' },
    { title: 'iCloud', url: 'https://www.icloud.com', icon: '☁️' },
    { title: 'Google', url: 'https://www.google.com', icon: 'G' },
    { title: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'W' },
    { title: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { title: 'News', url: 'https://news.google.com', icon: '📰' },
];

const Safari: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
      { id: 1, title: 'Start Page', url: 'about:blank', active: true },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const activeTab = tabs.find(t => t.active) || tabs[0];

  const setActiveTab = (id: number) => {
      setTabs(tabs.map(t => ({ ...t, active: t.id === id })));
      const tab = tabs.find(t => t.id === id);
      if (tab) setInputValue(tab.url === 'about:blank' ? '' : tab.url.replace('https://www.', '').replace('https://', ''));
  };

  const closeTab = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      const newTabs = tabs.filter(t => t.id !== id);
      if (newTabs.length === 0) {
           // If closing last tab, create a new blank one
           setTabs([{ id: Date.now(), title: 'Start Page', url: 'about:blank', active: true }]);
           setInputValue('');
           return;
      }
      if (activeTab.id === id) {
          newTabs[newTabs.length - 1].active = true;
          const newActive = newTabs[newTabs.length - 1];
          setInputValue(newActive.url === 'about:blank' ? '' : newActive.url);
      }
      setTabs(newTabs);
  };

  const addTab = () => {
      const newId = Date.now();
      setTabs([...tabs.map(t => ({...t, active: false})), { id: newId, title: 'Start Page', url: 'about:blank', active: true }]);
      setInputValue('');
  };

  const handleNavigate = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const urlStr = typeof e === 'string' ? e : inputValue;
    
    let target = urlStr.toLowerCase();
    if (!target) return;
    if (!target.startsWith('http') && !target.startsWith('about:')) {
      target = 'https://' + target;
    }
    
    const title = target.replace('https://www.', '').replace('https://', '').split('/')[0];
    setTabs(tabs.map(t => t.id === activeTab.id ? { ...t, url: target, title: title } : t));
    if (typeof e !== 'string') setInputValue(target.replace('https://', '').replace('https://www.', ''));
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F5F5]">
      {/* Toolbar */}
      <div className="h-12 bg-[#F5F5F5] flex items-center px-3 gap-4 border-b border-[#E5E5E5] shadow-sm z-20">
        <div className="flex gap-4 text-gray-500">
          <ArrowLeft size={16} className="cursor-pointer hover:text-gray-800 transition-colors" />
          <ArrowRight size={16} className="cursor-pointer hover:text-gray-800 transition-colors" />
        </div>
        
        <div className="flex items-center gap-3 text-gray-500">
          <Shield size={14} className="hover:text-gray-800 cursor-pointer" />
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-2xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search or enter website name"
              className="w-full bg-[#E5E5E5] hover:bg-white focus:bg-white border border-transparent focus:border-blue-500/40 rounded-lg py-1.5 px-8 text-center text-sm focus:text-left outline-none transition-all shadow-sm"
            />
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
               <div className="text-[10px] text-gray-500 font-medium">AA</div>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer hover:text-blue-500">
              <RotateCw size={12} className="text-gray-500" />
            </div>
          </div>
        </form>

        <div className="flex gap-4 text-gray-500">
          <Share size={16} className="cursor-pointer hover:text-gray-800 transition-colors" />
          <Plus size={16} className="cursor-pointer hover:text-gray-800 transition-colors" onClick={addTab} />
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-800 transition-colors">
             <div className="w-3 h-3 border-2 border-current rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-[#F5F5F5] px-2 gap-1 pt-1 overflow-x-auto scrollbar-hide border-b border-[#D1D1D1]">
          {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg min-w-[140px] max-w-[240px] text-xs cursor-default transition-all group relative border-t border-l border-r ${tab.active ? 'bg-white border-gray-300 shadow-sm z-10' : 'bg-[#E5E5E5] border-transparent hover:bg-[#EAEAEA] text-gray-600'}`}
              >
                  <Globe size={12} className={tab.active ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="truncate flex-1 font-medium">{tab.title || 'Start Page'}</span>
                  <X 
                    size={12} 
                    className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full p-0.5 cursor-pointer text-gray-500"
                    onClick={(e) => closeTab(e, tab.id)} 
                  />
              </div>
          ))}
      </div>

      {/* Content */}
      <div className="flex-1 relative bg-white">
        {activeTab.url === 'about:blank' ? (
            <div className="w-full h-full overflow-y-auto bg-[#F9F9F9] p-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-300 mb-8 select-none">Favorites</h1>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-8">
                        {FAVORITES.map((fav, i) => (
                            <div 
                                key={i} 
                                className="flex flex-col items-center gap-3 group cursor-pointer"
                                onClick={() => handleNavigate(fav.url)}
                            >
                                <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-3xl group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
                                    {fav.icon}
                                </div>
                                <span className="text-xs font-medium text-gray-600 group-hover:text-blue-500">{fav.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <h2 className="text-xl font-bold text-gray-300 mb-4 select-none">Privacy Report</h2>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-4">
                            <Shield size={32} className="text-green-500" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-800">0 trackers prevented from profiling you.</span>
                                <span className="text-xs text-gray-400">Your IP address is hidden from known trackers.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : activeTab.url.includes('apple.com') ? (
            <div className="w-full h-full overflow-y-auto bg-black text-white">
                {/* Mock Apple Site */}
                <div className="bg-[#1d1d1f] h-12 flex items-center justify-center gap-8 text-xs text-gray-300 sticky top-0 z-50/90 backdrop-blur-md bg-[#1d1d1f]/80">
                    <span>Store</span>
                    <span>Mac</span>
                    <span>iPad</span>
                    <span>iPhone</span>
                    <span>Watch</span>
                    <span>Vision</span>
                    <span>AirPods</span>
                </div>
                <div className="bg-black h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <h1 className="text-6xl font-bold mb-2 z-10">MacBook Pro</h1>
                    <h2 className="text-3xl text-gray-400 mb-6 z-10">Mind-blowing. Head-turning.</h2>
                    <div className="flex gap-4 z-10">
                        <button className="bg-[#0071e3] text-white px-5 py-2 rounded-full text-sm hover:bg-[#0077ed]">Buy</button>
                        <button className="text-[#2997ff] hover:underline text-sm">Learn more {'>'}</button>
                    </div>
                    <div className="mt-12 w-[600px] h-[300px] bg-gradient-to-b from-gray-800 to-black rounded-t-xl mx-auto opacity-50 blur-sm"></div>
                </div>
            </div>
        ) : (
            <iframe 
                src={activeTab.url} 
                className="w-full h-full border-none" 
                title="browser-content"
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
        )}
      </div>
    </div>
  );
};

export default Safari;
