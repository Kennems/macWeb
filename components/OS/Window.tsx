
import React, { useEffect, useState, useRef } from 'react';
import { WindowState } from '../../types';
import { X, Minus, Maximize2, Scaling } from 'lucide-react';

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, w: number, h: number) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  windowState,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    onFocus(windowState.id);
    if (windowState.isMaximized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
  };

  // Resize Logic
  const handleResizeDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus(windowState.id);
    setIsResizing(true);
    setDragOffset({
        x: e.clientX,
        y: e.clientY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdatePosition(windowState.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
      if (isResizing) {
        const deltaX = e.clientX - dragOffset.x;
        const deltaY = e.clientY - dragOffset.y;
        const newWidth = Math.max(300, windowState.width + deltaX);
        const newHeight = Math.max(200, windowState.height + deltaY);
        
        onUpdateSize(windowState.id, newWidth, newHeight);
        setDragOffset({ x: e.clientX, y: e.clientY }); // Update ref point
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, windowState, onUpdatePosition, onUpdateSize]);

  if (windowState.isMinimized) return null;

  const style: React.CSSProperties = {
    transform: windowState.isMaximized ? 'none' : `translate(${windowState.x}px, ${windowState.y}px)`,
    width: windowState.isMaximized ? '100vw' : windowState.width,
    height: windowState.isMaximized ? 'calc(100vh - 32px)' : windowState.height,
    zIndex: windowState.zIndex,
    top: windowState.isMaximized ? 32 : 0,
    left: windowState.isMaximized ? 0 : 0,
    position: 'absolute',
    transition: (isDragging || isResizing) ? 'none' : 'width 0.2s, height 0.2s, transform 0.1s',
    opacity: isActive ? 1 : 0.96,
  };

  // macOS Big Sur+ Deep Shadow
  const shadowClass = isActive 
    ? 'shadow-[0_20px_50px_rgba(0,0,0,0.45)]' 
    : 'shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

  return (
    <div
      ref={windowRef}
      style={style}
      className={`flex flex-col rounded-xl overflow-hidden bg-white text-black border border-black/10 transition-all duration-200 animate-in zoom-in-95 fade-in ${
        windowState.isMaximized ? 'rounded-none shadow-none' : shadowClass
      }`}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Title Bar */}
      <div
        className={`h-11 flex items-center px-4 select-none cursor-default shrink-0 transition-colors relative ${isActive ? 'bg-[#F3F3F3] border-b border-[#DCDCDC]' : 'bg-[#F6F6F6] border-b border-[#E5E5E5] text-gray-400'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        {/* macOS Traffic Lights */}
        <div className="window-controls flex gap-2 mr-4 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group transition-all border ${isActive ? 'bg-[#FF5F57] border-[#E0443E]' : 'bg-[#FF5F57] border-[#E0443E] opacity-50'}`}
          >
            <X size={6} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group transition-all border ${isActive ? 'bg-[#FEBC2E] border-[#D8A123]' : 'bg-[#FEBC2E] border-[#D8A123] opacity-50'}`}
          >
            <Minus size={6} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
            className={`w-3 h-3 rounded-full flex items-center justify-center group transition-all border ${isActive ? 'bg-[#28C840] border-[#24AA35]' : 'bg-[#28C840] border-[#24AA35] opacity-50'}`}
          >
             {windowState.isMaximized ? 
                <Scaling size={6} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100" /> :
                <Maximize2 size={6} strokeWidth={4} className="text-black/50 opacity-0 group-hover:opacity-100" />
             }
          </button>
        </div>
        
        <div className={`flex-1 text-center text-[13px] font-semibold pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
          {windowState.title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {/* Overlay for resizing/dragging over iframes */}
        {(isDragging || isResizing) && <div className="absolute inset-0 z-50 bg-transparent" />}
        {children}
      </div>

      {/* Resize Handle (Only visible when not maximized) */}
      {!windowState.isMaximized && (
        <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
            onMouseDown={handleResizeDown}
        />
      )}
    </div>
  );
};

export default Window;
