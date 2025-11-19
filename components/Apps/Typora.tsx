
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { Eye, Code, Sidebar, MoreHorizontal, Download, FileText, Type, Moon, Sun, Check } from 'lucide-react';

interface TyporaProps {
  fileId?: string;
}

const THEMES = {
    github: 'prose-slate bg-white text-gray-900',
    night: 'prose-invert bg-[#363B40] text-gray-100',
    newsprint: 'prose-stone bg-[#F4F3F1] text-[#2c2c2c] font-serif',
};

const Typora: React.FC<TyporaProps> = ({ fileId }) => {
  const { updateFileContent, createItem, getItem } = useFileSystem();
  
  // Initialize content safely
  const [content, setContent] = useState(() => {
      if (fileId) {
          const file = getItem(fileId);
          return file ? (file.content || '') : '';
      }
      return '# Untitled\n\nStart typing...';
  });

  const [currentFileId, setCurrentFileId] = useState<string | null>(fileId || null);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'github' | 'night' | 'newsprint'>('github');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // File Sync Logic: Only update internal state if fileId CHANGES, not when file content updates (avoid loops)
  useEffect(() => {
      if (fileId && fileId !== currentFileId) {
          const file = getItem(fileId);
          if (file) {
             setContent(file.content || '');
             setCurrentFileId(fileId);
          }
      }
  }, [fileId, currentFileId, getItem]);

  // Auto-Save Logic
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    if (currentFileId) {
        saveTimeoutRef.current = setTimeout(() => {
            updateFileContent(currentFileId, newContent);
        }, 500);
    }
  };

  const handleCreateFile = () => {
     if (!currentFileId) {
         const id = createItem('Untitled.md', 'file', 'desktop', content);
         setCurrentFileId(id);
     }
  };

  const handleExport = () => {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFileId ? getItem(currentFileId)?.name || 'document.md' : 'untitled.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMenuOpen(false);
  };

  const insertText = (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const prev = textarea.value;
      const next = prev.substring(0, start) + text + prev.substring(end);
      
      handleContentChange(next);
      
      setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
  };

  const getHtml = () => {
      // @ts-ignore
      if (window.marked) return window.marked.parse(content, { breaks: true, gfm: true });
      return content;
  };

  const stats = {
      words: content.trim().split(/\s+/).filter(Boolean).length,
      chars: content.length,
      readTime: Math.ceil(content.split(' ').length / 200)
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'night' ? 'bg-[#363B40] text-white' : 'bg-white text-gray-900'} font-sans relative transition-colors duration-300`} onClick={() => setMenuOpen(false)}>
      
      {/* Mac-style Toolbar */}
      <div className={`h-12 flex items-center justify-between px-4 select-none z-20 ${theme === 'night' ? 'bg-[#2d3135] border-b border-white/10' : 'bg-[#F9F9F9] border-b border-gray-200'}`}>
        <div className="flex items-center gap-3">
             <button 
                onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }} 
                className={`p-1.5 rounded-md transition-colors ${theme === 'night' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                title="Toggle Sidebar"
            >
                <Sidebar size={18} />
             </button>
             
             <div className={`w-[1px] h-5 ${theme === 'night' ? 'bg-white/10' : 'bg-gray-300'}`}></div>

             <div className="flex gap-1">
                <button onClick={() => insertText('**Bold**')} className={`p-1.5 rounded text-xs font-bold ${theme === 'night' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>B</button>
                <button onClick={() => insertText('*Italic*')} className={`p-1.5 rounded text-xs italic ${theme === 'night' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>I</button>
                <button onClick={() => insertText('# ')} className={`p-1.5 rounded text-xs font-bold ${theme === 'night' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>H1</button>
                <button onClick={() => insertText('`code`')} className={`p-1.5 rounded text-xs font-mono ${theme === 'night' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>{`<>`}</button>
             </div>
        </div>

        <div className="flex items-center gap-2 relative">
             <span className={`text-xs mr-4 ${theme === 'night' ? 'text-gray-500' : 'text-gray-400'}`}>
                {stats.words} words
             </span>

             {/* Mode Switcher */}
             <div className={`flex rounded-lg p-0.5 ${theme === 'night' ? 'bg-black/20' : 'bg-gray-200'}`}>
                <button 
                    onClick={() => setMode('edit')} 
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium flex items-center gap-1.5 transition-all ${mode === 'edit' ? (theme === 'night' ? 'bg-[#4a4f55] text-white shadow-sm' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}
                >
                    <Code size={12} /> Source
                </button>
                <button 
                    onClick={() => setMode('preview')} 
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium flex items-center gap-1.5 transition-all ${mode === 'preview' ? (theme === 'night' ? 'bg-[#4a4f55] text-white shadow-sm' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}
                >
                    <Eye size={12} /> Preview
                </button>
             </div>

             {/* Menu */}
             <button 
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} 
                className={`p-1.5 rounded-md ml-2 ${theme === 'night' ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
            >
                <MoreHorizontal size={18} />
             </button>

             {menuOpen && (
                 <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl border py-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${theme === 'night' ? 'bg-[#2d3135] border-black/40 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
                     <div className="px-3 py-2 text-xs font-semibold opacity-50 uppercase tracking-wider">Themes</div>
                     <button onClick={() => setTheme('github')} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white flex justify-between">
                        GitHub {theme === 'github' && <Check size={14} />}
                     </button>
                     <button onClick={() => setTheme('night')} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white flex justify-between">
                        Night {theme === 'night' && <Check size={14} />}
                     </button>
                     <button onClick={() => setTheme('newsprint')} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white flex justify-between">
                        Newsprint {theme === 'newsprint' && <Check size={14} />}
                     </button>
                     <div className={`h-[1px] my-1 ${theme === 'night' ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                     <button onClick={handleExport} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-500 hover:text-white flex items-center gap-2">
                         <Download size={14} /> Export Markdown
                     </button>
                 </div>
             )}
        </div>
      </div>

      {/* Main Editor Surface */}
      <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ease-in-out border-r flex flex-col ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'} ${theme === 'night' ? 'bg-[#2d3135] border-white/5' : 'bg-[#F7F7F7] border-gray-200'}`}>
              <div className="p-4 text-xs font-bold opacity-40 uppercase tracking-wider">Outline</div>
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                  {content.split('\n').map((line, i) => {
                      const match = line.match(/^(#+)\s+(.*)/);
                      if (!match) return null;
                      const level = match[1].length;
                      const text = match[2];
                      return (
                          <div 
                            key={i} 
                            className={`px-3 py-1.5 text-sm rounded-md cursor-pointer truncate transition-colors mb-0.5 ${theme === 'night' ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-200'}`}
                            style={{ paddingLeft: `${(level - 1) * 12 + 12}px` }}
                          >
                              {text}
                          </div>
                      );
                  })}
                  {!content.includes('#') && (
                      <div className="px-4 py-2 text-sm italic opacity-40">No headings</div>
                  )}
              </div>
          </div>

          {/* Content Area */}
          <div className={`flex-1 overflow-y-auto relative ${theme === 'newsprint' ? 'bg-[#F4F3F1]' : theme === 'night' ? 'bg-[#363B40]' : 'bg-white'}`}>
              <div className="max-w-[800px] mx-auto min-h-full px-12 py-12">
                  {mode === 'edit' ? (
                      <textarea 
                        ref={textareaRef}
                        className={`w-full h-full min-h-[600px] resize-none outline-none font-mono text-[15px] leading-relaxed bg-transparent placeholder-opacity-30 ${theme === 'night' ? 'text-gray-200 placeholder-gray-600' : 'text-gray-800 placeholder-gray-300'}`}
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        spellCheck={false}
                        placeholder="# Untitled Story..."
                      />
                  ) : (
                      <div 
                        className={`prose max-w-none ${THEMES[theme]}`}
                        dangerouslySetInnerHTML={{ __html: getHtml() }}
                      />
                  )}
              </div>
          </div>
      </div>
      
      {/* Bottom Status Bar */}
      <div className={`h-6 border-t flex items-center justify-end px-4 text-[10px] select-none ${theme === 'night' ? 'bg-[#2d3135] border-white/10 text-gray-500' : 'bg-white border-gray-100 text-gray-400'}`}>
         <span className="mr-3">{stats.readTime} min read</span>
         {currentFileId ? (
             <span className="flex items-center gap-1 text-green-500"><Check size={10} /> Saved</span>
         ) : (
             <span className="text-orange-400 cursor-pointer hover:underline" onClick={handleCreateFile}>Unsaved File</span>
         )}
      </div>
    </div>
  );
};

export default Typora;
