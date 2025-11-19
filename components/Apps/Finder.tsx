
import React, { useState } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { Folder, FileText, File, Image as ImageIcon, ArrowLeft, ArrowRight, LayoutGrid, List, Clock, Cloud, Download, HardDrive, Home, Search, ChevronRight } from 'lucide-react';

const SidebarItem: React.FC<{ icon: React.ElementType, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${active ? 'bg-[#CCD4DD] text-black/80' : 'text-gray-600 hover:bg-gray-200/50'}`}
  >
    <Icon size={16} className={active ? 'text-black/70' : 'text-gray-500'} />
    <span className="font-medium">{label}</span>
  </div>
);

interface FinderProps {
  onOpenFile?: (fileId: string) => void;
}

const Finder: React.FC<FinderProps> = ({ onOpenFile }) => {
  const { getChildren, getItem, getPath } = useFileSystem();
  const [currentPathId, setCurrentPathId] = useState('desktop');
  const [history, setHistory] = useState<string[]>(['desktop']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const currentFolder = getItem(currentPathId);
  const items = getChildren(currentPathId);
  const breadcrumbs = getPath(currentPathId);

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const navigate = (id: string) => {
    if (id === currentPathId) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(id);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPathId(id);
    setSelectedItemIds(new Set()); // Clear selection
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPathId(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPathId(history[historyIndex + 1]);
    }
  };

  const handleItemClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (e.metaKey || e.ctrlKey) {
          const newSet = new Set(selectedItemIds);
          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          setSelectedItemIds(newSet);
      } else {
          setSelectedItemIds(new Set([id]));
      }
  };

  const handleItemDoubleClick = (item: any) => {
    if (item.type === 'folder') {
      navigate(item.id);
    } else if (onOpenFile) {
      onOpenFile(item.id);
    }
  };

  const getIcon = (type: string, name: string) => {
      if (type === 'folder') return <Folder size={viewMode === 'grid' ? 48 : 18} className="text-blue-400" fill="currentColor" />;
      if (name.endsWith('.jpg') || name.endsWith('.png')) return <ImageIcon size={viewMode === 'grid' ? 48 : 18} className="text-purple-400" />;
      if (name.endsWith('.md') || name.endsWith('.txt')) return <FileText size={viewMode === 'grid' ? 48 : 18} className="text-gray-400" />;
      return <File size={viewMode === 'grid' ? 48 : 18} className="text-gray-300" />;
  };

  return (
    <div className="flex h-full w-full bg-white text-gray-800 text-sm font-sans" onClick={() => setSelectedItemIds(new Set())}>
      {/* Sidebar */}
      <div className="w-48 bg-[#F1F1F1]/90 backdrop-blur-xl border-r border-gray-200 flex flex-col pt-4 pb-2 px-2 select-none">
        <div className="mb-4">
          <div className="text-[11px] font-bold text-gray-400 px-2 mb-1 uppercase tracking-wide">Favorites</div>
          <SidebarItem icon={Cloud} label="AirDrop" />
          <SidebarItem icon={Clock} label="Recents" />
          <SidebarItem icon={Folder} label="Applications" />
          <SidebarItem icon={Download} label="Downloads" onClick={() => navigate('downloads')} active={currentPathId === 'downloads'} />
          <SidebarItem icon={Home} label="Desktop" onClick={() => navigate('desktop')} active={currentPathId === 'desktop'} />
          <SidebarItem icon={FileText} label="Documents" onClick={() => navigate('documents')} active={currentPathId === 'documents'} />
        </div>
        <div>
          <div className="text-[11px] font-bold text-gray-400 px-2 mb-1 uppercase tracking-wide">Locations</div>
          <SidebarItem icon={HardDrive} label="Macintosh HD" onClick={() => navigate('root')} active={currentPathId === 'root'} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-4 bg-[#F6F6F6] text-gray-600">
          <div className="flex items-center gap-1">
             <button onClick={goBack} disabled={historyIndex === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ArrowLeft size={16} /></button>
             <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ArrowRight size={16} /></button>
          </div>
          
          <div className="font-semibold text-gray-800 flex items-center gap-2">
             {currentFolder?.name || 'Finder'}
          </div>

          <div className="flex-1"></div>

          <div className="flex bg-gray-200 rounded-md p-0.5 border border-gray-300/50">
            <button onClick={() => setViewMode('grid')} className={`p-1 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'hover:bg-gray-300/50 text-gray-500'}`}><LayoutGrid size={14} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'hover:bg-gray-300/50 text-gray-500'}`}><List size={14} /></button>
          </div>

          <div className="relative group">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-gray-200/50 border border-gray-300/50 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white focus:border-blue-400 w-32 transition-all focus:w-48"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
            {filteredItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
                    <div className="text-lg mb-1 font-medium">Folder is empty</div>
                    <div className="text-xs">0 items</div>
                </div>
            ) : (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-x-4 gap-y-8 content-start">
                        {filteredItems.map(item => {
                            const isSelected = selectedItemIds.has(item.id);
                            return (
                                <div 
                                    key={item.id} 
                                    onClick={(e) => handleItemClick(e, item.id)}
                                    onDoubleClick={() => handleItemDoubleClick(item)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-md cursor-default group ${isSelected ? 'bg-[#CCD4DD]/50' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="relative drop-shadow-sm">
                                        {getIcon(item.type, item.name)}
                                    </div>
                                    <span className={`text-[11px] text-center font-medium px-2 py-0.5 rounded leading-tight line-clamp-2 break-words ${isSelected ? 'bg-[#0058D0] text-white' : 'text-gray-700'}`}>
                                        {item.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col select-none w-full">
                        <div className="flex text-[11px] font-semibold text-gray-500 border-b border-gray-200 px-4 py-1 bg-white sticky top-0">
                            <div className="flex-1 pl-8">Name</div>
                            <div className="w-32">Date Modified</div>
                            <div className="w-24">Kind</div>
                        </div>
                        {filteredItems.map((item, i) => {
                            const isSelected = selectedItemIds.has(item.id);
                            return (
                                <div 
                                    key={item.id}
                                    onClick={(e) => handleItemClick(e, item.id)}
                                    onDoubleClick={() => handleItemDoubleClick(item)}
                                    className={`flex items-center px-4 py-1 text-[12px] cursor-default ${isSelected ? 'bg-[#0058D0] text-white' : i % 2 === 0 ? 'bg-white' : 'bg-[#F6F8FA]'} border-b border-gray-50 group`}
                                >
                                    <div className="flex-1 flex items-center gap-2 font-medium">
                                        {getIcon(item.type, item.name)}
                                        <span>{item.name}</span>
                                    </div>
                                    <div className={`w-32 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(item.updatedAt).toLocaleDateString()}</div>
                                    <div className={`w-24 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{item.type === 'folder' ? 'Folder' : 'Document'}</div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>

        {/* Footer Path Bar */}
        <div className="h-6 bg-[#F6F6F6] border-t border-gray-200 flex items-center px-4 gap-2 text-[11px] text-gray-500 select-none">
            {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.id}>
                    <div 
                        className="flex items-center gap-1 hover:bg-gray-200 px-1 rounded cursor-pointer"
                        onClick={() => navigate(crumb.id)}
                    >
                        {crumb.type === 'folder' && <Folder size={10} />}
                        <span>{crumb.name}</span>
                    </div>
                    {i < breadcrumbs.length - 1 && <ChevronRight size={10} className="opacity-50" />}
                </React.Fragment>
            ))}
            <div className="flex-1"></div>
            <span>{items.length} items</span>
        </div>
      </div>
    </div>
  );
};

export default Finder;
