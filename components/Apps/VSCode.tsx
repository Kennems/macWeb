import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { File, Folder, Search, GitBranch, Settings, Menu, X } from 'lucide-react';

interface VSCodeProps {
  initialFileId?: string;
}

const VSCode: React.FC<VSCodeProps> = ({ initialFileId }) => {
  const { fs, getChildren, updateFileContent } = useFileSystem();
  const [activeFileId, setActiveFileId] = useState<string | null>(initialFileId || null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'desktop']));

  const activeFile = activeFileId ? fs[activeFileId] : null;

  useEffect(() => {
    if (initialFileId) setActiveFileId(initialFileId);
  }, [initialFileId]);

  const toggleFolder = (id: string) => {
    const newSet = new Set(expandedFolders);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedFolders(newSet);
  };

  const renderTree = (parentId: string, depth = 0) => {
    const children = getChildren(parentId);
    return children.map(item => (
      <div key={item.id}>
        <div 
          className={`flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-[#2a2d2e] text-[#cccccc] ${activeFileId === item.id ? 'bg-[#37373d]' : ''}`}
          style={{ paddingLeft: `${depth * 12 + 10}px` }}
          onClick={() => item.type === 'folder' ? toggleFolder(item.id) : setActiveFileId(item.id)}
        >
          {item.type === 'folder' && (
             <span className={`text-xs transition-transform ${expandedFolders.has(item.id) ? 'rotate-90' : ''}`}>▶</span>
          )}
          {item.type === 'folder' ? <Folder size={14} className="text-blue-400" /> : <File size={14} className="text-gray-400" />}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && (
          <div>{renderTree(item.id, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#cccccc] font-sans">
      {/* Title Bar (Fake) */}
      <div className="h-8 bg-[#3c3c3c] flex items-center justify-center text-xs select-none">
        {activeFile ? activeFile.name : 'Visual Studio Code'} - macOS Web
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 border-r border-black/20 shrink-0 z-10">
           <File size={24} className="text-white cursor-pointer opacity-100" />
           <Search size={24} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
           <GitBranch size={24} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
           <div className="flex-1" />
           <Settings size={24} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
        </div>

        {/* Sidebar */}
        <div className="w-60 bg-[#252526] flex flex-col border-r border-black/20">
            <div className="h-8 flex items-center px-4 text-xs font-bold uppercase tracking-wider text-gray-400">Explorer</div>
            <div className="flex-1 overflow-y-auto py-2">
                <div className="font-bold text-xs px-4 mb-1 text-blue-400">OPEN EDITORS</div>
                 {/* Just mock open editors section */}
                <div className="font-bold text-xs px-4 mt-2 mb-1 text-blue-400">WORKSPACE</div>
                {renderTree('root')}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
           {activeFile ? (
             <>
               {/* Tabs */}
               <div className="h-9 bg-[#2d2d2d] flex items-center overflow-x-auto">
                  <div className="bg-[#1e1e1e] px-3 h-full flex items-center gap-2 text-sm border-t-2 border-blue-500 min-w-[120px]">
                      <File size={14} className="text-yellow-400" />
                      <span className="text-white">{activeFile.name}</span>
                      <X size={14} className="ml-auto hover:bg-white/10 rounded p-0.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setActiveFileId(null); }}/>
                  </div>
               </div>
               {/* Breadcrumbs */}
               <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-xs text-gray-500 border-b border-white/5">
                  src &gt; components &gt; {activeFile.name}
               </div>
               <div className="flex-1 relative">
                   <textarea
                      className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none outline-none border-none leading-relaxed"
                      value={activeFile.content || ''}
                      onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
                      spellCheck={false}
                   />
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50 select-none">
                <div className="text-9xl mb-4">⌘</div>
                <div className="text-sm">Show All Commands</div>
             </div>
           )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs gap-4 select-none">
        <div className="flex items-center gap-1"><GitBranch size={12} /> main</div>
        <div className="flex-1" />
        <div className="hidden sm:block">Ln 12, Col 42</div>
        <div className="hidden sm:block">UTF-8</div>
        <div className="hidden sm:block">TypeScript React</div>
      </div>
    </div>
  );
};

export default VSCode;