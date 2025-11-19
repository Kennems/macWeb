
import React, { useState, useRef, useEffect } from 'react';
import { useFileSystem } from '../../contexts/FileSystemContext';
import { AppID } from '../../types';

// Augment to dispatch events for the main app to listen to
const dispatchOpenApp = (appId: AppID, fileId?: string) => {
    const event = new CustomEvent('open-app', { detail: { appId, fileId } });
    window.dispatchEvent(event);
};

const Terminal: React.FC = () => {
  const { getChildren, getPath, createItem, deleteItem, getItem } = useFileSystem();
  const [history, setHistory] = useState<any[]>(['Last login: ' + new Date().toLocaleString() + ' on ttys000']);
  const [input, setInput] = useState('');
  const [currentDirId, setCurrentDirId] = useState('root');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getCurrentPathString = () => {
    const path = getPath(currentDirId);
    if (path.length === 0) return '/';
    return '/' + path.map(p => p.name).join('/');
  };

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(/\s+/);
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        return ['Available commands:', '  ls        List directory contents', '  cd [dir]  Change directory', '  pwd       Print working directory', '  mkdir [name] Create directory', '  touch [name] Create file', '  rm [name]    Remove item', '  cat [file]   Read file', '  open [app]   Open application', '  code [file]  Open VS Code', '  neofetch  Show system info', '  clear     Clear screen'];
      
      case 'clear':
        setHistory([]);
        return null;

      case 'open': {
          const appName = args[1]?.toLowerCase();
          if (!appName) return ['usage: open [application]'];
          
          const appMap: Record<string, AppID> = {
              'finder': AppID.FINDER,
              'safari': AppID.SAFARI,
              'notes': AppID.NOTES,
              'calculator': AppID.CALCULATOR,
              'settings': AppID.SETTINGS,
              'typora': AppID.TYPORA,
              'vscode': AppID.VSCODE,
              'photos': AppID.PHOTOS
          };
          
          if (appMap[appName]) {
              dispatchOpenApp(appMap[appName]);
              return [`Opening ${appName}...`];
          }
          return [`Application not found: ${appName}`];
      }

      case 'code': {
          const fileName = args[1];
          if (!fileName || fileName === '.') {
              dispatchOpenApp(AppID.VSCODE);
              return [];
          }
          const children = getChildren(currentDirId);
          const file = children.find(c => c.name === fileName && c.type === 'file');
          if (file) {
              dispatchOpenApp(AppID.VSCODE, file.id);
              return [`Opening ${fileName} in VS Code...`];
          }
          return [`File not found: ${fileName}`];
      }

      case 'neofetch':
        return [
            <div key={Date.now()} className="flex gap-4 my-2 text-xs sm:text-sm font-mono">
                <div className="text-blue-500 pt-1 select-none">
                    <pre className="leading-tight font-bold">
{`                    'c.
                 ,xNMM.
               .OMMMMo
               OMMM0,
     .;loddo:' loolloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  .XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       .cooc,.    .,coo:.`}
                    </pre>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="font-bold mb-2">guest@macbook-pro</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">OS:</span> macOS Sequoia Web</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">Host:</span> Browser Environment</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">Uptime:</span> {(performance.now() / 60000).toFixed(0)} mins</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">Shell:</span> zsh 5.9</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">Resolution:</span> {window.innerWidth}x{window.innerHeight}</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">DE:</span> Aqua (Simulated)</div>
                    <div className="flex gap-2"><span className="font-bold text-blue-400 min-w-[80px]">Terminal:</span> WebTerm Pro</div>
                    <div className="flex gap-2 mt-2">
                        <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                        <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                        <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                        <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                        <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                        <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
                    </div>
                </div>
            </div>
        ];

      case 'echo':
        return [args.slice(1).join(' ')];

      case 'pwd':
        return [getCurrentPathString()];

      case 'ls': {
        const children = getChildren(currentDirId);
        if (children.length === 0) return [];
        // Simple column formatting
        return [
            <div key={Date.now()} className="grid grid-cols-3 gap-4 text-blue-300 font-bold">
                {children.map(c => (
                    <span key={c.id} className={c.type === 'folder' ? 'text-blue-400' : 'text-gray-300 font-normal'}>
                        {c.name}{c.type === 'folder' ? '/' : ''}
                    </span>
                ))}
            </div>
        ];
      }

      case 'cd': {
        const target = args[1];
        if (!target || target === '/') {
            setCurrentDirId('root');
            return [];
        }
        if (target === '..') {
            const current = getItem(currentDirId);
            if (current && current.parentId) {
                setCurrentDirId(current.parentId);
            }
            return [];
        }
        const children = getChildren(currentDirId);
        const dir = children.find(c => c.name === target && c.type === 'folder');
        if (dir) {
            setCurrentDirId(dir.id);
            return [];
        }
        return [`cd: no such file or directory: ${target}`];
      }

      case 'mkdir': {
        const name = args[1];
        if (!name) return ['usage: mkdir [directory_name]'];
        createItem(name, 'folder', currentDirId);
        return [];
      }

      case 'touch': {
        const name = args[1];
        if (!name) return ['usage: touch [file_name]'];
        createItem(name, 'file', currentDirId);
        return [];
      }

      case 'rm': {
        const name = args[1];
        if (!name) return ['usage: rm [name]'];
        const children = getChildren(currentDirId);
        const item = children.find(c => c.name === name);
        if (item) {
            deleteItem(item.id);
            return [];
        }
        return [`rm: ${name}: No such file or directory`];
      }

      case 'cat': {
        const name = args[1];
        if (!name) return ['usage: cat [file]'];
        const children = getChildren(currentDirId);
        const item = children.find(c => c.name === name && c.type === 'file');
        if (item) {
            return item.content ? item.content.split('\n') : [];
        }
        return [`cat: ${name}: No such file or directory`];
      }

      case '':
        return [];

      default:
        return [`zsh: command not found: ${command}`];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLines = handleCommand(input);
    const prompt = (
        <div key={Date.now() + '_prompt'} className="flex gap-2">
            <span className="text-[#28c840] whitespace-nowrap">guest@macbook</span>
            <span className="text-[#61afef] whitespace-nowrap">{getCurrentPathString()}</span>
            <span className="text-[#d4d4d4]">% {input}</span>
        </div>
    );
    
    if (commandIsClear(input)) {
       // handled in switch
    } else {
       setHistory(prev => [...prev, prompt, ...(newLines || [])]);
    }
    setInput('');
  };

  const commandIsClear = (i: string) => i.trim() === 'clear';

  return (
    <div 
      className="h-full w-full bg-[#101010]/95 backdrop-blur-md text-[#d4d4d4] font-mono text-sm p-2 overflow-y-auto select-text" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="p-2">
        {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap mb-0.5 leading-snug break-words">{line}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
            <span className="text-[#28c840] whitespace-nowrap">guest@macbook</span>
            <span className="text-[#61afef] whitespace-nowrap">{getCurrentPathString()}</span>
            <span className="text-[#d4d4d4]">%</span>
            <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[#d4d4d4] caret-white ml-1 font-mono"
            autoComplete="off"
            autoFocus
            />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;
