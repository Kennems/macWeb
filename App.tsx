
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppID, WindowState, SystemState, ContextMenuState, ContextMenuItem, FileSystemItem } from './types';
import { APPS, WALLPAPER_URL as DEFAULT_WALLPAPER } from './constants';
import MenuBar from './components/Desktop/MenuBar';
import Dock from './components/Desktop/Dock';
import Window from './components/OS/Window';
import Finder from './components/Apps/Finder';
import Calculator from './components/Apps/Calculator';
import GeminiAssistant from './components/Apps/GeminiAssistant';
import Launchpad from './components/OS/Launchpad';
import Spotlight from './components/OS/Spotlight';
import Terminal from './components/Apps/Terminal';
import Safari from './components/Apps/Safari';
import Notes from './components/Apps/Notes';
import VSCode from './components/Apps/VSCode';
import Typora from './components/Apps/Typora';
import Settings from './components/Apps/Settings';
import AboutMac from './components/Apps/AboutMac';
import ControlCenter from './components/Desktop/ControlCenter';
import NotificationCenter from './components/OS/NotificationCenter';
import BootScreen from './components/OS/BootScreen';
import LoginScreen from './components/OS/LoginScreen';
import ContextMenu from './components/OS/ContextMenu';
import { FileSystemProvider, useFileSystem } from './contexts/FileSystemContext';
import { Folder, FileText, Image as ImageIcon, File } from 'lucide-react';
import { IconDefs } from './components/Icons';
import { ThemeProvider } from './contexts/ThemeContext';

const WALLPAPER_KEY = 'macos_wallpaper_v1';

// Inner component that uses FileSystemContext
const MacOS: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>('BOOTING');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  
  // Persistent Wallpaper State
  const [wallpaper, setWallpaper] = useState(() => {
      return localStorage.getItem(WALLPAPER_KEY) || DEFAULT_WALLPAPER;
  });

  // Persist Wallpaper on change
  useEffect(() => {
      localStorage.setItem(WALLPAPER_KEY, wallpaper);
  }, [wallpaper]);
  
  // Dragging State for Desktop Icons
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ isOpen: false, x: 0, y: 0, items: [] });

  // Desktop File System
  const { getChildren, createItem, getItem, updateItemPosition } = useFileSystem();
  const desktopItems = getChildren('desktop');

  // Listen for Terminal 'open' commands
  useEffect(() => {
      const handleOpenAppEvent = (e: Event) => {
          const customEvent = e as CustomEvent;
          if (customEvent.detail) {
              openApp(customEvent.detail.appId, customEvent.detail.fileId);
          }
      };
      window.addEventListener('open-app', handleOpenAppEvent);
      return () => window.removeEventListener('open-app', handleOpenAppEvent);
  }, [windows]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = () => {
    setSystemState('LOGIN');
  };

  const handleLogin = () => {
    setSystemState('DESKTOP');
  };

  // System State Actions
  const handleRestart = () => {
      setSystemState('BOOTING');
      setWindows([]);
  };

  const handleSleep = () => {
      setSystemState('LOGIN');
  };
  
  const handleShutDown = () => {
      // Create a fake shutdown state (black screen) by reusing booting but stopping at 0
      // For now, just restart to boot
      handleRestart(); 
  };

  // Window Management
  const openApp = (id: AppID, fileId?: string) => {
    // If app is single instance and already open, focus it
    const singleInstanceApps = [AppID.SETTINGS, AppID.CALCULATOR, AppID.GEMINI, AppID.ABOUT_MAC];
    const existingWindow = windows.find(w => w.appId === id);
    
    if (singleInstanceApps.includes(id) && existingWindow) {
        if (existingWindow.isMinimized) {
            setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w));
        }
        focusWindow(existingWindow.id);
        return;
    }

    const appConfig = APPS[id];
    const newWindow: WindowState = {
        id: uuidv4(),
        appId: id,
        title: appConfig.title,
        x: 100 + (Math.random() * 50),
        y: 50 + (Math.random() * 50),
        width: appConfig.defaultWidth,
        height: appConfig.defaultHeight,
        zIndex: zIndexCounter + 1,
        isMinimized: false,
        isMaximized: false,
        fileId: fileId
    };

    setWindows(prev => [...prev, newWindow]);
    setZIndexCounter(prev => prev + 1);
    setActiveWindowId(newWindow.id);
    setIsLaunchpadOpen(false);
    setIsSpotlightOpen(false);
  };

  const closeWindow = (id: string) => {
      setWindows(prev => prev.filter(w => w.id !== id));
      if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
      if (activeWindowId === id) return;
      setZIndexCounter(prev => prev + 1);
      setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w));
      setActiveWindowId(id);
  };

  const minimizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
      setActiveWindowId(null);
  };

  const maximizeWindow = (id: string) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
      focusWindow(id);
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const updateWindowSize = (id: string, width: number, height: number) => {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  };

  // Context Menu Handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).closest('.window-container') || (e.target as HTMLElement).closest('.dock-container') || (e.target as HTMLElement).closest('.menubar-container')) return;

    const x = e.clientX;
    const y = e.clientY;

    const items: ContextMenuItem[] = [
        { label: 'New Folder', action: () => createItem('New Folder', 'folder', 'desktop') },
        { label: 'New Text Document', action: () => createItem('Untitled.txt', 'file', 'desktop', '') },
        { label: 'Get Info', action: () => {} },
        { separator: true, label: '', action: () => {} },
        { label: 'Change Wallpaper...', action: () => openApp(AppID.SETTINGS) },
    ];

    setContextMenu({ isOpen: true, x, y, items });
  };

  const closeContextMenu = () => setContextMenu({ ...contextMenu, isOpen: false });

  // Desktop Icon Drag Logic
  const handleIconMouseDown = (e: React.MouseEvent, id: string, currentX: number, currentY: number) => {
      e.stopPropagation();
      // close context menu if open
      closeContextMenu();
      
      setDraggedItemId(id);
      setDragOffset({
          x: e.clientX - currentX,
          y: e.clientY - currentY
      });
  };

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (draggedItemId) {
              const newX = e.clientX - dragOffset.x;
              const newY = e.clientY - dragOffset.y;
              updateItemPosition(draggedItemId, newX, newY);
          }
      };

      const handleMouseUp = () => {
          setDraggedItemId(null);
      };

      if (draggedItemId) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [draggedItemId, dragOffset, updateItemPosition]);


  const renderAppContent = (window: WindowState) => {
      switch (window.appId) {
          case AppID.FINDER: return <Finder onOpenFile={(fileId) => {
              const file = getItem(fileId);
              if(file && file.name.endsWith('.md')) openApp(AppID.TYPORA, fileId);
              else if(file && (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js'))) openApp(AppID.VSCODE, fileId);
              else if(file && file.type === 'file') openApp(AppID.VSCODE, fileId);
          }} />;
          case AppID.CALCULATOR: return <Calculator />;
          case AppID.GEMINI: return <GeminiAssistant />;
          case AppID.TERMINAL: return <Terminal />;
          case AppID.SAFARI: return <Safari />;
          case AppID.NOTES: return <Notes />;
          case AppID.VSCODE: return <VSCode initialFileId={window.fileId} />;
          case AppID.TYPORA: return <Typora fileId={window.fileId} />;
          case AppID.SETTINGS: return <Settings currentWallpaper={wallpaper} onSetWallpaper={setWallpaper} />;
          case AppID.ABOUT_MAC: return <AboutMac />;
          case AppID.PHOTOS: return (
            <div className="flex items-center justify-center h-full bg-white text-gray-400">
                <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={48} />
                    <span>No Photos</span>
                </div>
            </div>
          );
          default: return null;
      }
  };

  const handleDesktopIconDoubleClick = (item: FileSystemItem) => {
      if (item.type === 'folder') {
          openApp(AppID.FINDER);
      } else {
          if (item.name.endsWith('.md')) openApp(AppID.TYPORA, item.id);
          else openApp(AppID.VSCODE, item.id);
      }
  };

  if (systemState === 'BOOTING') return <BootScreen onComplete={handleBootComplete} />;
  if (systemState === 'LOGIN') return <LoginScreen onLogin={handleLogin} />;

  return (
    <div 
        className="relative h-screen w-screen overflow-hidden bg-cover bg-center select-none transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${wallpaper})` }}
        onContextMenu={handleContextMenu}
        onClick={() => {
            closeContextMenu();
            setActiveWindowId(null); // Deselect window when clicking bg
        }}
    >
        {/* Desktop Icons Layer */}
        <div className="absolute inset-0 z-0">
            {desktopItems.map(item => {
                // Default pos if not set
                const pos = item.position || { x: 20, y: 20 };
                return (
                    <div 
                        key={item.id} 
                        className="absolute flex flex-col items-center gap-1 group w-24 cursor-pointer active:scale-95 transition-transform duration-75"
                        style={{ left: pos.x, top: pos.y }}
                        onMouseDown={(e) => handleIconMouseDown(e, item.id, pos.x, pos.y)}
                        onDoubleClick={() => handleDesktopIconDoubleClick(item)}
                    >
                        {item.type === 'folder' ? <Folder size={56} className="text-[#5FB1F8] drop-shadow-lg filter" fill="#5FB1F8" stroke="rgba(0,0,0,0.1)" /> : 
                         item.name.endsWith('.md') ? <FileText size={52} className="text-white drop-shadow-md" strokeWidth={1.5} /> :
                         <File size={52} className="text-white drop-shadow-md" strokeWidth={1.5} />
                        }
                        <span className="text-white text-[11px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1.5 py-0.5 rounded-sm text-center break-all line-clamp-2 leading-tight group-hover:bg-white/10">
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </div>

        {/* Windows Layer */}
        <div className="window-container absolute inset-0 pointer-events-none">
            {windows.map(window => (
                <div key={window.id} className="pointer-events-auto">
                    <Window
                        windowState={window}
                        isActive={activeWindowId === window.id}
                        onClose={closeWindow}
                        onFocus={focusWindow}
                        onMinimize={minimizeWindow}
                        onMaximize={maximizeWindow}
                        onUpdatePosition={updateWindowPosition}
                        onUpdateSize={updateWindowSize}
                    >
                        {renderAppContent(window)}
                    </Window>
                </div>
            ))}
        </div>

        {/* OS Elements */}
        <div className="menubar-container relative z-[100]">
             <MenuBar 
                toggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)} 
                toggleNotificationCenter={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
                onAppleClick={() => openApp(AppID.ABOUT_MAC)}
                onRestart={handleRestart}
                onSleep={handleSleep}
                onShutDown={handleShutDown}
                onLogOut={handleSleep}
             />
        </div>

        <div className="dock-container relative z-[50]">
             <Dock 
                openApp={openApp} 
                toggleLaunchpad={() => setIsLaunchpadOpen(!isLaunchpadOpen)} 
                activeApp={activeWindowId ? (windows.find(w => w.id === activeWindowId)?.appId || null) : null}
                minimizedApps={windows.filter(w => w.isMinimized).map(w => w.appId)}
             />
        </div>

        <Launchpad 
            isOpen={isLaunchpadOpen} 
            onClose={() => setIsLaunchpadOpen(false)} 
            onOpenApp={openApp} 
        />

        <Spotlight 
            isOpen={isSpotlightOpen} 
            onClose={() => setIsSpotlightOpen(false)} 
            onOpenApp={openApp} 
        />

        <ControlCenter 
            isOpen={isControlCenterOpen} 
            onClose={() => setIsControlCenterOpen(false)} 
        />

        <NotificationCenter 
            isOpen={isNotificationCenterOpen} 
            onClose={() => setIsNotificationCenterOpen(false)} 
        />

        <ContextMenu 
            isOpen={contextMenu.isOpen} 
            x={contextMenu.x} 
            y={contextMenu.y} 
            items={contextMenu.items} 
            onClose={closeContextMenu} 
        />
    </div>
  );
};

const App: React.FC = () => {
    return (
        <FileSystemProvider>
            <ThemeProvider>
                <IconDefs />
                <MacOS />
            </ThemeProvider>
        </FileSystemProvider>
    );
};

export default App;
